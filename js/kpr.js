
function formatRupiah(num){ return "Rp " + Number(num).toLocaleString('id-ID'); }

$(function(){
  // prefill from detail if exists
  const pre = localStorage.getItem('prefillHarga');
  if(pre) $('#harga').val(pre);

  function calcAndRender(){
    const harga = Number($('#harga').val()||0);
    const dp = Number($('#dp').val()||0);
    const bunga = Number($('#bunga').val()||0)/100;
    const tenor = Number($('#tenor').val()||0);
    const pokok = harga - dp;
    const n = tenor*12;
    const r = bunga/12;
    let cicilan = 0;
    if(r>0){
      cicilan = pokok * r / (1 - Math.pow(1+r, -n));
    } else {
      cicilan = pokok / n;
    }
    $('#hasil').html(`<div class="fw-bold">${formatRupiah(cicilan.toFixed(0))} / bulan</div><div class="small text-muted">Tenor ${tenor} tahun, Pinjaman ${formatRupiah(pokok)}</div>`);

    // amortization table (first 12 months)
    let table = '<table class="table table-sm"><thead><tr><th>Bulan</th><th>Bunga</th><th>Pokok</th><th>Saldo</th></tr></thead><tbody>';
    let saldo = pokok;
    for(let i=1;i<=Math.min(n,36);i++){
      let bungaBln = saldo * r;
      let pokokBln = cicilan - bungaBln;
      saldo -= pokokBln;
      table += `<tr><td>${i}</td><td>${formatRupiah(bungaBln.toFixed(0))}</td><td>${formatRupiah(pokokBln.toFixed(0))}</td><td>${formatRupiah(Math.max(0,saldo.toFixed(0)))}</td></tr>`;
    }
    table += '</tbody></table>';
    $('#amort').html(table);
    return {cicilan: Math.round(cicilan)};
  }

  $('#hitungBtn').on('click', function(){ calcAndRender(); });

  $('#saveSim').on('click', function(){
    const res = calcAndRender();
    let hist = JSON.parse(localStorage.getItem('kprHistory')||'[]');
    hist.unshift({date:new Date().toISOString(), harga: Number($('#harga').val()), dp: Number($('#dp').val()), bunga: Number($('#bunga').val()), tenor: Number($('#tenor').val()), cicilan: res.cicilan});
    localStorage.setItem('kprHistory', JSON.stringify(hist));
    renderHistory();
    alert('Simulasi disimpan');
  });

  function renderHistory(){
    const hist = JSON.parse(localStorage.getItem('kprHistory')||'[]');
    if(hist.length===0) $('#simHistory').html('<div class="small text-muted">Belum ada riwayat</div>');
    else {
      $('#simHistory').html(hist.map(h=>`<div class="card p-2 mb-2"><div><strong>${new Date(h.date).toLocaleString()}</strong></div><div>${formatRupiah(h.harga)} - DP ${formatRupiah(h.dp)} - ${h.tenor} tahun</div><div class="fw-bold">${formatRupiah(h.cicilan)}</div></div>`).join(''));
    }
  }

  renderHistory();
});

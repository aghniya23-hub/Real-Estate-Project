
function qs(name){ // query string helper
  name = name.replace(/[\\[]/,"\\[").replace(/[\\]]/,"\\]");
  const regex = new RegExp("[\\?&]"+name+"=([^&#]*)"), results = regex.exec(location.search);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(function(){
  const id = Number(qs('id'));
  $.getJSON('data/properties.json', function(data){
    const p = data.find(x => x.id === id);
    if(!p){ $('#detailContainer').html('<div class="alert alert-danger">Properti tidak ditemukan</div>'); return; }
    renderDetail(p);
    loadReviews(p.id);
  });

  function renderDetail(p){
    $('#detailContainer').html(`
      <div class="row">
        <div class="col-md-7">
          <div class="card p-3">
            <img src="${p.img}" class="img-fluid mb-3" style="border-radius:6px;">
            <h3>${p.nama} ${p.verified?'<span class="badge-verified">Verified</span>':''}</h3>
            <p class="text-muted">${p.lokasi}</p>
            <p class="fw-bold">${formatRupiah(p.harga)}</p>
            <p>${p.desc}</p>
            <div class="d-flex gap-2">
              <button class="btn btn-primary" id="openKPR">Simulasi KPR</button>
              <button class="btn btn-outline-danger add-wishlist" data-id="${p.id}">❤️ Tambah Wishlist</button>
            </div>
          </div>
        </div>
        <div class="col-md-5">
          <div class="card p-3 mb-3">
            <h5>Spesifikasi</h5>
            <ul>
              <li>Kamar: ${p.kamar}</li>
              <li>Harga: ${formatRupiah(p.harga)}</li>
            </ul>
          </div>

          <div class="card p-3">
            <h5>Review & Rating</h5>
            <div id="reviewsList"></div>
            <hr>
            <h6>Tambahkan Review</h6>
            <input id="revName" class="form-control mb-2" placeholder="Nama">
            <textarea id="revText" class="form-control mb-2" placeholder="Tulis review..."></textarea>
            <select id="revRating" class="form-select mb-2"><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option></select>
            <button class="btn btn-success" id="addReview">Kirim</button>
          </div>
        </div>
      </div>
    `);

    $('#openKPR').on('click', function(){
      // prefill kpr form by storing harga into localStorage and opening kpr.html
      localStorage.setItem('prefillHarga', p.harga);
      window.location.href = 'kpr.html';
    });
  }

  function loadReviews(pid){
    const key = 'reviews_'+pid;
    let reviews = JSON.parse(localStorage.getItem(key)||'[]');
    renderReviews(reviews);
    $('#addReview').on('click', function(){
      const name = $('#revName').val()||'Anon';
      const text = $('#revText').val()||'';
      const rating = Number($('#revRating').val()||5);
      const item = {name, text, rating, date: new Date().toISOString()};
      reviews.unshift(item);
      localStorage.setItem(key, JSON.stringify(reviews));
      renderReviews(reviews);
      $('#revName').val(''); $('#revText').val(''); $('#revRating').val('5');
    });
  }

  function renderReviews(list){
    if(!list.length) $('#reviewsList').html('<div class="small text-muted">Belum ada review</div>');
    else{
      $('#reviewsList').html(list.map(r=>`<div class="mb-2"><strong>${r.name}</strong> <span class="small text-muted">(${new Date(r.date).toLocaleString()})</span><div>${'★'.repeat(r.rating)}</div><div class="mt-1">${r.text}</div></div>`).join(''));
    }
  }

});

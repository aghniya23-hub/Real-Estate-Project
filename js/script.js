
// global helper
function formatRupiah(num){ return "Rp " + Number(num).toLocaleString('id-ID'); }

$(function(){
  // theme restore
  if(localStorage.getItem('theme')==='dark') document.documentElement.setAttribute('data-theme','dark');

  $("#themeToggle").on("click", function(){
    const current = document.documentElement.getAttribute('data-theme');
    if(current === 'dark'){ document.documentElement.removeAttribute('data-theme'); localStorage.setItem('theme','light'); $(this).text('Dark'); }
    else { document.documentElement.setAttribute('data-theme','dark'); localStorage.setItem('theme','dark'); $(this).text('Light'); }
  });

  // load properties for index and properties page
  $.getJSON('data/properties.json', function(data){
    // featured on index - top 2 verified or first two
    let featured = data.slice(0,2);
    featured.forEach(p => {
      $('#featured-list').append(`
        <div class="col-md-6 mb-3">
          <div class="card p-3 property-card">
            <div class="d-flex gap-3">
              <img src="${p.img}" alt="${p.nama}" style="width:48%;border-radius:8px;">
              <div>
                <h5>${p.nama} ${p.verified?'<span class="badge-verified">Verified</span>':''}</h5>
                <p class="mb-1">${p.lokasi}</p>
                <p class="mb-1 fw-bold">${formatRupiah(p.harga)}</p>
                <p class="small text-muted">${p.desc}</p>
                <a href="detail.html?id=${p.id}" class="btn btn-sm btn-primary">Lihat</a>
                <button class="btn btn-sm btn-outline-danger add-wishlist" data-id="${p.id}">❤️</button>
              </div>
            </div>
          </div>
        </div>`);
    });

    // if on properties page populate list
    if($('#property-list').length){
      renderPropertyList(data);
      // search + filters
      $("#searchInput").on("keyup", function(){
        let q = $(this).val().toLowerCase();
        const filtered = data.filter(p => (p.nama+p.lokasi).toLowerCase().includes(q));
        renderPropertyList(filtered);
      });
      $("#filterPrice").on("input", function(){
        $("#priceValue").text(Number($(this).val()).toLocaleString('id-ID'));
        applyFilters(data);
      });
      $("#filterRooms").on("change", function(){ applyFilters(data); });
      $("#filterVerified").on("change", function(){ applyFilters(data); });
      $("#clearFilters").on("click", function(){ $("#filterPrice").val(1000000000); $("#priceValue").text('1.000.000.000'); $("#filterRooms").val(''); $("#filterVerified").val('all'); renderPropertyList(data); });
    }

    // wishlist button (delegated)
    $(document).on('click', '.add-wishlist', function(){
      const id = $(this).data('id');
      let wishlist = JSON.parse(localStorage.getItem('wishlist')||'[]');
      if(!wishlist.includes(id)) wishlist.push(id);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      alert('Ditambahkan ke wishlist');
    });
  });

  function applyFilters(data){
    let max = Number($("#filterPrice").val());
    let rooms = $("#filterRooms").val();
    let ver = $("#filterVerified").val();
    let filtered = data.filter(p => p.harga <= max);
    if(rooms) filtered = filtered.filter(p => p.kamar >= Number(rooms));
    if(ver !== 'all'){
      filtered = filtered.filter(p => ver==='verified' ? p.verified : !p.verified);
    }
    renderPropertyList(filtered);
  }

  function renderPropertyList(list){
    $("#property-list").empty();
    if(list.length===0){ $("#property-list").html('<div class="col-12"><div class="alert alert-warning">Tidak ada properti cocok.</div></div>'); return; }
    list.forEach(p=>{
      $("#property-list").append(`
        <div class="col-md-6 col-lg-4 mb-4">
          <div class="card property-card">
            <img src="${p.img}" class="card-img-top" alt="${p.nama}">
            <div class="card-body">
              <h5 class="card-title">${p.nama} ${p.verified?'<span class="badge-verified">Verified</span>':''}</h5>
              <p class="mb-1 text-muted">${p.lokasi}</p>
              <p class="fw-bold">${formatRupiah(p.harga)}</p>
              <p class="small text-muted">${p.desc}</p>
              <div class="d-flex justify-content-between mt-3">
                <a href="detail.html?id=${p.id}" class="btn btn-sm btn-primary">Detail</a>
                <button class="btn btn-sm btn-outline-danger add-wishlist" data-id="${p.id}">❤️</button>
              </div>
            </div>
          </div>
        </div>
      `);
    });
  }

});

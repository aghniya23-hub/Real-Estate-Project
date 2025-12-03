
$(function(){
  let wishlist = JSON.parse(localStorage.getItem('wishlist')||'[]');
  if(wishlist.length===0){ $('#wishlist-container').html('<div class="alert alert-info">Wishlist kosong</div>'); return; }
  $.getJSON('data/properties.json', function(data){
    wishlist.forEach(id => {
      const p = data.find(x=>x.id===id);
      if(p){
        $('#wishlist-container').append(`
          <div class="col-md-4 mb-3">
            <div class="card p-2">
              <img src="${p.img}" class="card-img-top" style="height:160px;object-fit:cover;">
              <div class="card-body">
                <h5>${p.nama}</h5>
                <p class="small text-muted">${p.lokasi}</p>
                <p class="fw-bold">${formatRupiah(p.harga)}</p>
                <div class="d-flex gap-2">
                  <a class="btn btn-sm btn-primary" href="detail.html?id=${p.id}">Detail</a>
                  <button class="btn btn-sm btn-outline-danger remove" data-id="${p.id}">Hapus</button>
                </div>
              </div>
            </div>
          </div>
        `);
      }
    });
    $('.remove').on('click', function(){ const id = $(this).data('id'); wishlist = wishlist.filter(x=>x!==id); localStorage.setItem('wishlist', JSON.stringify(wishlist)); location.reload(); });
  });
});

<div class="component item" id="{items._id}">
    <header
        <h3 class="product-name">{items.name}</h3>
    </header>
    <figure class="product-image">
        <img src="{items.image.path}" alt="{items.name}">
    </figure>
    <section class="meta">
        <span class="product-price">{items.price}</span>
        <span class="product-time-left" data-time-to-start="{items.endTime}"></span>
    </section>
    <section class="bidding">
        <button class="component bid" role="button">Bieten</button>
    </section>
</div>

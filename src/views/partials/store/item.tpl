<div class="component item" id="item{items.id}">
    <header>
        <h3 class="product-name">{items.name}</h3>
    </header>
    <figure class="product-image">
        <img src="{items.image.path}" alt="{items.name}">
    </figure>
    <section class="meta">
        <span class="product-price">{items.price}</span>
        <span class="product-votes">{items.votes.length}</span>
        <span class="product-time-left" data-time-to-start="{items.timeToStart}"></span>
    </section>
    <section class="voting">
        <button class="component vote" role="button" data-vote-for="{items.id}">Abstimmen</button>
    </section>
</div>

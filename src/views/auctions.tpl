<!-- IMPORT partials/header.tpl -->
<div class="auctions grid">
    <!-- BEGIN items -->
        <!-- IMPORT partials/auctions/item.tpl -->
    <!-- END items -->
</div>
<script defer>
    $('button.bid').on('click', function() {
       socket.emit('auction.bid', {
           id: $(this).parents('.component.item').attr('id'),
           localBidTime: Date.now()
       }, function());
    });

    socket.on('auction.updateAuction', function(data) {
      var auction = $('#' + data.id);

      auction.find('.product-price').text(data.price);
      auction.find('.product-time-left').text(data.endTime.toLocaleString()).data().countdown.update(data.endTime);
    });
</script>
<!-- IMPORT partials/footer.tpl -->

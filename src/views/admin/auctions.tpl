<!-- IMPORT admin/partials/header.tpl -->
<table class="auction-list admin-table">
  <thead>
  <tr>
    <th class="index">Nummer</th>
    <th class="item">Artikel</th>
    <th class="id">ID</th>
    <th class="start-date">Startdatum</th>
    <th class="end-date">Enddatum</th>
    <th class="current-price">Aktueller Preis</th>
    <th class="bids">Aktuelle Gebote</th>
    <th class="edit"></th>
  </tr>
  </thead>
  <tbody>
  <!-- BEGIN auctions -->
  <tr class="auction" id="{auctions._id}">
    <td class="index">
      <a href="#{auctions._id}">
        <i class="fa fa-chain"></i>
      </a>
    </td>
    <td class="item">
      <a href="/admin/items#{auctions.item._id}" title="Zum Artikel">{auctions.item.name}</a>
    </td>
    <td class="id">
      {auctions._id}
    </td>
    <td class="start-date">
      {function.format_date_string, startTime}
    </td>
    <td class="end-date">
      {function.format_date_string, endTime}
    </td>
    <td class="current-price">
      {auctions.price}
    </td>
    <td class="bids">
      <span class="bid-counter">{auctions.bids.length}</span>
      <button class="icon-button watch-bids" data-watch="false" title="Gebote live beobachten"><i class="fa fa-eye"></i></button>
    </td>
    <td class="edit">
      <button class="edit" data-user="{users._id}">
        Bearbeiten <i class="fa fa-edit"></i>
      </button>
    </td>
  </tr>
  <!-- END auctions -->
  </tbody>
</table>
<script defer>
  $(document).ready(function () {
    $(document).on('click', '.watch-bids[data-watch="false"]', function () {
      var auctionId = $(this).parents('.auction').attr('id'),
          bidCounter = $(this).prev();

      $(this).find('.fa').removeClass('fa-eye').addClass('fa-eye-slash');
      $(this).data('watch-timer', setTimeout(function () {
            socket.emit('auction.getCurrentBids', { id: auctionId }, function (error, data) {
              if (error) {
                notify.error(error.message);
              }

              console.log(data);
              bidCounter.text(data);
            });
          }, 1000)
      );
    });


    $(document).on('click', '.watch-bids[data-watch="true"]', function () {
      clearTimeout($(this).data('watch-timer'));
      $(this).find('.fa').removeClass('fa-eye-slash').addClass('fa-eye');
    });
  });
</script>
<!-- IMPORT admin/partials/footer.tpl -->

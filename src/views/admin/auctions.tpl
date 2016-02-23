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
      <span>{auctions._id}</span>
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
      <button class="edit" data-auction="{auctions._id}">
        <span class="label">Bearbeiten</span>
        <i class="fa fa-edit"></i>
      </button>
    </td>
  </tr>
  <!-- END auctions -->
  </tbody>
</table>
<script defer>
  $(document).ready(function () {
    $(document).on('click', '.watch-bids[data-watch="false"]', function () {
      var button = $(this),
          auctionId = button.parents('.auction').attr('id'),
          bidCounter = button.prev();

      // clear all other watchers
      $('.watch-bids').not(button).click();
      button.attr('data-watch', 'true');
      button.find('.fa').removeClass('fa-eye').addClass('fa-eye-slash');
      button.data('watch-timer', setInterval(function () {
            socket.emit('auction.getCurrentBids', { id: auctionId }, function (error, data) {
              if (error) {
                notify.error(error.message);
              }

              bidCounter.text(data);
            });
          }, 1000)
      );
    });


    $(document).on('click', '.watch-bids[data-watch="true"]', function () {
      var button = $(this);

      button.attr('data-watch', 'false');
      clearInterval(button.data('watch-timer'));
      button.find('.fa').removeClass('fa-eye-slash').addClass('fa-eye');
    });
  });
</script>
<!-- IMPORT admin/partials/footer.tpl -->

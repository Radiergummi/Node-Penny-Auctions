<!-- IMPORT admin/partials/header.tpl -->
<table class="item-list admin-table">
  <thead>
  <tr>
    <th class="index">Nummer</th>
    <th class="name">Name</th>
    <th class="id">ID</th>
    <th class="manufacturer">Hersteller</th>
    <th class="start-date">Startdatum</th>
    <th class="price">Preis</th>
    <th class="votes">Aktuelle Stimmen</th>
    <th class="edit">
      <button class="add inverted">
        <span class="label">Hinzufügen</span>
        <i class="fa fa-plus"></i>
      </button>
    </th>
  </tr>
  </thead>
  <tbody>
  <!-- BEGIN items -->
  <tr class="item" id="{items._id}">
    <td class="index">
      <a href="#{items._id}">
        <i class="fa fa-chain"></i>
      </a>
    </td>
    <td class="name">
      {items.name}
    </td>
    <td class="id">
      <span>{items._id}</span>
    </td>
    <td class="manufacturer">
      {items.manufacturer}
    </td>
    <td class="start-date">
      {function.format_date_string, startDate}
    </td>
    <td class="price">
      {items.price}€
    </td>
    <td class="votes">
      <span class="vote-counter">{items.votes.length}</span>
      <button class="icon-button watch-votes" data-watch="false" title="Stimmen live beobachten"><i class="fa fa-eye"></i></button>
    </td>
    <td class="edit">
      <button class="edit" data-item="{items._id}">
        <span class="label">Bearbeiten</span>
        <i class="fa fa-edit"></i>
      </button>
    </td>
  </tr>
  <!-- END items -->
  </tbody>
</table>
<script defer>
  $(document).ready(function () {
    /**
     * watch votes events
     */
    $(document).on('click', '.watch-votes[data-watch="false"]', function () {
      var button = $(this),
          itemId = button.parents('.item').attr('id'),
          voteCounter = button.prev();

      // clear all other watchers
      $('.watch-votes').not(button).click();
      button.attr('data-watch', 'true');
      button.find('.fa').removeClass('fa-eye').addClass('fa-eye-slash');
      button.data('watch-timer', setInterval(function () {
          socket.emit('item.getCurrentVotes', { id: itemId }, function (error, data) {
            if (error) {
              notify.error(error.message);
            }

            voteCounter.text(data);
          });
        }, 1000)
      );
    });
    $(document).on('click', '.watch-votes[data-watch="true"]', function () {
      var button = $(this);

      button.attr('data-watch', 'false');
      clearInterval(button.data('watch-timer'));
      button.find('.fa').removeClass('fa-eye-slash').addClass('fa-eye');
    });
  });

  /**
   * Create item event handlers
   */
  $(document).on('click', 'button.add', function() {
    socket.emit('admin.item.getAdd', {}, function(error, modalContent) {
      if (error) {
        return notify.error(error.message);
      }

      var overlay = $('#overlay');

      overlay.html(modalContent);
      var modal = $('.modal.create-item');


      modal.fadeIn(200).removeClass('hidden');
      overlay.fadeIn(400).removeClass('visually-hidden');
      $('body').addClass('noscroll');
    });
  });
  $(document).on('click', '.add-item', function () {
    var newData = {
          id:       $(this).data('item-id')
        },
        modal = $(this).parents('.modal');
        // username = modal.find('#username').val(),

    // newData.local.username = username;

    socket.emit('admin.item.add', newData, function (error) {
      if (error !== null) {
        notify.error(error.message);
      } else {
        modal.fadeOut(200).addClass('hidden');
        $('#overlay').fadeOut(300);
        $('body').removeClass('noscroll');

        notify.success('Die Daten wurden gespeichert.')
      }
    });
  });


  /**
   * Edit item event handlers
   */
  $(document).on('click', 'button.edit', function () {
    var itemId = $(this).data('item');

    socket.emit('admin.item.getUpdate', { id: itemId }, function (error, modalContent) {
      if (error) {
        return notify.error(error.message);
      }

      var overlay = $('#overlay');

      overlay.html(modalContent);
      var modal = $('.modal.edit-item');


      modal.fadeIn(200).removeClass('hidden');
      overlay.fadeIn(400).removeClass('visually-hidden');
      $('body').addClass('noscroll');
    })
  });
  $(document).on('click', '.save-item', function () {
    var newData = {},
        modal = $(this).parents('.modal'),
        id = modal.data('item-id');
        // username = modal.find('#username').val(),



    newData.id = id;
    // newData.local.username = username;

    socket.emit('admin.item.update', newData, function (error) {
      if (error !== null) {
        notify.error(error.message);
      } else {
        modal.fadeOut(200).addClass('hidden');
        $('#overlay').fadeOut(300);
        $('body').removeClass('noscroll');

        notify.success('Die Daten wurden gespeichert.')
      }
    });
  });
  $(document).on('click', '.delete-item', function () {
    var id = $(this).data('item-id'),
        modalNode = $(this).parents('.modal');

    notify.confirmation('Soll dieser Artikel wirklich gelöscht werden?', [
      {
        name: 'Ja',
        action: function() {
          socket.emit('admin.item.remove', { id: id }, function (error) {
            if (error) {
              console.error(error);
              return notify.error('Der Artikel konnte nicht gelöscht werden:' + error.message);
            }

            notify.success('Der Artikel wurde gelöscht.');
            modalNode.fadeOut(400).addClass('hidden');
            $('#overlay').fadeOut(500);
            $('body').removeClass('noscroll');

            $('tr#' + id).fadeOut(600).remove();
          });
        }
      },
      {
        name: 'Nein',
        action: function () {
          return undefined;
        }
      }
    ]);
  });



  /**
   * Modal event handlers
   */
  $(document).on('click', '.close-modal', function () {
    $(this).parents('.modal').fadeOut(200).addClass('hidden');
    $('#overlay').fadeOut(300);
    $('body').removeClass('noscroll');
  });
  $(document).on('click', '#overlay', function (event) {
    if (event.target !== this) return;

    $('.modal').fadeOut(200).addClass('hidden');
    $('#overlay').fadeOut(300);
    $('body').removeClass('noscroll');
  });
</script>
<!-- IMPORT admin/partials/footer.tpl -->

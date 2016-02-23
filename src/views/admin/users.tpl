<!-- IMPORT admin/partials/header.tpl -->
<table class="user-list admin-table">
  <thead>
  <tr>
    <th class="index">Nummer</th>
    <th class="picture">Profilbild</th>
    <th class="id">ID</th>
    <th class="username">Benutzername</th>
    <th class="email">E-Mail-Adresse</th>
    <th class="edit">
      <button class="add inverted">
        <span class="label">Hinzufügen</span>
        <i class="fa fa-plus"></i>
      </button>
    </th>
  </tr>
  </thead>
  <tbody>
  <!-- BEGIN users -->
  <tr class="user" id="{users._id}">
    <td class="index">
      <a href="#{users._id}">
        <i class="fa fa-chain"></i>
      </a>
    </td>
    <td class="picture">
      <figure class="profile-picture">
        <img src="/images/user/{users._id}.jpg" alt="">
        <!-- IF users.data.admin -->
          <i class="fa fa-gear badge" title="Administrator"></i>
        <!-- ENDIF users.data.admin -->
      </figure>
    </td>
    <td class="id">
      <span>{users._id}</span>
    </td>
    <td class="username">
      {users.local.username}
    </td>
    <td class="email">
      {users.data.email}
      <a class="send-mail" href="mailto:{users.data.email}" title="E-Mail an den Benutzer senden">
        <i class="fa fa-send"></i>
      </a>
    </td>
    <td class="edit">
      <button class="edit" data-user="{users._id}">
        <span class="label">Bearbeiten</span>
        <i class="fa fa-edit"></i>
      </button>
    </td>
  </tr>
  <!-- END users -->
  </tbody>
</table>
<div id="overlay" class="visually-hidden"></div>
<script defer>
  $(document).ready(function () {
    /**
     * Create user event handlers
     */
    $(document).on('click', 'button.add', function() {
      socket.emit('admin.user.getAdd', {}, function(error, modalContent) {
        if (error) {
          return notify.error(error.message);
        }

        var overlay = $('#overlay');

        overlay.html(modalContent);
        var modal = $('.modal.create-user');


        modal.fadeIn(200).removeClass('hidden');
        overlay.fadeIn(400).removeClass('visually-hidden');
        $('body').addClass('noscroll');
      });
    });
    $(document).on('click', '.add-user', function () {
      var newData = {
            id:       $(this).data('user-id'),
            local:    {},
            data:     {},
            settings: {}
          },
          modal = $(this).parents('.modal'),
          username = modal.find('#username').val(),
          password = modal.find('#password').val(),
          email = modal.find('#email').val(),
          useGravatarImage = modal.find('#useGravatarImage').prop('checked'),
          showLastAuctions = modal.find('#showLastAuctions').prop('checked'),
          isAdmin = (modal.find('#isAdmin').val() === 'true'),
          paymentUnits = parseInt(modal.find('#current-balance').val());

      if (! username || ! password || ! email) {
        return notify.warning('Benutzername, Passwort und E-Mail-Adresse müssen angegeben werden.');
      }

      if (password === '' || password.length < 8) {
        return notify.warning('Es muss ein Passwort mit mindestens 8 Zeichen eingegeben werden.');
      }

      newData.local.username = username;
      newData.local.password = password;
      newData.data.email = email;
      newData.settings.useGravatarImage = useGravatarImage;
      newData.settings.showLastAuctions = showLastAuctions;
      newData.data.admin = isAdmin;
      newData.data.paymentUnits = paymentUnits;

      socket.emit('admin.user.add', newData, function (error) {
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
     * Edit user event handlers
     */
    $(document).on('click', 'button.edit', function () {
      var userId = $(this).data('user');

      socket.emit('admin.user.getUpdate', { id: userId }, function (error, modalContent) {
        if (error) {
          return notify.error(error.message);
        }

        var overlay = $('#overlay');

        overlay.html(modalContent);
        var modal = $('.modal.edit-user');


        modal.fadeIn(200).removeClass('hidden');
        overlay.fadeIn(400).removeClass('visually-hidden');
        $('body').addClass('noscroll');
      })
    });
    $(document).on('click', '.save-user', function () {
      var newData = {
            local:    {},
            data:     {},
            settings: {}
          },
          modal = $(this).parents('.modal'),
          id = modal.data('user-id'),
          username = modal.find('#username').val(),
          password = modal.find('#password').val(),
          email = modal.find('#email').val(),
          useGravatarImage = modal.find('#useGravatarImage').prop('checked'),
          showLastAuctions = modal.find('#showLastAuctions').prop('checked'),
          isAdmin = (modal.find('#isAdmin').val() === 'true'),
          paymentUnits = parseInt(modal.find('#balance').val());


      console.log(password.length);
      if (password.length > 0 || password.length < 8) {
        return notify.warning('Es muss ein Passwort mit mindestens 8 Zeichen eingegeben werden.');
      }

      newData.id = id;
      newData.local.username = username;

      if (password !== '') {
        newData.local.password = password;
      }

      newData.data.email = email;
      newData.settings.useGravatarImage = useGravatarImage;
      newData.settings.showLastAuctions = showLastAuctions;
      newData.data.admin = isAdmin;
      newData.data.paymentUnits = paymentUnits;

      socket.emit('admin.user.update', newData, function (error) {
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
    $(document).on('click', '.delete-user', function () {
      var id = $(this).data('user-id'),
          modalNode = $(this).parents('.modal');

      notify.confirmation('Soll dieser Benutzer wirklich gelöscht werden?', [
        {
          name: 'Ja',
          action: function() {
            socket.emit('admin.user.remove', { id: id }, function (error) {
              if (error) {
                console.error(error);
                return notify.error('Der Benutzer konnte nicht gelöscht werden:' + error.message);
              }

              notify.success('Der Benutzer wurde gelöscht.');
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
  });
</script>
<!-- IMPORT admin/partials/footer.tpl -->

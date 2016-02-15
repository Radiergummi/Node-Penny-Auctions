<!-- IMPORT admin/partials/header.tpl -->
<table class="user-list">
  <thead>
  <tr>
    <th class="index">Nummer</th>
    <th class="picture">Profilbild</th>
    <th class="id">ID</th>
    <th class="username">Benutzername</th>
    <th class="email">E-Mail-Adresse</th>
    <th class="edit"></th>
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
    <td class="id">{users._id}</td>
    <td class="username">{users.local.username}</td>
    <td class="email">{users.data.email} <a class="send-mail" href="mailto:{users.data.email}"
                                            title="E-Mail an den Benutzer senden"><i
        class="fa fa-send"></i></a></td>
    <td class="edit">
      <button class="edit" data-user="{users._id}">
        Bearbeiten <i class="fa fa-edit"></i>
      </button>
    </td>
  </tr>
  <!-- END users -->
  </tbody>
</table>
<div id="overlay" class="visually-hidden"></div>
<script defer>
  $(document).ready(function () {
    $('button.edit').on('click', function (event) {
      var userId = $(this).data('user');

      socket.emit('admin.getUserData', { id: userId }, function (error, modalContent) {
        if (error) {
          return notify.error(error.message);
        }

        $('#overlay').html(modalContent);
        var modal = $('.modal.edit-user');


        modal.fadeIn(200).removeClass('hidden');
        $('#overlay').fadeIn(400).removeClass('visually-hidden');
        $('body').addClass('noscroll');
      })
    });


    $(document).on('click', '.save-user', function () {
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

      newData.local.username = username;
      if (password !== '') newData.local.password = password;
      newData.data.email = email;
      newData.settings.useGravatarImage = useGravatarImage;
      newData.settings.showLastAuctions = showLastAuctions;
      newData.data.admin = isAdmin;
      newData.data.paymentUnits = paymentUnits;

      socket.emit('admin.saveUserData', newData, function (error) {
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

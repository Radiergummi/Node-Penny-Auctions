<!-- IMPORT partials/header.tpl -->
  <ul id="messages"></ul>
  <form action="">
    <input id="m" autocomplete="off" /><button>Send</button>
  </form>

  <script defer>
    var socket = io();
    $('form').submit(function(){
      var $input = $('#m');
      socket.emit('chat.message', $input.val());
      $input.val('');
      return false;
    });

    socket.on('chat.message', function(response){
      $('#messages').append($('<li>').text('[' + response.sent + '] ' + response.message));
    });

  </script>
<!-- IMPORT partials/footer.tpl -->

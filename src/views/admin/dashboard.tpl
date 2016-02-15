<!-- IMPORT admin/partials/header.tpl -->
Willkommen im Admin-Panel, {user.username}!
<br>
<div class="stats">
Prozessorauslastung: <span class="cpu"></span>
<br>
Arbeitsspeicherauslastung: <span class="memory"></span>
</div>
<script defer>
  socket.emit('admin.getSystemStats');

  socket.on('admin.systemStats', function(data) {
    $('.stats .cpu').text(data.cpuUsage + '%');
    $('.stats .memory').text(data.memoryUsage + '%');

    setTimeout(function() {
      socket.emit('admin.getSystemStats');
    }, 3000);
  });
</script>
<!-- IMPORT admin/partials/footer.tpl -->

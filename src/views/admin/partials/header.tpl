                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <html lang="de">
  <head>
    <title>{name}</title>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="/stylesheets/reset.min.css" rel="stylesheet"/>
    <link href="/stylesheets/style.min.css" rel="stylesheet"/>
    <link href="/stylesheets/admin.min.css" rel="stylesheet"/>
    <script src="/js/jquery.2.2.0.min.min.js"></script>
    <script src="/js/notifications.min.js"></script>
    <script src="/socket.io/socket.io.js"></script>
    <script>
      var socket = io();
      var notify = new Notifications();

      socket.on('app.updated', function() {
        console.log('GoldenDeals hat gerade ein Update erhalten.');
        notify.info('GoldenDeals hat gerade ein Update erhalten.', [
          {
            name: 'Aktualisieren',
            action: function() {
              location.reload();
            }
          }
        ]);
      });
    </script>
  </head>
  <body>
    <header class="site-header">
      <h1 class="site-title">{siteTitle}</h1>
      <!-- IMPORT admin/partials/accountMenu.tpl -->
      <nav role="navigation" class="main-navigation">
        <ul>
          <li class="menu-dashboard {dashboardActive}"><a href="/admin/dashboard" title="Dashboard">Dashboard</a></li><li class="menu-settings {settingsActive}"><a href="/admin/settings" title="Einstellungen">Einstellungen</a></li><li class="menu-settings {usersActive}"><a href="/admin/users" title="Benutzer">Benutzer</a></li><li class="menu-settings {itemsActive}"><a href="/admin/items" title="Artikel">Artikel</a></li><li class="menu-settings {auctionsActive}"><a href="/admin/auctions" title="Auktionen">Auktionen</a></li>
        </ul>
      </nav>
    </header>
    <main role="main">

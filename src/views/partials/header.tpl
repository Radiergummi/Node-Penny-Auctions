<html lang="de">
  <head>
    <title>{name}</title>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="/stylesheets/reset.min.css" rel="stylesheet"/>
    <link href="/stylesheets/style.min.css" rel="stylesheet"/>
    <script src="/socket.io/socket.io.js"></script>
    <script>
      var socket = io();
    </script>
    <script src="/js/main.min.js"></script>
  </head>
  <body>
    <header class="site-header">

      <!-- IF !user.loggedIn -->
      <div class="create-account">{banner}</div>
      <!-- ENDIF !user.loggedIn -->

      <figure class="logo">
        <img src="/images/logo.png" alt="Golden Deals">
        <figcaption>
          <span>Unsere Deals sind Gold wert!</span>
        </figcaption>
      </figure>

      <!-- IF user.loggedIn -->
      <!-- IMPORT partials/user/accountMenu.tpl -->
      <!-- ENDIF user.loggedIn -->
      <nav role="navigation" class="main-navigation">
        <ul>
          <li class="menu-home"><a href="/" title="Startseite">Startseite</a></li><!--
          --><li class="menu-auctions"><a href="/auctions" title="Auktionen">Auktionen</a></li><!--
          --><li class="menu-store"><a href="/store" title="Store">Store</a></li><!--
          --><li class="menu-tools"><a href="/tools" title="Nützliches">Nützliches</a></li><!--
          --><li class="menu-forum"><a href="/chat" title="Chat">Chat</a></li><!--
          --><!-- IF user.isAdmin --><li class="menu-admin"><a href="/admin/dashboard" title="Admin">Admin</a></li><!-- ENDIF user.isAdmin -->
        </ul>
      </nav>
    </header>
    <main role="main">

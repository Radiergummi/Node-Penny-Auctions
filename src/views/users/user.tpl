<!-- IMPORT partials/header.tpl -->
<article class="user-profile">
  <header class="profile-header">
    <h1>{profile.username}</h1>

    <!-- IF profile.isSelf -->
    <div class="toolbar">
      <button class="edit-profile">Bearbeiten</button>
      <a href="/user/{profile.username}/settings" class="settings button">Einstellungen</a>
      <button class="sso-connect">Mit anderen Diesten verbinden</button>
    </div>
    <!-- ENDIF profile.isSelf -->
  </header>

  <div class="grid">
    <section class="info tile tile-1-3">
      <form class="profile">
        <input type="hidden" id="token" value="{csrf}">

        <div class="error-messages">
          <!-- IF error -->
            <div class="message">{error}</div>
          <!-- ENDIF error -->
        </div>
        <figure class="profile-picture">
          <img src="{profile.image}" alt="Profilbild von {profile.username}">
          <div class="upload-overlay"></div>
        </figure>
        <span class="username" style="display: block">Benutzername: <span style="display: block; color: white; margin: 2px 5px; padding: 4px 14px; font-size: 1.2rem">{profile.username}</span></span>

        <!-- IF profile.isSelf -->
        <label for="email">E-Mail-Adresse: </label><input type="email" id="email" value="{profile.email}" disabled><br>
        <label for="email">Geburtstag: </label><input type="date" id="birthday" value="{profile.birthday}" disabled><br>
        <!-- ENDIF profile.isSelf -->
      </form>
    </section>
    <section class="contact tile tile-1-3">
      (Kontaktdetails, Social Networks, Chat)
    </section>

    <!-- IF profile.settings.showLastAuctions -->
    <section class="auctions tile tile-2-3">
      (Auktionen in letzter Zeit)
    </section>
    <!-- ENDIF profile.settings.showLastAuctions -->

    <!-- IF profile.isSelf -->
    <section class="statistics tile tile-2-3">
      (Statistiken zu Käufen)
    </section>
    <!-- ENDIF profile.isSelf -->

    <!-- IF user.isAdmin -->
    <section class="connection-data tile tile-1-3">
      <h3>Debugging-Daten</h3>
      <table>
        <tbody>
        <tr>
          <td>User-ID</td>
          <td>{profile.id}</td>
        </tr>
        </tbody>
      </table>
      <table>
        <tbody>
        <tr>
          <th>IP</th>
          <th>Zuletzt online</th>
        </tr>
        <!-- BEGIN profile.connections -->
        <tr>
          <td>{profile.connections.remoteAddress}</td>
          <td>{profile.connections.lastSeen}</td>
        </tr>
        <!-- END profile.connections -->
        </tbody>
      </table>
    </section>
    <!-- ENDIF user.isAdmin -->
  </div>
</article>
<!-- IMPORT partials/footer.tpl -->

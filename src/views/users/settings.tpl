<!-- IMPORT partials/header.tpl -->
<article class="user-profile">
  <header class="profile-header">
    <h1>Einstellungen</h1>
  </header>

  <div class="grid">
    <section class="settings tile tile-1-1">
      <form action="/user/{user.username}/settings/edit" method="post" class="save-settings">
        <h2>Profileinstellungen</h2>
        <label for="useGravatarImage">Gravatar-Profilbild benutzen: </label>
        <input id="useGravatarImage" name="useGravatarImage" type="checkbox" value="useGravatarImage" <!-- IF settings.useGravatarImage -->checked<!-- ENDIF settings.useGravatarImage -->><br>
        <br>
        <label for="showLastAuctions">Auktionen anzeigen, an denen ich zuletzt teilgenommen habe: </label>
        <input id="showLastAuctions" name="showLastAuctions" type="checkbox" value="showLastAuctions" <!-- IF settings.showLastAuctions -->checked<!-- ENDIF settings.showLastAuctions -->><br>

        <input type="submit" value="Speichern">
      </form>
    </section>

  </div>
</article>
<!-- IMPORT partials/footer.tpl -->

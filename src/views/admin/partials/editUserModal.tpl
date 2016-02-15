<div class="modal edit-user hidden">
  <header>
    <h1>Benutzer bearbeiten</h1>
    <button class="icon-button close-modal" title="Schließen">
      <i class="fa fa-close"></i>
    </button>
  </header>
  <article>

    <section class="user-fields">
      <h2>Profil</h2>
      <label for="username">Benutzername ändern:</label>
      <input type="text" id="username" placeholder="Benutzername ändern" value="{local.username}">

      <label for="password">Passwort ändern:</label>
      <input type="text" id="password" placeholder="Passwort ändern">

      <label for="email">E-Mail-Adresse ändern:</label>
      <input type="email" id="email" placeholder="E-Mail-Adresse ändern" value="{data.email}">

    </section>

    <section class="user-settings">
      <h2>Einstellungen</h2>
      <input type="checkbox" id="useGravatarImage" name="useGravatarImage" <!-- IF settings.useGravatarImage -->checked<!-- ENDIF settings.useGravatarImage -->><label for="useGravatarImage">Gravatar-Bild verwenden</label>
      <br>
      <input type="checkbox" id="showLastAuctions" name="showLastAuctions" <!-- IF settings.showLastAuctions -->checked<!-- ENDIF settings.showLastAuctions -->><label for="showLastAuctions">Letzte Auktionen im Profil anzeigen</label>
    </section>

    <section class="user-permissions">
      <h2>Berechtigungen</h2>
      <p class="warning">
        Achtung! Administratoren haben vollständigen Zugriff auf alle Daten und Einstellungen!
      </p>
      Der Benutzer ist <select name="isAdmin" id="isAdmin">
      <option value="true" <!-- IF data.admin -->selected<!-- ENDIF data.admin -->>Administrator</option>
      <option value="false" <!-- IF !data.admin -->selected<!-- ENDIF !data.admin -->>Benutzer</option>
    </select>
    </section>

    <section class="user-payment">
      <h2>Bezahldaten</h2>
      <label for="current-balance">Aktuelles Guthaben ändern:</label>
      <input type="number" id="current-balance" placeholder="Guthaben"  value="{data.paymentUnits}">
    </section>
  </article>
  <footer>
    <button class="save-user" data-user-id="{_id}">
      <span>Speichern</span> <i class="fa fa-save"></i>
    </button>
  </footer>
</div>

<!-- IMPORT partials/header.tpl -->
<h1>Anmeldung</h1>
<p>
  Sie haben noch kein Konto? <a href="/register">Hier</a> geht's zur Registrierung.<br>
</p>
<form class="login" action="/login" method="post">
  <div class="error-messages">
    <!-- IF error -->
    <div class="message">{error}</div>
    <!-- ENDIF error -->
  </div>
  <input name="username" type="username" placeholder="Benutzername" required><br>
  <input name="password" type="password" placeholder="Passwort" required><br>
  <input type="submit" value="Anmelden">
</form>
<!-- IMPORT partials/footer.tpl -->

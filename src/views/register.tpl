<!-- IMPORT partials/header.tpl -->
<h1>Registrierung</h1>
<p>
  Sie haben bereits ein Konto erstellt? <a href="/login">Hier</a> geht's zur Anmeldung.<br>
  Registriere dich jetzt, um BLA BLA BLA
</p>

<form class="register" action="/register" method="post">
  <div class="error-messages">
    <!-- IF error -->
    <div class="message">{error}</div>
    <!-- ENDIF error -->
  </div>
  <input name="username" type="text" placeholder="Benutzername"
         data-validation="length alphanumeric" data-validation-length="min4" required><br>
  <input name="email" type="email" placeholder="E-Mail-Adresse" required
         data-validation="email"><br>
  <input name="password_confirmation" type="password" placeholder="Passwort" required
         data-validation="length" data-validation-length="min8"><br>
  <input name="password" type="password" placeholder="Passwort wiederholen" required
         data-validation="confirmation"><br>

  <div class="recaptcha-container">{recaptcha}</div>
  <input type="submit" value="Registrieren">
</form>
<script defer>
  $(document).ready(function () {
    $.validate({
      modules : 'security',
      errorMessagePosition: $('.error-messages'),
      errorMessageClass: 'message'
    });
  });
</script>
<!-- IMPORT partials/footer.tpl -->

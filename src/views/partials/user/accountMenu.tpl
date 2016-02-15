<div class="user">
  <div class="menu dropdown-handler">
    <span class="dropdown-arrow">&#9662;</span>
    <span class="username">{user.username}</span>
    <figure class="profile-image">
      <img src="{user.profileImage}" alt>
    </figure>
    <ul class="account dropdown closed">
      <li class="user-profile"><a href="/user/{user.username}">Mein Account</a></li>
      <li class="logout"><a href="/logout">Abmelden</a></li>
    </ul>
  </div>
  <div class="credits">
    <div class="coins">
      <span class="count">{user.credits}</span> Goldcoins
    </div>
  </div>
</div>

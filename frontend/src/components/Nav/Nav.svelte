<script>
    import { Link } from "svelte-navigator";
    import { activeRoute, user } from "../../store/globals";

    export let logoutHandler;
</script>

<nav class="navbar navbar-expand bg-dark navbar-dark mb-2">
    <div class="container-fluid">
      <Link class="navbar-brand" to="/">NLP Chat</Link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <Link class="nav-link{$activeRoute === '/' ? ' active' : ''}" to="/">
              <svg class="feather">
                <use href="/feather-sprite.svg#home" />
              </svg>
            </Link>
          </li>
          {#if !$user}
          <li class="nav-item">
            <Link class="nav-link{$activeRoute === '/register' ? ' active' : ''}" to="/register">
              <svg class="feather">
                <use href="/feather-sprite.svg#user-plus" />
              </svg>
            </Link>
          </li>
          {:else}
          <li class="nav-item">
            <Link class="nav-link{$activeRoute === '/chat' ? ' active' : ''}" to="/chat">
              <svg class="feather">
                <use href="/feather-sprite.svg#message-circle" />
              </svg>
            </Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link{$activeRoute === '/profile' ? ' active' : ''}" to="/profile">
              <svg class="feather">
                <use href="/feather-sprite.svg#user" />
              </svg>
            </Link>
          </li>
          <li class="nav-item">
            <button class="nav-link btn btn-link border border-0" on:click="{logoutHandler}">
              <svg class="feather">
                <use href="/feather-sprite.svg#log-out" />
              </svg>
            </button>
          </li>
          {/if}
        </ul>
      </div>
    </div>
  </nav>
<script>
  import { Router, Link, Route, navigate } from "svelte-navigator";
  import PrivateRoute from "./components/PrivateRoute/PrivateRoute.svelte";
  import Home from "./pages/Home/Home.svelte";
  import Register from "./pages/Register/Register.svelte";
  import Login from "./pages/Login/Login.svelte";
  import { user, activeRoute } from "./store/globals.js";
  import Profile from "./pages/Profile/Profile.svelte";
  import ConfirmEmail from "./pages/Profile/ConfirmEmail.svelte";
  import Chat from "./pages/Chat/Chat.svelte";
  import makeReq from "./utils/fetchWrapper";

  const logoutHandler = async () => {
    // blacklist refresh token until expiry
    try {
      delete $user.tokens.access; // do not refresh access token on logout
      await makeReq("/auth/logout", "post", { token: $user.tokens.refresh });
    } catch (err) {
      console.log(err);
    } finally {
      $user = null; // delete user state
      navigate('/');
    }
  }
</script>

<Router>
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
  <main class="flex-grow-1 d-flex flex-column">
    <PrivateRoute path="/" let:location let:registerFocus>
      <Home {registerFocus} />
    </PrivateRoute>
    <PrivateRoute path="/chat" let:location let:registerFocus>
      <Chat {registerFocus} />
    </PrivateRoute>
    <Route path="/register">
      <Register />
    </Route>
    <Route path="/login">
      <Login />
    </Route>
    <PrivateRoute path="/profile" let:location let:registerFocus>
      <Profile {registerFocus} />
    </PrivateRoute>
    <PrivateRoute path="/profile/confirm-email/:code" let:location let:registerFocus>
      <ConfirmEmail {registerFocus} />
    </PrivateRoute>
  </main>
</Router>

<footer class="mt-2">
  <div class="bg-dark text-white p-3 text-center">
          Powered by <a href="https://expressjs.com">Express</a>,
          <a href="https://nodejs.org">NodeJS</a>,
          <a href="https://svelte.dev">Svelte</a> and
          <a href="https://www.tensorflow.org/js">TensorFlow.js</a>

  </div>
</footer>
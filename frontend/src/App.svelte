<script>
  // Move to components
  import { Router, Route, navigate } from "svelte-navigator";
  import PrivateRoute from "./components/PrivateRoute/PrivateRoute.svelte";
  import Home from "./pages/Home/Home.svelte";
  import Register from "./pages/Register/Register.svelte";
  import Login from "./pages/Login/Login.svelte";
  import { user } from "./store/globals.js";
  import Profile from "./pages/Profile/Profile.svelte";
  import ConfirmEmail from "./pages/Profile/ConfirmEmail.svelte";
  import Chat from "./pages/Chat/Chat.svelte";
  import makeReq from "./utils/fetchWrapper";
  import Nav from "./components/Nav/Nav.svelte";
  import Footer from "./components/Footer/Footer.svelte";

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
  <Nav {logoutHandler} />
  <main class="flex-grow-1 d-flex flex-column">
    <PrivateRoute path="/" let:registerFocus>
      <Home {registerFocus} />
    </PrivateRoute>
    <PrivateRoute path="/chat" let:registerFocus>
      <Chat {registerFocus} />
    </PrivateRoute>
    <Route path="/register">
      <Register />
    </Route>
    <Route path="/login">
      <Login />
    </Route>
    <PrivateRoute path="/profile" let:registerFocus>
      <Profile {registerFocus} />
    </PrivateRoute>
    <PrivateRoute path="/profile/confirm-email/:code" let:registerFocus>
      <ConfirmEmail {registerFocus} />
    </PrivateRoute>
    <Route>
      <div class="d-flex place-center flex-grow-1 mx-auto">
        <h2>The requested page is not found</h2>
      </div>
    </Route>
  </main>
</Router>
<Footer />
<script>
    import { user, activeRoute } from "../../store/globals";
    import { useLocation } from "svelte-navigator";
    import { onDestroy } from "svelte";
    import io from "socket.io-client";
    import { validTokens } from "../../utils/tokenUtil";
    import { onMount } from "svelte";
    import Users from "../../components/Chat/Users.svelte";
    import Messages from "../../components/Chat/Messages.svelte";
    import Input from "../../components/Chat/Input.svelte";

    export let registerFocus;
    const location = useLocation();

    let chatUsers = [{ id: 0, username: "SentimentBot", self: false }];

    onMount(() => {
        $activeRoute = $location.pathname;
    });

    const socket = io("http://localhost:8080", {
        // autoConnect: false,
        reconnectionAttempts: 0,
        auth: { token: $user.tokens.access },
        withCredentials: true, // send cookies
    });

    let attempts = 1;
    socket.on("connect_error", async (err) => {
        if (err.message === "invalid context")
            return ($user = null); // show login form
        else if (err.message === "invalid token") {
            if (!(await validTokens($user.tokens))) return ($user = null);
            socket.auth.token = $user.tokens.access; // update access token
            return socket.connect(); // try again after refresh
        }
        console.log("ERR:", err.message);
        // add one AFTER comparing, try reconnecting 4 times
        if (attempts++ < 5) socket.connect();
    });

    onDestroy(() => {
        socket.disconnect(); // -->delete from users array in backend
        socket.off("connect_error");
    });

</script>

<svelte:head>
    <link rel="icon" type="image/svg+xml" href="/message-circle.svg" />
    <title>Chat</title>
</svelte:head>
<div class="row gx-2 flex-nowrap flex-grow-1">
    <Users {chatUsers} {socket}/>
    <div class="col-lg-9">
        <div class="bg-dark text-white p-3 d-flex flex-column px-xl-5 h-100">
            <h3 class="text-center mb-3">Chat lounge</h3>
            <Messages {socket} {chatUsers} />
            <Input {registerFocus} {socket} />
        </div>
    </div>
</div>

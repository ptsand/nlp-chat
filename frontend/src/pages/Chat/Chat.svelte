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
    import Head from "../../components/Head/Head.svelte";

    export let registerFocus;
    const location = useLocation();

    let chatUsers = [{ id: 0, username: "SentimentBot", self: false }];
    let messages = [];
    const myUserID = $user.id;

    onMount(() => {
        $activeRoute = $location.pathname;
        messages = msgWrap({
            id: 0,
            sender: chatUsers[0],
            content:
                "Welcome to the chat lounge, please click on any message to make me process it",
        });
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

    socket.on("chat message", async (msg) => {
        messages = msgWrap(msg);
        window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on("users", (users) => {
        users.forEach((user) => {
            user.self = user.id === myUserID;
        });
        // put the current user first, and then sort by username
        chatUsers = [
            ...chatUsers,
            ...users.sort((a, b) => {
                if (a.self) return -1;
                if (b.self) return 1;
                if (a.username < b.username) return -1;
                return a.username > b.username ? 1 : 0;
            }),
        ];
    });
    //
    socket.on("user connected", (user) => {
        messages = msgWrap({
            sender: { id: 0, username: "system" },
            content: `${user.username} has joined`,
        });
        chatUsers = [...chatUsers, user];
    });
    // when any user disconnects
    socket.on("user disconnected", (username) => {
        messages = msgWrap({
            sender: { id: 0, username: "system" },
            content: `${username} has left`,
        });
        chatUsers = chatUsers.filter((u) => u.userID !== user.userID);
    });

    onDestroy(() => {
        socket.disconnect(); // -->delete from users array in backend
        socket.off("connect_error");
    });

    const msgWrap = (msg) => {
        // cycle theme colors using senders user id
        const msgColors = [
            "primary",
            "secondary",
            "success",
            "danger",
            "warning",
            "info",
            "light",
            "dark",
        ];
        msg.color = msgColors[msg.sender.id % msgColors.length];
        // console.log(msg);
        return [...messages, msg];
    };
</script>

<Head icon="message-circle" title="Chat" />
<div class="row gx-2 flex-nowrap flex-grow-1">
    <Users {chatUsers} />
    <div class="col-lg-9">
        <div class="bg-dark text-white p-3 d-flex flex-column px-xl-5 h-100">
            <h3 class="text-center mb-3">Chat lounge</h3>
            <Messages {messages} />
            <Input {registerFocus} {socket} />
        </div>
    </div>
</div>
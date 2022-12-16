<script>
    import { user, activeRoute } from "../../store/globals";
    import { useLocation } from "svelte-navigator";
    import { onDestroy } from 'svelte';
    import io from "socket.io-client";
    import { validTokens } from "../../utils/tokenUtil";
    import { onMount } from 'svelte';

    const location = useLocation();
    onMount(()=>$activeRoute=$location.pathname);
    
    export let registerFocus;
    let message = "testMsg";
    let messages;
    let chatUsers = [];
    let myUserID = $user.id;
    
    const socket = io("http://localhost:8080", {
        // autoConnect: false,
        reconnectionAttempts: 0,
        auth: { token: $user.tokens.access },
        withCredentials: true   // send cookies
    });
    
    let attempts = 1;
    socket.on("connect_error", async (err) => {
        if (err.message === "invalid context") return $user = null; // show login form
        else if (err.message === "invalid token") {
            if (!await validTokens($user.tokens)) return $user = null;
            socket.auth.token = $user.tokens.access; // update access token
            return socket.connect(); // try again after refresh
        }
        console.log("ERR:", err.message);
        // add one AFTER comparing, try reconnecting 4 times
        if (attempts++ < 5) socket.connect(); 
    });
    
    // socket.onAny((event, ...args) => {
    //     console.log(event, args);
    // });
    
    socket.on("users", (users) => {
        users.forEach((user) => {
            console.log("UserID:", myUserID)
            user.self = user.id === myUserID; // TODO: self is not in 
            // console.log(user);
        });
        // put the current user first, and then sort by username
        chatUsers = users.sort((a, b) => {
            if (a.self) return -1;
            if (b.self) return 1;
            if (a.username < b.username) return -1;
            return a.username > b.username ? 1 : 0;
        });
    });
    // 
    socket.on("user connected", (user) => {
        console.log("user connected", user);
        chatUsers = [...chatUsers, user];
    });
    // when any user disconnects (TODO:)
    socket.on("user disconnected", (user) => {
        chatUsers = chatUsers.filter(u=>u.userID !== user.userID);
        console.log("user has left:", user);
    });
    // when self connect/disconnect
    socket.on("connect", () => {
        chatUsers.forEach((user) => {
            if (user.self) {
                user.connected = true;
            }
        });
    });
    socket.on("disconnect", () => {
        chatUsers.forEach((user) => {
            if (user.self) {
                user.connected = false;
            }
        });
    });
    
    socket.on("chat message", (msg) => {
        // console.log(msg);
        let item = document.createElement('div');
        item.className = "";
        item.textContent = msg;
        if (messages) messages.appendChild(item);
        // window.scrollTo(0, document.body.scrollHeight);
    });
    
    onDestroy(() => {
        socket.disconnect(); // delete from users array in backend
        socket.off("connect_error");
    });
    
    const sendMessage = ()=>{
        socket.emit('chat message', message);
    }
</script>
<div class="row gx-2 flex-nowrap flex-grow-1">
<div class="col-lg-4 col-xl-3 d-none d-lg-block">
<div class="bg-dark text-white h-100 p-2">
    <h3 class="text-center">Users</h3>
    <div>
    {#each chatUsers as user}
    <div class="text-center text-success fw-bold">{ user.username }</div>
    {/each}
    </div>
</div>
</div>
<div class="col-lg-8, col-xl-9">
<div class="bg-dark text-white p-2 d-flex flex-column px-md-5 h-100">
    <h3 class="text-center">Chat lounge</h3>
    <div class="flex-grow-1" bind:this={messages}></div>
    <div class="d-flex input-group">
        <input use:registerFocus bind:value={message} type="text" class="form-control bg-light border-0" placeholder="Enter message" aria-label="Enter message">
        <button class="btn btn-success" type="button" on:click={sendMessage}>Send</button>
    </div>
</div>
</div>
</div>

<script>
    import { user } from "../../store/globals";

    export let chatUsers;
    export let socket;

    const myUserID = $user.id;

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
</script>

<div class="d-none d-lg-block col-lg-3">
    <div class="bg-dark text-white h-100 p-2">
        <h3 class="text-center mb-3">
            <svg class="feather">
                <use href="/feather-sprite.svg#users" />
            </svg>
        </h3>
        <div>
            {#each chatUsers as user}
                <div class="text-center text-success fw-bold">
                    {user.username}
                </div>
            {/each}
        </div>
    </div>
</div>
<script>
    import { onMount } from "svelte";
    import Message from "./Message.svelte";

    export let socket;
    export let chatUsers;

    let messages = [];

    onMount(() => messages = msgWrap({
                id: 0,
                sender: chatUsers[0],
                content: "Welcome to the chat lounge, please click on any message to make me process it",
            })
    );

    socket.on("chat message", async (msg) => {
        messages = msgWrap(msg);
        window.scrollTo(0, document.body.scrollHeight);
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

<div class="flex-grow-1">
    {#each messages as msg}
        <div class="mb-3 text-{msg.sender.id % 2 === 0 ? 'start' : 'end'}">
            <div class=".small mb-1 mx-1">
                {msg.sender.username}
            </div>
            <Message {msg} />
        </div>
    {/each}
</div>

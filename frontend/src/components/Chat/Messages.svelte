<script>
    import Message from "./Message.svelte";

    export let messages;

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

<script>
    export let socket;
    export let registerFocus;
    let message;

    const sendMessage = async () => {
        socket.emit("chat message", message);
        message = ""; // clear input text field
    };
</script>

<div class="d-flex input-group">
    <input
        use:registerFocus
        bind:value={message}
        on:keydown={(e) => e.keyCode === 13 && sendMessage()}
        type="text"
        class="form-control bg-light border-0"
        placeholder="Enter message"
        aria-label="Enter message"
    />
    <button class="btn btn-success" type="button" on:click={sendMessage}>
        <svg class="feather">
            <use href="/feather-sprite.svg#send" />
        </svg>
    </button>
</div>
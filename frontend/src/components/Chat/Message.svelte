<script>
    import { onMount } from "svelte";
    import predictSentiment from "../../utils/model.js";
    import Popover from "bootstrap/js/dist/popover.js";

    export let msg;
    let popover;
    let popoverEl;
    let processed = false;

    onMount(()=>{
        if (popoverEl) {
            popover = new Popover(popoverEl);
            popoverEl.addEventListener('show.bs.popover', () =>
                !processed && predictSentiment([msg.content]).then(s=>sentiment(s))
            );
            popoverEl.addEventListener('inserted.bs.popover', () =>
                processed && msg.sentimentClass && setColor(msg.sentimentClass)
            );
        }
    });

    const setColor = (sentimentClass)=>{
        const [popoverEl] = document.getElementsByClassName(`msg-${msg.id}`);
        popoverEl.classList.add(`popover-${sentimentClass}`);
    }

    const sentiment = (sentiment)=>{
        const [s] = sentiment;
        processed = true;   // do not trigger prediction on setContent
        msg.sentimentClass = s.category.toLowerCase(); // choose colors based on sentiment
        popover.setContent({
            '.popover-header': 'SentimentBot',
            '.popover-body': `${s.category} (confidence: ${s.confidence})`
        });
    }
</script>

<button type="button" class="btn btn-{msg.color} rounded"
        data-bs-toggle="popover" data-bs-placement="{msg.sender.id % 2 === 0 ? 'right' : 'left'}"
        data-bs-custom-class="msg-{msg.id} fs-5"
        data-bs-title="SentimentBot"
        data-bs-content="Processing..."
        bind:this={popoverEl}>
        { msg.content }
</button>

<style>
    button {
        max-width: 50%;
    }
</style>
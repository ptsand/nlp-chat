<script>
    import { onMount } from "svelte";
    import predictSentiment from '../../utils/model.js';

    export let msg;
    let popover;
    let popoverEl;
    let processed = false;

    onMount(()=>{
        if (popoverEl) {
            popover = new bootstrap.Popover(popoverEl);
            popoverEl.addEventListener('show.bs.popover', () =>
                !processed && predictSentiment([msg.content]).then(s=>sentiment(s))
            );
        }
    });

    const sentiment = (sentiment)=>{
        const [s] = sentiment;
        processed = true;   // do not trigger prediction on setContent
        popover.setContent({
            '.popover-header': 'SentimentAnalyzerBot',
            '.popover-body': `${s.category} (confidence: ${s.confidence})`
        });
    }
</script>

<button type="button" class="btn btn-{msg.color} rounded-pill mx-2"
        data-bs-toggle="popover" data-bs-placement="{msg.sender.id % 2 === 0 ? 'right' : 'left'}"
        data-bs-custom-class="custom-popover"
        data-bs-title="SentimentAnalyzerBot"
        data-bs-content="Processing..."
        bind:this={popoverEl}>
        { msg.content }
</button>

<style>
    button {
        max-width: 50%;
    }
</style>
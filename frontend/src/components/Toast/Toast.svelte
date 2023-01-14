<script>
    import { onMount } from "svelte";
    import Toast from "bootstrap/js/dist/toast.js";

    export let title;
    export let message;

    let seconds = 0;

    // TODO: setInterval to update time on toasts
    onMount(()=>{
        const toastLiveExample = document.getElementById('liveToast');
        const toast = new Toast(toastLiveExample);
        toast.show()
        setInterval(()=>seconds++,1000)
    });
</script>

<div class="toast-container position-fixed bottom-0 end-0 p-3">
  <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      <strong class="me-auto">{ title }</strong>
      <small>{ seconds } seconds ago</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
        { message }
    </div>
  </div>
</div>
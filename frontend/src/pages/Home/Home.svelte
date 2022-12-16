<script>
    import { user } from '../../store/globals.js';
    import jwtDecode from 'jwt-decode';
    import Toast from "../../components/Toast/Toast.svelte";
    import { useLocation } from 'svelte-navigator';
    import  { activeRoute } from '../../store/globals.js'
    import { onMount } from 'svelte';
    
    export let registerFocus;

    const location = useLocation();
    onMount(()=>$activeRoute=$location.pathname);
    
</script>
<div use:registerFocus class="bg-dark w-100 text-white p-2 d-flex flex-column flex-grow-1">
    <h2 class="m-auto">Welcome {$user.username}</h2>
</div>

{#if !$user.email_confirmed}
    <Toast title="Confirmation Bot" message="Please confirm your email, thanks" />
{/if}
<script>
    import { user, activeRoute } from '../../store/globals.js';
    import { useLocation } from 'svelte-navigator';
    import { onMount } from 'svelte';
    import makeReq from '../../utils/fetchWrapper.js';
    export let registerFocus;

    const location = useLocation();
    onMount(()=>$activeRoute=$location.pathname);
</script>

<div use:registerFocus class="bg-dark text-white p-2 d-flex flex-column flex-grow-1 justify-content-center px-md-5">
    <h2 class="mx-auto pb-3">Your profile</h2>
        {#await makeReq("/users/me")}
            <p>Fetching your information...</p>
        {:then details}
        <table class="table table-dark table-hover text-center">
            <tbody>
              <tr>
                <th scope="row">Username</th>
                <td>{ details.username }</td>
              </tr>
              <tr>
                <th scope="row">Role</th>
                <td>{ details.role }</td>
              </tr>
              <tr>
                <th scope="row">Email</th>
                <td>{ details.email }</td>
              </tr>
            </tbody>
          </table>
        {:catch err}
            {err}
        {/await}
</div>
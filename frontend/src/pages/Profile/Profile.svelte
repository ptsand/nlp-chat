<script>
    import { activeRoute } from '../../store/globals.js';
    import { useLocation } from 'svelte-navigator';
    import { onMount } from 'svelte';
    import makeReq from '../../utils/fetchWrapper.js';
    import Head from '../../components/Head/Head.svelte';
    export let registerFocus;

    const location = useLocation();
    onMount(()=>$activeRoute=$location.pathname);
</script>

<Head icon="user" title="Profile" />
<div use:registerFocus class="bg-dark text-white p-2 d-flex flex-column flex-grow-1 justify-content-center px-md-5">
    <h2 class="mx-auto pb-3">
      <svg class="feather sw-4">
        <use href="/feather-sprite.svg#user"/>
      </svg>
      profile
    </h2>
        {#await makeReq("/users/me")}
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        {:then details}
        <div class="table-wrapper rounded mx-auto">
          <table class="table table-dark table-borderless table-hover mb-0">
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
        </div>
        {:catch err}
            {err}
        {/await}
</div>

<style>

  table {
    min-width: 500px;
    --bs-table-bg: var(--bs-black);
  }
  .table-wrapper {
    overflow: hidden;
  }
</style>
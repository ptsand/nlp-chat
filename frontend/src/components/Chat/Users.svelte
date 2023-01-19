<script>
    export let chatUsers;
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
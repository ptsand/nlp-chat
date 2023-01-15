<script>
    // @ts-nocheck
    import { Sveltik, Form, Field, ErrorMessage } from 'sveltik';
    import { useFocus, useLocation } from "svelte-navigator";
    import { onMount } from 'svelte';
    import makeReq from '../../utils/fetchWrapper.js';
    import { activeRoute } from '../../store/globals.js';
    import Head from '../../components/Head/Head.svelte';

    const location = useLocation();
	const registerFocus = useFocus();
    onMount(()=>{
        registerFocus(document.getElementById("username"));
        $activeRoute=$location.pathname;
    });
    let status = { err: false, msg: undefined };

    let initialValues = {
        username: 'user',
        email: 'test@dev.mail',
        password: 'letmein',
    };
    
    let validate = values => {
        const errors = {};
        if (!values.username) {
            errors.username = 'Required';
        } else if (!values.password) {
            errors.password = 'Required';
        } else if (!values.email) {
            errors.email = 'Required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
        }
        return errors;
    }
    
    let onSubmit = async (user, { setSubmitting }) => {
        try {
            status.msg = await makeReq("/users", "post", user).then(res=>res.message);
        } catch (err) {
            status.err = true;
            status.msg = err.message;
        }
        setSubmitting(false);
    }
</script>

<Head icon="user" title="Register" />
<div class="d-flex w-100 place-center flex-grow-1">
    <Sveltik {initialValues} {validate} {onSubmit} let:isSubmitting>
        <Form class="bg-dark px-4 py-2 mx-auto text-center" style="min-width: 30vw;">
            <h3 class="mb-3 text-white">Register</h3>
            <div class="form-floating mb-3">
                <Field class="form-control" id="username" type="text" name="username" />
                <label for="username">Username</label>
                <ErrorMessage name="username" as="div" />
            </div>
            <div class="form-floating mb-3">
                <Field class="form-control" id="password" type="password" name="password" />
                <label for="password">Password</label>
            </div>
            <div class="form-floating mb-3">
                <Field class="form-control" id="email" type="email" name="email" />
                <label for="email">Email</label>
                <ErrorMessage name="email" as="div" />
            </div>
            <div>
                <button class="btn btn-success mb-2" type="submit" disabled={isSubmitting}>Submit</button>
                {#if isSubmitting}
                    <div>In progress...</div>
                {:else if status.msg}
                    <div class="alert mb-0 alert-{!status.err ? 'success' : 'danger'}">
                        {status.msg}
                    </div>
                {/if}
            </div>
        </Form>
    </Sveltik>
</div>
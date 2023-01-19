import { readable, writable } from "svelte/store";

export const BASE_URL = readable("http://localhost:8080"); // TODO: call apiBaseUrl, move to env

export let activeRoute = writable(null);

// parse user from localStorage
export const user = writable(localStorage.user ? JSON.parse(localStorage.user) : null);

// persist in localStorage if user else clear
user.subscribe((user) => user && (localStorage.user = JSON.stringify(user)) || localStorage.clear());

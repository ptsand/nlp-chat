// @ts-nocheck
import { get } from 'svelte/store';
import { BASE_URL, user } from '../store/globals.js';
import { validTokens } from './tokenUtil.js';

const makeReq = async (path, method, body) => {
  const options = {
    method: method || "get",  // use get as default
    credentials: 'include',
    headers: {
      "Content-type": "application/json",
      "Accept": "application/json"
    }
  };
  if (body) options.body = JSON.stringify(body); // optional body
  // authenticate with access token, if present and valid
  const tokens = get(user)?.tokens;
  if (tokens?.access) {
      if(!await validTokens(tokens)) return user.set(null); // show login form
      options.headers.Authorization = `Bearer ${ get(user).tokens.access }`;
  }
  return fetch(`${get(BASE_URL)}/api${path}`, options).then(res => handleErrors(res));
}

const handleErrors = async (res) => {
  if (!res.ok) {
    if (res.status === 403 || res.status === 401) {
      user.set(null); // this will show the login form
    }
    const errorResponse = await res.json();
    const error = new Error(errorResponse.message);
    throw error;
  }
  if (res.status === 204) return res; // empty res body, just return it
  return res.json();
}

export default makeReq;
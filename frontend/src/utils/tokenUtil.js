// @ts-nocheck
import jwtDecode from 'jwt-decode';
import makeReq from './fetchWrapper.js';
import { get } from 'svelte/store';
import { user } from '../store/globals.js';

export const validTokens = (tokens) => {
    if (tokenExpired(tokens?.access)) {
      if (tokenExpired(tokens?.refresh)) {
        return false;
      }
      return refreshAccessToken(); 
    }
    return true;  // valid access token
}

export const refreshAccessToken = async () => {
    setAccessToken(false);  // avoid refresh loop
    return makeReq( // fetch new accessToken
        "/auth/refresh", "post", { token: get(user).tokens.refresh }
    ).then(res => {
        setAccessToken(res.token);
        return true;    // success
    });
}

export const tokenExpired = token => {
    // console.log(token);
    if (!token) return true;
    try {
        const { exp } = jwtDecode(token); // expires exp seconds after epoch
        // convert to ms since epoch to match Date.now()
        // subtract 1 second to hit the server before expiry
        const expireTime = exp * 1000 - 1000;
        if (Date.now() > expireTime) return true;
    } catch (err) {
        return true;
    }
}

const setAccessToken = token => {
    user.update(user => { 
        user.tokens.access = token;
        return user;
    });
}
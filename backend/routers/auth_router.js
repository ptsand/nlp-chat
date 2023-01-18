import { Router } from "express";
import { 
    sha256,
    accessToken, 
    refreshToken, 
    updateAccessToken,
    blacklistRefreshToken
} from '../middleware/jwt_auth.js';
import * as argon2 from "argon2";
const { randomBytes } = await import('node:crypto');
import * as db from '../database/db_wrapper.js';

const router = Router();
const req_base = "/api/auth";

router.post(`${req_base}/refresh`, (req, res) => {
    res.send({ token: updateAccessToken(req, res) });
});

router.post(`${req_base}/logout`, (req, res) => {
    // blacklist refresh token until expiry
    if (!blacklistRefreshToken(req.body.token)) return res.sendStatus(400);
    res.sendStatus(204); 
});

router.post(`${req_base}/login`, async (req, res) => {
    // verify username and password
    const { username, password } = req.body;
    const user = await db.userByUsername(username);
    try {
        if ( !await argon2.verify(user?.password, password) ) throw new Error();
    } catch (err) {
        return res.status(401).send({ message: "Invalid username or password" });
    }
    if (!user.enabled) res.status(401).send({ message: "User disabled" });
    // create tokens and user context to prevent side jacking, ref:
    // https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
    const fingerprint = randomBytes(50).toString("hex");
    const { id, role, email_confirmed } = user;
    const claims = { id, username, role, email_confirmed, hash: sha256(fingerprint) };
    const tokens = { access: accessToken(claims), refresh: refreshToken(claims) };

    res.cookie('__Secure_Fgp', fingerprint, { 
        httpOnly: true,     // prevent clientside js to read cookie
        sameSite: 'strict', // works with chrome on localhost, safari needs a real domain
        secure: true,       // (localhost is allowed in plaintext though)
        maxAge: 3600*24*7   // 7 days
    });
    
    res.json(tokens);
});

export default router;
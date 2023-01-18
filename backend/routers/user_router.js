import { Router } from "express";
import { authenticate } from "../middleware/jwt_auth.js";
import * as db from "../database/db_wrapper.js";
import { sendConfirmationMail } from "../utils/mailer.js";
const { randomBytes } = await import('node:crypto');

const router = Router();

const req_base = "/api/users";

// protected endpoint (admins only)
router.get(req_base, authenticate, (req, res) => {
    if (req.user.role === 'admin') return res.send(db.users());
    res.sendStatus(403);
});

// let authenticated user retrieve user data not in token
router.get(`${req_base}/me`, authenticate, async (req, res) => {
    // important: req.user.name is NOT comming from the client,
    // but extracted from a VERIFIED token in authenticate middleware function
    const user = { ...await db.userByUsername(req.user.username) };
    delete user.password;   // don't send password hash to client
    res.send(user);
});

router.get(`${req_base}/confirm-email/:code`, authenticate, async (req, res) => {
    const trueCode = await db.confirmationCode(req.user.id);
    if (req.params.code === trueCode) {
        await db.confirmEmail(req.user.id);
        return res.send({ message: "Your email was successfully confirmed, thank you." });
    }
    res.status(400).send({ message: "Your email was already confirmed!" });
});
// register endpoint
router.post(req_base, async (req, res) => {
    // TODO: validation
    const confirmationCode = randomBytes(10).toString("hex");
    const user = { ...req.body, role: 'user', confirmationCode};  // set role, code
    try {
        await db.saveUser(user);
        sendConfirmationMail(user.email, confirmationCode);
        res.send({ message:"Registration successful" });
    } catch (err) {
        res.status(409).send({ message: err.message });
    }
});

export default router;

import { envs } from "./load_env.js";

const {
    SMTP_HOST: host,
    SMTP_USER: user,
    SMTP_PASS: pass,
    SMTP_PORT: port
} = envs;

export const smtp_conf = { 
    host,
    auth: { user, pass },
    port
}

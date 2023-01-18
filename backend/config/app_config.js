import { envs } from "./load_env.js";

export const { HOST, PORT } = envs;

// TODO: read from .env
export const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true                   // accept cookies
}
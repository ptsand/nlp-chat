import { envs } from "./load_env.js";

const { DB_HOST: host,
    DB_USER: user,
    DB_PASSWORD: password,
    DB_NAME: database,
} = envs;

export const dbPoolConf = { 
    host,
    user,
    password,
    database,
}
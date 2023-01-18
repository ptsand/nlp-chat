import * as dotenv from 'dotenv';

const result = dotenv.config({ path: ".env.dev" });

const { parsed: envs } = result;

export { envs };
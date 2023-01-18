import mysql from "mysql2";
import * as argon2 from "argon2";
import { dbPoolConf } from "../config/db_config.js";

let db;

export const setupConnectionPooling = () => {
    try {
        db = mysql.createPool(dbPoolConf).promise();
    } catch (err) {
        console.log("Error creating db connection pool:", err.message);
    }
    return db;
}

export const userByUsername = async (username) => {
    if (!username) return false;
    const [[user]] = await db.query(
        'SELECT * FROM users inner join roles on users.role_id=roles.id WHERE username = ?;',
        [username]);
    return user;
}

export const users = async () => {
    const [users] = await db.query('SELECT * FROM users inner join roles on users.role_id=roles.id;');
    return users;
}

export const saveRole = async (name)=>await db.query(
    'INSERT INTO roles (name) VALUES (?);',
    [name]
);

export const roleIdByName = async (name) => {
    const [[role]] = await db.query('SELECT id FROM roles where name = ?;', [name]);
    return role.id;
}

export const saveUser = async (user) => {
    user.password = await argon2.hash(user.password); // argon2 recommended by owasp
    // ref: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id
    const { username, password, email, role, confirmationCode } = user;
    return roleIdByName(role).then((roleId)=>db.query(
        'INSERT INTO users (username, password, email, role_id) VALUES (?, ?, ?, ?);',
        [username, password, email, roleId])
    ).then((res)=>db.query('INSERT INTO confirmation_codes (user_id, code) VALUES (?, ?);', 
        [res[0].insertId, confirmationCode]));
}

export const confirmEmail = async (userID) => {
    return await Promise.all([
        db.query('UPDATE users SET email_confirmed = 1 WHERE id = ?;', [userID]),
        db.query('DELETE FROM confirmation_codes WHERE user_id = ?;', [userID])
    ]);
}

export const confirmationCode = async (userID) => {
    const [[row]] = await db.query('SELECT code FROM confirmation_codes WHERE user_id = ?;', [userID]);
    return row?.code;
}
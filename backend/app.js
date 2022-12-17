import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRouter from "./routers/authRouter.js";
import userRouter from "./routers/userRouter.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./database/dbWrapper.js";
import * as dotenv from 'dotenv';
import { Server } from "socket.io";
import http from "http";
import { authenticate } from './utils/tokenHandler.js'

dotenv.config({ path: ".env.dev" });    // load .env file

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true                   // accept cookies
}

const app = express();
const server = http.createServer(app);
const io = new Server(server,  {
    cors: corsOptions
});

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(helmet());        // set security headers

app.use(express.static("public"));

// setup req rate limiting
const generalLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 80
});
app.use(generalLimiter);

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 6, // Limit each IP to 6 requests per `window`
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use("/api/auth/login", authLimiter);

app.use(authRouter);
app.use(userRouter);

// last middleware handles not found
app.use(function (req, res){
	res.sendStatus(404);
});

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(cookieParser()));

io.use((socket, next)=>{ // wrap auth and add auth header
    socket.request.headers.authorization = `Bearer ${ socket.handshake.auth.token }`;
    return authenticate(socket.request, false, next);
});

let users = [];   // keep users in memory

// handle connections to socket
io.on("connection", (socket) => {
    let user = socket.request.user;     // the connected user
    for (let [id, socket] of io.of("/").sockets) {
        let user = socket.request.user;
        if (users.filter(u=>u.id===user.id).length < 1) {
            console.log("added user with id", user);
            users.push({
                id: user.id,
                username: user.username,
                connected: true
            });
        }
    }
    socket.emit("users", users);

    // notify existing users
    socket.broadcast.emit("user connected", {
      id: user.id,
      username: user.username,
    });

    socket.on("disconnect", async () => {
        // remove disconnected user
        users = users.filter(u => u.id !== user.id);
        console.log("disconnect, users left:", users);
        // notify other clients
        socket.broadcast.emit("user disconnected", user.id);
    });

    socket.on("chat message", (message) => {
        // console.log(data, socket.handshake.auth);
        const msg = { sender: { id: user.id, username: user.username}, content: message };
        io.emit("chat message", msg);
    });
});

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 8080;

server.listen(PORT, HOST, (error) => {
    if (error) console.log(error);
    console.log("Server is running on port", server.address().port);
    db.setupConnectionPooling();           // use DB connection pool
});
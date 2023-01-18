import express from "express";
import * as db from "./database/db_wrapper.js";
import { Server } from "socket.io";
import http from "http";
import { HOST, PORT, corsOptions } from "./config/app_config.js";
import { initExpressMiddleware, initSocketIoMiddleware } from "./middleware/init.js";
import { respond } from "./controllers/chat_controller.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });

initExpressMiddleware(app);
initSocketIoMiddleware(io);

// handle connections to socket
io.on("connection", socket => respond(socket, io));

server.listen(PORT, HOST, (error) => {
    if (error) console.log(error);
    console.log("Server is running on port", server.address().port);
    db.setupConnectionPooling();           // use DB connection pool
});
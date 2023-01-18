import { generalLimiter, authLimiter } from "./rate_limit.js";
import express from "express";
import helmet from "helmet";
import authRouter from "../routers/auth_router.js";
import userRouter from "../routers/user_router.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "../config/app_config.js";
import { authenticate } from './jwt_auth.js'

export const initExpressMiddleware = app => {
    app.use(cors(corsOptions));
    app.use(cookieParser());
    app.use(express.json());
    app.use(helmet());        // set security headers

    app.use(express.static("public"));

    app.use(generalLimiter);
    app.use("/api/auth/login", authLimiter);
    app.use(authRouter);
    app.use(userRouter);

    // last middleware handles not found
    app.use(function (req, res) {
        res.sendStatus(404);
    });
}

export const initSocketIoMiddleware = io => {
    const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
    io.use(wrap(cookieParser()));

    io.use((socket, next) => { // wrap auth and add auth header
        socket.request.headers.authorization = `Bearer ${socket.handshake.auth.token}`;
        return authenticate(socket.request, false, next);
    });
}
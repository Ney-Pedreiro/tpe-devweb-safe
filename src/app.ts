import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
app.use(express.json());

//configuração da sessão bem top demais
app.use(session({
    secret: process.env.SESSION_SECRET || "senhaSecretaDemais",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 //isso da um dia
    }
}))
// montar rotas
app.use('/auth', authRoutes);

export { app };
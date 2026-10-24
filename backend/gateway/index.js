import express from "express";
import proxy from "express-http-proxy";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { protect } from "./middleware/protect.js";
import { proxyWithHeader } from "./utils/proxyWithHeader.js";
import { getCurrentUser } from "./controllers/user.controller.js";

dotenv.config();
const app=express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 8000;

app.use("/api/auth", proxy(process.env.AUTH_SERVICE));
app.use("/api/projects",protect ,proxyWithHeader(process.env.PROJECT_SERVICE));
app.use("/api/files",protect ,proxyWithHeader(process.env.FILE_SERVICE));
app.get("/api/me", protect, getCurrentUser);
app.get("/", (req, res) => {
    res.json({message: "Gateway is running"});
});







app.listen(port, () => {
    console.log(`gateway started at ${port}`);
})    
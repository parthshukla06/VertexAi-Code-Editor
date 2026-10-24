import { app } from "../config/firebase.js"
import { getAuth } from "firebase-admin/auth"
import crypto from "crypto"
import User from "../models/user.model.js"
import redis from "../../../shared/redis/redis.js";

export const login = async (req, res) => {
    try {
        const { token } = req.body;
        const decoded = await getAuth(app).verifyIdToken(token);

        let user = await User.findOne({
            firebaseUid: decoded.uid,
        });

        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                email: decoded.email,
                name: decoded.name,
                avatar: decoded.picture,
            });
        }

        const sessionId = crypto.randomUUID();
        await redis.set(
            `session:${sessionId}`,
            JSON.stringify({
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                _id: user._id,
            }),"EX", 7*24*60*60
        )

        res.cookie("session", sessionId, {
            httpOnly: true,
            secure: false, // Set to true in production
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });



        return res.status(200).json(user);
    } catch (error) {
        return res.status(401).json({ message: `login error: ${error.message}` });
    }
};

export const logout = async (req, res) => {
    try {
        const sessionId = req.cookies.session;
        if (sessionId) {
            await redis.del(`session:${sessionId}`);
            res.clearCookie("session");
        }
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Logout error: ${error.message}` });
    }
};
import redis from "../../shared/redis/redis.js";

export const protect = async (req, res, next) => {
    try {
        const sessionId = req.cookies.session;
        if (!sessionId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const result = await redis.get(`session:${sessionId}`);
        if (!result) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const data = JSON.parse(result);
        req.user = data;
        next();
    } catch (error) {
        res.status(500).json({ message: `Protect middleware error: ${error.message}` });
    }
}
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config();
const port = process.env.PORT || 8003;

const app=express();
app.use(express.json());


app.get("/", (req, res) => {
    res.json({message: "Hello from File Service"});
});




app.listen(port, () => {
    connectDB()
    console.log(`File service started at ${port}`);
})    
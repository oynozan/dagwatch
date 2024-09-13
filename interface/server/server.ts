import express, { type Application } from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import cors from "cors";

const app: Application = express();
const whitelist = ["http://localhost:3000", "https://dagwatch.xyz"];

/* Middlewares */
app.use(cors({ origin: whitelist, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.post("/user", (req, res) => {
    const { accessToken } = req.body;
    if (!accessToken) return res.status(400).send({ message: "Bad Request" });

    const user = req.cookies["user-token"];
    if (!user) return res.status(401).send({ message: "Unauthorized" });

    try {
        var decoded = jwt.verify(user, accessToken);
    } catch(e) {
        console.error(e);
        return res.status(401).send({ message: "Unauthorized" });
    }

    return res.send({ message: "OK", user: decoded });
});

// Start the server
app.listen(5001, () =>
    console.log(`DAGWatch Interface Server is running on port ${5001}`),
);
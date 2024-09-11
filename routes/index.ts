import { type Request, Router } from "express";

import type { IApp } from "../db/App";

/* ROUTES */
import app from "./app";
import auth from "./auth";
import wallet from "./wallet";

const router = Router();

router.use("/", app);
router.use("/auth", auth);
router.use("/wallet", wallet);

/**
 * @description Failed to login route
 */
router.get("/failed", (req, res) => {
    return res.send("Failed to login");
});

export type AppRequest = Request & { app: IApp };
export default router;

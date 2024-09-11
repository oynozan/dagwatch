import { Router } from "express";

import userDB from "../db/User";
import { verifyApp } from "../funcs/middlewares";

const router = Router();

/**
 * @description Get user information from the wallet
 */
router.get("/user", verifyApp, async (req, res) => {
    try {
        const { app } = req as any;
        const { address } = req.query;

        if (!address) return res.status(400).send({ message: "Address is required" });

        // Get the user
        const user = await userDB.findOne(
            { wallet: address, appID: app._id },
            { _id: 0, __v: 0 },
            { lean: true },
        );

        if (!user) return res.status(404).send({ message: "User not found" });

        return res.send({
            email: user.email,
            loginType: user.type,
            pfp: user.pfp,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "An error occured." });
    }
});

export default router;
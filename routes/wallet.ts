import { Router } from "express";

import userDB from "../db/User";
import { Wallet } from "../funcs/wallet";
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

/**
 * @description Get the balance of the user
 */
router.get("/balance", verifyApp, async (req, res) => {
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

        // Get the balance
        const wallet = new Wallet();
        const balance = await wallet.getBalance(address as string);

        return res.send({ balance });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "An error occured." });
    }
});

/**
 * @description Send a transaction
 */
router.post("/send-transaction", verifyApp, async (req, res) => {
    try {
        const { app } = req as any;
        const { address, to, amount } = req.body;

        if (!address || !to || amount === undefined)
            return res.status(400).send({ message: "All fields are required" });

        // Get the user
        const user = await userDB.findOne(
            { wallet: address, appID: app._id },
            { _id: 0, __v: 0 },
            { lean: true },
        );

        if (!user) return res.status(404).send({ message: "User not found" });

        // Send the transaction
        const wallet = new Wallet();
        const tx: any = await wallet.sendTransaction(user.privateKey, to, amount);
        const rawTx = tx.toString();

        // Error management
        if (rawTx.includes("Send amount must be greater than 1e-8"))
            return res.status(400).send({ message: "Amount must be greater than 0" });
        if (rawTx.includes("An address cannot send a transaction to itself"))
            return res.status(400).send({ message: "You cannot send a transaction to yourself" });
        if (rawTx.includes("Insufficient"))
            return res.status(400).send({ message: "Insufficient balance" });

        // Return the transaction
        return res.send({ message: "Transaction sent successfully", tx });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "An error occured." });
    }
});

export default router;

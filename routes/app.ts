import { z } from "zod";
import { Router } from "express";
import { randomUUID } from "crypto";

import appDB from "../db/App";
import { verifyApp } from "../funcs/middlewares";

const router = Router();

/**
 * @description Sign an application up for the API
 */
router.post("/sign-application", async (req, res) => {
    const body = req.body;

    // Validate the request body
    const schema = z.object({
        name: z.string().min(3).max(100),
        redirect: z.string().url().startsWith("http"),
    });

    try {
        var { name, redirect } = schema.parse(body);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: "Invalid request body" });
    }

    // Generate a unique appID and token
    const appID = randomUUID();
    const token = randomUUID();

    // Create a new application document
    const newApplication = new appDB({
        _id: appID,
        name,
        redirect,
        token,
    });

    // Save the application to the database
    await newApplication.save();

    return res.send({ appID, token });
});

/**
 * @description Get the details of an application
 */
router.get("/details", verifyApp, async (req, res) => {
    try {
        const { app } = req as any;
        return res.send({ name: app.name, redirect: app.redirect, id: app._id });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "An error occured." });
    }
});

/**
 * @description Update the name of the application
 */
router.post("/update-name", verifyApp, async (req, res) => {
    const body = req.body;

    // Validate the request body
    const schema = z.object({
        name: z.string().min(3).max(100),
    });

    try {
        var { name } = schema.parse(body);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: "Invalid request body" });
    }

    // Update the application name
    const { app } = req as any;
    await appDB.updateOne({ _id: app._id }, { $set: { name } });

    return res.send({ message: "OK" });
});

/**
 * @description Update the redirect URL of the application
 */
router.post("/update-redirect", verifyApp, async (req, res) => {
    const body = req.body;

    // Validate the request body
    const schema = z.object({
        redirect: z.string().url().startsWith("http"),
    });

    try {
        var { redirect } = schema.parse(body);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: "Invalid request body" });
    }

    // Update the application redirect URL
    const { app } = req as any;
    await appDB.updateOne({ _id: app._id }, { $set: { redirect } });

    return res.send({ message: "OK" });
});

/**
 * @description Check if app ID and token are valid
 */
router.post("/verify", async (req, res) => {
    const body = req.body;

    // Validate the request body
    const schema = z.object({
        appID: z.string(),
        token: z.string(),
    });

    try {
        var { appID, token } = schema.parse(body);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: "Invalid request body" });
    }

    // Check if the app exists
    const app = await appDB.findOne({ _id: appID, token });
    if (!app) return res.status(404).json({ error: "App ID and access token do not match" });

    return res.send({ message: "OK" });
});

export default router;

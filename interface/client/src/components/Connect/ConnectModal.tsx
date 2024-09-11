import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaDiscord, FaGoogle } from "react-icons/fa6";

import "./modal.scss";

export default function ConnectModal() {
    const [appID, setAppID] = useState<string>("");

    const handleGoogleLogin = (): any => {
        if (!appID) return toast.error("Please enter your DAGWatch App ID");
        window.location.href = `${process.env.REACT_APP_API}/auth/google?appID=${appID}`;
    };
    const handleDiscordLogin = (): any => {
        if (!appID) return toast.error("Please enter your DAGWatch App ID");
        window.location.href = `${process.env.REACT_APP_API}/auth/discord?appID=${appID}`;
    };

    return (
        <div id="connect-modal">
            <h2>Sign in to DAGWatch</h2>
            <div className="app-id">
                <label>DAGWatch App ID</label>
                <a href="https://docs.dagwatch.xyz/development-docs/create-an-app" target='_blank'>
                    How to create an app?
                </a>
                <input
                    type="text"
                    placeholder="123456"
                    value={appID}
                    onChange={e => setAppID(e.target.value)}
                />
            </div>
            <div className="methods">
                <label>Web2 Login</label>
                <small>Choose a method to sign in to DAGWatch</small>
                <button className="google" onClick={handleGoogleLogin}>
                    <FaGoogle />
                    <span>Continue with Google</span>
                </button>
                <button className="discord" onClick={handleDiscordLogin}>
                    <FaDiscord />
                    <span>Continue with Discord</span>
                </button>
            </div>
        </div>
    );
}

import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";

import { F } from "../../lib/helpers";
import Button from "../../components/Button";
import { useUserStore } from "../../lib/states";

// Pages
import DashboardHome from './Home';

import "./dashboard.scss";

export default function Dashboard() {
    const [searchParams] = useSearchParams();

    const user = useUserStore(s => s.user);
    const setUser = useUserStore(s => s.setUser);

    const [accessToken, setAccessToken] = useState("");

    // After login redirection, get app ID from URL
    useEffect(() => {
        const appID = searchParams.get("appID");
        if (!appID) return;
        setUser({ appID });
    }, [searchParams]);

    useEffect(() => {
        if (user?.accessToken && !user?.wallet) {
            // Get user details & wallet
            fetch(`${process.env.REACT_APP_SERVER}/user`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    accessToken: user.accessToken,
                })
            })
                .then(data => data.json())
                .then(data => {
                    const wallet = data.user.wallet;

                    // Get user details
                    F({
                        endpoint: `/wallet/user?address=${wallet}`,
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${user.accessToken}`
                        }
                    })
                        .then(resp => {
                            setUser({ ...user, wallet, ...resp });
                        })
                        .catch(err => {
                            console.error(err);
                            toast.error("Failed to get user details");
                            setUser({ ...user, accessToken: undefined })
                        });
                })
                .catch(err => {
                    console.error(err);
                    toast.error("Failed to get wallet");
                    setUser({ ...user, accessToken: undefined })
                })
        }
    }, [user]);

    const handleAccessTokenSubmit = () => {
        if (!accessToken || !user) return;

        // Check if app ID and access token are valid
        F({
            endpoint: `/verify`,
            method: "POST",
            body: {
                appID: user.appID,
                token: accessToken,
            },
        })
            .then(resp => {
                if (resp.message === "OK") {
                    setUser({ ...user, accessToken });
                    toast.success("Access token verified");
                }
            })
            .catch(err => {
                console.error(err);
                toast.error(err.error);
            });
    };

    if (user?.accessToken && !user?.wallet) {
        return <h2 style={{ margin: 30, textAlign: "center" }}>Loading...</h2>
    }

    return (
        <div id="dashboard">
            {!user?.accessToken ? (
                <div className="access-token-prompt">
                    <h2>Access Token Required</h2>
                    <p>To access the dashboard, you need to provide an access token.</p>
                    <div className="action">
                        <input
                            type="text"
                            placeholder="Enter your access token"
                            value={user?.accessToken}
                            onChange={e => setAccessToken(e.target.value)}
                        />
                        <Button click={handleAccessTokenSubmit}>Submit</Button>
                    </div>
                </div>
            ) : (
                <Routes>
                    <Route path="/" element={<DashboardHome />} />
                </Routes>
            )}
        </div>
    );
}

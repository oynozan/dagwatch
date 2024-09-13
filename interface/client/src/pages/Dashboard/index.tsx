import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Link, Route, Routes, useSearchParams } from "react-router-dom";

import { F } from "../../lib/helpers";
import Button from "../../components/Button";
import { useUserStore } from "../../lib/states";

// Pages
import DashboardHome from "./Home";

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

        localStorage.setItem("appID", appID);
        setUser({ appID });
    }, [searchParams]);

    useEffect(() => {
        // Get user details & wallet
        if (user?.accessToken && !user?.wallet) {
            fetch(`${process.env.REACT_APP_SERVER}/user`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    accessToken: user.accessToken,
                }),
            })
                .then(data => data.json())
                .then(data => {
                    // Get user details
                    const wallet = data.user.wallet;
                    F({
                        endpoint: `/wallet/user?address=${wallet}`,
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${user.accessToken}`,
                        },
                    })
                        .then(resp => {
                            setUser({ ...user, wallet, ...resp });
                        })
                        .catch(err => {
                            console.error(err);
                            toast.error("Failed to get user details");
                            setUser({ ...user, accessToken: undefined });
                        });
                })
                .catch(err => {
                    console.error(err);
                    toast.error("Failed to get wallet");
                    setUser({ ...user, accessToken: undefined });
                });
        // Get app details
        } else if (user?.wallet && !user?.appName) {
            F({
                endpoint: `/details`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                },
            })
                .then(resp => {
                    setUser({ ...user, appName: resp.name, redirectURL: resp.redirect });
                })
                .catch(err => {
                    console.error(err);
                    toast.error("Failed to get app details");
                });
        // Set access token from session storage
        } else if (user?.appID && !user?.accessToken) {
            const rawAccessToken = sessionStorage.getItem("accessToken");
            if (rawAccessToken) {
                setAccessToken(rawAccessToken);
                handleAccessTokenSubmit(rawAccessToken);
            }
        }
    }, [user]);

    const handleAccessTokenSubmit = (token?: string): any => {
        if (!token) token = accessToken;
        if (!token || !user) return toast.error("Log in with your app ID and provide an access token");

        // Check if app ID and access token are valid
        F({
            endpoint: `/verify`,
            method: "POST",
            body: {
                appID: user.appID,
                token: token,
            },
        })
            .then(resp => {
                if (resp.message === "OK") {
                    setUser({ ...user, accessToken: token });
                    sessionStorage.setItem("accessToken", token);
                    toast.success("Access token verified");
                }
            })
            .catch(err => {
                console.error(err);
                toast.error(err.error);
                localStorage.removeItem("appID");
            });
    };

    if (user?.accessToken && !user?.wallet) {
        return <h2 style={{ margin: 30, textAlign: "center" }}>Loading...</h2>;
    }

    return (
        <div id="dashboard">
            {user?.appID && user?.appName && (
                <div className="dashboard-header">
                    <h5>{user.appName}</h5>
                    <h5>{user.appID}</h5>
                </div>
            )}
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
                        <Button click={() => handleAccessTokenSubmit()}>Submit</Button>
                    </div>
                </div>
            ) : (
                <>
                <div className="dashboard-sidebar"></div>
                <main>
                    <Routes>
                        <Route path="/" element={<DashboardHome />} />
                    </Routes>
                </main>
                </>
            )}
        </div>
    );
}

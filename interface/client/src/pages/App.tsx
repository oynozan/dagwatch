import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

// Components
import Header from '../components/Header';
import Modals from "../components/Modal/Modals";

// Pages
import Dashboard from "./Dashboard";

export default function App() {
    return (
        <>
            <Modals /> {/* Modal handler */}
            <div id="main-container">
                <Header />
                <main>
                    <Routes>
                        <Route path="/dashboard/*" element={<Dashboard />} />
                    </Routes>
                </main>
            </div>
        </>
    );
}

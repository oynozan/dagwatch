import { useNavigate } from 'react-router-dom';

import Button from '../Button';
import ConnectModal from './ConnectModal';
import { useModalStore, useUserStore } from '../../lib/states';
import { useEffect } from 'react';

export default function ConnectButton() {
    const navigate = useNavigate();

    const setUser = useUserStore(s => s.setUser);
    const setModal = useModalStore(s => s.setModal);

    useEffect(() => {
        const appID = localStorage.getItem("appID");
        if (appID) handleConnectModal();
    }, []);

    function handleConnectModal(): any {
        // Check if the user is already connected
        const appID = localStorage.getItem("appID");

        if (appID) {
            setUser({ appID });

            // Redirect to /dashboard with react-router-dom
            navigate("/dashboard");
            return;
        }

        setModal("custom", {
            content: <ConnectModal />
        });
    }

    return (
        <Button
            type="main"
            click={handleConnectModal}
        >
            Connect
        </Button>
    )
}
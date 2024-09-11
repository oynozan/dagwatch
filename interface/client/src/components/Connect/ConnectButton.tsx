import Button from '../Button';
import ConnectModal from './ConnectModal';
import { useModalStore } from '../../lib/states';

export default function ConnectButton() {
    const setModal = useModalStore(s => s.setModal);

    function handleConnectModal() {
        setModal("custom", {
            content: <ConnectModal />
        })
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
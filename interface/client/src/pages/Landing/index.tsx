import Button from '../../components/Button';
import ConnectButton from '../../components/Connect/ConnectButton';

import './landing.scss';

export default function Landing() {
    return (
        <div id="landing">
            <h1>Wallet Abstraction on <span>Constellation</span></h1>
            <div className="actions">
                <ConnectButton />
                <Button type="light" href="https://docs.dagwatch.xyz">API Docs</Button>
            </div>
        </div>
    )
}
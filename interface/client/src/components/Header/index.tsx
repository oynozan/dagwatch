import { useUserStore } from "../../lib/states";
import ConnectButton from "../Connect/ConnectButton";
import { truncateWalletAddress } from '../../lib/helpers';

import "./header.scss";

export default function Header() {
    const user = useUserStore(s => s.user);

    return (
        <header>
            <img src="/images/logo.svg" alt="DAGWatch" />
            {user?.wallet ? (
                <div className="user">
                    <span>{truncateWalletAddress(user.wallet)}</span>
                    <img src={user.pfp} alt="Avatar" />
                </div>
            ) : (
                <>{user?.appID ? <></> : <ConnectButton />}</>
            )}
        </header>
    );
}

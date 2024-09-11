import { dag4 } from "@stardust-collective/dag4";

interface IWallet {
    createWallet: () => Promise<{ privateKey: string; address: string } | { error: string }>;
}

export class Wallet implements IWallet {
    async createWallet() {
        try {
            // Create wallet
            const pk = dag4.keyStore.generatePrivateKey();
            dag4.account.loginPrivateKey(pk);
            const address = dag4.account.address;
            return { privateKey: pk, address };
        } catch (error) {
            return { error: "A server exception occurred" };
        }
    }
}

import { dag4 } from "@stardust-collective/dag4";

interface IWallet {
    createWallet: () => Promise<{ privateKey: string; address: string } | { error: string }>;
}

export class Wallet implements IWallet {
    connectNetwork() {
        dag4.account.connect({
            networkVersion: '2.0',
            beUrl: 'https://be-testnet.constellationnetwork.io',
            l0Url: process.env.L0_GLOBAL_URL,
            l1Url: process.env.L1_CURRENCY_URL,
            testnet: true,
        });
    }

    async createWallet() {
        try {
            // Create wallet
            const pk = dag4.keyStore.generatePrivateKey();
            dag4.account.loginPrivateKey(pk);
            const address = dag4.account.address;
            return { privateKey: pk, address };
        } catch (error) {
            console.error(error);
            return { error: "A server exception occurred" };
        }
    }

    async getBalance(address: string) {
        this.connectNetwork();
        return await dag4.network.getAddressBalance(address);
    }

    async sendTransaction(privateKey: string, to: string, amount: number) {
        this.connectNetwork();
        dag4.account.loginPrivateKey(privateKey);
        try {
            return await dag4.account.transferDag(to, amount, 0);
        } catch (error) {
            return error;
        }
    }
}

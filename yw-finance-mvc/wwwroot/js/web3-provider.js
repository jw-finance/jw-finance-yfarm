/**
 * Connect wallet button pressed.
 */
const onConnect = async() => {
    console.log("Opening a dialog", web3Modal);
    try {
        provider = await web3Modal.connect();
    } catch (e) {
        console.log("Could not get a wallet connection", e);
        return;
    }

    // Subscribe to accounts change
    provider.on("accountsChanged",
        (accounts) => {
            console.log(`AccountsChanged has changed to ${accounts}`);
            pageRefresh(1000);
        });

    // Subscribe to chainId change
    provider.on("chainChanged",
        (chainId) => {
            console.log(`ChainId has changed to ${chainId}`);
            pageRefresh(1000);
        });

    // Subscribe to networkId change
    provider.on("networkChanged",
        (networkId) => {
            console.log(`NetworkChanged has changed to ${networkId}`);
            pageRefresh(1000);
        });
};

/**
 * Disconnect wallet button pressed.
 */
const onDisconnect = async() => {
    console.log("Killing the wallet connection", provider);
    if (provider.close) {
        await provider.close();

        // If the cached provider is not cleared,
        // WalletConnect will default to the existing session
        // and does not allow to re-scan the QR code with a new wallet.
        // Depending on your use case you may want or want not his behavir.
        await web3Modal.clearCachedProvider();
        provider = null;
    }

    selectedAccount = null;
    window.localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
};

const getERC20Contract = async (address) => {
    // And replace the old injected version by the latest build of Web3.js version 1.0.0
    window.web3 = new window.Web3(provider || window.web3.currentProvider);
    return new window.web3.eth.Contract(erc20ABI, address);
};

const getPoolContract = async (address, poolABI) => {
    window.web3 = new window.Web3(provider || window.web3.currentProvider);
    return new web3.eth.Contract(poolABI, address);
};
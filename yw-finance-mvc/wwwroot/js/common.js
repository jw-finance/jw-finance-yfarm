// Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const EvmChains = window.EvmChains;
const Fortmatic = window.Fortmatic;

// Web3modal instance
let web3Modal;
// Chosen wallet provider given by the dialog window
let provider;
let selectedAccount;

const initWeb3Modal = async () => {
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                infuraId: "c8fc448c343f4d12960ee269576d30b6"
            }
        }
    };

    web3Modal = new Web3Modal({
        cacheProvider: true, // optional
        providerOptions, // required
        disableInjectedProvider: false // optional. For MetaMask / Brave / Opera.
    });

    provider = await web3Modal.connect();
    selectedAccount = provider.selectedAddress
        ? provider.selectedAddress
        : provider.accounts[0];
    // If the browser has injected Web3.js
    if (window.web3) {
        // Then backup the good old injected Web3, sometimes it's useful:
        window.web3old = window.web3;
        // And replace the old injected version by the latest build of Web3.js version 1.0.0
        window.web3 = new window.Web3(provider || window.web3.currentProvider);
    }
    // Subscribe to accounts change
    provider.on("accountsChanged",
        (accounts) => {
            var result = confirm("Wallet changed. Refresh the page to continue.");
            if (result === true) {
                pageRefresh(1000);
            }
        });

    // Subscribe to chainId change
    provider.on("chainChanged",
        (chainId) => {
            var result = confirm("Network changed. Refresh the page to continue.");
            if (result === true) {
                pageRefresh(1000);
            }
        });

    // Subscribe to provider connection
    provider.on("connect",
        (info) => {
            console.log(info);
        });

    // Subscribe to provider disconnection
    provider.on("disconnect",
        (error) => {
            console.log(error);
        });
};

const handleSecureConnect = () => {
    // Check that the web page is run in a secure context,
    // as otherwise MetaMask won't be available
    if (location.protocol !== "https:") {
        // https://ethereum.stackexchange.com/a/62217/620
        console.log("Check that the web page is run in a secure context as otherwise MetaMask won't be available");
        return;
    }
};
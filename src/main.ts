import { WalletStandardAdapterProvider } from "@mysten/wallet-adapter-all-wallets";

/*
  Connect wallet steps:
  1. Get all available wallets
  2. Find Sui Wallet => we should inject sui wallet to window object
  3. Connect to Sui Wallet
  4. Get address
  5. Listen to change event 
*/
const SUI_WALLET = "Sui Wallet";
const allWallets = new WalletStandardAdapterProvider().get(); //get all available wallets
//for quick demo we only find sui wallet then connect to it 
const suiWallet = allWallets.find((wallet) => wallet.name === SUI_WALLET);
window.suiWallet = suiWallet;

//static html elements
const connectButton = document.getElementById("connectButton");
const connectStatusRes = document.getElementById("connected-status");

if (connectButton) {
  connectButton.addEventListener("click", connect);
}

async function connect() {
  try {
    if (!window.suiWallet) {
      alert("Sui Wallet not installed");
      return;
    }
    if (!window.suiWallet.connected) {
      await window.suiWallet.connect();
    }
    console.log(window.suiWallet);

    //get address 
    const accounts = await window.suiWallet.getAccounts();
    console.log(accounts);

    if (accounts.length == 0) {
      alert("Please add account to Sui Wallet");
      return;
    }

    window.suiWallet.on("change", ({ connected, accounts }) => {
      const newAccount = accounts[0];
      if (connected) {
        connectStatusRes.innerHTML = `
    <p>Connect to ${SUI_WALLET}</p>
    <p>icon: <img src="${window.suiWallet.icon}"/></p>
    <p>Chain: ${newAccount.chains[0]}</p>
    <p>Address: ${newAccount.address}</p>
  `;
      } else {
        connectStatusRes.innerHTML = `disconnected`
      }
    });

    const account = accounts[0];
    connectStatusRes.innerHTML = `
    <p>Connect to ${SUI_WALLET}</p>
    <p>icon: <img src="${window.suiWallet.icon}"/></p>
    <p>Chain: ${account.chains[0]}</p>
    <p>Address: ${account.address}</p>
  `;
  } catch (err: any) {
    console.log(err);
    alert(err.message);

  }

}

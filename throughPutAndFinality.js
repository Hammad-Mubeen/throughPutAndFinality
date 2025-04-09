import { providers, Wallet, utils } from "ethers";

const RPC_URL = `http://3.15.178.121:8020/rpc/ethrpc`;
const PRIVATE_KEY = `0x8610452e57d659fdd68298d5b7da65ad6ecba04724158043f9b77f9e54b47517`;
const RECEIVER = `0x3173E63d2Abbc1582fE41719EDeEE25A2624aC9D`;

const provider = new providers.JsonRpcProvider(RPC_URL);
const wallet = new Wallet(PRIVATE_KEY, provider);

const MIN_BALANCE = utils.parseEther("0.05");
const FUND_AMOUNT = utils.parseEther("100");
const gasPrice = utils.parseUnits("40", "gwei");
const gasLimit = 21000;
const frequency = 60_000 * 15; // 15 minutes
let nonce = 0;

let wallets = [];
let txHashes = [];

async function createWallets()
{
    let wallet = Wallet.createRandom();
    let input = {
        address: wallet.address,
        pk: wallet.privateKey
    };
    wallets.push(input);
    console.log("Wallet: ",wallets);
}

const truncate = (address) => {
  return address.slice(0, 6);
};

const checkAndFundWallets = async (provider) => {
  try {
    const balance = await provider.getBalance(wallets[0].address);
    if (balance.lt(MIN_BALANCE)) {
      console.log(
        `Funding wallet ${wallets[0].address} with ${utils.formatEther(FUND_AMOUNT)} ETH`
      );
      await sendETH(wallet, wallets[0].address, FUND_AMOUNT, provider);
    }
    else{
      console.log(
        `Wallet ${wallets[0].address} have ${utils.formatEther(FUND_AMOUNT)} ETH...`
      );
    }
  } catch (error) {
    console.log(`Failed to check and fund wallet ${truncate(wallets[0].address)}`,error);
  }
};

const sendETH = async (senderWallet, to, amount, provider) => {
  try {
    const nonce = await provider.getTransactionCount(wallet.address);
    console.log("nonce: ",nonce);
    const tx = {
      to,
      value: amount,
      nonce,
      gasLimit,
      gasPrice,
      chainId: 257,
    };
    const signedTx = await senderWallet.signTransaction(tx);
    const txHash = await provider.send("eth_sendRawTransaction", [signedTx]);
    let receipt = await provider.send("eth_getTransactionReceipt", [txHash]);
    receipt = JSON.stringify(receipt);
    console.log("\n receipt txHash : " + receipt);
  } catch (error) {
    console.log(`Failed to send ETH to ${truncate(to)}: `,error);
  }
};


const sendETHFromAllWallets = async (provider) => {
  const value = utils.parseEther("0.1");
  for (var i = 0; i < 100; i++) {
    try {
      const userWallet = new Wallet(wallets[0].pk, provider);
      console.log("nonce: ",nonce);
      const tx = {
      to: RECEIVER,
      nonce, 
      value,
      gasPrice,
      gasLimit,
      chainId: 257,
      };

      const signedTx = await userWallet.signTransaction(tx);
      let promise = provider.send("eth_sendRawTransaction", [signedTx]);
      txHashes.push(promise);
      nonce = nonce + 1;
    } catch (error) {
      console.log(`Failed to send ETH from ${truncate(wallets[0].address)} wallet`,error);
    }
  }
  console.log("Fire all transactions at once: ",txHashes);
  // Fire all transactions at once
  const results = await Promise.allSettled(txHashes);
  console.log("All transactions fired at once... ✅");

  console.log("Checking all fired transactions responses: ");
  results.forEach((res, i) => {
    if (res.status === "fulfilled") {
      console.log(`TX ${i}: ✅ Sent! Hash: ${res.value}`);
    } else {
      console.log(`TX ${i}: ❌ Failed - ${res}`);
    }
  });
  txHashes = [];
};

const checkSendETHFromAllWalletsTXs = async (provider) => {
  for (var i=0; i< wallets.length; i++) {
    try {
      let txHash= txHashes[i];
      console.log("txHash: ",txHash);
      let receipt = await provider.send("eth_getTransactionReceipt", [txHash]);
      receipt = JSON.stringify(receipt);
      console.log("\n receipt txHash : " + receipt);
    } catch (error) {
      console.log(`Failed to receive Tx from ${truncate(wallets[i].address)} wallet`,error);
    }
  }
};

const createWalletHelper = async () => {
  try {
    console.log("First time create a new wallet: ");
    await createWallets();
  } catch (error) {
    console.log("function error: ",error);
  }
};

const main = async () => {
  try {
    console.log("Interval Process Started: ");
    await checkAndFundWallets(provider);
    await sendETHFromAllWallets(provider);
  } catch (error) {
    console.log("Main function error: ",error);
  }
};

createWalletHelper();
setInterval(main, frequency);
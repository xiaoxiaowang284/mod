const { ethers } = require("ethers");

// 配置你的私钥和目标地址
const privateKey = ""; 
const toAddress = "0x2c8Ca06901A673a3ed41C14df24db9898aCf2Fb1"; 

// 连接到 Polygon 节点
const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/avalanche"); 

// 创建钱包
const wallet = new ethers.Wallet(privateKey, provider);

// 自定义十六进制数据
const hexData = "0x646174613a2c7b2270223a226173632d3230222c226f70223a226d696e74222c227469636b223a226176616c222c22616d74223a22313030303030303030227d"; // 替换为你想要的十六进制数据

// 获取当前账户的 nonce
async function getCurrentNonce(wallet) {
  try {
    const nonce = await wallet.getTransactionCount("pending");
    console.log("Nonce:", nonce);
    return nonce;
  } catch (error) {
    console.error("Error fetching nonce:", error.message);
    throw error;
  }
}

// 获取当前主网 gas 价格
async function getGasPrice() {
  const gasPrice = await provider.getGasPrice();
  return gasPrice;
}
// 获取链上实时 gasLimit
async function getGasLimit() {
  const gasLimit = await provider.estimateGas({
    to: toAddress,
    value: ethers.utils.parseEther("0"),
    data: hexData,
  });

  return gasLimit.toNumber();
}

// 转账交易
async function sendTransaction(nonce) {
  const gasPrice = await getGasPrice();
  const gasLimit = await getGasLimit(); 

  const transaction = {
    to: toAddress,
    value: ethers.utils.parseEther("0"), // 替换为你要转账的金额
    data: hexData, 
    nonce: nonce, 
    gasPrice: gasPrice, 
    gasLimit: gasLimit, 
  };

  try {
    const tx = await wallet.sendTransaction(transaction);
    console.log(`Transaction with nonce ${nonce} hash:`, tx.hash);
  } catch (error) {
    console.error(`Error in transaction with nonce ${nonce}:`, error.message);
  }
}

// 定义重复次数
const repeatCount = 300; // 你想要打多少张，这里就设置多少

async function sendTransactions() {
  const currentNonce = await getCurrentNonce(wallet);

  for (let i = 0; i < repeatCount; i++) {
    const gasPrice = await getGasPrice(); // 获取实时 gas 价格
    await sendTransaction(currentNonce + i, gasPrice);
  }
}

sendTransactions();
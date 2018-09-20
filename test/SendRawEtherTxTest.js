const token = artifacts.require("ExampleToken");
const Wallet = require('ethereumjs-wallet');
const EthUtil = require('ethereumjs-util');
const EthereumTx = require('ethereumjs-tx')
const Web3 = require('web3');

contract('SendRawTX ERC20 transaction test', async (accounts) => {

  it("transfer with raw TX", async () => {
    let erc20 = await token.deployed();

    const privateKeyString = '0x61ce8b95ca5fd6f55cd97ac60817777bdf64f1670e903758ce53efc32c3dffeb';
    const privateKeyBuffer = EthUtil.toBuffer(privateKeyString);
    const wallet = Wallet.fromPrivateKey(privateKeyBuffer);

    const address = wallet.getAddressString();
    await erc20.transfer(address, 100);

    //using the newer version from web3
    var web3_v1 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    await web3_v1.eth.sendTransaction({from: accounts[0], to:address, value: web3_v1.utils.toWei("1", 'ether'), gasLimit: 21000, gasPrice: 20000000000});


    const toAddress = "0xcf30d7c4efdae2edd2f4c117b19ff6dc295e8d69";
    var txCount = await web3_v1.eth.getTransactionCount(address);
    const gasPrice = await web3_v1.eth.getGasPrice();
    const gasLimit = 21000;
    const wei = 10;

    console.log("From Address: " + address);
    console.log("To Address:   " + toAddress);
    console.log("txCount:      " + txCount);
    console.log("gasPrice:     " + gasPrice);
    console.log("gasLimit:     " + gasLimit);
    console.log("wei:          " + wei);


    const txParams = {
        nonce: txCount,
        gasPrice: Number(gasPrice),
        gasLimit: Number(gasLimit),
        to: toAddress, 
        value: Number(wei), 
        data: '0x',
        chainId: 12  //ganache-cli chainId not important
    }

    const tx = new EthereumTx(txParams)
    tx.sign(privateKeyBuffer)
    var raw = '0x' + tx.serialize().toString('hex');
    console.log("Raw TX:       " + raw);

    var result = await web3_v1.eth.sendSignedTransaction(raw);
    //console.dir(result);
 })
});
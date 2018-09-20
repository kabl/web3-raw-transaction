//configure your endpoint
const RPC_ENDPOINT = 'https://rinkeby.infura.io/v3/1c21b6765c9e4935b7d34170e5d8f1aa';

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(RPC_ENDPOINT));
const Wallet = require('ethereumjs-wallet');
const EthUtil = require('ethereumjs-util');
const EthereumTx = require('ethereumjs-tx')

async function sendRawTx() {

    const privateKeyString = '0x61ce8b95ca5fd6f55cd97ac60817777bdf64f1670e903758ce53efc32c3dffeb';
    const privateKeyBuffer = EthUtil.toBuffer(privateKeyString);
    const wallet = Wallet.fromPrivateKey(privateKeyBuffer);

    const address = wallet.getAddressString();
    const toAddress = "0xcf30d7c4efdae2edd2f4c117b19ff6dc295e8d69";
    var txCount = await web3.eth.getTransactionCount(address);
    const gasPrice = await web3.eth.getGasPrice();
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
        chainId: 4  //rinkeby
    }

    const tx = new EthereumTx(txParams)
    tx.sign(privateKeyBuffer)
    var raw = '0x' + tx.serialize().toString('hex');
    console.log("Raw TX:       " + raw);

    var result = await web3.eth.sendSignedTransaction(raw);
    //console.dir(result);
}

sendRawTx();
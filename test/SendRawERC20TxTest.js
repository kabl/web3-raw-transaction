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

    const web3Token = new web3_v1.eth.Contract(erc20.abi, erc20.address);
    const payload = web3Token.methods.transfer(accounts[1], 100).encodeABI();

    const contractAddress = erc20.address;
    const txCount = await web3_v1.eth.getTransactionCount(address);
    const gasPrice = await web3_v1.eth.getGasPrice();
    var estimateGas = await web3_v1.eth.estimateGas({
        from: address, 
        data: payload,
        to: contractAddress
      });
    estimateGas = estimateGas * 2;

    console.log("payload:      " + payload);
    console.log("Contract:     " + contractAddress);
    console.log("TX Count:     " + txCount); 
    console.log("GasPrice:     " + gasPrice);
    console.log("Estimate Gas: " + estimateGas);
    
    const txParams = {
      nonce: Number(txCount),
      gasPrice: Number(gasPrice), 
      gasLimit: Number(estimateGas), 
      to: contractAddress, 
      value: '0x', 
      data: payload,
      chainId: 12  //ganache-cli chainId not important
    }
    
    const tx = new EthereumTx(txParams)
    tx.sign(privateKeyBuffer)
   // const serializedTx = tx.serialize();
    var raw = '0x' + tx.serialize().toString('hex');
    console.log("Raw TX:       " + raw);

    balance = await erc20.balanceOf(address);
    assert.equal(balance, 100);

    var result = await web3_v1.eth.sendSignedTransaction(raw);
    //console.dir(result);

    balance = await erc20.balanceOf(address);
    assert.equal(balance, 0);

    balance = await erc20.balanceOf(accounts[1]);
    assert.equal(balance, 100);
 })
});
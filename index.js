const { ethers } = require("ethers");
require('dotenv').config()
contracts = require('folia-contracts')

const network = "homestead";
const provider = ethers.getDefaultProvider(network, {
  infura: process.env.INFURA_API_KEY,
});


async function run() {
  wallet = new ethers.Wallet.fromMnemonic(process.env.MAINNET_MNEMONIC)
  wallet = wallet.connect(provider)
  // auction = new ethers.Contract(contracts.ReserveAuction.networks['1'].address, contracts.ReserveAuction.abi, wallet)
  hpwithdraw = new ethers.Contract(contracts.House_Plants.networks['1'].address, contracts.House_Plants.abi, wallet)

  overrides = {
    gasLimit: 500000,
    gasPrice: ethers.utils.parseUnits('150', 'gwei').toString(),
    type: 1,
    accessList: [
      {
        address: "0xF871A4FB983b89C123CD4e70f768DC9EF5ce5f71", // admin gnosis safe proxy address
        storageKeys: [
            "0x0000000000000000000000000000000000000000000000000000000000000000"
        ]
      },
      {
        address: '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',  // gnosis safe master address
        storageKeys: []
      }
    ]
  }

  // work = 11000003
  withdrawTX = await hpwithdraw.withdraw(/* work,  */overrides)
  console.log({withdrawTX})
  resolved = await withdrawTX.wait()
  console.log({resolved})
}

run()

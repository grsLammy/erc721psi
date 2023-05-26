import { providers, Wallet, utils } from "ethers";
import ps from "prompt-sync";
const prompt = ps();
import { config } from "dotenv";
import { abi } from "../artifacts/src/LandMinter_LIGHT.sol/LandMinter_LIGHT.json";
import { ethers } from "hardhat";
config();

const pKey: any = process.env.PRIVATE_KEY;
const landMinter_address: any = process.env.LAND_MINTER;
const zkEVM_RPC: any = process.env.RPC_URL;

async function mintLand() {
    try {
        console.log("\n");

        const provider = new providers.JsonRpcProvider(zkEVM_RPC);
        const nonce = await provider.getTransactionCount("0xB75D71adFc8E5F7c58eA89c22C3B70BEA84A718d");
        const signer = new Wallet(pKey, provider);
        const landMinter_ABI = abi;
        const landMinter_contract = new ethers.Contract(landMinter_address, landMinter_ABI, provider);
        const landMinter_connect = landMinter_contract.connect(signer);

        const quantity = prompt("Enter the total number of NFTs to Mint: ");
        if (!quantity) return console.log("Total number of NFTs to Mint cannot be null");

        const estimatedGasLimit = await landMinter_connect.estimateGas.mintLand(quantity, {
            gasLimit: 14_999_999,
            nonce: nonce,
        });

        console.log(`estimated_gas: ${estimatedGasLimit}`);

        const txIssueBatch = await landMinter_connect.mintLand(quantity, {
            gasLimit: estimatedGasLimit,
            nonce: nonce,
        });
        await txIssueBatch.wait();

        console.log(txIssueBatch);
        const txHashIssueBatch = txIssueBatch.hash;

        console.log("\nTransaction Hash: ", txHashIssueBatch);
        console.log(`Transaction Details: https://public.zkevm-test.net:8443/tx/${txHashIssueBatch}`);
        console.log(`\nNFTs minted successfully\n`);
    } catch (error) {
        console.log("Error in mintLand: ", error);
        process.exit(1);
    }
}

mintLand();

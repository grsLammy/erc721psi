import { providers, Wallet } from "ethers";
import { config } from "dotenv";
import { abi } from "../artifacts/src/LandMinter_LIGHT.sol/LandMinter_LIGHT.json";
import { ethers } from "hardhat";
config();

const pKey: any = process.env.PRIVATE_KEY;
const landMinter_address: any = process.env.LAND_MINTER;
const zkEVM_RPC: any = process.env.RPC_URL;

async function setBaseURI() {
    try {
        const provider = new providers.JsonRpcProvider(zkEVM_RPC);
        const signer = new Wallet(pKey, provider);
        const landMinter_ABI = abi;
        const landMinter_contract = new ethers.Contract(landMinter_address, landMinter_ABI, provider);
        const landMinter_connect = landMinter_contract.connect(signer);
        const baseURI = "ipfs://some-random-hash/";
        const txSetBaseURI = await landMinter_connect.setBaseURI(baseURI);
        await txSetBaseURI.wait();

        const txHashSetBaseURI = txSetBaseURI.hash;

        console.log("\nTransaction Hash: ", txHashSetBaseURI);
        console.log(`Transaction Details: https://public.zkevm-test.net:8443/tx/${txHashSetBaseURI}`);
        console.log(`\nBaseURI set successfully\n`);
    } catch (error) {
        console.log("Error in setBaseURI: ", error);
        process.exit(1);
    }
}

setBaseURI();

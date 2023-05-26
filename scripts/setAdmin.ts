import { providers, Wallet } from "ethers";
import { config } from "dotenv";
import ps from "prompt-sync";
const prompt = ps();
import { abi } from "../artifacts/src/LandMinter_LIGHT.sol/LandMinter_LIGHT.json";
import { ethers } from "hardhat";
config();

const pKey: any = process.env.PRIVATE_KEY;
const landMinter_address: any = process.env.LAND_MINTER;
const zkEVM_RPC: any = process.env.RPC_URL;

async function setAdmin() {
    try {
        console.log("\n");
        const adminAddress = prompt("Enter the wallet address: ");
        if (!adminAddress) return console.log("wallet address cannot be null");
        if (adminAddress.length !== 42) return console.log(`${adminAddress} is not a valid address`);

        const adminStatus = prompt("Enter the admin status (true | false): ");
        if (!adminStatus) return console.log("admin status cannot be null");
        if (
            adminStatus !== "true" &&
            adminStatus !== "TRUE" &&
            adminStatus !== "false" &&
            adminStatus !== "FALSE"
        )
            return console.log(`${adminStatus} is not a valid input`);

        const provider = new providers.JsonRpcProvider(zkEVM_RPC);
        const signer = new Wallet(pKey, provider);
        const landMinter_ABI = abi;
        const landMinter_contract = new ethers.Contract(landMinter_address, landMinter_ABI, provider);
        const landMinter_connect = landMinter_contract.connect(signer);

        const txIssueBatch = await landMinter_connect.setAdmin(adminAddress, adminStatus);
        await txIssueBatch.wait();

        const txHashIssueBatch = txIssueBatch.hash;

        console.log("\nTransaction Hash: ", txHashIssueBatch);
        console.log(`Transaction Details: https://public.zkevm-test.net:8443/tx/${txHashIssueBatch}`);
        console.log(`\nAdmin set successfully\n`);
    } catch (error) {
        console.log("Error in setAdmin: ", error);
        process.exit(1);
    }
}

setAdmin();

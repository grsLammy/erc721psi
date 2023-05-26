import { ethers } from "hardhat";
import { LandMinterLIGHT__factory } from "../src/types";

async function deploy() {
    // get the contract to deploy
    const LandMinter_LIGHT = (await ethers.getContractFactory(
        "LandMinter_LIGHT"
    )) as LandMinterLIGHT__factory;
    const landMinter_LIGHT = await LandMinter_LIGHT.deploy();
    console.log("\nDeploying NFTEngine smart contract on zkEVM chain....");
    function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    await delay(20000);
    console.log("\nLand Minter ERC721 contract deployed at: ", landMinter_LIGHT.address);
    console.log(`https://public.zkevm-test.net:8443/address/${landMinter_LIGHT.address}/`);
}

deploy();

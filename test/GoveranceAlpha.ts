import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Governor", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function Governor() {


    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, add3, add4, add5, add6, add7] = await ethers.getSigners();

    const GovernorToken = await ethers.getContractFactory("GovernorAlpha");
    const governorToken = await GovernorToken.deploy(owner.address);

    return { governorToken, owner, otherAccount};
  }

  
});

import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";
import { goveranceAlphaSol } from "../typechain-types";


describe("GovernorSystem", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function GovernorsSystem() {


    // Contracts are deployed using the first signer/account by default

    // this test works for timelock , goverance token and goverance system
    
    const [owner, otherAccount, add3, add4, add5, add6, add7] = await ethers.getSigners();

    const timeLock = await ethers.getContractFactory("Timelock");
    const timelock = await timeLock.deploy(add4.address, "604800");
    const GovernorToken = await ethers.getContractFactory("GovernorToken");
    const governorToken = await GovernorToken.deploy(owner.address);
    const GovernorAlpha = await ethers.getContractFactory("GovernorAlpha");
    const governorAlpha = await GovernorAlpha.deploy(timelock.address, governorToken.address, add4.address);
    const MultiSig = await ethers.getContractFactory("MultiSigWallet");
    const multisig = await MultiSig.deploy();



    return { governorAlpha,multisig,owner,timelock, otherAccount, add3, add4, add5, add6, add7 , governorToken};
  }

  describe("Proposes ", function () {
    it("propose something to the dao", async function() {
      const {  multisig,timelock, governorAlpha,governorToken,otherAccount, owner ,add3, add4, } = await loadFixture(GovernorsSystem);
      // how to use keccak256
      const transferAmount = ethers.utils.parseUnits("1000000", "18");
      await governorToken.transfer(add3.address,transferAmount);
      await governorToken.transfer(add4.address,transferAmount);
      await governorToken.connect(add3).delegate(owner.address);
      const blockNumBefore1 = await ethers.provider.getBlockNumber();
      const signature = keccak256(toUtf8Bytes("true"));
      const blockNumBefore2 = await ethers.provider.getBlockNumber();
      await governorAlpha.propose([multisig.address],["0"],["toggle(bool status)"],[signature],"need to help women in nigeria");
      const blockNumBefore3 = await ethers.provider.getBlockNumber();
      const id = await governorAlpha.latestProposalIds(owner.address);
      console.log(blockNumBefore1,blockNumBefore2, blockNumBefore3, signature , id);
      
    });

    it("propose something to the dao and cast a vote", async function() {
      const {  multisig,timelock, governorAlpha,governorToken,otherAccount, owner ,add3, add4,add7,add6 } = await loadFixture(GovernorsSystem);
      const transferAmount = ethers.utils.parseUnits("200000", "18");
      await governorToken.transfer(add3.address,transferAmount);
      await governorToken.transfer(add4.address,transferAmount);
      await governorToken.transfer(add7.address, transferAmount);
      await governorToken.connect(add3).delegate(owner.address);
      await governorToken.connect(add4).delegate(add3.address);
      // await governorToken.connect(add7).delegate(add6.address);
      const signature = keccak256(toUtf8Bytes("true"));
      await governorAlpha.propose([multisig.address],["0"],["toggle(bool status)"],[signature],"need to help women in nigeria");
      console.log( signature);
      const currentTime = await time.latest()
      console.log("Your old time is\n", currentTime);
      await time.increaseTo(currentTime + 1)
      const newCurrentTime = await time.latest()
      console.log("Your new time is\n", newCurrentTime);
      await governorAlpha.connect(add4).castVote("1",true);   
       await timelock.set1(governorAlpha.address);
     // await governorAlpha.connect(add4).cancel("1");
      expect(await governorAlpha.connect(add3).castVote("1",true)).to.revertedWith("GovernorAlpha::_castVote: voting is closed"); 
      const actions = await governorAlpha.getActions("1"); 
      const receipt1 = await governorAlpha.getReceipt("1",add4.address);
      const receipt2 = await governorAlpha.getReceipt("1",add3.address)
      console.log(actions,  "actions \n",receipt1, receipt2,);
      const currentTime2 = await time.latest()
      console.log("Your old time is\n", currentTime);
      await time.increaseTo(currentTime + 20000)
      const newCurrentTime2 = await time.latest()
      console.log("Your new time is\n", newCurrentTime);
      await governorAlpha.queue("1");
      await governorAlpha.execute("1");
    });


    // it("propose something to the dao and should revert", async function () {
    //   const {  multisig,timelock, governorAlpha,governorToken,otherAccount, add3, add4, } = await loadFixture(GovernorsSystem);
    //   // how to use keccak256
    //   const signature = keccak256(toUtf8Bytes("true"));
    //   expect (await governorAlpha.propose([multisig.address],["0"],["toggle(bool status)"],[signature],"need to help women in nigeria")).to.revertedWith("GovernorAlpha::propose: proposer votes below proposal threshold")
    // })
  });

  
});



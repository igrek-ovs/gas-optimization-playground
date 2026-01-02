import { expect } from "chai";
import { network } from "hardhat";
import { Contract } from "ethers";

describe("UserRegistry Gas Comparison", function () {
  async function deploy() {
    const connection = await network.connect({
      network: "hardhatOp",
      chainType: "op",
    });

    const { ethers } = connection;
    const [deployer, user] = await ethers.getSigners();

    const NaiveFactory = await ethers.getContractFactory("NaiveUserRegistry");
    const naive = await NaiveFactory.deploy();
    await naive.waitForDeployment();

    const MediumFactory = await ethers.getContractFactory("MediumUserRegistry");
    const medium = await MediumFactory.deploy();
    await medium.waitForDeployment();

    return { ethers, deployer, user, naive, medium };
  }

  it("addUser gas comparison", async function () {
    const { user, naive, medium } = await deploy();

    const txNaive = await naive.addUser(user.address, "Alice");
    const receiptNaive = await txNaive.wait();

    const txMedium = await medium.addUser(user.address, "Alice");
    const receiptMedium = await txMedium.wait();

    console.log("\naddUser gas");
    console.log("NaiveUserRegistry :", receiptNaive?.gasUsed.toString());
    console.log("MediumUserRegistry:", receiptMedium?.gasUsed.toString());

    expect(receiptMedium?.gasUsed).to.be.lt(receiptNaive?.gasUsed);
  });

  it("incrementActions gas comparison", async function () {
    const { user, naive, medium } = await deploy();

    await naive.addUser(user.address, "Alice");
    await medium.addUser(user.address, "Alice");

    const txNaive = await naive.incrementActions(user.address);
    const receiptNaive = await txNaive.wait();

    const txMedium = await medium.incrementActions(user.address);
    const receiptMedium = await txMedium.wait();

    console.log("\nincrementActions gas");
    console.log("NaiveUserRegistry :", receiptNaive?.gasUsed.toString());
    console.log("MediumUserRegistry:", receiptMedium?.gasUsed.toString());
  });

  it("deactivateUser gas comparison", async function () {
    const { user, naive, medium } = await deploy();

    await naive.addUser(user.address, "Alice");
    await medium.addUser(user.address, "Alice");

    const txNaive = await naive.deactivateUser(user.address);
    const receiptNaive = await txNaive.wait();

    const txMedium = await medium.deactivateUser(user.address);
    const receiptMedium = await txMedium.wait();

    console.log("\ndeactivateUser gas");
    console.log("NaiveUserRegistry :", receiptNaive?.gasUsed.toString());
    console.log("MediumUserRegistry:", receiptMedium?.gasUsed.toString());
  });
});

import { expect } from "chai";
import { network } from "hardhat";

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

    const OptimizedFactory = await ethers.getContractFactory("OptimizedUserRegistry");
    const optimized = await OptimizedFactory.deploy();
    await optimized.waitForDeployment();

    return { ethers, deployer, user, naive, medium, optimized };
  }

  it("addUser gas comparison", async function () {
    const { ethers, user, naive, medium, optimized } = await deploy();

    const nameString = "Alice";
    const nameBytes32 = ethers.encodeBytes32String(nameString);

    const r1 = await (await naive.addUser(user.address, nameString)).wait();
    const r2 = await (await medium.addUser(user.address, nameString)).wait();
    const r3 = await (await optimized.addUser(user.address, nameBytes32)).wait();

    console.log("\naddUser gas");
    console.log("Naive     :", r1!.gasUsed.toString());
    console.log("Medium    :", r2!.gasUsed.toString());
    console.log("Optimized :", r3!.gasUsed.toString());

    expect(r3!.gasUsed).to.be.lt(r2!.gasUsed);
    expect(r2!.gasUsed).to.be.lt(r1!.gasUsed);
  });

  it("incrementActions gas comparison", async function () {
    const { ethers, user, naive, medium, optimized } = await deploy();

    const name = ethers.encodeBytes32String("Alice");

    await naive.addUser(user.address, "Alice");
    await medium.addUser(user.address, "Alice");
    await optimized.addUser(user.address, name);

    const r1 = await (await naive.incrementActions(user.address)).wait();
    const r2 = await (await medium.incrementActions(user.address)).wait();
    const r3 = await (await optimized.incrementActions(user.address)).wait();

    console.log("\nincrementActions gas");
    console.log("Naive     :", r1!.gasUsed.toString());
    console.log("Medium    :", r2!.gasUsed.toString());
    console.log("Optimized :", r3!.gasUsed.toString());
  });

  it("deactivateUser gas comparison", async function () {
    const { ethers, user, naive, medium, optimized } = await deploy();

    const name = ethers.encodeBytes32String("Alice");

    await naive.addUser(user.address, "Alice");
    await medium.addUser(user.address, "Alice");
    await optimized.addUser(user.address, name);

    const r1 = await (await naive.deactivateUser(user.address)).wait();
    const r2 = await (await medium.deactivateUser(user.address)).wait();
    const r3 = await (await optimized.deactivateUser(user.address)).wait();

    console.log("\ndeactivateUser gas");
    console.log("Naive     :", r1!.gasUsed.toString());
    console.log("Medium    :", r2!.gasUsed.toString());
    console.log("Optimized :", r3!.gasUsed.toString());
  });
});

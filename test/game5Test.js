const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();

    return { game };
  }
  it("should be a winner", async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    // Get address < target address
    let wallet = ethers.Wallet.createRandom();
    // while(BigInt(wallet.address) >= BigInt("0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf")) {
    
    // The contract threshold starts with 0x00, 0x is hexadecimal prefix,
    //  so if we have an address that has any values other than 00 it will be > threshold
    while (wallet.address.slice(0, 4) !== "0x00") {
      wallet = ethers.Wallet.createRandom();
    }

    // Send money to the address
    const signer = ethers.provider.getSigner(0);
    await signer.sendTransaction({
      to: wallet.address,
      value: ethers.utils.parseEther("1"),
    });

    await game.connect(wallet.connect(ethers.provider)).win();

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});

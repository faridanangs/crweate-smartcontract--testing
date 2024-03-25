const {expect} = require("chai")
const hre = require("hardhat")
const {time, loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers")



//// cara ini kita panggil satu satu deploynya
// describe("Lock", function() {
//     it("Should set the right unlocktime", async function(){
//         const lockedAmount = 1_000_000_000;
//         const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
//         const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

//         // deploy a lock contact where funds can be whildraw
//         // one year in the future
//         const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
//             value: lockedAmount,
//         })

//         expect(await lock.unlockTimeLol()).to.equal(unlockTime)
//     })

//     it("should revert with the right error if called too soon", async function(){
//         const lockedAmount = 1_000_000_000;
//         const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
//         const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
//         const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
//             value: lockedAmount,
//         })
        
//         await expect(lock.withdraw()).to.be.revertedWith("You can't withdraw yet");    
//     })
//     it("Should transfer the funds to the owner", async function(){
//         const lockedAmount = 1_000_000_000;
//         const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
//         const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
//         const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
//             value: lockedAmount,
//         })

//         // jika kita tidak memnaruh ini maka dia akan error karna waktunya belum satu tahun
//         await time.increaseTo(unlockTime) // kita gunakan ini untuk mempercepat waktunya dan bisa testingnya

//         await lock.withdraw()
//     })

//     it("Should revert with the right error if called from another account", async function(){
//         const lockedAmount = 1_000_000_000;
//         const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
//         const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
//         const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
//             value: lockedAmount,
//         })

//         const [acount, anotherAcount] = await hre.ethers.getSigners()
//         await time.increaseTo(unlockTime)
//         await expect(lock.connect(anotherAcount).withdraw()).to.be.revertedWith(
//             "You aren't the owner"
//         )
//     })
// })


describe("Lock", function() {
    async function deployOneYearLockFicture(){
        const lockedAmount = 1_000_000_000;
        const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
        const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
        const [owner, anotherAcount] = await hre.ethers.getSigners();
        const Lock = await hre.ethers.getContractFactory("Lock");
        const lock = await Lock.deploy(unlockTime, {value: lockedAmount});

        return {owner, lock, lockedAmount, unlockTime, anotherAcount};
    }

    it("pengirim harus owner", async function(){
        const {anotherAcount, lock, unlockTime} = await loadFixture(deployOneYearLockFicture);

        await expect(lock.withdraw()).to.be.revertedWith(
            "You can't withdraw yet"
        )
        await time.increaseTo(unlockTime);
        await expect(lock.connect(anotherAcount).withdraw()).to.be.revertedWith(
            "You aren't the owner"
        )
    })
    it("gagal menarik ether karna blum 1 tahun", async function(){
        const {lock} = await loadFixture(deployOneYearLockFicture);

        await expect(lock.withdraw()).to.be.revertedWith(
            "You can't withdraw yet"
        )
    })
    it("waktu penguncian ether harus sama dgn yang ada di contract", async function() {
        const {lock, unlockTime} = await loadFixture(deployOneYearLockFicture);
        expect(await lock.unlockTimeLol()).to.equal(unlockTime);
    })
    it("penarikan ether berhasil", async function() {
        const {lock, unlockTime} = await loadFixture(deployOneYearLockFicture);

        await time.increaseTo(unlockTime)
        lock.withdraw()
    })
})
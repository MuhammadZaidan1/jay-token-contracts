import { expect } from "chai";
import hre from "hardhat";

describe("Skenario Penjualan $JAY Token", function () {
  it("Pembeli harus sukses dapet token setelah bayar ETH", async function () {
    // 1. Kita ambil 2 dompet dari terminal Node lu tadi
    // admin = Akun #0, pembeli = Akun #1
    const [admin, pembeli] = await hre.ethers.getSigners();
    // 2. Robot nge-deploy ulang contract ke memori sementara
    const Token = await hre.ethers.getContractFactory("JayToken");
    const token = await Token.deploy();
    const Vendor = await hre.ethers.getContractFactory("Vendor");
    const vendor = await Vendor.deploy(await token.getAddress());
    // 3. Admin transfer 500,000 token ke Kasir (Vendor) buat modal jualan
    await token.transfer(await vendor.getAddress(), 500000n);
    // 4. Pembeli nyoba beli pake 1 ETH (karena tokensPerEth = 500, harusnya dapet 500)
    await vendor.connect(pembeli).buyTokens({ value: 1n });
    // 5. Ujian Akhir: Kita cek saldo si pembeli, beneran nambah 500 gak?
    const saldoPembeli = await token.balanceOf(pembeli.address);
    // Ini fungsinya Chai (expect), kalau saldo bukan 500, terminal bakal teriak Error!
    expect(saldoPembeli).to.equal(500n);
  });
});
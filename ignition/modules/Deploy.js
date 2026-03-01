import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("JayTokenModule", (m) => {
    // 1. Deploy JayToken
    // Ignition otomatis nyari contract bernama "JayToken" di folder contracts
    const jayToken = m.contract("JayToken");
    // 2. Deploy Vendor
    // [jayToken] di sini otomatis ngirim alamat JayToken yang baru dideploy ke constructor Vendor
    const vendor = m.contract("Vendor", [jayToken]);
    // 3. Stok Warung (Transfer 500k JAY ke Vendor)
    // Kita pakai BigInt (akhiran n) karena Solidity pake angka gede banget
    const transferAmount = 500000n * 10n ** 18n; 
    // m.call gunanya buat manggil fungsi setelah kontrak dideploy
    m.call(jayToken, "transfer", [vendor, transferAmount]);
    return { jayToken, vendor };
});
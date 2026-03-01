import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("JayModule", (m) => {
    // 1. Deploy JayToken dulu
    const jayToken = m.contract("JayToken");
    // 2. Deploy Vendor, sambil ngasih alamat JayToken ke constructor-nya
    const vendor = m.contract("Vendor", [jayToken]);
    return { jayToken, vendor };
});
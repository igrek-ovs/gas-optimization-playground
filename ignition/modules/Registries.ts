import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Registries", (m) => {
  const naive = m.contract("NaiveUserRegistry");
  const medium = m.contract("MediumUserRegistry");
  return { naive, medium };
});
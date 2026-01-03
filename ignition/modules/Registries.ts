import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Registries", (m) => {
  const naive = m.contract("NaiveUserRegistry");
  const medium = m.contract("MediumUserRegistry");
  const optimized = m.contract("OptimizedUserRegistry");
  return { naive, medium, optimized };
});
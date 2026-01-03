# gas-optimization-playground

An educational Solidity playground focused on **gas optimization**, featuring side-by-side contract implementations and reproducible **gas benchmarks** using **Hardhat** and **Foundry**.

The project demonstrates how storage layout, data types, and access patterns directly impact gas consumption in real-world smart contracts.

---

## Executive Summary

This repository compares three implementations of the same User Registry contract with increasing levels of optimization.

Key results:
- Deployment gas reduced by ~60% from Naive to Optimized
- State-changing functions (`addUser`, `incrementActions`, `deactivateUser`) are consistently 40–45% cheaper
- Gas savings are reproducible across **Foundry** and **Hardhat**
- Most improvements come from storage packing, removal of dynamic arrays, and eliminating redundant mappings

The project is intended for **learning, experimentation, and benchmarking**, not as production-ready code.

---

## Goals of the Project

- Compare naive, medium, and highly optimized Solidity implementations
- Measure and analyze gas costs for common state-changing operations
- Practice low-level gas optimization techniques
- Showcase a hybrid testing setup using Hardhat and Foundry
- Provide a clean baseline for further experiments and benchmarks

---

## Contracts Overview

The core example is a simple **User Registry**, implemented in three different ways.

### NaiveUserRegistry

A straightforward, beginner-friendly implementation:
- Dynamic arrays
- Multiple mappings
- `string` storage
- `require` with revert strings
- No storage packing
- No unchecked arithmetic

**Goal:** baseline / worst-case gas usage

---

### MediumUserRegistry

An intermediate optimization level:
- Struct field reordering
- Partial storage packing
- `uint128` counters
- Custom errors instead of revert strings
- `unchecked` arithmetic where safe

**Goal:** balance between readability and gas efficiency

---

### OptimizedUserRegistry

Aggressively optimized version:
- `mapping(address => struct)` instead of arrays
- `bytes32` instead of `string`
- Fully packed struct
- Minimal storage writes
- Custom errors only
- No redundant mappings

**Goal:** minimum possible gas consumption

---

## Testing and Benchmarking Strategy

The project uses two complementary testing frameworks.

### Hardhat

- TypeScript tests
- Ethers v6
- Integration-style testing
- Gas measured from transaction receipts (`receipt.gasUsed`)

### Foundry

- Solidity-based tests
- Built-in gas reporting
- Fast execution
- Deployment and per-function gas benchmarks

Using both tools ensures that results are **reproducible** and not tool-specific.

---

## Project Structure

```
contracts/
 └─ gas/
    ├─ NaiveUserRegistry.sol
    ├─ MediumUserRegistry.sol
    └─ OptimizedUserRegistry.sol

test/
 └─ gas/
    └─ UserRegistryGas.ts        # Hardhat gas comparison tests

lib/
 └─ forge-std/                  # Foundry standard library

ignition/
 └─ modules/
    └─ Registries.ts            # Hardhat Ignition deployment module

.github/
 └─ workflows/
    └─ test.yml                 # CI pipeline

foundry.toml
hardhat.config.ts
package.json
```

---

## Installation

### Prerequisites
- Node.js 18+
- npm / pnpm / yarn
- Foundry (`forge`, `cast`)

### Install dependencies

```
npm install
forge install
```

---

## Available Scripts

### Hardhat
- `npm run compile` — Compile contracts
- `npm run test` — Run Hardhat tests
- `npm run node` — Start local Hardhat node

### Foundry
- `npm run forge:test` — Run Foundry tests
- `npm run forge:gas` — Run Foundry tests with gas report

### Combined
- `npm run test:all` — Compile + Hardhat tests + Foundry gas report

---

## Local Deployment

Using Hardhat Ignition:

```
npm run deploy:local
```

Clean previous deployments:

```
npm run deploy:clean
```

---

## Gas Benchmark Results (Foundry)

Benchmarks produced using `forge test --gas-report`.

### Deployment Cost

| Contract              | Deployment Gas | Bytecode Size (bytes) |
|-----------------------|----------------|------------------------|
| NaiveUserRegistry     | 599,435        | 2,554                  |
| MediumUserRegistry    | 452,849        | 1,876                  |
| OptimizedUserRegistry | 241,404        | 898                    |

### Function Gas Usage

#### addUser

| Contract              | Gas Used |
|-----------------------|----------|
| NaiveUserRegistry     | 138,538  |
| MediumUserRegistry    | 133,967  |
| OptimizedUserRegistry | 88,615   |

#### incrementActions

| Contract              | Gas Used |
|-----------------------|----------|
| NaiveUserRegistry     | 50,373   |
| MediumUserRegistry    | 31,114   |
| OptimizedUserRegistry | 28,915   |

#### deactivateUser

| Contract              | Gas Used |
|-----------------------|----------|
| NaiveUserRegistry     | 28,378   |
| MediumUserRegistry    | 26,251   |
| OptimizedUserRegistry | 24,013   |

---

## Gas Benchmark Results (Hardhat)

Gas usage measured from transaction receipts using `tx.wait().gasUsed`.

### addUser

| Contract              | Gas Used |
|-----------------------|----------|
| NaiveUserRegistry     | 139,838  |
| MediumUserRegistry    | 134,947  |
| OptimizedUserRegistry | 89,552   |

### incrementActions

| Contract              | Gas Used |
|-----------------------|----------|
| NaiveUserRegistry     | 50,876   |
| MediumUserRegistry    | 31,765   |
| OptimizedUserRegistry | 29,485   |

### deactivateUser

| Contract              | Gas Used |
|-----------------------|----------|
| NaiveUserRegistry     | 28,781   |
| MediumUserRegistry    | 26,775   |
| OptimizedUserRegistry | 24,507   |

---

## Trade-offs and Limitations

While the optimized version is significantly cheaper, it comes with trade-offs:

- `bytes32` names reduce usability compared to `string`
- `mapping`-based storage prevents iteration over users
- Optimized code is harder to read and reason about
- Not all applications benefit from aggressive optimization

Gas optimization should be applied selectively, based on actual usage patterns.

---

## Notes

- Gas values depend on compiler version and optimizer settings
- Results should be compared relatively, not absolutely
- Contracts are intentionally simplified to highlight gas effects

---

## Future Improvements

Possible extensions of this playground include:

- Summarizing gas savings in percentage terms across implementations
- Documenting optimization decisions at the EVM and storage-slot level
- Extending benchmarks to compare calldata vs memory usage
- Exploring more complex storage layouts and access patterns

# Raydium Liquidity Pool

This repository contains scripts to create your own SPL token, set up liquidity pools, and perform swaps.

## Setup

### Step 1: Configure

Before getting started, make sure to set up the `config.js` as well as `keypair.json` file according to your environment and requirements. Also install the node modules

```
npm i
```

### Step 2: Create SPL Token

Execute the `createSplToken` script using Node.js:

```
node scripts/createSplToken.js
```

### Step 3: Update Token Metadata

Update the metadata by executing the `updateMetadata` script using Node.js:

```
node scripts/updateMetadata.js
```

### Step 4: Revoke Mint and Freeze Authority

Revoke the mint and freeze authority with the following commands:

```
spl-token authorize 'spl token mint address' mint --disable -u devnet --authority ./keypair.json
spl-token authorize 'spl token mint address' freeze --disable -u devnet --authority ./keypair.json
```

### Step 5: Create AMM Pool

Update and run the `createAmmPool` script using Node.js:

```
node scripts/createAmmPool.js
```

### Step 6: Perform Swap

You can perform swaps by updating and running the `swapAmm` script. If you don't have the pool ID, you can obtain it by running the `getAmmPoolInfo` script.

```
node scripts/createAmmPool.js
```

### Additional Notes

- Make sure to handle errors and exceptions appropriately while executing the scripts.
- Ensure that you have necessary permissions before executing any commands that involve modifying the file or creating liquidity pools.

Feel free to reach out if you encounter any issues or need further assistance. Happy coding!

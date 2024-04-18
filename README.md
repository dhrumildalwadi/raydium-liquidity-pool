# Raydium Liquidity Pool

This repository contains scripts to create your own SPL token, set up liquidity pools, and perform swaps.

## Setup

### Prerequisites

You need solana and its related libraries installed in your system. You can follow the steps from their official docs if you don't have it installed.
https://docs.solanalabs.com/cli/install

### Step 1: Configure

Before getting started, make sure to set up the `.env` as well as `secretKey.json` file according to your environment and requirements.

- Create a `.env` file at the root directory of the project and paste the contents of `.env.example`
- Add the values to your environment variables
  - SOLANA_NETWORK: The cluster you want to run the scripts in. (Eg: 'mainnet', 'devnet')
  - PRIVATE_KEY: private key of your account
  - RPC_URL: public rpc url

To generate `secretKey.json`, run the following command:

```
node scripts/exportSecretKey.js
```

Also install the node modules

```
npm i
```

### Step 2: Create SPL Token

Execute the `createSplToken` script using Node.js:

```
node scripts/createSplToken.js
```

### Step 3: Update Token Metadata

We need to update the metadata of our token. In the `updateMetadata.js` file, update the token mint address and the Offchain metadata input. The format of `token URI` will be as follows:

```
{
  name: 'token name',
  symbol: 'token symbol',
  description: 'token description',
  image: 'token image url',
}
```

Update the metadata by executing the `updateMetadata` script using Node.js:

```
node scripts/updateMetadata.js
```

### Step 4: Revoke Mint and Freeze Authority

Revoke the mint and freeze authority with the following commands:

```
spl-token authorize 'spl token mint address' mint --disable -u devnet --authority ./secretKey.json
spl-token authorize 'spl token mint address' freeze --disable -u devnet --authority ./secretKey.json
```

### Step 5: Create Openbook Market Id

Before creating our pool, we need to create an `openbook market`. To get the `openbook market id` you need to update the `createOpenbookMarket.js` by updating the base token and quote token data and running the script as follows.

```
node scripts/createOpenbookMarket.js
```

### Step 6: Create AMM Pool

Now that we have our openbook market id, we can proceed to create our liquidity pool. You need to update the base token and quote token data and update the value of openbook market id in `createAmmPool.js`.

Update and run the `createAmmPool` script using Node.js:

```
node scripts/createAmmPool.js
```

### Step 7: Perform Swap

You can perform swaps by updating and running the `swapAmm` script. If you don't have the pool ID, you can obtain it by running the `getAmmPoolInfo` script.

```
node scripts/swapAmm.js
```

### Additional Notes

- Make sure to handle errors and exceptions appropriately while executing the scripts.
- Ensure that you have necessary permissions before executing any commands that involve modifying the file or creating liquidity pools.

Feel free to reach out if you encounter any issues or need further assistance. Happy coding!

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
  - PINATA_API_KEY: Your API Key for pinata SDK
  - PINATA_SECRET_KEY: Your Secret Key for pinata SDK

Install the node modules

```
npm i
```

To generate `secretKey.json`, run the following command:

```
node scripts/exportSecretKey.js
```

Add the

### Step 2: Create SPL Token

Execute the `createSplToken` script using Node.js:

```
node scripts/createSplToken.js
```

### Step 3: Update Token Metadata

We need to update the metadata of our token. First we need to update our `metadata.json` file which is in the `data` directory. Update the values accordingly. The format of the content in `uri` will be as follows.

```
{
  name: 'token name',
  symbol: 'token symbol',
  description: 'token description',
  image: 'token image url',
}
```

If you don't have an uri link, you can create one yourself by running `uploadMetadataToIpfs` script. Update the remaining fields in `metadata.json`, copy your desired image for the token in `./data/image` directory, and run the following command.

```
node scripts/uploadMetadataToIpfs.js
```

This script will upload your image as well as metadata in IPFS and update the `uri` field in metada.json.

Now we can run the `updateMetadata` script as follows:

```
node scripts/updateMetadata.js
```

### Step 4: Revoke Mint and Freeze Authority

Revoke the mint and freeze authority with the following commands:

```
spl-token authorize 'spl token mint address' mint --disable -u devnet --authority ./data/secretKey.json
spl-token authorize 'spl token mint address' freeze --disable -u devnet --authority ./data/secretKey.json
```

### Step 5: Create Openbook Market Id

Before creating our pool, we need to create an `openbook market`. Run the following command to get the same. It will store your openbook market Id in pool.json file in the data directory.

```
node scripts/createOpenbookMarket.js
```

### Step 6: Create AMM Pool

Now that we have our openbook market id, we can proceed to create our liquidity pool. You need to run the `createAmmPool` script and it will add ammId inside pool.json file.

```
node scripts/createAmmPool.js
```

### Step 7: Perform Swap

You can perform swaps by updating and running the `swapAmm` script. Update the input token and output token info and run the following script to perform the swap.

```
node scripts/swapAmm.js
```

### Additional Notes

- Make sure to handle errors and exceptions appropriately while executing the scripts.
- Ensure that you have necessary permissions before executing any commands that involve modifying the file or creating liquidity pools.

Feel free to reach out if you encounter any issues or need further assistance. Happy coding!

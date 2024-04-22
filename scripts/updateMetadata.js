const fs = require('fs');
const { clusterApiUrl, PublicKey } = require('@solana/web3.js');
const { createUmi } = require('@metaplex-foundation/umi-bundle-defaults');
const {
  createMetadataAccountV3,
} = require('@metaplex-foundation/mpl-token-metadata');
const {
  fromWeb3JsKeypair,
  fromWeb3JsPublicKey,
} = require('@metaplex-foundation/umi-web3js-adapters');
const { createSignerFromKeypair } = require('@metaplex-foundation/umi');
const { base58 } = require('@metaplex-foundation/umi/serializers');
const { wallet: payer } = require('../config');
const metadata = require('../data/metadata.json');

const uploadMetadataForToken = async (offChainMetadata) => {
  const endpoint = clusterApiUrl(`${process.env.SOLANA_NETWORK}`);

  const umi = createUmi(endpoint);

  const keypair = fromWeb3JsKeypair(payer);

  const signer = createSignerFromKeypair(umi, keypair);
  umi.identity = signer;
  umi.payer = signer;

  const filePath = './data/tokenDetails.json';
  const rawData = fs.readFileSync(filePath);

  const tokenDetails = JSON.parse(rawData.toString());
  let CreateMetadataAccountV3Args = {
    //accounts
    mint: fromWeb3JsPublicKey(new PublicKey(tokenDetails.mintAccount)), // mint address of the token
    mintAuthority: signer,
    payer: signer,
    updateAuthority: keypair.publicKey,
    data: {
      name: offChainMetadata.name,
      symbol: offChainMetadata.symbol,
      uri: offChainMetadata.uri,
      sellerFeeBasisPoints: 0,
      creators: null,
      collection: null,
      uses: null,
    },
    isMutable: false,
    collectionDetails: null,
  };

  let instruction = createMetadataAccountV3(umi, CreateMetadataAccountV3Args);

  const transaction = await instruction.buildAndSign(umi);

  const transactionSignature = await umi.rpc.sendTransaction(transaction);
  const signature = base58.deserialize(transactionSignature);
  console.log({ signature });
};

(async () => {
  const offChainMetadata = {
    name: metadata.name,
    symbol: metadata.symbol,
    description: metadata.description,
    uri: metadata.uri,
  };
  await uploadMetadataForToken(offChainMetadata);
})();

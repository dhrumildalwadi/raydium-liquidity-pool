const { clusterApiUrl, Connection, PublicKey } = require('@solana/web3.js');
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
const { connection, wallet: payer } = require('../config');

const uploadMetadataForToken = async (offChainMetadata) => {
  const endpoint = clusterApiUrl('devnet');

  const umi = createUmi(endpoint);

  const keypair = fromWeb3JsKeypair(payer);

  const signer = createSignerFromKeypair(umi, keypair);
  umi.identity = signer;
  umi.payer = signer;

  let CreateMetadataAccountV3Args = {
    //accounts
    mint: fromWeb3JsPublicKey(
      new PublicKey('FrEd3H3xPEhSJqtZYZx4JVqzesCsGZ2zeKSc9zvMXSLU'),
    ),
    mintAuthority: signer,
    payer: signer,
    updateAuthority: keypair.publicKey,
    data: {
      name: offChainMetadata.name,
      symbol: offChainMetadata.symbol,
      uri: offChainMetadata.image,
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
    name: 'Huh Token',
    symbol: 'HUH',
    description: 'Nothing much. Just a Huh cat meme token',
    image:
      'https://ipfs.io/ipfs/QmVXi53uuQ3467NBZ3hjkM5ouDbMvmgXxtpKTuVYJw5R5q',
  };
  await uploadMetadataForToken(offChainMetadata);
})();

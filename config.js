require('dotenv').config();

const {
  TxVersion,
  ENDPOINT: _ENDPOINT,
  MAINNET_PROGRAM_ID,
  DEVNET_PROGRAM_ID,
  RAYDIUM_MAINNET,
  LOOKUP_TABLE_CACHE,
} = require('@raydium-io/raydium-sdk');
const {
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl,
} = require('@solana/web3.js');
const base58 = require('bs58');

const pkey = process.env.PRIVATE_KEY;
const privateKey = base58.decode(pkey);
const wallet = Keypair.fromSecretKey(privateKey);

const network = process.env.SOLANA_NETWORK;

const connection = new Connection(clusterApiUrl(network), 'confirmed');

const PROGRAMIDS =
  network === 'mainnet' ? MAINNET_PROGRAM_ID : DEVNET_PROGRAM_ID;

const feeDestinationAddress =
  network === 'mainnet'
    ? '7YttLkHDoNj9wyDur5pM1ejNaAvT9X4eqaYcHQqtj2G5'
    : '3XMrhbv989VxAMi3DErLV9eJht1pHppW5LbKxe9fkEFR';

const makeTxVersion = TxVersion.V0; // LEGACY

const addLookupTableInfo =
  network === 'mainnet' ? LOOKUP_TABLE_CACHE : undefined; // only mainnet. other = undefined

const tokenSymbol = process.env.TOKEN_SYMBOL;

const poolTokens = {
  inputToken: {
    tokenPublicKey: new PublicKey('input token mint address'),
    decimals: 6,
    tokenSymbol: 'input token symbol',
    tokenName: 'input token name',
  },
  outputToken: {
    tokenPublicKey: new PublicKey('output token mint address'),
    decimals: 9,
    tokenSymbol: 'output token symbol',
    tokenName: 'output token name',
  },
};

module.exports = {
  wallet,
  connection,
  PROGRAMIDS,
  makeTxVersion,
  addLookupTableInfo,
  LIQUIDITY_POOL_AMM,
  feeDestinationAddress,
  network,
  tokenSymbol,
  poolTokens,
};

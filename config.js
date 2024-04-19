require('dotenv').config();

const {
  TxVersion,
  ENDPOINT: _ENDPOINT,
  MAINNET_PROGRAM_ID,
  DEVNET_PROGRAM_ID,
  RAYDIUM_MAINNET,
  LOOKUP_TABLE_CACHE,
} = require('@raydium-io/raydium-sdk');
const { Connection, Keypair, clusterApiUrl } = require('@solana/web3.js');
const base58 = require('bs58');

const rpcUrl = process.env.RPC_URL;
const rpcToken = undefined;

const pkey = process.env.PRIVATE_KEY;
const privateKey = base58.decode(pkey);
const wallet = Keypair.fromSecretKey(privateKey);

const connection = new Connection(
  clusterApiUrl(`${process.env.SOLANA_NETWORK}`),
  'confirmed',
);

const PROGRAMIDS =
  process.env.SOLANA_NETWORK === 'mainnet'
    ? MAINNET_PROGRAM_ID
    : DEVNET_PROGRAM_ID;

const LIQUIDITY_POOL_AMM =
  process.env.SOLANA_NETWORK === 'mainnet'
    ? '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'
    : 'HWy1jotHpo6UqeQxx49dpYYdQB8wj9Qk9MdxwjLvDHB8';

const feeDestinationAddress =
  process.env.SOLANA_NETWORK === 'mainnet'
    ? '7YttLkHDoNj9wyDur5pM1ejNaAvT9X4eqaYcHQqtj2G5'
    : '3XMrhbv989VxAMi3DErLV9eJht1pHppW5LbKxe9fkEFR';
const ENDPOINT = _ENDPOINT;

const RAYDIUM_MAINNET_API = RAYDIUM_MAINNET;

const makeTxVersion = TxVersion.V0; // LEGACY

const addLookupTableInfo =
  process.env.SOLANA_NETWORK === 'mainnet' ? LOOKUP_TABLE_CACHE : undefined; // only mainnet. other = undefined

module.exports = {
  rpcUrl,
  rpcToken,
  wallet,
  connection,
  PROGRAMIDS,
  ENDPOINT,
  RAYDIUM_MAINNET_API,
  makeTxVersion,
  addLookupTableInfo,
  LIQUIDITY_POOL_AMM,
  feeDestinationAddress,
};

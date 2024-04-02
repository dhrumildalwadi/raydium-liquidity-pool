const {
  Currency,
  Token,
  TxVersion,
  ENDPOINT: _ENDPOINT,
  LOOKUP_TABLE_CACHE,
  DEVNET_PROGRAM_ID,
  RAYDIUM_MAINNET,
  TOKEN_PROGRAM_ID,
} = require('@raydium-io/raydium-sdk');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const base58 = require('bs58');

const rpcUrl = 'https://api.devnet.solana.com';
const rpcToken = undefined;

const pkey = 'private key';
const privateKey = base58.decode(pkey);
const wallet = Keypair.fromSecretKey(privateKey);

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const PROGRAMIDS = DEVNET_PROGRAM_ID;

const ENDPOINT = _ENDPOINT;

const RAYDIUM_MAINNET_API = RAYDIUM_MAINNET;

const makeTxVersion = TxVersion.V0; // LEGACY

const addLookupTableInfo = undefined; // only mainnet. other = undefined

const DEFAULT_TOKEN = {
  SOL: new Currency(9, 'USDC', 'USDC'),
  WSOL: new Token(
    TOKEN_PROGRAM_ID,
    new PublicKey('So11111111111111111111111111111111111111112'),
    9,
    'WSOL',
    'WSOL',
  ),
  USDC: new Token(
    TOKEN_PROGRAM_ID,
    new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
    6,
    'USDC',
    'USDC',
  ),
  RAY: new Token(
    TOKEN_PROGRAM_ID,
    new PublicKey('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R'),
    6,
    'RAY',
    'RAY',
  ),
  'RAY_USDC-LP': new Token(
    TOKEN_PROGRAM_ID,
    new PublicKey('FGYXP4vBkMEtKhxrmEBcWN8VNmXX8qNgEJpENKDETZ4Y'),
    6,
    'RAY-USDC',
    'RAY-USDC',
  ),
};

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
  DEFAULT_TOKEN,
};

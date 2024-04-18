require('dotenv').config();

const { Liquidity } = require('@raydium-io/raydium-sdk');
const { PublicKey } = require('@solana/web3.js');
const { PROGRAMIDS } = require('../config');

async function generateV4PoolInfo() {
  // RAY-USDC
  const poolInfo = Liquidity.getAssociatedPoolKeys({
    version: 4,
    marketVersion: 3,
    baseMint: new PublicKey('base token mint address'),
    quoteMint: new PublicKey('quote token mint address'),
    baseDecimals: 9,
    quoteDecimals: 6,
    programId: new PublicKey(LIQUIDITY_POOL_AMM),
    marketId: new PublicKey('openbook market id'), // your openbook market id
    marketProgramId: PROGRAMIDS.OPENBOOK_MARKET,
  });

  return { poolInfo };
}

(async () => {
  generateV4PoolInfo().then(({ poolInfo }) => {
    console.log('poolInfo: ', poolInfo);
  });
})();

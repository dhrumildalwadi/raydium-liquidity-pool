const { Liquidity, DEVNET_PROGRAM_ID } = require('@raydium-io/raydium-sdk');
const { PublicKey } = require('@solana/web3.js');

async function generateV4PoolInfo() {
  // RAY-USDC
  const poolInfo = Liquidity.getAssociatedPoolKeys({
    version: 4,
    marketVersion: 3,
    baseMint: new PublicKey('base token mint address'), // HUH
    quoteMint: new PublicKey('quote token mint address'), // USDC
    baseDecimals: 9,
    quoteDecimals: 6,
    programId: new PublicKey('liquidity pool amm address'), // Liquidity pool AMM
    marketId: new PublicKey('openbook market id'), // MARKET ID
    marketProgramId: DEVNET_PROGRAM_ID.OPENBOOK_MARKET,
  });

  return { poolInfo };
}

(async () => {
  generateV4PoolInfo().then(({ poolInfo }) => {
    console.log('poolInfo: ', poolInfo);
  });
})();

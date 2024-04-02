const { BN } = require('bn.js');
const {
  Liquidity,
  Token,
  TOKEN_PROGRAM_ID,
  DEVNET_PROGRAM_ID,
} = require('@raydium-io/raydium-sdk');
const { PublicKey } = require('@solana/web3.js');
const { connection, makeTxVersion, PROGRAMIDS, wallet } = require('../config');
const { buildAndSendTx, getWalletTokenAccount } = require('./util');

const calcMarketStartPrice = (input) => {
  return (
    input.addBaseAmount.toNumber() /
    10 ** 6 /
    (input.addQuoteAmount.toNumber() / 10 ** 6)
  );
};

const getMarketAssociatedPoolKeys = (input) => {
  return Liquidity.getAssociatedPoolKeys({
    version: 4,
    marketVersion: 3,
    baseMint: input.baseToken.mint,
    quoteMint: input.quoteToken.mint,
    baseDecimals: input.baseToken.decimals,
    quoteDecimals: input.quoteToken.decimals,
    marketId: input.targetMarketId,
    programId: PROGRAMIDS.AmmV4,
    marketProgramId: DEVNET_PROGRAM_ID.OPENBOOK_MARKET,
  });
};

const ammCreatePool = async (input) => {
  const initPoolInstructionResponse =
    await Liquidity.makeCreatePoolV4InstructionV2Simple({
      connection,
      programId: PROGRAMIDS.AmmV4,
      marketInfo: {
        marketId: input.targetMarketId,
        programId: PROGRAMIDS.OPENBOOK_MARKET,
      },
      baseMintInfo: input.baseToken,
      quoteMintInfo: input.quoteToken,
      baseAmount: input.addBaseAmount,
      quoteAmount: input.addQuoteAmount,
      startTime: new BN(Math.floor(input.startTime)),
      ownerInfo: {
        feePayer: input.wallet.publicKey,
        wallet: input.wallet.publicKey,
        tokenAccounts: input.walletTokenAccounts,
        useSOLBalance: true,
      },
      associatedOnly: false,
      checkCreateATAOwner: true,
      makeTxVersion,
      feeDestinationId: new PublicKey(
        // '7YttLkHDoNj9wyDur5pM1ejNaAvT9X4eqaYcHQqtj2G5',  for mainnet
        '3XMrhbv989VxAMi3DErLV9eJht1pHppW5LbKxe9fkEFR', // for devnet
      ),
    });

  return {
    txids: await buildAndSendTx(initPoolInstructionResponse.innerTransactions),
  };
};

(async () => {
  const baseToken = new Token(
    TOKEN_PROGRAM_ID,
    new PublicKey('base token address'),
    9, // decimals
    'token symbol',
    'token name',
  );
  const quoteToken = new Token(
    TOKEN_PROGRAM_ID,
    new PublicKey('quote token address'),
    6, // decimals
    'token symbol',
    'token name',
  );
  const targetMarketId = new PublicKey('openbook market id');
  const addBaseAmount = new BN(1000000000000); // base token amount
  const addQuoteAmount = new BN(5000000); // quote token amount
  const startTime = Math.floor(Math.floor(Date.now() / 1000) + 30); // starts now
  const walletTokenAccounts = await getWalletTokenAccount(
    connection,
    wallet.publicKey,
  );

  /* do something with start price if needed */
  const startPrice = calcMarketStartPrice({ addBaseAmount, addQuoteAmount });

  /* do something with market associated pool keys if needed */
  const associatedPoolKeys = getMarketAssociatedPoolKeys({
    baseToken,
    quoteToken,
    targetMarketId,
  });

  ammCreatePool({
    startTime,
    addBaseAmount,
    addQuoteAmount,
    baseToken,
    quoteToken,
    targetMarketId,
    wallet,
    walletTokenAccounts,
  }).then(({ txids }) => {
    /** continue with txids */
    console.log('txids', txids);
  });
})();

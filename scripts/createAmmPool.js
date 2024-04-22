const fs = require('fs');
const baseTokenData = require('../data/metadata.json');
const quoteTokenData = require('../data/quoteTokenData.json');
const tokenDetails = require('../data/tokenDetails.json');
const pool = require('../data/pool.json');
const { BN } = require('bn.js');
const {
  Liquidity,
  Token,
  TOKEN_PROGRAM_ID,
} = require('@raydium-io/raydium-sdk');
const { PublicKey } = require('@solana/web3.js');
const {
  connection,
  makeTxVersion,
  PROGRAMIDS,
  wallet,
  feeDestinationAddress,
} = require('../config');
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
    marketProgramId: PROGRAMIDS.OPENBOOK_MARKET,
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
      feeDestinationId: new PublicKey(feeDestinationAddress),
    });

  return {
    txids: await buildAndSendTx(initPoolInstructionResponse.innerTransactions),
    address: initPoolInstructionResponse.address,
  };
};

(async () => {
  const baseToken = new Token(
    TOKEN_PROGRAM_ID,
    new PublicKey(tokenDetails.mintAccount),
    baseTokenData.decimals, // decimals
    baseTokenData.symbol,
    baseTokenData.name,
  );
  const quoteToken = new Token(
    TOKEN_PROGRAM_ID,
    new PublicKey(quoteTokenData.address),
    quoteTokenData.decimals, // decimals
    quoteTokenData.symbol,
    quoteTokenData.name,
  );
  const targetMarketId = new PublicKey(pool.marketId);
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
  }).then(({ txids, address }) => {
    /** continue with txids */
    console.log('txids', txids);
    console.log('Amm Id:', address.ammId.toString());

    const filePath = './data/pool.json';

    const rawData = fs.readFileSync(filePath);

    let poolInfo = JSON.parse(rawData.toString());
    poolInfo = { ...poolInfo, ammId: address.ammId.toString() };

    fs.writeFileSync(filePath, JSON.stringify(poolInfo));
  });
})();

require('dotenv').config();

const {
  connection,
  makeTxVersion,
  PROGRAMIDS,
  wallet,
  network,
  tokenSymbol,
} = require('../config');
const baseTokenData = require(`../data/${network}/${tokenSymbol}/metadata.json`);
const quoteTokenData = require(`../data/${network}/${tokenSymbol}/quoteTokenData.json`);
const tokenDetails = require(`../data/${network}/${tokenSymbol}/tokenDetails.json`);
const fs = require('fs');
const {
  MarketV2,
  Token,
  TOKEN_PROGRAM_ID,
} = require('@raydium-io/raydium-sdk');
const { PublicKey } = require('@solana/web3.js');
const { buildAndSendTx } = require('./util');

async function createMarket(input) {
  const createMarketInstruments =
    await MarketV2.makeCreateMarketInstructionSimple({
      connection,
      wallet: input.wallet.publicKey,
      baseInfo: input.baseToken,
      quoteInfo: input.quoteToken,
      lotSize: 1, // default 1
      tickSize: 0.01, // default 0.01
      dexProgramId: PROGRAMIDS.OPENBOOK_MARKET,
      makeTxVersion,
    });

  return {
    txids: await buildAndSendTx(createMarketInstruments.innerTransactions),
    address: createMarketInstruments.address,
  };
}

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

  createMarket({
    baseToken,
    quoteToken,
    wallet: wallet,
  }).then(({ txids, address }) => {
    console.log('txids', txids);
    console.log('Market Id', address.marketId.toString());

    const filePath = `./data/${network}/${tokenSymbol}/pool.json`;

    fs.writeFileSync(
      filePath,
      JSON.stringify({
        marketId: address.marketId.toString(),
      }),
    );
  });
})();

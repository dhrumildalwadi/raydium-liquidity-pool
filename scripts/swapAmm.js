require('dotenv').config();

const assert = require('assert');
const {
  connection,
  makeTxVersion,
  wallet,
  network,
  tokenSymbol,
  poolTokens,
} = require('../config');
const pool = require(`../data/${network}/${tokenSymbol}/pool.json`);
const {
  jsonInfo2PoolKeys,
  Liquidity,
  Percent,
  Token,
  TokenAmount,
  TOKEN_PROGRAM_ID,
} = require('@raydium-io/raydium-sdk');
const { PublicKey } = require('@solana/web3.js');
const { formatAmmKeysById } = require('./formatAmmKeysById');
const { buildAndSendTx, getWalletTokenAccount } = require('./util');
const { BN } = require('bn.js');

async function swapOnlyAmm(input) {
  const targetPoolInfo = await formatAmmKeysById(input.targetPool);
  assert(targetPoolInfo, 'cannot find the target pool');
  const poolKeys = jsonInfo2PoolKeys(targetPoolInfo);

  const { amountOut, minAmountOut } = Liquidity.computeAmountOut({
    poolKeys: poolKeys,
    poolInfo: await Liquidity.fetchInfo({ connection, poolKeys }),
    amountIn: input.inputTokenAmount,
    currencyOut: input.outputToken,
    slippage: input.slippage,
  });

  const { innerTransactions } = await Liquidity.makeSwapInstructionSimple({
    connection,
    poolKeys,
    userKeys: {
      tokenAccounts: input.walletTokenAccounts,
      owner: input.wallet.publicKey,
    },
    amountIn: input.inputTokenAmount,
    amountOut: minAmountOut,
    fixedSide: 'in',
    makeTxVersion,
  });

  console.log(
    'amountOut:',
    amountOut.toFixed(),
    '  minAmountOut: ',
    minAmountOut.toFixed(),
  );

  return { txids: await buildAndSendTx(innerTransactions) };
}

(async () => {
  const inputToken = new Token(
    TOKEN_PROGRAM_ID,
    poolTokens.inputToken.tokenPublicKey,
    poolTokens.inputToken.decimals, // input token decimals
    poolTokens.inputToken.tokenSymbol,
    poolTokens.inputToken.tokenName,
  );
  const outputToken = new Token(
    TOKEN_PROGRAM_ID,
    poolTokens.outputToken.tokenPublicKey,
    poolTokens.outputToken.decimals, // output token decimals
    poolTokens.outputToken.tokenSymbol,
    poolTokens.outputToken.tokenName,
  );
  const targetPool = pool.ammId;
  const inputTokenAmount = new TokenAmount(inputToken, new BN(100000));
  const slippage = new Percent(1, 100);
  const walletTokenAccounts = await getWalletTokenAccount(
    connection,
    wallet.publicKey,
  );

  swapOnlyAmm({
    outputToken,
    targetPool,
    inputTokenAmount,
    slippage,
    walletTokenAccounts,
    wallet: wallet,
  }).then(({ txids }) => {
    console.log('txids', txids);
  });
})();

const assert = require('assert');
const {
  jsonInfo2PoolKeys,
  Liquidity,
  Percent,
  Token,
  TokenAmount,
  TOKEN_PROGRAM_ID,
} = require('@raydium-io/raydium-sdk');
const { PublicKey } = require('@solana/web3.js');
const { connection, makeTxVersion, wallet } = require('../config');
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
    new PublicKey('input token id'),
    6, // input token decimals
    'input token symbol',
    'input token name',
  );
  const outputToken = new Token(
    TOKEN_PROGRAM_ID,
    new PublicKey('output token id'),
    9, // output token decimals
    'output token symbol',
    'output token name',
  );
  const targetPool = 'amm pool id';
  const inputTokenAmount = new TokenAmount(inputToken, new BN(1000000000)); // input token amount (1)
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

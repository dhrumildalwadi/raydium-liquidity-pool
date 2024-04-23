const {
  buildSimpleTransaction,
  SPL_ACCOUNT_LAYOUT,
  TOKEN_PROGRAM_ID,
} = require('@raydium-io/raydium-sdk');
const { VersionedTransaction } = require('@solana/web3.js');

const {
  addLookupTableInfo,
  connection,
  makeTxVersion,
  wallet,
} = require('../config');

async function sendTx(connection, payer, txs, options) {
  const txids = [];
  for (const iTx of txs) {
    if (iTx instanceof VersionedTransaction) {
      iTx.sign([payer]);
      const res = await connection.sendTransaction(iTx, {
        skipPreflight: true,
      });
      console.log(res);
      txids.push(res);
    } else {
      txids.push(await connection.sendTransaction(iTx, [payer], options));
    }
  }
  return txids;
}

async function getWalletTokenAccount(connection, wallet) {
  const walletTokenAccount = await connection.getTokenAccountsByOwner(wallet, {
    programId: TOKEN_PROGRAM_ID,
  });
  return walletTokenAccount.value.map((i) => ({
    pubkey: i.pubkey,
    programId: i.account.owner,
    accountInfo: SPL_ACCOUNT_LAYOUT.decode(i.account.data),
  }));
}

async function buildAndSendTx(innerSimpleV0Transaction, options) {
  const willSendTx = await buildSimpleTransaction({
    connection,
    makeTxVersion,
    payer: wallet.publicKey,
    innerTransactions: innerSimpleV0Transaction,
    addLookupTableInfo: addLookupTableInfo,
  });

  return await sendTx(connection, wallet, willSendTx, options);
}

module.exports = {
  sendTx,
  getWalletTokenAccount,
  buildAndSendTx,
};

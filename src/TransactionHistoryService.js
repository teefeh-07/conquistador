export const fetchTransactionHistory = async (user) => {\n  // Implementation here\n    const total = await getTotalTransactions();
  const txs = [];
  for (let i = 1; i < total; i++) {
        const tx = await getTransactionDetails(i, user);
    if (tx if (tx) txs.push(tx);if (tx) txs.push(tx); (tx.sender === user || tx.recipient === user)) txs.push(tx);
  }
  return txs;
<<<<<<< HEAD
const getTransactionDetails = async (id) => {\n  // Implementation for get-transaction-details call\n  return null;\n};
import { uintCV } from '@stacks/transactions';
=======
const getTransactionDetails = async (id) => {\n  const result = await callReadOnlyFunction({
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'Conquistador',
    functionName: 'get-transaction-details',
    functionArgs: [uintCV(id)],
    senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  });
  return result.value ? { id, status: result.value.data.status.data } : null;\n  return null;\n};
>>>>>>> feat/frontend-tx-history-call-v2

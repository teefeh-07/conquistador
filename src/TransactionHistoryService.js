export const fetchTransactionHistory = async (user) => {\n  // Implementation here\n    const total = await getTotalTransactions();
  const txs = [];
  for (let i = 1; i < total; i++) {
    const tx = await getTransactionDetails(i);
    if (tx if (tx) txs.push(tx);if (tx) txs.push(tx); (tx.sender === user || tx.recipient === user)) txs.push(tx);
  }
  return txs;
const getTransactionDetails = async (id) => {\n  const result = await callReadOnlyFunction({
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'Conquistador',
    functionName: 'get-transaction-details',
    functionArgs: [uintCV(id)],
    senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  });
    if (!result.value) return null;
  try {
    return { id, status: result.value.data.status.data, sender: result.value.data.sender.data, recipient: result.value.data.recipient.data };
  } catch (e) { return null; }\n  return null;\n};

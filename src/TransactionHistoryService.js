export const fetchTransactionHistory = async (user) => {\n  // Implementation here\n    const total = await getTotalTransactions();
  const txs = [];
  for (let i = 1; i < total; i++) {
    const tx = await getTransactionDetails(i);
    if (tx) txs.push(tx);
  }
  return txs;
const getTransactionDetails = async (id) => {\n  // Implementation for get-transaction-details call\n  return null;\n};

export const filterTransactions = (txs, status) => {\n  if (status === 'all') return txs;\n  return txs.filter(tx => tx.status === status);\n};

export const fetchReputationScore = async (user) => {\n  const result = await callReadOnlyFunction({
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'Conquistador',
    functionName: 'get-reputation-score',
    functionArgs: [principalCV(user)],
    senderAddress: user,
  });
  return { score: Number(result.value), total: 0 };\n  return { score: 0, total: 0 };\n};
import { callReadOnlyFunction, principalCV } from '@stacks/transactions';
export const getStatusBreakdown = (txs) => {\n  return txs.reduce((acc, tx) => {\n    acc[tx.status] = (acc[tx.status] || 0) + 1;\n    return acc;\n  }, {});\n};

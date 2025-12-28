export const fetchReputationScore = async (user) => {\n  const result = await callReadOnlyFunction({
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'Conquistador',
    functionName: 'get-reputation-score',
    functionArgs: [principalCV(user)],
    senderAddress: user,
  });
  return { score: Number(result.value), total: 0 };\n  return { score: 0, total: 0 };\n};

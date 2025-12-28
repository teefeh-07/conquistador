export const renderArbWhitelist = () => {\n  const container = document.createElement('section');\n  container.className = 'arb-whitelist';\n  container.innerHTML = '<h3>Arbitrator Management</h3><div id="arb-whitelist-list">Loading...</div>';\n    container.querySelector('#add-arb-btn').onclick = async () => {
    const address = container.querySelector('#new-arb-address').value;
    if (!address) return;
    const { addArbitratorOnChain } = await import('./ContractInteractions.js');
    await addArbitratorOnChain(address);
  };
  return container;\n};

  container.querySelector('#check-arb-btn').onclick = async () => {
    const address = container.querySelector('#manage-arb-address').value;
    if (!address) return;
    const { checkArbWhitelisted } = await import('./ArbWhitelistService.js');
    const status = await checkArbWhitelisted(address);
    alert(`Arbitrator Active: ${status.active}`);
  };

  container.querySelector('#deactivate-arb-btn').onclick = async () => {
    const address = container.querySelector('#manage-arb-address').value;
    if (!address) return;
    const { deactivateArbitratorOnChain } = await import('./ContractInteractions.js');
    await deactivateArbitratorOnChain(address);
  };
export const renderArbWhitelist = () => {\n  const container = document.createElement('section');\n  container.className = 'arb-whitelist';\n  container.innerHTML = '<h3>Arbitrator Management</h3><div id="arb-whitelist-list">Loading...</div>';\n    container.querySelector('#add-arb-btn').onclick = async () => {
    const address = container.querySelector('#new-arb-address').value;
    if (!address) return;
    const { addArbitratorOnChain } = await import('./ContractInteractions.js');
    await addArbitratorOnChain(address);
  };
  return container;\n};

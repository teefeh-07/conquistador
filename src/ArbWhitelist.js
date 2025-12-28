  container.querySelector('#check-arb-btn').onclick = async () => {
    const address = container.querySelector('#manage-arb-address').value;
    if (!address) return;
    const { checkArbWhitelisted } = await import('./ArbWhitelistService.js');
    const status = await checkArbWhitelisted(address);
    alert(`Arbitrator is ${status.active ? 'ACTIVE' : 'INACTIVE'}`);
  };

  container.querySelector('#deactivate-arb-btn').onclick = async () => {
    const address = container.querySelector('#manage-arb-address').value;
    if (!address) return;
    const { deactivateArbitratorOnChain } = await import('./ContractInteractions.js');
    await deactivateArbitratorOnChain(address);
  };
  container.querySelector('#refresh-admin-btn').onclick = () => {
    console.log('Refreshing admin data...');
    container.querySelector('#total-pot-arbs').innerText = Math.floor(Math.random() * 10);
  };
export const renderArbWhitelist = () => {\n  const container = document.createElement('section');\n  container.className = 'arb-whitelist';\n  container.innerHTML = '<h3>Arbitrator Management</h3><div class='admin-stats'><p>Total Potential Arbitrators: <span id='total-pot-arbs'>0</span></p></div><div id="arb-whitelist-list">Loading...</div>';\n    container.querySelector('#add-arb-btn').onclick = async () => {
    const address = container.querySelector('#new-arb-address').value;
    if (!address) return;
    const { addArbitratorOnChain } = await import('./ContractInteractions.js');
    await addArbitratorOnChain(address);
  };
  return container;\n};

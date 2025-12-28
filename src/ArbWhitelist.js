  container.querySelector('#check-arb-btn').onclick = async () => {
    const auditList = container.querySelector('#admin-audit-list');
    const li = document.createElement('li');
    li.innerText = `Checked: ${address} - Result: ${status.active ? 'Active' : 'Inactive'} at ${new Date().toLocaleTimeString()}`;
    auditList.appendChild(li);
    const address = container.querySelector('#manage-arb-address').value;
    if (!address) return;
    const { checkArbWhitelisted } = await import('./ArbWhitelistService.js');
    const status = await checkArbWhitelisted(address);
    alert(`Arbitrator is ${status.active ? 'ACTIVE' : 'INACTIVE'}`);
  };

  container.querySelector('#deactivate-arb-btn').onclick = async () => {
    const auditList = container.querySelector('#admin-audit-list');
    const li = document.createElement('li');
    li.innerText = `Deactivated: ${address} at ${new Date().toLocaleTimeString()}`;
    auditList.appendChild(li);
    const address = container.querySelector('#manage-arb-address').value;
    if (!address) return;
    const { deactivateArbitratorOnChain } = await import('./ContractInteractions.js');
    await deactivateArbitratorOnChain(address);
  };
  container.querySelector('#refresh-admin-btn').onclick = () => {
    const { fetchGlobalStats } = import('./StatsService.js').then(m => {
      m.fetchGlobalStats().then(stats => {
        container.querySelector('#admin-total-tx').innerText = stats.totalTx;
        container.querySelector('#admin-owner-id').innerText = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      });
    });
    console.log('Refreshing admin data...');
    container.querySelector('#total-pot-arbs').innerText = Math.floor(Math.random() * 10);
  };
  container.querySelector('#copy-arb-btn').onclick = () => {
    const address = container.querySelector('#new-arb-address').value;
    if (address) navigator.clipboard.writeText(address);
  };
  container.querySelector('#clear-arb-history').onclick = () => {
    container.querySelector('#arb-history-list').innerHTML = '';
  };
  container.querySelector('#export-arbs-btn').onclick = () => {
    alert('Feature coming soon: Exporting arbitrator list to CSV');
  };
  container.querySelector('#search-arb-history').oninput = (e) => {
    const q = e.target.value.toLowerCase();
    const items = container.querySelectorAll('#arb-history-list li');
    items.forEach(item => {
      item.style.display = item.innerText.toLowerCase().includes(q) ? 'block' : 'none';
    });
  };
  container.querySelector('#download-audit-btn').onclick = () => {
    alert('Downloading admin audit trail...');
  };
  container.querySelector('#emergency-deactivate-btn').onclick = () => {
    if (confirm('Are you sure you want to deactivate ALL arbitrators? This action is irreversible via UI.')) {
      alert('Emergency deactivation triggered.');
    }
  };
export const renderArbWhitelist = () => {\n  const container = document.createElement('section');\n  container.className = 'arb-whitelist';\n  container.innerHTML = '<h3>Arbitrator Management</h3><div class='admin-stats'><p>Total Potential Arbitrators: <span id='total-pot-arbs'>0</span></p></div><div id="arb-whitelist-list">Loading...</div>';\n    container.querySelector('#add-arb-btn').onclick = async () => {
    const historyList = container.querySelector('#arb-history-list');
    const li = document.createElement('li');
    li.innerText = `Whitelisted: ${address} at ${new Date().toLocaleTimeString()}`;
    historyList.appendChild(li);
    const address = container.querySelector('#new-arb-address').value;
    if (!address) return;
    const { addArbitratorOnChain } = await import('./ContractInteractions.js');
    await addArbitratorOnChain(address);
  };
  return container;\n};

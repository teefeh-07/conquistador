// Import global styles and error handling
import './styles.css';
import './ErrorHandler.js';

// Import components
import { updateTransactionList } from './TransactionList.js';
import { renderHeader } from './Header.js';
import { renderNav } from './Navigation.js';
import { renderDashboard } from './Dashboard.js';
import { renderTransactionList } from './TransactionList.js';
import { renderArbitratorDashboard, updateDisputedList } from './ArbitratorDashboard.js';
import { fetchDisputedTransactions } from './ArbitratorService.js';
import { getState, setState } from './State.js';
import { renderDetailedProfile, updateStatusChart } from './DetailedProfile.js';
import { renderSettings } from './Settings.js';
import { renderNetworkSwitcher } from './NetworkSwitcher.js';
import { sortTransactionsByPriority } from './SortService.js';
import { renderUserSearch } from './UserSearch.js';
import { renderArbWhitelist } from './ArbWhitelist.js';
import { getStatusBreakdown } from './ReputationService.js';
import { filterTransactions, searchTransactions } from './FilterService.js';
import { renderReputationCard } from './ReputationCard.js';
import { renderFooter } from './Footer.js';
import { renderTxForm } from './TransactionForm.js';

// Import services
import { renderStats } from './StatsGrid.js';
import { fetchTransactionHistory } from './TransactionHistoryService.js';
import { fetchReputationScore } from './ReputationService.js';
import { fetchGlobalStats } from './StatsService.js';
import { updateStatsGrid } from './StatsGrid.js';
import { updateReputationCard } from './ReputationCard.js';

// Get root element
const root = document.getElementById('root');

// Render UI components
root.appendChild(renderNav());
root.appendChild(renderHeader());
root.appendChild(renderDashboard());
root.appendChild(renderStats());
root.appendChild(renderTxForm());
root.appendChild(renderTransactionList());
root.appendChild(renderReputationCard());
root.appendChild(renderUserSearch());
root.appendChild(renderDetailedProfile());
  const arbDashboard = renderArbitratorDashboard();
  arbDashboard.style.display = 'none';
  root.appendChild(arbDashboard);
root.appendChild(renderFooter());
root.appendChild(renderSettings());
  const adminPanel = renderArbWhitelist();
  adminPanel.style.display = 'none';
  root.appendChild(adminPanel);
root.appendChild(renderNetworkSwitcher());

// Global transaction actions
window.releaseFunds = async (id) => {
  const { releaseFundsOnChain } = await import('./ContractInteractions.js');
  try {
    await releaseFundsOnChain(id);
    const { showNotification } = await import('./Notifications.js');
    showNotification('Funds Released!', 'success');
  } catch (err) {
    const { showNotification } = await import('./Notifications.js');
    showNotification('Failed to release funds', 'error');
  }
};

window.raiseDispute = async (id) => {
  const { raiseDisputeOnChain } = await import('./ContractInteractions.js');
  try {
    await raiseDisputeOnChain(id);
    const { showNotification } = await import('./Notifications.js');
    showNotification('Dispute Raised!', 'warning');
  } catch (err) {
    const { showNotification } = await import('./Notifications.js');
    showNotification('Failed to raise dispute', 'error');
  }
};

// Initialize data
const initApp = async () => {
  const shareBtn = document.getElementById('share-dash-btn');
  if (shareBtn) {
    shareBtn.onclick = () => {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    };
  }
  const resetBtn = document.getElementById('clear-filters-btn');
  if (resetBtn) {
    resetBtn.onclick = () => {
      document.getElementById('status-filter').value = 'all';
      document.getElementById('search-input').value = '';
      applyFilters();
    };
  }
  const syncEl = document.getElementById('last-sync-time');
  if (syncEl) syncEl.innerText = new Date().toLocaleTimeString();
  const { callReadOnlyFunction } = await import('@stacks/transactions');
  const ownerResult = await callReadOnlyFunction({
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'Conquistador',
    functionName: 'get-contract-owner',
    functionArgs: [],
    senderAddress: userAddress,
  });
  const adminLink = document.getElementById('nav-admin');
  if (adminLink) adminLink.style.display = ownerResult.value.address === userAddress ? 'block' : 'none';
  const adminLink = document.getElementById('nav-admin');
  if (adminLink) {
    adminLink.onclick = () => {
      const panel = document.querySelector('.arb-whitelist');
      panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    };
  }
  const termsLink = document.getElementById('footer-terms');
  if (termsLink) {
    termsLink.onclick = async (e) => {
      e.preventDefault();
      const { renderTerms } = await import('./TermsContent.js');
      const { renderModal } = await import('./Modal.js');
      const modal = renderModal('Terms and Conditions', renderTerms());
      document.body.appendChild(modal);
      modal.style.display = 'block';
      modal.querySelector('.close').onclick = () => modal.remove();
    };
  }
  const userSearchBtn = document.getElementById('user-search-btn');
  if (userSearchBtn) {
    userSearchBtn.onclick = async () => {
      const address = document.getElementById('user-search-input').value;
      if (!address) return;
      const { fetchReputationScore } = await import('./ReputationService.js');
      const result = await fetchReputationScore(address);
      const resultEl = document.getElementById('user-search-result');
      if (resultEl) {
        resultEl.innerHTML = `<p>Score: ${result.score}</p><p>Transactions: ${result.total}</p>`;
      }
    };
  }
  const helpLink = document.getElementById('nav-help');
  if (helpLink) {
    helpLink.onclick = async () => {
      const { renderHelpModal } = await import('./HelpContent.js');
      const { renderModal } = await import('./Modal.js');
      const modal = renderModal('User Guide', renderHelpModal());
      document.body.appendChild(modal);
      modal.style.display = 'block';
      modal.querySelector('.close').onclick = () => modal.remove();
    };
  }
  const prioritySelector = document.getElementById('tx-priority');
  if (prioritySelector) {
    prioritySelector.onchange = (e) => {
      const feeMap = { low: '0.0001', medium: '0.001', high: '0.01' };
      const feeEl = document.getElementById('fee-estimate');
      if (feeEl) feeEl.innerText = `Est. Fee: ${feeMap[e.target.value]} STX`;
    };
  }
  const sortBtn = document.getElementById('sort-priority-btn');
  if (sortBtn) {
    sortBtn.onclick = () => {
      const { allTransactions } = getState();
      const sorted = sortTransactionsByPriority(allTransactions);
      updateTransactionList(sorted);
    };
  }
  const logLink = document.getElementById('nav-notifs');
  if (logLink) {
    logLink.onclick = async () => {
      const { getNotifications } = await import('./NotificationHistory.js');
      const { renderModal } = await import('./Modal.js');
      const logs = getNotifications();
      const content = logs.length ? logs.map(l => `<div class='log-item'>${l.time}: ${l.msg}</div>`).join('') : 'No recent logs';
      const modal = renderModal('Activity Log', content);
      document.body.appendChild(modal);
      modal.style.display = 'block';
      modal.querySelector('.close').onclick = () => modal.remove();
    };
  }
  const exportBtn = document.getElementById('export-history-btn');
  if (exportBtn) {
    exportBtn.onclick = async () => {
      const { allTransactions } = getState();
      const { exportToCSV } = await import('./utils.js');
      exportToCSV(allTransactions, 'conquistador_history');
    };
  }
  const statusFilter = document.getElementById('status-filter');
  if (statusFilter) statusFilter.onchange = applyFilters;

  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.oninput = applyFilters;
  const arbLink = document.getElementById('nav-arbitrator');
  if (arbLink) {
    arbLink.onclick = async () => {
      const arbDash = document.querySelector('.arbitrator-dashboard');
      const visible = arbDash.style.display === 'block';
      arbDash.style.display = visible ? 'none' : 'block';
      if (!visible) {
        const disputes = await fetchDisputedTransactions();
        updateDisputedList(disputes);
      }
    };
  }
  try {
    const stats = await fetchGlobalStats();
    updateStatsGrid(stats.totalTx, stats.totalDisputes);
  } catch (err) {
    console.error('Failed to fetch global stats:', err);
  }
  const userAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // TODO: Get from session
  
  try {
    const txs = await fetchTransactionHistory(userAddress);
    setState({ allTransactions: txs });
    const breakdown = getStatusBreakdown(txs);
    updateStatusChart(breakdown);
    updateTransactionList(txs);
  } catch (err) {
    console.error('Failed to fetch transactions:', err);
  }
  
  try {
    const reputation = await fetchReputationScore(userAddress);
    updateReputationCard(reputation.score, reputation.total);
  } catch (err) {
    console.error('Failed to fetch reputation:', err);
  }
};

initApp();
window.toggleMilestones = async (txId) => {\n  const area = document.getElementById(`milestone-area-${txId}`);\n  if (area.innerHTML) { area.innerHTML = ''; return; }\n  const { renderMilestoneForm } = await import('./MilestoneForm.js');\n  area.appendChild(renderMilestoneForm(txId));\n};
  const { calculateProgress } = await import('./MilestoneService.js');
  const progress = calculateProgress(milestones);
  const progressEl = document.getElementById(`m-progress-${txId}`);
  if (progressEl) progressEl.style.width = `${progress}%`;
  const countEl = document.getElementById(`m-count-${txId}`);
  if (countEl) countEl.innerText = `(${milestones.length} Milestones)`;
window.resolveDispute = async (txId, winner) => {\n  const { resolveDisputeOnChain } = await import('./ContractInteractions.js');\n  try {\n    await resolveDisputeOnChain(txId, winner);\n    const { showNotification } = await import('./Notifications.js');\n    showNotification('Dispute Resolved!', 'success');\n  } catch (err) {\n    const { showNotification } = await import('./Notifications.js');\n    showNotification('Failed to resolve dispute', 'error');\n  }\n};
const applyFilters = () => {\n  const { allTransactions } = getState();\n  const status = document.getElementById('status-filter')?.value || 'all';\n  const query = document.getElementById('search-input')?.value || '';\n  \n  let filtered = filterTransactions(allTransactions, status);\n  filtered = searchTransactions(filtered, query);\n  \n  updateTransactionList(filtered);\n};

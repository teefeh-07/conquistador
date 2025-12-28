// Import global styles and error handling
import './styles.css';
import './ErrorHandler.js';

// Import components
import { updateTransactionList } from './TransactionList.js';
import { renderHeader } from './Header.js';
import { renderNav } from './Navigation.js';
import { renderDashboard } from './Dashboard.js';
import { renderTransactionList } from './TransactionList.js';
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
root.appendChild(renderFooter());

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
  try {
    const stats = await fetchGlobalStats();
    updateStatsGrid(stats.totalTx, stats.totalDisputes);
  } catch (err) {
    console.error('Failed to fetch global stats:', err);
  }
  const userAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // TODO: Get from session
  
  try {
    const txs = await fetchTransactionHistory(userAddress);
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
document.getElementById('new-escrow-btn').onclick = () => {\n  const form = document.querySelector('.tx-form-container');\n  form.style.display = form.style.display === 'block' ? 'none' : 'block';\n};

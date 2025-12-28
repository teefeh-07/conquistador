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

window.resolveDispute = async (txId, winner) => {
  const { resolveDisputeOnChain } = await import('./ContractInteractions.js');
  try {
    await resolveDisputeOnChain(txId, winner);
    const { showNotification } = await import('./Notifications.js');
    showNotification('Dispute Resolved!', 'success');
  } catch (err) {
    const { showNotification } = await import('./Notifications.js');
    showNotification('Failed to resolve dispute', 'error');
  }
};

window.toggleMilestones = async (txId) => {
  const area = document.getElementById(`milestone-area-${txId}`);
  if (area.innerHTML) {
    area.innerHTML = '';
    return;
  }
  const { fetchMilestones } = await import('./MilestoneService.js');
  const milestones = await fetchMilestones(txId);
  const { renderMilestoneList } = await import('./MilestoneList.js');
  const { renderMilestoneForm } = await import('./MilestoneForm.js');
  area.appendChild(renderMilestoneList(milestones));
  area.appendChild(renderMilestoneForm(txId));
};

window.viewTxHistory = async (txId) => {
  const { renderModal } = await import('./Modal.js');
  const modal = renderModal(`Transaction #${txId} History`, '<p>Loading history...</p>');
  document.body.appendChild(modal);
  modal.style.display = 'block';
  modal.querySelector('.close').onclick = () => modal.remove();
};

window.completeMilestone = async (txId, mId) => {
  const { completeMilestoneOnChain } = await import('./ContractInteractions.js');
  try {
    await completeMilestoneOnChain(txId, mId);
    const { showNotification } = await import('./Notifications.js');
    showNotification('Milestone Completed!', 'success');
  } catch (err) {
    const { showNotification } = await import('./Notifications.js');
    showNotification('Failed to complete milestone', 'error');
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

  // Set up event listeners that need DOM items
  const newEscrowBtn = document.getElementById('new-escrow-btn');
  if (newEscrowBtn) {
    newEscrowBtn.onclick = () => {
      const form = document.querySelector('.tx-form-container');
      if (form) {
        form.style.display = form.style.display === 'block' ? 'none' : 'block';
      }
    };
  }
};

initApp();

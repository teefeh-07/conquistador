import { renderBadge } from './Badge.js';

export const renderTransactionList = () => {
    const section = document.createElement('section');
    section.className = 'transaction-list';
    section.innerHTML = `
    <div class='list-header'>
      <h5>Transactions</h5>
      <button id='sort-priority-btn'>Sort by Priority</button>
    </div>
    <ul id='tx-list'></ul>
  `;
    return section;
};

export const updateTransactionList = async (transactions) => {
    const list = document.getElementById('tx-list');
    if (!list) return;

    const { formatAddress } = await import('./utils.js');

    list.innerHTML = transactions.map(tx => `
    <li class='tx-item'>
      <div class='tx-info'>
        <span class='tx-id'>#${tx.id}</span>
        <span class='tx-party'>From: ${formatAddress(tx.sender)}</span>
        <span class='tx-party'>To: ${formatAddress(tx.recipient)}</span>
        <span class='tx-amount'>${tx.amount} STX</span>
        <span class='tx-status'>Source: ${renderBadge('Web App', 'source').outerHTML} Status: ${renderBadge(tx.status, tx.status.toLowerCase()).outerHTML}</span> <span class='m-count' id='m-count-${tx.id}'></span>
      </div>
      <div class='tx-actions'>
        <button onclick="window.releaseFunds(${tx.id})" class='btn-release'>Release</button>
        <button onclick="window.raiseDispute(${tx.id})" class='btn-dispute'>Dispute</button>
        <button onclick="window.toggleMilestones(${tx.id})" class='btn-milestones'>Milestones</button>
        <button onclick="window.viewTxHistory(${tx.id})" class='btn-history'>History</button>
      </div>
      <div class='milestone-progress-container'>
        <div class='milestone-progress-bar' id='m-progress-${tx.id}' style='width: 0%'></div>
      </div>
      <div id='milestone-area-${tx.id}' class='milestone-area'></div>
    </li>
  `).join('');
};

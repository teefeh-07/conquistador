import { updateTransactionList } from './TransactionList.js';
console.log('Conquistador initialized');
window.releaseFunds = async (id) => {\n  const { releaseFundsOnChain } = await import('./ContractInteractions.js');\n    await releaseFundsOnChain(id);
  import('./Notifications.js').then(({ showNotification }) => showNotification('Funds Released!', 'success'));\n};
window.raiseDispute = async (id) => {\n  const { raiseDisputeOnChain } = await import('./ContractInteractions.js');\n    await raiseDisputeOnChain(id);
  import('./Notifications.js').then(({ showNotification }) => showNotification('Dispute Raised!', 'warning'));\n};
import { renderNav } from './Navigation.js';
document.getElementById('root').prepend(renderNav());

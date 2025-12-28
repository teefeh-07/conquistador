import { addNotification } from './NotificationHistory.js';
export const showNotification = (msg, type = 'info') => {\n  const notif = document.createElement('div');\n  notif.className = `notification ${type}`;\n  notif.innerText = msg;\n  document.body.appendChild(notif);\n  setTimeout(() => notif.remove(), 3000);\n};
  addNotification(msg, type);

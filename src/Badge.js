export const renderBadge = (text, type = 'default') => {\n  const badge = document.createElement('span');\n  badge.className = `badge badge-${type}`;\n  badge.innerText = text;\n  return badge;\n};

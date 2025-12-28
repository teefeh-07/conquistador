export const renderNav = () => {\n  const nav = document.createElement('nav');\n  nav.innerHTML = '<ul><li>Dashboard</li><li>Transactions</li><li>Profile</li></ul>';\n  return nav;\n};

export const renderLoader = () => {\n  const loader = document.createElement('div');\n  loader.className = 'loader';\n  loader.innerText = 'Loading...';\n  return loader;\n};

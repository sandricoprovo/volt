const updateAppHighlight = (colorCode) => {
  const rootVariables = document.documentElement;
  rootVariables.style.setProperty('--highlight-color', colorCode);
};

export default updateAppHighlight;

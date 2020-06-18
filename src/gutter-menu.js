
const typoTools = require('./typo-tools');

/* eslint max-params: [warn, 6] */
module.exports = (cm, lineN, gutter, e, config, dict) => {
  if (gutter !== config.gutterClass) {
    return;
  }
  if (!window.typoIsSetup) {
    typoTools.setupTypoMenuEnv(cm, dict, config.gutterMarkClass);
  }
  if (window.typoMenuOpen) {
    window.removeTypoMenu();
  }

  const info = cm.lineInfo(lineN);
  if (!info.gutterMarkers) {
    return;
  }

  const words = typoTools.getTypos(config, info);

  window.typoMenuOpen = true;

  if (words.length > 0) {
    const menu = document.createElement('div');
    menu.id = 'typoMenu';
    menu.style.left = e.pageX + 'px';
    menu.style.top = e.pageY + 'px';
    menu.setAttribute('data-lineN', lineN);
    document.body.appendChild(menu);
    const typoItemContainer = document.createElement('div');
    typoItemContainer.className = 'typoItemContainer';
    menu.appendChild(typoItemContainer);
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const typoItem = document.createElement('div');
      typoItem.className = 'typoItem';
      typoItem.setAttribute('data-word', word);
      typoItem.addEventListener('mouseenter', window.showSugMenu);
      typoItem.addEventListener('mouseleave', window.hideSugMenu);
      typoItem.appendChild(document.createTextNode(word));
      typoItemContainer.appendChild(typoItem);
    }
  }
  for (let i = 0; i < words.length; i++) {
    typoTools.addSuggestionMenu(cm, words[i], dict);
  }
};

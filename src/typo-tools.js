
const Promise = require('es6-promise');

module.exports = {
  get: path => {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open('GET', path);
      req.onload = function () {
        if (req.status === 200) {
          resolve(req.response);
        } else {
          reject(Error(req.statusText));
        }
      };
      req.onerror = function () {
        reject(Error('Network Error'));
      };
      req.send();
    });
  },

  insertCSS: config => {
    // create style element to inject into head
    const style = document.createElement('style');
    style.type = 'text/css';

    let typoSelector = '.CodeMirror .cm-' + config.typoClass;
    for (let i = 0; i < config.excludeClasses.length; i++) {
      typoSelector += ':not(.cm-' + config.excludeClasses[i] + ')';
    }

    let css = typoSelector + ' {' + config.typoCSS + '}';
    const gutterCSS = [
      ' .' + config.gutterClass + ' {',
      'width: 20px;',
      'white-space: nowrap;',
      '-moz-box-sizing: content-box;',
      'box-sizing: content-box;',
      '}',
      ' .' + config.gutterMarkClass + ' {',
      'width: 20px;',
      'color: #551A8B;',
      'transition: all 0.2s;',
      '}',
      ' .' + config.gutterMarkClass + ':hover {',
      'cursor: pointer;',
      'color: #885EAD',
      '}'
    ].join('');
    css += gutterCSS;

    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  },

  getTypos: (config, info) => {
    const indices = [];
    const styles = info.handle.styles;
    let i = -1;
    const getTypoIndices = style => {
      i++;
      if (typeof style === 'string') {
        if (style.indexOf(config.typoClass) >= 0) {
          for (let j = 0; j < config.excludeClasses.length; j++) {
            if (style.indexOf(config.excludeClasses[j]) >= 0) {
              return;
            }
          }
          indices.push(i);
        }
      }
      return;
    };
    styles.map(getTypoIndices);

    const words = [];
    for (let i = 0; i < indices.length; i++) {
      let len;
      if (indices[i] - 3 <= 0) {
        len = styles[indices[i] - 1];
      } else {
        len = styles[indices[i] - 1] - styles[indices[i] - 3];
      }
      const word = info.text.substr(styles[indices[i] - 3], len);
      words.push(word);
    }
    return words;
  },

  // setup environment for typo menus
  setupTypoMenuEnv: (cm, dict, gutterMarkClass) => {
    window.typoIsSetup = true;
    window.removeTypoMenu = () => {
      const menu = document.getElementById('typoMenu');
      document.body.removeChild(menu);
      window.typoMenuOpen = false;
    };
    document.addEventListener('mousedown', e => {
      const keepOpen = (e.target.className.indexOf('typoItem') >= 0 ||
                        e.target.className.indexOf(gutterMarkClass) >= 0) ||
                        e.target.className.indexOf('typoSugItem') >= 0;
      if (!keepOpen && window.typoMenuOpen) {
        window.removeTypoMenu();
      }
    });
    window.showSugMenu = e => {
      const word = e.target.getAttribute('data-word');
      const menu = document.querySelector('.typoSugMenu[data-word = ' +
                                          word + ']');
      menu.style.display = 'inline-block';
    };
    window.hideSugMenu = e => {
      const word = e.target.getAttribute('data-word');
      const menu = document.querySelector('.typoSugMenu[data-word = ' +
                                          word + ']');
      menu.style.display = 'none';
    };
    window.replaceTypo = e => {
      const suggestion = e.target.innerHTML;
      const container = e.target.parentElement;
      const word = container.getAttribute('data-word');
      const lineN = container.parentElement.getAttribute('data-linen');
      const start = cm.getLine(lineN).indexOf(word);
      const end = start + word.length;
      cm.replaceRange(suggestion,
                      {line: lineN, ch: start},
                      {line: lineN, ch: end});
      window.removeTypoMenu();
    };
  },

  addSuggestionMenu: (cm, word, dict) => {
    const container = document.getElementById('typoMenu');
    const sugMenu = document.createElement('div');
    container.appendChild(sugMenu);
    sugMenu.className = 'typoSugMenu';
    sugMenu.setAttribute('data-word', word);
    // const suggestions = dict.suggest(word);
    Promise.resolve(dict.suggest(word)).then(suggestions => {
      if (suggestions.length === 0) {
        sugMenu.innerHTML = 'No suggestions found.';
      } else {
        suggestions.map(suggestion => {
          const typoSugItem = document.createElement('div');
          typoSugItem.className = 'typoSugItem';
          typoSugItem.appendChild(document.createTextNode(suggestion));
          typoSugItem.onclick = window.replaceTypo;
          return sugMenu.appendChild(typoSugItem);
        });
      }
    });
  }
};

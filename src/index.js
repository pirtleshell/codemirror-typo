
const path = require('path');
const urljoin = require('url-join');
const objectAssign = require('object-assign');
const Typo = require('typo-js');
const typoTools = require('./typo-tools');
const gutterClick = require('./gutter-menu');

function codeMirrorTypo(cm, lang, options) {
  if (!cm | !lang) {
    return;
  }

  // config defaults
  let config = {
    dictPath: 'dictionary/' + lang,
    dictFolder: '',
    filename: lang,
    affFile: '',
    dicFile: '',
    typoClass: 'typo',  // will be prefixed with 'cm-'
    typoCSS: 'background: rgba(255,0,0,.25)',
    excludeClasses: ['url', 'comment', 'tag', 'word'],
    gutterClass: 'typoFlags',
    gutterMarkClass: 'typoMark'
  };

  // config overwrites
  if (typeof options === 'string') {
    config.dictPath = options;
  } else if (typeof options === 'object') {
    config = objectAssign(config, options);
  }

  let resolvedPath = '';

  //Cannot use path for urls. Use urljoin instead
  if(config.dictPath.match(/^https?:\/\//i)) {
    resolvedPath = urljoin(config.dictPath, config.dictFolder, '/');
  } else {
    resolvedPath = path.join(config.dictPath, config.dictFolder, '/');
  }

  const dictPath = resolvedPath;
  const affFile = config.affFile ? config.affFile : config.filename;
  const dicFile = config.dicFile ? config.dicFile : config.filename;

  const paths = [dictPath + affFile + '.aff',
                 dictPath + dicFile + '.dic'];

  let dict;
  Promise.all(paths.map(typoTools.get)).then(data => {
    dict = new Typo(lang, data[0], data[1], {platform: 'any'});

    const wordSeparators = ' `~!@#$%^&*()-_=+[]{}\\|;:"<>,./?©';

    try {
      // major credit to @kofifus for the overlay
      // https://plnkr.co/edit/x0y0RSAR9PaYXbH7PSoY?p=preview
      cm.addOverlay({
        token: stream => {
          let ch = stream.peek();
          let word = '';
          if (wordSeparators.indexOf(ch) >= 0) {
            stream.next();
            return null;
          }

          while ((ch = stream.peek()) && wordSeparators.indexOf(ch) < 0) {
            word += ch;
            stream.next();
          }

          if (!dict.check(word)) {
            return config.typoClass;
          }
        }
      });
    } catch (err) {
      console.error(err);
    }
  });

  typoTools.insertCSS(config);

  // gutter markers for typos
  const typoMark = config => {
    const flag = document.createElement('i');
    flag.className = config.gutterMarkClass;
    flag.innerHTML = '🐌';
    return flag;
  };

  // filter for recognizing typo highlights
  const isTypoFilter = style => {
    if (typeof style === 'string') {
      if (style.indexOf(config.typoClass) >= 0) {
        for (let i = 0; i < config.excludeClasses.length; i++) {
          if (style.indexOf(config.excludeClasses[i]) >= 0) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  };

  const markTypos = (editor, line) => {
    if (line.styles) {
      const lineTypos = line.styles.filter(isTypoFilter);
      if (lineTypos.length > 0) {
        editor.setGutterMarker(line, config.gutterClass, typoMark(config));
      } else {
        editor.setGutterMarker(line, config.gutterClass, null);
      }
    } else {
      editor.setGutterMarker(line, config.gutterClass, null);
    }
  };

  // iterate through lines, gutter mark ones containing typos
  const markAllLines = editor => {
    try {
      editor.eachLine(line => markTypos(editor, line));
    } catch (err) {
      console.log(err);
    }
  };

  cm.setOption('gutters', cm.getOption('gutters').concat(config.gutterClass));
  cm.refresh();
  // cm.on('focus', editor => markAllLines(editor));
  cm.on('cursorActivity', editor => markAllLines(editor));

  cm.on('gutterClick', (editor, lineN, gut, e) =>
                          gutterClick(editor, lineN, gut, e, config, dict));
}

module.exports = codeMirrorTypo;

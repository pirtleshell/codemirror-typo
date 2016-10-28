# codemirror-typo
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> :snail: Spellcheck your [CodeMirror](https://codemirror.net/) editor in style with the dictionary of your choice

[Play with a live demo](https://pirtle.xyz/codemirror-typo/demo/).


## Install

**Browser inclusion** - Include `lib/codemirror-typo.min.js` into your `head`:
```html
<script src='codemirror-typo.min.js'></script>
```

This is a minified version of `codemirror-typo`, bundled using [browserify](http://browserify.org/).

**Working in Node** - Install it as a dependency:
```sh
$ npm install --save codemirror-typo
```


## Usage

Locate a [Hunspell dictionary](https://hunspell.github.io/) you'd like to use. You'll need a `*.aff` and `*.dic` for your spellcheck language. Below, there is more [dictionary information](#dictionaries), and a list of [where to get dictionaries](#dictionary-repos).

**Load `lib/codemirror-typo.css` into your `head`:**
```html
<style rel='stylesheet' href='codemirror-typo.css'></style>
```

**Register `codeMirrorTypo`**:

In Node, `require` it:
```js
var codeMirrorTypo = require('codemirror-typo');
```

In the browser, it is registered through adding the `lib/codemirror.min.js` script.

**Now just plug and play!**
```js
var cm = CodeMirror(document.body); // your CodeMirror instance

codeMirrorTypo(cm, lang[, options]);
```

* `cm` - `CodeMirorr` instance to overlay spellchecker
* `lang` - `string` - dictionary language
* `options` - `string` or `object` - optional, either a `string` path to dictionary files or an options object

There are now red highlighted overlays on words not recognized by the dictionary. Upon focus, gutter marks provide a menu of suggestions of close matches from dictionary for easy fixing.


## Dictionaries

`codemirror-typo` uses [typo-js](https://github.com/cfinke/Typo.js/) that makes use of [Hunspell dictionaries](https://hunspell.github.io/), a popular open-source dictionary framework used by Firefox, Google Chrome, LibreOffice and more. These consist of a `*.dic` file of words and a `*.aff` of various spelling rules.

See below for a [list of Hunspell dictionary repos](#dictionary-repos) for downloading `aff` and `dic` files.


## Options Parameters
### Dictionary Path Options

**No Path:**
Passing just `lang` looks for `dictionary/lang/lang.aff` & `dictionary/lang/lang.dic`:
```js
codeMirrorTypo(cm, 'en_US'); // for files in dictionary/en_US/
```

Note that this is a relative path.

**String Path:**
Passing `lang` and a path `string` looks for `path/lang.aff`, `path/lang.dic`:
```js
codeMirrorTypo(cm, 'en_US', 'path/to/dictionary');
```
The path can be **relative, absolute, or an external web address**:
```js
codeMirrorTypo(cm, 'German', 'https://cdn.rawgit.com/titoBouzout/Dictionaries/master/');
```

### Options Object Parameters

`codemirror-typo` follows this schema when looking for dictionary files:

> `dictPath`/`dictFolder`/[`affFile`.aff, `arrFile`.dic]

**Defaults**
```js
{
  dictPath: 'dictionary/' + lang,          // replaced by options parameter if string
  dictFolder: '',                           // optional subdirectory of dictPath

  filename: '',                             // name of both aff and dic file
  affFile: lang,                            // name of aff file, overrides filename
  dicFile: lang,                            // name of dic file, overrides filename

  typoClass: 'typo',                         // CSS class applied to all spelling errors,
                                            // will be prefixed with 'cm-'
  typoCSS: 'background: rgba(255,0,0,.25)'  // CSS applied to typoClass

  gutterClass: 'typoFlags',                 // CSS class and name of CodeMirror gutter
  gutterMarkClass: 'typoMark'               // CSS class of gutter markers
}
```

Note that `dictPath` may be an absolute or relative directory path, or a web address, with or without a trailing `/`.


## Dictionary Repos

* [LibreOffice](https://cgit.freedesktop.org/libreoffice/dictionaries/tree/)
* [@titoBouzout's Dictionaries](https://github.com/titoBouzout/Dictionaries)


## Known Problems

**The gutter markers and spelling suggestions are very much in beta.** They're functional but definitely need improvement. **Suggestions, issues & PR's welcome!**

* **_Long_ load time for spelling suggestion menu**, especially if word is not in dictionary. The menu should render as it's generated, but it is waiting until the whole element exists before rendering it...
* **Gutter marks**: they don't load in as soon as the CodeMirror instance does, and they don't work on lines currently being written.


## TODO:

- [X] dictionary path configuration options
- [X] gutter mark typos
- [X] context menu spelling suggestions
- [X] make and host a [demo](https://pirtle.xyz/codemirror-typo/demo/)
- [ ] better browser compatibility
- [ ] general code cleanup
- [ ] cache an ignore word list aka "Add to dictionary"
- [ ] add devTool for auto-downloading dictionaries


## License

MIT © [Robert Pirtle](https://pirtle.xyz)

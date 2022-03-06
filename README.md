# Resize Frame [![Node.js Package](https://github.com/jamestomasino/resize-frame/actions/workflows/npm-publish.yml/badge.svg?branch=main)](https://github.com/jamestomasino/resize-frame/actions/workflows/npm-publish.yml)

Better resize event management using requestAnimationFrame.

_NOTE: This is in alpha. Tests are not yet working._

## Overview

`resize-frame` sets up one master requestAnimationFrame loop which processes callbacks only when the document or client window change size. Any deviation in `documentElement` properties: `clientHeight`, `clientWidth`, `scrollHeight`, or `scrollWidth` will trigger the callbacks to fire. When the size changes stop the callbacks also stop firing. Multiple callbacks can be added to this resize listener behavior. Callbacks can also be removed from the listener.

## Install

```bash
npm install @jamestomasino/resize-frame
```

## Use

```js
/**
 * Binds a callback function to the resize listener
 *
 * @param {function} func The callback function to trigger on resize
 * @param {boolean} breakOnError If callback function throws an error, remove from resize listener
 */
function addResizeListener(func, breakOnError = false)

/**
 * Remove a callback function from the resize listener
 *
 * @param {function} func The callback function to remove from the resize listener
 */
function removeResizeListener(func)
```

## Example
```js
const { addResizeListener, removeResizeListener } = require('@jamestomasino/resize-frame');

function onResize() {
  console.log('moving')
}

addResizeListener(onResize) // onResize will be called upon change in document or client size
removeResizeListener(onResize) // onResize will no longer be called upon change in document or client size
```

## License

[AGPL-3.0 or later](LICENSE)

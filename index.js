// Generates add and remove listeners for resize events
function resizeFrame() {
  let animationFrame = window.requestAnimationFrame(loop)
  let callbackCollection = []
  let lastDocHeight = -1 // document.documentElement.scrollHeight
  let lastDocWidth = -1 // document.documentElement.scrollWidth
  let lastClientHeight = -1 // document.documentElement.clientHeight
  let lastClientWidth = -1 // document.documentElement.clientWidth

  /**
   * Object that holds a callback function and data about how to handle it
   *
   * @param {function} func The callback function
   * @param {boolean} breakOnError If callback function throws an error, remove from resize listener
   */
  function Callback(func, breakOnError) {
    this.func = func
    this.breakOnError = breakOnError
  }

  /**
   * Determines if any resize has occurred and callbacks exist to initiate a trigger
   */
  function loop () {
    // Only process checks if callback exists
    if (callbackCollection.length) {
      // Only process loop if we are resizing
      const docHeight = document.documentElement.scrollHeight
      const docWidth = document.documentElement.scrollWidth
      const clientHeight = document.documentElement.clientHeight
      const clientWidth = document.documentElement.clientWidth
      switch (false) {
        case (docHeight === lastDocHeight):
        case (docWidth === lastDocWidth):
        case (clientHeight === lastClientHeight):
        case (clientWidth === lastClientWidth):
          lastDocHeight = docHeight
          lastDocWidth = docWidth
          lastClientHeight = clientHeight
          lastClientWidth = clientWidth
          trigger()
      }
    }
    animationFrame = window.requestAnimationFrame(loop)
  }

  /**
   * Fire all callback functions in the callback collection
   */
  function trigger() {
    // Reverse while loop is safer when potentially removing elements from array
    let i=callbackCollection.length
    while(i--) {
      // callback functions are external and could be problematic
      const callback = callbackCollection[i]
      try {
        callback.func()
      } catch (err) {
        if (callback.breakOnError) {
          remove(callback.func)
        } else {
          throw new Error('ResizeFrame: callback error', { cause: err })
        }
      }
    }
  }

  /**
   * Test if callback collection contains a reference to the supplied callback function
   *
   * @param {function} func The function to test for presence in the collection
   * @return {boolean} true if found, false if not found
   */
  function contains(func) {
    return callbackCollection.length && callbackCollection.reduce((prev, callback) => {
      prev || func === callback.func
    }, false)
  }

  /**
   * Binds a callback function to the resize listener
   *
   * @param {function} func The callback function to trigger on resize
   * @param {boolean} breakOnError If callback function throws an error, remove from resize listener
   */
  function addResizeListener(func, breakOnError = false) {
    // Only allow a single instance of a callback function
    if (!contains(func)) {
      // Only allow functions as callbackCollection
      if (typeof func === 'function') {
        callbackCollection.push(new Callback(func, breakOnError))
      }
    }
  }

  /**
   * Remove a callback function from the resize listener
   *
   * @param {function} func The callback function to remove from the resize listener
   */
  function removeResizeListener(func) {
    let i=callbackCollection.length
    while(i--) {
      if (callbackCollection[i].func === func) {
        callbackCollection.splice(i, 1)
        break
      }
    }
  }

  return { addResizeListener, removeResizeListener }
}

module.exports = resizeFrame()

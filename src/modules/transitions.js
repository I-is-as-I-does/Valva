
/* Vâlvă | (c) 2021-22 I-is-as-I-does | MIT License */
/* eslint-disable no-unused-expressions */

import { deflt, profl } from './constants.js'
import { resetDisplay, isHidden } from './utils.js'

function setTransition(elm, type, duration, timing) {
  elm.style.setProperty('transition-property', profl[type].target)
  elm.style.setProperty('transition-timing-function', timing)
  elm.style.setProperty('transition-duration', duration + 'ms')
}

function resetStyle(elm, type) {
  profl[type].toReset.forEach(p => {
    elm.style.setProperty(p, 0)
  })
}

function removeProp(elm, type, key) {

  profl[type][key].forEach(p => {
    elm.style.removeProperty(p)
  })
}


function changeThenAct(parent, child, placeAction, placeCallBack) {
  if (!(parent instanceof Element)) {
    parent = document.body
  }

  var tmpclass = 'm' + Math.random().toString(20).substring(2)
  child.classList.add(tmpclass)

  return new Promise((resolve) => {
    var observer = new MutationObserver(() => {
      if (parent.querySelector('.' + tmpclass)) {
        child.classList.remove(tmpclass)
        observer.disconnect()
        placeCallBack()
        resolve(true)
      }
    })
    observer.observe(parent, {
      childList: true
    })
    placeAction()
  })
}


export function vHide(elm, type = deflt.type, duration = deflt.duration, callback = null, timing = deflt.timing) {
  setTransition(elm, type, duration, timing)
  if (type !== 'fade') {
    elm.style.setProperty('box-sizing', 'border-box')
    elm.style.setProperty('height', elm.offsetHeight + 'px')
    elm.offsetHeight
    elm.style.setProperty('overflow', 'hidden')
  }
  resetStyle(elm, type)
  window.setTimeout(() => {
    elm.style.setProperty('display', 'none')
    removeProp(elm, type, 'removeOut')
    if (typeof callback === 'function') {
      callback()
    }
  }, duration)
}

export function vShow(elm, type = deflt.type, duration = deflt.duration, callback = null, timing = deflt.timing) {
  if (type === 'fade') {
    resetStyle(elm, 'fade')
    resetDisplay(elm)
    setTransition(elm, 'fade', duration, timing)
  } else {
    resetDisplay(elm)
    var height = elm.offsetHeight
    elm.style.setProperty('overflow', 'hidden')
    resetStyle(elm, type)
    elm.offsetHeight
    elm.style.setProperty('box-sizing', 'border-box')
    setTransition(elm, type, duration, timing)
    elm.style.setProperty('height', height + 'px')
  }
  removeProp(elm, type, 'removeInFirst')
  window.setTimeout(() => {
    removeProp(elm, type, 'removeInThen')
    if (typeof callback === 'function') {
      callback()
    }
  }, duration)
}

export function vToggle(elm, type = deflt.type, duration = deflt.duration, callback = null, timing = deflt.timing) {
  if (isHidden(elm)) {
    vShow(elm, type, duration, callback, timing)
  } else {
    vHide(elm, type, duration, callback, timing)
  }
}
export function vTempToggle(elm, type = deflt.type, delay = deflt.delay, duration = deflt.duration, callback = null, timing = deflt.timing) {
  var methods = [vHide, vShow]
  if (isHidden(elm)) {
    methods.reverse()
  }
  var transcallback = function () {
    if (typeof callback === 'function') {
      callback()
    }
    window.setTimeout(() => {
      methods[1](elm, type, duration, callback, timing)
    }, delay)
  }

  methods[0](elm, type, duration, transcallback, timing)
}

export function vToggleResolve(
  elm,
  callback = null,
  type = deflt.type,
  duration = deflt.duration,
  timing = deflt.timing,
  reverse = false
) {
  if (typeof callback !== 'function') {
    callback = function () { }
  }
  var methods = [vHide, vShow]
  if (reverse) {
    methods.reverse()
  }
  methods[0](elm, type, duration, function () {
    Promise.resolve(callback()).then(() => methods[1](elm, type, duration, null, timing))
  }, timing)
}

export function vPlace(
  parent,
  child,
  prepend = false,
  type = deflt.type,
  duration = deflt.duration,
  callback = null,
  timing = deflt.timing
) {
  child.style.setProperty('display', 'none')
  var placeAction
  if (prepend) {
    placeAction = function () {
      parent.prepend(child)
    }
  } else {
    placeAction = function () {
      parent.append(child)
    }
  }

  var placeCallback = function () {
    vShow(child, type, duration, callback, timing)
  }
  changeThenAct(parent, child, placeAction, placeCallback)
}


export function vReplace(oldElm, newElm, duration = deflt.duration, callback = null, timing = deflt.timing) {
  newElm.style.opacity = 0

  var parent = oldElm.parentNode
  var preh = oldElm.offsetHeight
  var placeAction = function () {
    oldElm.replaceWith(newElm)
  }
  var placeCallback = function () {
    vShowAdapt(newElm, preh, duration, callback, timing)
  }
  var transcallback = function () {
    changeThenAct(parent, newElm, placeAction, placeCallback)
  }
  vHide(oldElm, 'fade', duration, transcallback, timing)
}

export function vShowAdapt(elm, prevHeight, duration = deflt.duration, callback = null, timing = deflt.timing) {
  var type = 'ease'
  if (elm.offsetHeight === prevHeight) {
    type = 'fade'
  }
  vShow(elm, type, duration, callback, timing)
}


export function vSplitFlap(elm, text, speed = 20) {
  var ntext = elm.textContent.split('')
  var stext = text.split('')
  var prevLen = ntext.length
  var newLen = stext.length

  var l
  var stop
  var solve
  if (prevLen > newLen) {
    l = prevLen
    stop = 0
    solve = function () {
      if (l > newLen) {
        ntext.pop()
      } else {
        ntext[l - 1] = stext[l - 1]
      }
      l--
    }
  } else {
    l = 0
    stop = newLen
    solve = function () {
      if (l < prevLen) {
        ntext[l] = stext[l]
      } else {
        ntext.push(stext[l])
      }
      l++
    }
  }
  var repl = setInterval(function () {
    solve()
    elm.textContent = ntext.join('')
    if (l === stop) {
      clearInterval(repl)
    }
  }, speed)
}

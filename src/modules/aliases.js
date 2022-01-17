/* Vâlvă | (c) 2021-22 I-is-as-I-does | MIT License */

import { vShow, vHide, vToggle, vTempToggle, vToggleResolve, vPlace, vReplace, vSplitFlap } from './transitions.js'
import { deflt } from './constants.js'

// @doc: Valva v.1 support

export function easeOut(elm, duration = deflt.duration, callback = null, timing = deflt.timing) {
    vHide(elm, 'ease', duration, callback, timing)
}
export function easeIn(elm, duration = deflt.duration, callback = null, timing = deflt.timing) {
    vShow(elm, 'ease', duration, callback, timing)
}
export function easeToggle(elm, duration = deflt.duration, callback = null, timing = deflt.timing) {
    vToggle(elm, 'ease', duration, callback, timing)
}
export function timedEaseToggle(elm, delay = deflt.delay, duration = deflt.duration, callback = null, timing = deflt.timing) {
    vTempToggle(elm, 'ease', delay, duration, callback, timing)
}



export function slideUp(elm, duration = deflt.duration, callback = null, timing = deflt.timing) {
    vHide(elm, 'slide', duration, callback, timing)
}
export function slideDown(elm, duration = deflt.duration, callback = null, timing = deflt.timing) {
    vShow(elm, 'slide', duration, callback, timing)
}
export function slideToggle(elm, duration = deflt.duration, callback = null, timing = deflt.timing) {
    vToggle(elm, 'slide', duration, callback, timing)
}
export function timedSlideToggle(elm, delay = deflt.delay, duration = deflt.duration, callback = null, timing = deflt.timing) {
    vTempToggle(elm, 'slide', delay, duration, callback, timing)
}



export function fadeOut(elm, callback = null, duration = deflt.duration, timing = deflt.timing) {
    vHide(elm, 'fade', duration, callback, timing)
}
export function fadeIn(elm, callback = null, duration = deflt.duration, timing = deflt.timing) {
    vShow(elm, 'fade', duration, callback, timing)
}
export function fadeToggle(elm, callback = null, duration = deflt.duration, timing = deflt.timing) {
    vToggle(elm, 'fade', duration, callback, timing)
}
export function timedFadeToggle(elm, delay = deflt.delay, callback = null, duration = deflt.duration, timing = deflt.timing) {
    vTempToggle(elm, 'fade', delay, duration, callback, timing)
}


export function diversionToggle(elm, callback = null, ease = true, duration = deflt.duration, reverse = false, timing = deflt.timing) {
    var t = ease ? 'ease' : 'slide'
    vToggleResolve(elm, callback, t, duration, timing, reverse)
}

export function insertDiversion(parent, child, prepend = false, ease = true, duration = deflt.duration, callback = null, timing = deflt.timing) {
    var t = ease ? 'ease' : 'slide'
    vPlace(parent, child, prepend, t, duration, callback, timing)
}

export function replaceDiversion(oldElm, newElm, callback, duration = deflt.duration, timing = deflt.timing) {
    vReplace(oldElm, newElm, duration, callback, timing)
}

export function splitFlap(elm, text, speed = deflt.speed) {
    vSplitFlap(elm, text, speed)
}


export * from './transitions.js'
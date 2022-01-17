(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Valva = {}));
})(this, (function (exports) { 'use strict';

    /* Vâlvă | (c) 2021-22 I-is-as-I-does | MIT License */
    const props = {
        spacing: ['padding-top', 'padding-bottom', 'margin-top', 'margin-bottom'],
        transitions: ['transition-duration', 'transition-timing-function', 'transition-property'],
        heights: ['height', 'overflow']
    };

    const slide = {
        target: 'height, margin, padding',
        toReset: ['height'].concat(props.spacing),
        removeInFirst: props.spacing,
        removeInThen: props.heights.concat(props.transitions),
        removeOut: props.heights.concat(props.spacing, props.transitions)
    };

    const fade = {
        target: 'opacity',
        toReset: ['opacity'],
        removeInFirst: ['opacity'],
        removeInThen: props.transitions,
        removeOut: ['opacity'].concat(props.transitions)
    };
    const ease = {
        target: slide.target + ', ' + fade.target,
        toReset: ['opacity'].concat(slide.toReset),
        removeInFirst: props.spacing.concat(['opacity']),
        removeInThen: slide.removeInThen,
        removeOut: ['opacity'].concat(slide.removeOut)
    };

    const profl = {
        slide: slide,
        fade: fade,
        ease: ease
    };

    const deflt = {
        type: 'ease',
        duration: 300,
        callback: null,
        timing: 'ease-in-out',
        delay: 1000, // vTempToggle
        reverse: false, // vToggleResolve
        prepend: false // vPlace
    };

    /* Vâlvă | (c) 2021-22 I-is-as-I-does | MIT License */

    function isHidden(elm) {
      if (!elm) return false
      do {
        if (!(elm instanceof Element)) continue
        if (elm.hidden || !elm.offsetHeight) {
          return true
        }
        var style = window.getComputedStyle(elm);
        if (
          style.width === '0' ||
          style.height === '0' ||
          style.opacity === '0' ||
          style.display === 'none' ||
          style.visibility === 'hidden'
        ) {
          return true
        }
      } while ((elm = elm.parentNode))
      return false
    }


    function resetDisplay(elm) {
      elm.style.removeProperty('display');
      let display = window.getComputedStyle(elm).display;
      if (display === 'none') display = 'block';
      elm.style.display = display;
    }

    function setTransition(elm, type, duration, timing) {
      elm.style.setProperty('transition-property', profl[type].target);
      elm.style.setProperty('transition-timing-function', timing);
      elm.style.setProperty('transition-duration', duration + 'ms');
    }

    function resetStyle(elm, type) {
      profl[type].toReset.forEach(p => {
        elm.style.setProperty(p, 0);
      });
    }

    function removeProp(elm, type, key) {

      profl[type][key].forEach(p => {
        elm.style.removeProperty(p);
      });
    }


    function changeThenAct(parent, child, placeAction, placeCallBack) {
      if (!(parent instanceof Element)) {
        parent = document.body;
      }

      var tmpclass = 'm' + Math.random().toString(20).substring(2);
      child.classList.add(tmpclass);

      return new Promise((resolve) => {
        var observer = new MutationObserver(() => {
          if (parent.querySelector('.' + tmpclass)) {
            child.classList.remove(tmpclass);
            observer.disconnect();
            placeCallBack();
            resolve(true);
          }
        });
        observer.observe(parent, {
          childList: true
        });
        placeAction();
      })
    }


    function vHide(elm, type = deflt.type, duration = deflt.duration, callback = null, timing = deflt.timing) {
      setTransition(elm, type, duration, timing);
      if (type !== 'fade') {
        elm.style.setProperty('box-sizing', 'border-box');
        elm.style.setProperty('height', elm.offsetHeight + 'px');
        elm.offsetHeight;
        elm.style.setProperty('overflow', 'hidden');
      }
      resetStyle(elm, type);
      window.setTimeout(() => {
        elm.style.setProperty('display', 'none');
        removeProp(elm, type, 'removeOut');
        if (typeof callback === 'function') {
          callback();
        }
      }, duration);
    }

    function vShow(elm, type = deflt.type, duration = deflt.duration, callback = null, timing = deflt.timing) {
      if (type === 'fade') {
        resetStyle(elm, 'fade');
        resetDisplay(elm);
        setTransition(elm, 'fade', duration, timing);
      } else {
        resetDisplay(elm);
        var height = elm.offsetHeight;
        elm.style.setProperty('overflow', 'hidden');
        resetStyle(elm, type);
        elm.offsetHeight;
        elm.style.setProperty('box-sizing', 'border-box');
        setTransition(elm, type, duration, timing);
        elm.style.setProperty('height', height + 'px');
      }
      removeProp(elm, type, 'removeInFirst');
      window.setTimeout(() => {
        removeProp(elm, type, 'removeInThen');
        if (typeof callback === 'function') {
          callback();
        }
      }, duration);
    }

    function vToggle(elm, type = deflt.type, duration = deflt.duration, callback = null, timing = deflt.timing) {
      if (isHidden(elm)) {
        vShow(elm, type, duration, callback, timing);
      } else {
        vHide(elm, type, duration, callback, timing);
      }
    }
    function vTempToggle(elm, type = deflt.type, delay = deflt.delay, duration = deflt.duration, callback = null, timing = deflt.timing) {
      var methods = [vHide, vShow];
      if (isHidden(elm)) {
        methods.reverse();
      }
      var transcallback = function () {
        if (typeof callback === 'function') {
          callback();
        }
        window.setTimeout(() => {
          methods[1](elm, type, duration, callback, timing);
        }, delay);
      };

      methods[0](elm, type, duration, transcallback, timing);
    }

    function vToggleResolve(
      elm,
      callback = null,
      type = deflt.type,
      duration = deflt.duration,
      timing = deflt.timing,
      reverse = false
    ) {
      if (typeof callback !== 'function') {
        callback = function () { };
      }
      var methods = [vHide, vShow];
      if (reverse) {
        methods.reverse();
      }
      methods[0](elm, type, duration, function () {
        Promise.resolve(callback()).then(() => methods[1](elm, type, duration, null, timing));
      }, timing);
    }

    function vPlace(
      parent,
      child,
      prepend = false,
      type = deflt.type,
      duration = deflt.duration,
      callback = null,
      timing = deflt.timing
    ) {
      child.style.setProperty('display', 'none');
      var placeAction;
      if (prepend) {
        placeAction = function () {
          parent.prepend(child);
        };
      } else {
        placeAction = function () {
          parent.append(child);
        };
      }

      var placeCallback = function () {
        vShow(child, type, duration, callback, timing);
      };
      changeThenAct(parent, child, placeAction, placeCallback);
    }


    function vReplace(oldElm, newElm, duration = deflt.duration, callback = null, timing = deflt.timing) {
      newElm.style.opacity = 0;

      var parent = oldElm.parentNode;
      var preh = oldElm.offsetHeight;
      var placeAction = function () {
        oldElm.replaceWith(newElm);
      };
      var placeCallback = function () {
        vShowAdapt(newElm, preh, duration, callback, timing);
      };
      var transcallback = function () {
        changeThenAct(parent, newElm, placeAction, placeCallback);
      };
      vHide(oldElm, 'fade', duration, transcallback, timing);
    }

    function vShowAdapt(elm, prevHeight, duration = deflt.duration, callback = null, timing = deflt.timing) {
      var type = 'ease';
      if (elm.offsetHeight === prevHeight) {
        type = 'fade';
      }
      vShow(elm, type, duration, callback, timing);
    }


    function vSplitFlap(elm, text, speed = 20) {
      var ntext = elm.textContent.split('');
      var stext = text.split('');
      var prevLen = ntext.length;
      var newLen = stext.length;

      var l;
      var stop;
      var solve;
      if (prevLen > newLen) {
        l = prevLen;
        stop = 0;
        solve = function () {
          if (l > newLen) {
            ntext.pop();
          } else {
            ntext[l - 1] = stext[l - 1];
          }
          l--;
        };
      } else {
        l = 0;
        stop = newLen;
        solve = function () {
          if (l < prevLen) {
            ntext[l] = stext[l];
          } else {
            ntext.push(stext[l]);
          }
          l++;
        };
      }
      var repl = setInterval(function () {
        solve();
        elm.textContent = ntext.join('');
        if (l === stop) {
          clearInterval(repl);
        }
      }, speed);
    }

    exports.vHide = vHide;
    exports.vPlace = vPlace;
    exports.vReplace = vReplace;
    exports.vShow = vShow;
    exports.vShowAdapt = vShowAdapt;
    exports.vSplitFlap = vSplitFlap;
    exports.vTempToggle = vTempToggle;
    exports.vToggle = vToggle;
    exports.vToggleResolve = vToggleResolve;

    Object.defineProperty(exports, '__esModule', { value: true });

}));

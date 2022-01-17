/* Vâlvă | (c) 2021-22 I-is-as-I-does | MIT License */

export function isHidden(elm) {
  if (!elm) return false
  do {
    if (!(elm instanceof Element)) continue
    if (elm.hidden || !elm.offsetHeight) {
      return true
    }
    var style = window.getComputedStyle(elm)
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


export function resetDisplay(elm) {
  elm.style.removeProperty('display')
  let display = window.getComputedStyle(elm).display
  if (display === 'none') display = 'block'
  elm.style.display = display
}

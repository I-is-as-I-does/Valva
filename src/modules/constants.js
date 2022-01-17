/* Vâlvă | (c) 2021-22 I-is-as-I-does | MIT License */
const props = {
    spacing: ['padding-top', 'padding-bottom', 'margin-top', 'margin-bottom'],
    transitions: ['transition-duration', 'transition-timing-function', 'transition-property'],
    heights: ['height', 'overflow']
}

const slide = {
    target: 'height, margin, padding',
    toReset: ['height'].concat(props.spacing),
    removeInFirst: props.spacing,
    removeInThen: props.heights.concat(props.transitions),
    removeOut: props.heights.concat(props.spacing, props.transitions)
}

const fade = {
    target: 'opacity',
    toReset: ['opacity'],
    removeInFirst: ['opacity'],
    removeInThen: props.transitions,
    removeOut: ['opacity'].concat(props.transitions)
}
const ease = {
    target: slide.target + ', ' + fade.target,
    toReset: ['opacity'].concat(slide.toReset),
    removeInFirst: props.spacing.concat(['opacity']),
    removeInThen: slide.removeInThen,
    removeOut: ['opacity'].concat(slide.removeOut)
}

export const profl = {
    slide: slide,
    fade: fade,
    ease: ease
}

export const deflt = {
    type: 'ease',
    duration: 300,
    callback: null,
    timing: 'ease-in-out',
    delay: 1000, // vTempToggle
    reverse: false, // vToggleResolve
    prepend: false // vPlace
}
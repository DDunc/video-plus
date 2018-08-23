# video-plus
A small, client-side, zero-dependency javascript utilities library for the HTMLVideoElement, written and vended in ES6.

## Categories ##
These utilities can be roughly grouped into three categories.

*1.* Utilities for common needs and cross-platform normalization of the kind that everyone working with video elements will eventually want to create:
`isPlaying, remaining, isFullscreen, removeToggleFullscreen, addToggleFullscreen`

*2.* Positional utilities:
`getElementPosition, isWithin, inViewPercentage`

*3.* Oddball syntactic sugar I've found useful for integrating a raw video element into a framework. My use case has been with Preact and React, but these functions may also be helpful for working with other frameworks as well.
`addListeners, removeListeners, update`



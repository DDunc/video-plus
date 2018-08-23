import fullscreenNormalizer from './fullscreen-normalizer';

function updateElAttr({update, el, attr}) {

  if (typeof update === "function") {
    el[attr] = update({el, attr})

  } else {
    el[attr] = update;
  }
  return el
}

const fullscreenHandler = (e) => !fullscreenNormalizer.isFullscreen()
  ? fullscreenNormalizer.requestFullscreen(e.target) :
  fullscreenNormalizer.exitFullscreen(e.target);

function addToggleFullscreen(el, action, fn = fullscreenHandler) {
  el.addEventListener(action, fn)
}

function removeToggleFullscreen(el, action, fn = fullscreenHandler) {
  el.removeEventListener(action, fn)
}

function getWindowViewport({win = window}) {
  return {
    width: win.innerWidth,
    height: win.innerHeight
  }
}

function selectorOrEl (mysteryParam) {
  return typeof mysteryParam === 'string' ? document.querySelector(mysteryParam) : mysteryParam
}

function getElementPosition({el}) {
  // it's an exotic, we'd prefer to return normal object. Also possible through JSON.parse(JSON.stringify(el)), but this is more explicit/pathetically old-school
  const bounds = el.getBoundingClientRect();

  return {
    top: bounds.top,
    left: bounds.left,
    height:  bounds.height,
    width: bounds.width,
    bottom: bounds.bottom,
    right: bounds.right,
    // conditional here for cross-browser support
    x: bounds.x || bounds.left,
    y: bounds.y || bounds.top
  }
}

function roundedViewPercentage({win = window, el}) {
  const per = win / el;
  return (per >= 1 ? 1 : per) * 100;
}

function roundedView ({num}) {
  let checkedNum = num > 1 ? 1 : num;
  return Math.trunc(checkedNum * 100) < 0 ? 0 : Math.trunc(checkedNum * 100);
}

function isPlaying({el}) {
  return (!el.ended && !el.paused && el.currentTime > 0 && el.readyState > 2)
}

function getCoordsAndEls(active, target) {
  let a = selectorOrEl(active);
  let t = selectorOrEl(target);

  return {
    coords: {
      activeCoords: getElementPosition({el:a}),
      targetCoords: getElementPosition({el:t}),
      activeEl: a,
      targetEl: t
    }
  }
}

function isWithin({activeCoords, targetCoords, activeEl, targetEl}) {
  const a = activeCoords;
  const t = targetCoords;

  const aTotal = {x: a.width + a.x, y: a.height + a.y};
  const tTotal = {x: t.width + t.x, y: t.height + t.y};

  return (tTotal.x > aTotal.x) && (tTotal.y > aTotal.y);

}

function inViewPercentage({win = window, el}) {
  const winD = getWindowViewport({win});
  const elP = getElementPosition({el});
  let hSign = 0;
  let wSign = 0;
  let height;
  let width;

  if (elP.top < 0) {
    hSign = 1;
    height = Math.abs((Math.abs(winD.height - elP.top < 0 ? elP.bottom : elP.top) / elP.height) - hSign);
  }

  if (elP.left < 0) {
    wSign = 1;
    width = Math.abs((Math.abs(winD.width + elP.left < 0 ? elP.right : elP.left) / elP.width) - wSign)
  }

  height = roundedView({num: height ||  (win.innerHeight - elP.top) / elP.height});
  width = roundedView({num: width || (win.innerWidth - elP.left) / elP.width});

  return {
    height: height,
    width:  width
  };
}

const timeLeft = ({duration, currentTime}) => {
  return duration - currentTime;
};

function manipulateEventListeners({events, el, ctx, action, fn}) {
  events.forEach(ev => {
    el[`${action}EventListener`](ev.toLowerCase(), (e) => {
      fn(e, ev)
    })
  })
}

const addListeners = ({events, el, ctx, dispatch, fn = () => {}}) => {
  return manipulateEventListeners({events, el, ctx, action: "add", fn})
};

const removeListeners = ({events, el, ctx, fn = () => {}}) => {
  return manipulateEventListeners({events, el, ctx, action: "remove", fn})
};

export default {
  isPlaying,
  inViewPercentage,
  getElementPosition,
  update: updateElAttr,
  remaining: timeLeft,
  addToggleFullscreen,
  isWithin,
  isFullscreen: fullscreenNormalizer.isFullscreen,
  addListeners,
  removeListeners,
  removeToggleFullscreen
};
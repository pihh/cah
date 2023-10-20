export function scrollTo(elem: any, Y: any, duration: any, easingFunction: any, callback: any) {

  var start = Date.now(),

    from = elem.scrollLeft;

  if (from === Y) {
    callback();
    return; /* Prevent scrolling to the Y point if already there */
  }

  function min(a: any, b: any) {
    return a < b ? a : b;
  }

  function scroll(timestamp: any) {

    var currentTime = Date.now(),
      time = min(1, ((currentTime - start) / duration)),
      easedT = easingFunction(time);

    elem.scrollLeft = (easedT * (Y - from)) + from;

    if (time < 1) requestAnimationFrame(scroll);
    else
      if (callback) callback();
  }

  requestAnimationFrame(scroll)
}


export const easing = {
  // no easing, no acceleration
  linear: function (t: any) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t: any) { return t * t },
  // decelerating to zero velocity
  easeOutQuad: function (t: any) { return t * (2 - t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t: any) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
  // accelerating from zero velocity
  easeInCubic: function (t: any) { return t * t * t },
  // decelerating to zero velocity
  easeOutCubic: function (t: any) { return (--t) * t * t + 1 },
  // acceleration until halfway, then deceleration
  easeInOutCubic: function (t: any) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
  // accelerating from zero velocity
  easeInQuart: function (t: any) { return t * t * t * t },
  // decelerating to zero velocity
  easeOutQuart: function (t: any) { return 1 - (--t) * t * t * t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t: any) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t },
  // accelerating from zero velocity
  easeInQuint: function (t: any) { return t * t * t * t * t },
  // decelerating to zero velocity
  easeOutQuint: function (t: any) { return 1 + (--t) * t * t * t * t },
  // acceleration until halfway, then deceleration
  easeInOutQuint: function (t: any) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t },
  // decelerating to zero velocity
  easeOutCirc: function (t: any) { return Math.sqrt(1 - (--t * t)); }
}

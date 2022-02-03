//
// DETECT TOUCH DEVICES
//
if ('ontouchstart' in document.documentElement) {
  document.documentElement.className += ' touch';
}

//
// SMOOTH SCROLL
//
initSmoothScrolling();

function initSmoothScrolling() {
  if (isCssSmoothSCrollSupported()) {
    document.getElementById('css-support-msg').className = 'supported';
    return;
  }

  var duration = 400;

  var pageUrl = location.hash ?
    stripHash(location.href) :
    location.href;

  delegatedLinkHijacking();

  function delegatedLinkHijacking() {
    document.body.addEventListener('click', onClick, false);

    function onClick(e) {
      if (!isInPageLink(e.target))
        return;

      e.stopPropagation();
      e.preventDefault();

      jump(e.target.hash, {
        duration: duration,
        callback: function() {
          setFocus(e.target.hash);
        }
      });
    }
  }

  function directLinkHijacking() {
    [].slice.call(document.querySelectorAll('a'))
      .filter(isInPageLink)
      .forEach(function(a) {
        a.addEventListener('click', onClick, false);
      });

    function onClick(e) {
      e.stopPropagation();
      e.preventDefault();

      jump(e.target.hash, {
        duration: duration,
      });
    }

  }

  function isInPageLink(n) {
    return n.tagName.toLowerCase() === 'a' &&
      n.hash.length > 0 &&
      stripHash(n.href) === pageUrl;
  }

  function stripHash(url) {
    return url.slice(0, url.lastIndexOf('#'));
  }

  function isCssSmoothSCrollSupported() {
    return 'scrollBehavior' in document.documentElement.style;
  }

  // Adapted from:
  // https://www.nczonline.net/blog/2013/01/15/fixing-skip-to-content-links/
  function setFocus(hash) {
    var element = document.getElementById(hash.substring(1));

    if (element) {
      if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
        element.tabIndex = -1;
      }

      element.focus();
    }
  }

}

function jump(target, options) {
  var
    start = window.pageYOffset,
    opt = {
      duration: options.duration,
      offset: options.offset || 0,
      callback: options.callback,
      easing: options.easing || easeInOutQuad
    },
    distance = typeof target === 'string' ?
    opt.offset + document.querySelector(target).getBoundingClientRect().top :
    target,
    duration = typeof opt.duration === 'function' ?
    opt.duration(distance) :
    opt.duration,
    timeStart, timeElapsed;

  requestAnimationFrame(function(time) {
    timeStart = time;
    loop(time);
  });

  function loop(time) {
    timeElapsed = time - timeStart;

    window.scrollTo(0, opt.easing(timeElapsed, start, distance, duration));

    if (timeElapsed < duration)
      requestAnimationFrame(loop)
    else
      end();
  }

  function end() {
    window.scrollTo(0, start + distance);

    if (typeof opt.callback === 'function')
      opt.callback();
  }
  // Robert Penner's easeInOutQuad - http://robertpenner.com/easing/
  function easeInOutQuad(t, b, c, d) {
    t /= d / 2
    if (t < 1) return c / 2 * t * t + b
    t--
    return -c / 2 * (t * (t - 2) - 1) + b
  }
}

const scores1 = JSON.parse(localStorage.getItem("scores1"));
const scores2 = JSON.parse(localStorage.getItem("scores2"));
const scores3 = JSON.parse(localStorage.getItem("scores3"));
const scores4 = JSON.parse(localStorage.getItem("scores4"));
const scores5 = JSON.parse(localStorage.getItem("scores5"));
const scores6 = JSON.parse(localStorage.getItem("scores6"));
const scores7 = JSON.parse(localStorage.getItem("scores7"));
const parentEl = document.getElementById('type');
const typeEl = document.createElement('span');

function getType() {
  let totalScores = {
    "type1": 0,
    "type2": 0,
    "type3": 0,
    "type4": 0,
    "type5": 0,
    "type6": 0,
    "type7": 0,
    "type8": 0,
    "type9": 0,
  }
  let type = '';
  let max = 0;
    
    for(let i = 1; i <= 7; i++) {
      const scores = JSON.parse(localStorage.getItem("scores" + i));

      for(let j = 0; j < scores.length; j++) {
        let typeName = "type" + (j + 1);

        totalScores[typeName] += scores[j];
      }
    }

    console.log(Object.keys(totalScores))

    for(let item in Object.keys(totalScores)) {
        console.log(Object.values(totalScores)[item])
        let temp = Object.values(totalScores)[item];

        if(temp > max || temp === max) {
            max = temp;
            type = Object.keys(totalScores)[item];
        }
    }

    typeEl.innerHTML = type;
    parentEl.appendChild(typeEl);
}

getType();
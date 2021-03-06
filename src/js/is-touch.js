// определение тач-устройства

'use strict';

(function(){
  const isTouchCapable = 'ontouchstart' in window ||  window.DocumentTouch && document instanceof window.DocumentTouch ||
    navigator.maxTouchPoints > 0 ||  window.navigator.msMaxTouchPoints > 0;

  const cardContainer = document.querySelector('.event-feed__wrapper');

  if (!isTouchCapable) {
    cardContainer.classList.add('event-feed-not-touchscreen');
  }
})();
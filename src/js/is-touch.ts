// определение тач-устройства

'use strict';

(function(){
  const isTouchCapable = true;
      // 'ontouchstart' in window ||
      //window.DocumentTouch && document instanceof window.DocumentTouch ||
    // navigator.maxTouchPoints > 0;

  const cardContainer: HTMLElement | null= document.querySelector('.event-feed__wrapper');

  if (!isTouchCapable && cardContainer) {
    cardContainer.classList.add('event-feed-not-touchscreen');
  }
})();
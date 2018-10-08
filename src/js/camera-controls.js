'use strict';

function initCameraGesture(){

  const camera = document.querySelector('.camera');
  const zoomValueContainer = document.querySelector('.camera__zoom-value');

  let cameraWidth = camera.getBoundingClientRect().width;
  let prevBgSize = + ((getComputedStyle(camera).getPropertyValue('background-size')).slice(0, -1));
  zoomValueContainer.innerHTML = (prevBgSize - 100) + '%';

  let gesture = null;
  let evCache = new Array();
  let prevDiff = -1;

    camera.onpointerdown = pointerdown_handler;
    camera.onpointermove = pointermove_handler;
    camera.onpointerup = pointerup_handler;
    camera.onpointercancel = pointerup_handler;
    camera.onpointerout = pointerup_handler;
    camera.onpointerleave = pointerup_handler;

  function pointerdown_handler(ev) {
    camera.setPointerCapture(ev.pointerId);

    // формируем жест
    gesture = {
      id: ev.pointerId,
      startX: ev.x,
    };

    // записываем в массив
    evCache.push(gesture);

    if (evCache.length === 2) {
      prevDiff = (Math.abs(evCache[0].startX - evCache[1].startX)) * 100 / cameraWidth;
    }
  }

  function pointermove_handler(ev) {
    for (let i = 0; i < evCache.length; i++) {
      if (ev.pointerId === evCache[i].id) {
        evCache[i].startX = ev.x;
        break;
      }
    }

    if (evCache.length === 2) {
      const curDiff = (Math.abs(evCache[0].startX - evCache[1].startX)) * 100 / cameraWidth;
      let increase;
      let currentBgSize;
      if (prevDiff > 0) {
        increase = curDiff - prevDiff;

        if((prevBgSize + increase) < 135) {
          currentBgSize = 135;
        } else {
          currentBgSize = prevBgSize + increase;
        }

        camera.style.backgroundSize = currentBgSize + '%';

        if (curDiff > prevDiff) {
          ev.target.style.border = "5px dashed yellow";
        }
        if (curDiff < prevDiff) {
          ev.target.style.border = "5px dashed black";
        }
      }
      prevDiff = curDiff;
      prevBgSize = currentBgSize;
    }

    if(evCache.length < 2) {
      ev.target.style.border = "5px dashed green";

    }
  }

  function remove_event(ev) {
    for (let i = 0; i < evCache.length; i++) {
      if (evCache[i].id === ev.pointerId) {
        evCache.splice(i, 1);
        break;
      }
    }
  }

  function pointerup_handler(ev) {
    remove_event(ev);
    ev.target.style.border = "2px solid blue";

    if (evCache.length < 2) {
      prevDiff = -1;
      prevBgSize = + ((getComputedStyle(camera).getPropertyValue('background-size')).slice(0, -1));
      console.log(prevBgSize);
      zoomValueContainer.innerHTML = Math.round(prevBgSize - 100) + '%';
    }
  }
}

setTimeout(initCameraGesture, 0);





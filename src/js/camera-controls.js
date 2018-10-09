'use strict';

function initCameraGesture(){

  const camera = document.querySelector('.camera');
  const zoomValueContainer = document.querySelector('.camera__zoom-value');
  const scroll = document.querySelector('.camera__scroll');

  camera.style.touchAction = 'none';
  camera.style.backgroundPositionX = '0px';
  const cameraWidth = camera.getBoundingClientRect().width;
  let prevBgSize = + ((getComputedStyle(camera).getPropertyValue('background-size')).slice(0, -1));


  let prevBgPositionX = + (((getComputedStyle(camera).getPropertyValue('background-position-x')).split('px'))[0]);

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
      startPositionX: prevBgPositionX
    };

    // записываем в массив эвентов
    evCache.push(gesture);

    if (evCache.length === 2) {
      prevDiff = (Math.abs(evCache[0].startX - evCache[1].startX)) * 100 / cameraWidth;
    }
  }

  function pointermove_handler(ev) {
    if (evCache.length === 2) {
      for (let i = 0; i < evCache.length; i++) {
        if (ev.pointerId === evCache[i].id) {
          evCache[i].startX = ev.x;
          break;
        }
      }

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
      }

      prevDiff = curDiff;
      prevBgSize = currentBgSize;
    }

    if(evCache.length < 2) {
      if(!gesture) {
        return
      }

      const { startX, startPositionX } = gesture;
      const { x } = ev;
      const difX = x - startX;
      const prevBgSizePx = (cameraWidth * prevBgSize) / 100;
      const rate = cameraWidth / (prevBgSizePx - cameraWidth); // коэффициент для расчета положения точки-скролла

      // ограничение на левую границу
      if((startPositionX + difX) >= 0) {
        camera.style.backgroundPositionX = '0px';
        prevBgPositionX = 0;
        scroll.style.left = 0;
      }
      // ограничение на правую границу
      else if ((startPositionX + difX) < 0 && Math.abs(startPositionX + difX) >= (prevBgSizePx - cameraWidth)) {
        camera.style.backgroundPositionX = '-' + (prevBgSizePx - cameraWidth).toString() + 'px';
        prevBgPositionX = - (prevBgSizePx - cameraWidth);
        scroll.style.left = (cameraWidth - scroll.getBoundingClientRect().width) + 'px';
      }
      else {
        camera.style.backgroundPositionX = startPositionX + difX + 'px';
        prevBgPositionX = startPositionX + difX;
        scroll.style.left = Math.abs(startPositionX + difX) * rate + 'px';
      }
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

    if (evCache.length < 2) {
      prevDiff = -1;
      prevBgSize = + ((getComputedStyle(camera).getPropertyValue('background-size')).slice(0, -1));
      zoomValueContainer.innerHTML = Math.round(prevBgSize - 100) + '%';
    }
  }
}

setTimeout(initCameraGesture, 0);





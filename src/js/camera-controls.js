'use strict';

function initCameraGesture(){
  const PERCENTAGE_COEF = 100;
  const BG_SIZE_COVER_VALUE = 135; // значение background-size при котором фон покрывает контейнер по высоте

  const camera = document.querySelector('.camera');
  const zoomValueContainer = document.querySelector('.camera__zoom-value');
  const scroll = document.querySelector('.camera__scroll');
  const cameraWidth = camera.getBoundingClientRect().width;

  let prevBgSize = + ((getComputedStyle(camera).getPropertyValue('background-size')).slice(0, -1));
  let prevBgPositionX = + (((getComputedStyle(camera).getPropertyValue('background-position-x')).split('px'))[0]) || 0;
  let gesture = null;
  let evCache = new Array();
  let prevDiff;
  let prevDiffAbs= -1;

  camera.style.touchAction = 'none';

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
      console.log(evCache[1].startX,  evCache[0].startX);



      prevDiffAbs = (Math.abs(evCache[1].startX - evCache[0].startX)) / cameraWidth;
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

      const curDiffAbs = (Math.abs(evCache[1].startX - evCache[0].startX)) / cameraWidth;
      let increase;
      let currentBgSize;
      if (prevDiffAbs > 0) {
        increase = (curDiffAbs - prevDiffAbs) * PERCENTAGE_COEF;

        if((prevBgSize + increase) < BG_SIZE_COVER_VALUE) {
          currentBgSize = BG_SIZE_COVER_VALUE;
        } else {
          currentBgSize = prevBgSize + increase;
        }

        camera.style.backgroundSize = currentBgSize + '%';
      }

      prevDiffAbs = curDiffAbs;
      prevBgSize = currentBgSize;
    }

    if(evCache.length < 2) {
      if(!gesture) {
        return
      }

      const { startX, startPositionX } = gesture;
      const { x } = ev;
      const difX = x - startX;
      const prevBgSizePx = (cameraWidth * prevBgSize) / PERCENTAGE_COEF;
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
      prevDiffAbs = -1;
      prevBgSize = + ((getComputedStyle(camera).getPropertyValue('background-size')).slice(0, -1));
      zoomValueContainer.innerHTML = Math.round(prevBgSize - PERCENTAGE_COEF) + '%';
    }
  }
}

setTimeout(initCameraGesture, 0);

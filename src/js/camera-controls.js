'use strict';

function initCameraGesture(){
  const PERCENTAGE_COEF = 100;
  const BG_SIZE_COVER_VALUE = 135; // значение background-size при котором фон покрывает контейнер по высоте

  const camera = document.querySelector('.camera');
  const zoomValueContainer = document.querySelector('.camera__zoom-value');
  const scroll = document.querySelector('.camera__scroll');
  const cameraWidth = camera.getBoundingClientRect().width;
  const cameraHeight = camera.getBoundingClientRect().height;

  let prevBgSize = + ((getComputedStyle(camera).getPropertyValue('background-size')).slice(0, -1));
  let prevBgPositionX = + (((getComputedStyle(camera).getPropertyValue('background-position-x')).split('px'))[0]) || 0;
  let prevBgPositionY = + (((getComputedStyle(camera).getPropertyValue('background-position-y')).split('px'))[0]) || 0;
  let gesture = null;
  let evCache = new Array();
  let prevDiff = {};

  camera.style.touchAction = 'none';
  camera.setAttribute('touch-action', 'none');

  camera.addEventListener('pointerdown', pointerdownHandler);
  camera.addEventListener('pointermove', pointermoveHandler);
  camera.addEventListener('pointerup', pointerupHandler);
  camera.addEventListener('pointercancel', pointerupHandler);
  camera.addEventListener('pointerout', pointerupHandler);
  camera.addEventListener('pointerleave', pointerupHandler);

  function pointerdownHandler(ev) {
    camera.setPointerCapture(ev.pointerId);

    // формируем жест
    gesture = {
      id: ev.pointerId,
      startX: ev.x,
      startY: ev.y,
      startPositionX: prevBgPositionX,
      startPositionY: prevBgPositionY
    };

    // записываем в массив эвентов
    evCache.push(gesture);

    if (evCache.length === 2) {
      prevDiff.x = (evCache[1].startX - evCache[0].startX);
      prevDiff.y = (evCache[1].startY - evCache[0].startY);


      

      // if(evCache[1].startX > evCache[0].startX) {
      //   prevDiff.centerX = evCache[0].startX + (prevDiff.x / 2);
      //
      // } else {
      //   prevDiff.centerX = evCache[1].startX + (prevDiff.x / 2);
      // }
      //
      // if(evCache[1].startY > evCache[0].startY) {
      //   prevDiff.centerY = evCache[0].startY + (prevDiff.y / 2);
      // } else {
      //   prevDiff.centerY = evCache[1].startY + (prevDiff.y / 2);
      // }
      //
      // console.log(prevDiff);
      // prevDiffX = (evCache[1].startX - evCache[0].startX) / cameraWidth;
    }
  }

  function pointermoveHandler(ev) {
    const initX = prevDiff.x;
    const initY = prevDiff.Y;

    console.log('initDiff', initX, initY);
    console.log('prevDiff', prevDiff);
    if (evCache.length === 2) {
      for (let i = 0; i < evCache.length; i++) {
        if (ev.pointerId === evCache[i].id) {
          evCache[i].startX = ev.x;
          break;
        }
      }
      const curDiff = {};

      curDiff.x = (evCache[1].startX - evCache[0].startX);
      curDiff.y = (evCache[1].startX - evCache[0].startX);

      let increaseX;
      let increaseY;
      let currentBgSize;
      if ( Math.abs(prevDiff.x) > 0) {
        increaseX = ( Math.abs(curDiff.x) - Math.abs(prevDiff.x)) * PERCENTAGE_COEF / cameraWidth;
        increaseY = ( Math.abs(curDiff.y) - Math.abs(prevDiff.y)) * PERCENTAGE_COEF / cameraHeight;

        if((prevBgSize + increaseX) < BG_SIZE_COVER_VALUE) {
          currentBgSize = BG_SIZE_COVER_VALUE;
        } else {
          currentBgSize = prevBgSize + increaseX;
        }

        camera.style.backgroundSize = currentBgSize + '%';
      }

      prevDiff.x = curDiff.x;
      prevBgSize = currentBgSize;

      console.log('prevDiff', prevDiff);
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

  function pointerupHandler(ev) {
    remove_event(ev);

    if (evCache.length < 2) {
      prevDiff.x = -1;
      prevBgSize = + ((getComputedStyle(camera).getPropertyValue('background-size')).slice(0, -1));
      zoomValueContainer.innerHTML = Math.round(prevBgSize - PERCENTAGE_COEF) + '%';
    }
  }
}

setTimeout(initCameraGesture, 0);

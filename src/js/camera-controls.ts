'use strict';
interface PointerInfo {
    id: number,
    startX: number,
    startY: number,
    startPositionX: number;
    startPositionY: number;
}

interface Diff {
  x: number;
  y: number;
}

function initCameraGesture(){
  const PERCENTAGE_COEF = 100;
  const BG_SIZE_COVER_VALUE = 135; // значение background-size при котором фон покрывает контейнер по высоте

  const camera = document.querySelector('.camera') as HTMLElement;
  const zoomValue = document.querySelector('.camera__zoom-value') as HTMLElement;
  const brightValue = document.querySelector('.camera__brightness-value') as HTMLElement;
  const scroll = document.querySelector('.camera__scroll') as HTMLElement;


  const cameraWidth = camera.getBoundingClientRect().width;

  let curBrightness = 50;
  let prevBgSize = + ((getComputedStyle(camera).getPropertyValue('background-size')).slice(0, -1));
  let prevBgPositionX = + (((getComputedStyle(camera).getPropertyValue('background-position-x')).split('px'))[0]) || 0;
  let prevBgPositionY = + (((getComputedStyle(camera).getPropertyValue('background-position-y')).split('px'))[0]) || 0;

  let gesture: PointerInfo | undefined;
  let evCache: PointerInfo[] = [];
  let rotateCache: PointerEvent[] = [];
  let prevDiff = {
    x: 0,
    y: 0
  };
  let initAngle: number | undefined;
  let initBrightness: number | undefined;

  camera.style.touchAction = 'none';
  camera.setAttribute('touch-action', 'none');

  camera.addEventListener('pointerdown', pointerdownHandler);
  camera.addEventListener('pointermove', pointermoveHandler);
  camera.addEventListener('pointerup', pointerupHandler);
  camera.addEventListener('pointercancel', pointerupHandler);
  camera.addEventListener('pointerout', pointerupHandler);
  camera.addEventListener('pointerleave', pointerupHandler);



  function setcurBrightness (value: number) {
    curBrightness = value;

    const curBrightnessDisplayValue = Math.round(value) + '%';

    brightValue.innerHTML = curBrightnessDisplayValue;
    camera.style.filter = 'brightness(' +  curBrightnessDisplayValue + ')';
  }

  function getAngle (ev1: PointerEvent , ev2: PointerEvent) {
    let diffX= (ev1.x - ev2.x);
    let diffY = (ev1.y - ev2.y);
    let angleRad = Math.atan2(diffY, diffX);

    return (angleRad * (180 / Math.PI));
  }

  function applyLimit (value: number, lowLimit: number, hightLimit: number) {
    if(value <= lowLimit) {
      return lowLimit;
    }

    if(value >= hightLimit) {
      return hightLimit;
    }

    return value;
  }

  function processRotate (rotateCache: PointerEvent[]) {
    if(rotateCache.length !== 2) {
      initAngle = undefined;
      initBrightness = undefined;
      return;

    }

    const [ ev1, ev2 ] = rotateCache;
    const angle = getAngle(ev1, ev2);

    if(initAngle === undefined || initBrightness === undefined) {
      initAngle = angle;
      initBrightness = curBrightness;
    } else {
      const difAngle = angle - initAngle;
      const newBrightness = initBrightness + difAngle;

      const limitedNewBrightness = applyLimit(newBrightness, 0, 200);

      setcurBrightness(limitedNewBrightness);
    }

  }

  function pointerdownHandler(ev: PointerEvent) {
    camera.setPointerCapture(ev.pointerId);

    rotateCache.push(ev);

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
    }

  }

  function pointermoveHandler(ev: PointerEvent) {
    for (let i = 0; i < rotateCache.length; i++) {
      if (ev.pointerId === rotateCache[i].pointerId) {

        rotateCache[i] = ev;
      }
    }

    processRotate(rotateCache);

    if (evCache.length === 2) {
      for (let i = 0; i < evCache.length; i++) {
        if (ev.pointerId === evCache[i].id) {

          evCache[i].startX = ev.x;
          evCache[i].startY = ev.y;
          break;
        }
      }

      let curDiff: Diff = {
        x: 0,
        y: 0
      };


      curDiff.x = evCache[1].startX - evCache[0].startX;
      curDiff.y = evCache[1].startY - evCache[0].startY;

      let increaseX;
      let currentBgSize;
      if ( Math.abs(prevDiff.x) > 0) {
        // увеличение фонового изображения, нормированное на ширину блока в %, только по x, т.к. увеличивается пропорционально
        increaseX = (Math.abs(curDiff.x) - Math.abs(prevDiff.x)) * PERCENTAGE_COEF / cameraWidth;


        if((prevBgSize + increaseX) < BG_SIZE_COVER_VALUE) {
          currentBgSize = BG_SIZE_COVER_VALUE;
        } else {
          currentBgSize = prevBgSize + increaseX;
        }

        camera.style.backgroundSize = currentBgSize + '%';
        prevDiff.x = curDiff.x;
        prevBgSize = currentBgSize;
      }


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
        scroll.style.left = '0';
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

  function remove_event(ev: PointerEvent) {
    for (let i = 0; i < evCache.length; i++) {
      if (evCache[i].id === ev.pointerId) {
        evCache.splice(i, 1);
        break;
      }
    }
  }

  function pointerupHandler(ev: PointerEvent) {
    for (let i = 0; i < rotateCache.length; i++) {
      if (rotateCache[i].pointerId === ev.pointerId) {
        rotateCache.splice(i, 1);
        break;
      }
    }


    remove_event(ev);

    if (evCache.length < 2) {
      prevDiff.x = 0;
      prevBgSize = + ((getComputedStyle(camera).getPropertyValue('background-size')).slice(0, -1));
      zoomValue.innerHTML = Math.round(prevBgSize - PERCENTAGE_COEF) + '%';
    }
  }
}

setTimeout(initCameraGesture, 0);

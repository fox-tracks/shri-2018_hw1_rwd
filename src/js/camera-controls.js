'use strict';

function initCameraGesture(){

  // константы - лимиты, коэффициенты
  const PERCENTAGE_COEF = 100;
  const BG_SIZE_COVER_VALUE = 35; // значение background-size при котором фон покрывает контейнер по высоте
  const MIN_BRIGHTNESS = 0;
  const MAX_BRIGHTNESS = 200;

  //переменные
  const camera = document.querySelector('.camera');
  const zoomValue = document.querySelector('.camera__zoom-value');
  const brightValue = document.querySelector('.camera__brightness-value');
  const scroll = document.querySelector('.camera__scroll');
  const cameraWidth = camera.getBoundingClientRect().width;

  let curBrightness = 50; // начальная яркость в соответствии с макетом
  let curZoom = 178; // начальный зум фона (размер, %) в соответствии с макетом
  let prevBgSize = + ((getComputedStyle(camera).getPropertyValue('background-size')).slice(0, -1));
  let prevBgPositionX = + (((getComputedStyle(camera).getPropertyValue('background-position-x')).split('px'))[0]) || 0;
  let prevBgPositionY = + (((getComputedStyle(camera).getPropertyValue('background-position-y')).split('px'))[0]) || 0;
  let gesture = null;
  let evCache = new Array();
  let commonCache = new Array(); // хранилище эвентов от каждого пальца


  let prevDiff = {
    x: 0,
    y: 0
  };


  let initAngle;
  let initBrightness;
  let initDiffX;
  let initZoom;

  camera.style.touchAction = 'none';
  camera.setAttribute('touch-action', 'none');

  // листнеры
  camera.addEventListener('pointerdown', pointerdownHandler);
  camera.addEventListener('pointermove', pointermoveHandler);
  camera.addEventListener('pointerup', pointerupHandler);
  camera.addEventListener('pointercancel', pointerupHandler);
  camera.addEventListener('pointerout', pointerupHandler);
  camera.addEventListener('pointerleave', pointerupHandler);


  // функции

  // устанавливает текущую яркость
  function setCurBrightness (value) {
    curBrightness = value;

    const curBrightnessDisplayValue = Math.round(value) + '%';

    brightValue.innerHTML = curBrightnessDisplayValue;
    camera.style.filter = 'brightness(' +  curBrightnessDisplayValue + ')';
  }

  // устанавливает текущее увеличение/уменьшение
  function setCurrentZoom (value) {
    curZoom = value;

    zoomValue.innerHTML = Math.round(value - PERCENTAGE_COEF) + '%';
    camera.style.backgroundSize = value + '%';
  }

  // рассчитывает угол по координатам евентов
  function getAngle (ev1, ev2) {
    let diffX= (ev1.x - ev2.x);
    let diffY = (ev1.y - ev2.y);
    let angleRad = Math.atan2(diffY, diffX);
    let angleDeg = (angleRad * (180 / Math.PI));

    return angleDeg;
  }

  // рассчитывает разницу по Х координатам евентов
  function getDiffX(ev1, ev2) {
    return (ev1.x - ev2.x);
  }

  // ограничение по лимитам
  function applyLimit (value, lowerLimit, upperLimit) {
    if(value <= lowerLimit) {
      return lowerLimit;
    }

    if(value >= upperLimit) {
      return upperLimit;
    }

    return value;
  }

  // функция поворота
  function processRotate (commonCache) {
    if(commonCache.length !== 2) {
      initAngle = undefined;
      initBrightness = undefined;
      return;
    }

    const [ ev1, ev2 ] = commonCache;
    const angle = getAngle(ev1, ev2);

    if(initAngle === undefined) {
      initAngle = angle;
      initBrightness = curBrightness;
    } else {
      const difAngle = angle - initAngle;
      const newBrightness = initBrightness + difAngle;

      const limitedNewBrightness = applyLimit(Math.abs(newBrightness), MIN_BRIGHTNESS, MAX_BRIGHTNESS);

      setCurBrightness(limitedNewBrightness);
    }
  }

  // функция увеличения/уменьшения
  function processZoom (commonCache) {

    if(commonCache.length !== 2) {
      initDiffX = undefined;
      initZoom = undefined;
      return;
    }

    const [ ev1, ev2 ] = commonCache;
    const diffX = getDiffX(ev1, ev2);

    if(initDiffX === undefined) {
      initDiffX = Math.abs(diffX);
      initZoom = curZoom;
    } else {
      const changeDiffX = Math.abs(diffX) - initDiffX;
      const newZoom = initZoom + (changeDiffX * PERCENTAGE_COEF / cameraWidth);

      const limitedNewZoom = applyLimit(newZoom, (BG_SIZE_COVER_VALUE + PERCENTAGE_COEF), Infinity);

      setCurrentZoom(limitedNewZoom);
    }
  }


  // хэндлер нажатия
  function pointerdownHandler(ev) {
    camera.setPointerCapture(ev.pointerId);

    commonCache.push(ev);

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

  // хэндлер движения
  function pointermoveHandler(ev) {
    for (let i = 0; i < commonCache.length; i++) {
      if (ev.pointerId === commonCache[i].pointerId) {

        commonCache[i] = ev;
      }
    }

    processRotate(commonCache);
    processZoom(commonCache);

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

  function removeEvent(ev) {
    for (let i = 0; i < evCache.length; i++) {
      if (evCache[i].id === ev.pointerId) {
        evCache.splice(i, 1);
        break;
      }
    }
  }

  function pointerupHandler(ev) {
    for (let i = 0; i < commonCache.length; i++) {
      if (commonCache[i].pointerId === ev.pointerId) {
        commonCache.splice(i, 1);
        break;
      }
    }

    removeEvent(ev);

    if (evCache.length < 2) {
      prevDiff.x = 0;
      prevBgSize = + ((getComputedStyle(camera).getPropertyValue('background-size')).slice(0, -1));
    }
  }
}

setTimeout(initCameraGesture, 0);

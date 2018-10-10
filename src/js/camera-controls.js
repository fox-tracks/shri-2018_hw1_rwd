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
  const scrollWidth = scroll.getBoundingClientRect().width;
  const cameraWidth = camera.getBoundingClientRect().width;

  let curBrightness = 50; // начальная яркость в соответствии с макетом
  let curZoom = 178; // начальный зум фона (размер, %) в соответствии с макетом
  let curBgPositionX = 0;


  let commonCache = new Array(); // хранилище эвентов от каждого пальца

  let initAngle;
  let initBrightness;
  let initDiffX;
  let initZoom;
  let initX;
  let initPositionX;

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

  function setScroollPointPosition (value) {
    scroll.style.left = value + 'px';


  }

  // устанавливает текушее положение фона
  function setCurrentPositionX(value) {
    curBgPositionX = value;

    camera.style.backgroundPositionX = value + 'px';
  }

  // рассчитывает угол по координатам евентов
  function getAngle (ev1, ev2) {
    let diffX= (ev1.x - ev2.x);
    let diffY = (ev1.y - ev2.y);
    let angleRad = Math.atan2(diffY, diffX);

    return (angleRad * (180 / Math.PI));
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

  // определяет позицию скролла
  function getScrollPosition (value, lowerLimit, upperLimit) {
    if(value <= lowerLimit) {
      return cameraWidth - scrollWidth;
    }

    if(value >= upperLimit) {
      return upperLimit;
    }

    return cameraWidth * (value / lowerLimit);
  }

  // функция кручение
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

  // функция перемещения по X
  function processTurn (commonCache) {
    if(commonCache.length >= 2) {
      return;
    }
    const [ ev1 ]  = commonCache;
    if(initX === undefined) {
      initX = ev1.x;
      initPositionX = curBgPositionX;
    } else {
      const changeX = ev1.x - initX;
      const newPositionX = initPositionX + changeX;
      const lowerLimit = cameraWidth - (curZoom * cameraWidth) / PERCENTAGE_COEF;
      const upperLimit = 0;
      const limitedNewPositionX  = applyLimit(newPositionX, lowerLimit, upperLimit);

      setCurrentPositionX(limitedNewPositionX);

      const scrollPosition = getScrollPosition(newPositionX, lowerLimit, upperLimit);

      setScroollPointPosition(scrollPosition);
    }
  }

  // хэндлер нажатия
  function pointerdownHandler(ev) {
    camera.setPointerCapture(ev.pointerId);

    commonCache.push(ev);
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
    processTurn (commonCache);
  }

  // хэндлер окончание события
  function pointerupHandler(ev) {
    for (let i = 0; i < commonCache.length; i++) {
      if (commonCache[i].pointerId === ev.pointerId) {
        commonCache.splice(i, 1);
        break;
      }
    }

    initX = undefined;
  }
}

setTimeout(initCameraGesture, 0);

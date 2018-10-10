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
    console.log('commonCache', commonCache);

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

// скрипты
'use strict';

(function () {
  // карточка события
  const events = window.data;
  const template = document.querySelector('template').content.querySelector('article.event-feed__card');
  const cardContainer = document.querySelector('.event-feed__wrapper');

  // генерация виджетов

  // график
  // todo chart.js(canvas, new chart, data, options)

  function createGraph() {
    const IMG_PATH = 'img/'; // относительный путь до картинок
    const IMG_NAMES = [
      'Richdata@1x.png',
      'Richdata@2x.png',
      'Richdata@3x.png',
    ]; // массив с названиями картинок

    const IMG_SRCS = IMG_NAMES.map(img => {
      const srcs = []; // переименовать
      srcs.push(IMG_PATH + img);

      return srcs;
    }); // массив src

    return `<div class="widget__wrap widget__wrap_graph">
                <img class="widget__wrap_graph-img" src="${IMG_SRCS[0]}" srcset="${IMG_SRCS[1]} 2x, ${IMG_SRCS[2]} 3x" width="100%" height="100%" alt="Графики">
            </div>`;
  }

  // климатические характеристики
  function getClimateParams(data) {
    const {temperature, humidity} = data;

    return (`<div class="widget__wrap climate">
        <div class="climate__temperature">Температура: <span class="climate__temperature-value">${temperature} С</span></div>
        <div class="climate__humidity">Влажность : <span class="climate__humidity-value">${humidity}%</span></div>
      </div>`);
  }

  // музыкальный плейер
  function createPlayer(data) {
    const {albumcover, artist, volume} = data;
    const {name, length} = data.track;

    return (`<div class="widget__wrap player">
        <img class="player__album-cover" src="${albumcover}" width="52px" height="53px" alt="Florence & The Machine">
        <div class="player__track-info">
            <span class="player__track-name">${artist} - ${name}</span>
        </div>
        <input class="player__track-bar" type="range" value="31" min="0" max="271">
        <span class="player__track-length">${length}</span>
        <button class="player__back-btn"></button>
        <button class="player__next-btn"></button>
        <input class="player__volume-bar" type="range" value="${volume}" min="0" max="100">
        <span class="player__volume-value">${volume}%</span>
  </div>`);
  }

  // диалоговая панель
  function createDialogue(data) {
    const {buttons} = data;

    return (`<div class="widget__wrap dialogue">
        <button class="dialogue__btn dialogue__btn_agree">${buttons[0]}</button>
        <button class="dialogue__btn dialogue__btn_cancel">${buttons[1]}</button>
      </div>`);
  }

  //виджет камеры

  // картинка вставляется из src
  function createVideo() {
    return `<div class="widget__wrap widget__wrap_cam camera"><div class="camera__scroll"></div></div>
            <div class="camera__controls"> 
                <p class="camera__zoom">Приближение: <span class="camera__zoom-value">78%</span></p>
                <p class="camera__brightness">Яркость: <span class="camera__brightness-value">50%</span></p>
            </div>`;
  }

  function createCardByData(template, dataItem) {
    const card = template.cloneNode(true);
    const {icon} = dataItem;
    const extraContent = card.querySelector('div.card__extra-content');

    card.classList.add('card_icon_' + icon);
    card.classList.add('card_size_' + dataItem.size);
    card.classList.add('event-feed__card_size_' + dataItem.size);
    card.classList.add('card_action_' + dataItem.type);

    card.querySelector('h3.card__title').textContent = dataItem.title;
    card.querySelector('p.card__source').textContent = dataItem.source;
    card.querySelector('p.card__time').textContent = dataItem.time;

    if (dataItem.description !== null) {
      let description = document.createElement('div');
      description.classList.add('card__description');
      description.textContent = dataItem.description;

      extraContent.appendChild(description);
    } else {
      extraContent.style.display = 'none';
    }


    if (dataItem.hasOwnProperty('data')) {
      let widget = document.createElement('div');
      widget.classList.add('card__widget');
      widget.classList.add('widget');

      const {data} = dataItem;

      switch (icon) {
      case 'stats':
        widget.innerHTML = createGraph(data);
        break;
      case 'thermal':
        widget.innerHTML = getClimateParams(data);
        break;
      case 'music':
        widget.innerHTML = createPlayer(data);
        break;
      case 'fridge':
        widget.innerHTML = createDialogue(data);
        break;
      case 'cam':
        widget.innerHTML = createVideo();
        break;
      default:
        break;
      }
      extraContent.appendChild(widget);
    }
    return card;
  }

  function createFragmentWithCards(data) {
    const fragment = document.createDocumentFragment();

    data.forEach(dataItem => {
      const card = createCardByData(template, dataItem);

      fragment.appendChild(card);
    });

    return fragment;
  }

  function renderCards(data) {
    const fragment = createFragmentWithCards(data);
    cardContainer.appendChild(fragment);

    return cardContainer;
  }

  return renderCards(events);
})();

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
// открытие/закрытие главного меню

'use strict';

(function() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mainNav = document.querySelector('.header__nav');

  hamburgerBtn.addEventListener('click', () => {
    mainNav.classList.toggle('header__nav_state_shown');
    hamburgerBtn.classList.toggle('hamburger-btn_action_close')
  });
})();
'use strict';

function initCameraGesture(){
  const PERCENTAGE_COEF = 100;
  const BG_SIZE_COVER_VALUE = 135; // значение background-size при котором фон покрывает контейнер по высоте

  const camera = document.querySelector('.camera');
  const zoomValue = document.querySelector('.camera__zoom-value');
  const brightValue = document.querySelector('.camera__brightness-value');
  const scroll = document.querySelector('.camera__scroll');
  const cameraWidth = camera.getBoundingClientRect().width;
  const cameraHeight = camera.getBoundingClientRect().height;

  let curBrightness = 50;
  let prevBgSize = + ((getComputedStyle(camera).getPropertyValue('background-size')).slice(0, -1));
  let prevBgPositionX = + (((getComputedStyle(camera).getPropertyValue('background-position-x')).split('px'))[0]) || 0;
  let prevBgPositionY = + (((getComputedStyle(camera).getPropertyValue('background-position-y')).split('px'))[0]) || 0;
  let gesture = null;
  let evCache = new Array();
  let rotateCache = new Array();
  let prevDiff = {
    x: 0,
    y: 0
  };
  let initAngle;
  let initBrightness;

  camera.style.touchAction = 'none';
  camera.setAttribute('touch-action', 'none');

  camera.addEventListener('pointerdown', pointerdownHandler);
  camera.addEventListener('pointermove', pointermoveHandler);
  camera.addEventListener('pointerup', pointerupHandler);
  camera.addEventListener('pointercancel', pointerupHandler);
  camera.addEventListener('pointerout', pointerupHandler);
  camera.addEventListener('pointerleave', pointerupHandler);



  function setcurBrightness (value) {
    curBrightness = value;

    const curBrightnessDisplayValue = Math.round(value) + '%';

    brightValue.innerHTML = curBrightnessDisplayValue;
    camera.style.filter = 'brightness(' +  curBrightnessDisplayValue + ')';
  }

  function getAngle (ev1, ev2) {
    let diffX= (ev1.x - ev2.x);
    let diffY = (ev1.y - ev2.y);
    let angleRad = Math.atan2(diffY, diffX);
    let angleDeg = (angleRad * (180 / Math.PI));

    return angleDeg;
  }

  function processRotate (rotateCache) {


    if(rotateCache.length !== 2) {
      initAngle = undefined;
      initBrightness = undefined;
      return;

    }

    const [ ev1, ev2 ] = rotateCache;
    const angle = getAngle(ev1, ev2);


    if(initAngle === undefined) {
      initAngle = angle;
      initBrightness = curBrightness;
    } else {
      const difAngle = angle - initAngle;
      const newBrightnes = initBrightness + difAngle;

      setcurBrightness(newBrightnes);
    }

  }

  function pointerdownHandler(ev) {
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

      const initAngle = getAngle(evCache[1], evCache[0]);
      // console.log(initAngle);
    }

  }

  function pointermoveHandler(ev) {
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

      let curDiff = {};

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
      }

      prevDiff.x = curDiff.x;
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

  function pointerupHandler(ev) {
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
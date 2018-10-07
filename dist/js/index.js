'use strict';

function initCameraGesture(){

  // поворот камеры:
  const camera = document.querySelector('.camera');
  const scroll = document.querySelector('.camera__scroll');
  const cameraWidth = camera.getBoundingClientRect().width;
  const cameraBgSize = getComputedStyle(camera).getPropertyValue('background-size');
  let gesture = null;
  const camState = {
    startPositionX: 0,
    startZoom: + (cameraBgSize.slice(0, -1))
  };

  let evtStorage = new Array();
  let prevDif = -1;

  camera.addEventListener('pointerdown', evt => {
    camera.style.transition = 'none';
    camera.setPointerCapture(evt.pointerId);

    // формируем событие
    gesture = {
      id: evt.pointerId,
      startX: evt.x,
      startPositionX: camState.startPositionX
    };

    // записываем в массив
    evtStorage.push(gesture);

  });

  camera.addEventListener('pointermove', evt => {
    // если в массиве событий 2 реализуем zoom
    if(evtStorage.length === 2) {

      evtStorage.forEach(e => {
        if(!gesture) {
          return
        }

        // если такое событие уже есть в массиве переприсваиваем координаты
        if (evt.pointerId === e.id) {
          e.startX = evt.x;
        }
      });
      const currentDif = Math.abs(evtStorage[0].startX - evtStorage[1].startX);

      if (prevDif > 0) {
        const zoom = (currentDif / cameraWidth) * 100;

        if(currentDif > prevDif) {
          camera.style.backgroundSize = camState.startZoom + zoom + '%';
          camState.startZoom = camState.startZoom + zoom;
        }

        if(currentDif < prevDif) {
          camera.style.backgroundSize = camState.startZoom - zoom + '%';
          camState.startZoom = camState.startZoom - zoom;
        }

        prevDif = currentDif;
      }
    }
    // если событий < 2
    if(evtStorage.length < 2) {
      // проверем есть ли оно
      if(!gesture) {
        return
      }
      // если есть реализуем поворот
      camera.classList.add('camera_moved');
      const cameraMoved = document.querySelector('.camera_moved');
      const { startX, startPositionX } = gesture;
      const { x } = evt;
      let difX = x - startX;

      const cameraBgSizeValue = camState.startZoom;
      const cameraBgSizePx = (cameraWidth * cameraBgSizeValue) / 100;
      const rate = cameraWidth / (cameraBgSizePx - cameraWidth);

      if((startPositionX + difX) >= 0) {
        cameraMoved.style.backgroundPositionX = '0px';
        camState.startPositionX = 0;
        scroll.style.left = 0;
      }
      else if ((startPositionX + difX) < 0 && Math.abs(startPositionX + difX) >= (cameraBgSizePx - cameraWidth)) {
        cameraMoved.style.backgroundPositionX = '-' + (cameraBgSizePx - cameraWidth).toString() + 'px';
        camState.startPositionX = - (cameraBgSizePx - cameraWidth);
        scroll.style.left = (cameraWidth - scroll.getBoundingClientRect().width) + 'px';
      }
      else {
        cameraMoved.style.backgroundPositionX = startPositionX + difX + 'px';
        camState.startPositionX = startPositionX + difX;
        scroll.style.left = Math.abs(startPositionX + difX) * rate + 'px';
      }
    }
  });

  camera.addEventListener('pointerup', () => {
    gesture = null;
  });
  camera.addEventListener('pointercancel', () => {
    gesture = null;
  });



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
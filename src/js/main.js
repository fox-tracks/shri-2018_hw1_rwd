// скрипты

(function() {
  // открытие/закрытие главного меню
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mainNav = document.querySelector('.header__nav');

  hamburgerBtn.addEventListener('click', ()=>{
    mainNav.classList.toggle('header__nav_state_shown');
    hamburgerBtn.classList.toggle('hamburger-btn_action_close')
  });


  // карточка события
  const events = [
        {
            "type": "info",
            "title": "Еженедельный отчет по расходам ресурсов",
            "source": "Сенсоры потребления",
            "time": "19:00, Сегодня",
            "description": "Так держать! За последнюю неделю вы потратили на 10% меньше ресурсов, чем неделей ранее.",
            "icon": "stats",
            "data": {
                "type": "graph",
                "values": [
                    {
                        "electricity": [
                            ["1536883200", 115],
                            ["1536969600", 117],
                            ["1537056000", 117.2],
                            ["1537142400", 118],
                            ["1537228800", 120],
                            ["1537315200", 123],
                            ["1537401600", 129]
                        ]
                    },
                    {
                        "water": [
                            ["1536883200", 40],
                            ["1536969600", 40.2],
                            ["1537056000", 40.5],
                            ["1537142400", 41],
                            ["1537228800", 41.4],
                            ["1537315200", 41.9],
                            ["1537401600", 42.6]
                        ]
                    },
                    {
                        "gas": [
                            ["1536883200", 13],
                            ["1536969600", 13.2],
                            ["1537056000", 13.5],
                            ["1537142400", 13.7],
                            ["1537228800", 14],
                            ["1537315200", 14.2],
                            ["1537401600", 14.5]
                        ]
                    }
                ]
            },
            "size": "l"
        },
        {
            "type": "info",
            "title": "Дверь открыта",
            "source": "Сенсор входной двери",
            "time": "18:50, Сегодня",
            "description": null,
            "icon": "key",
            "size": "s"
        },
        {
            "type": "info",
            "title": "Уборка закончена",
            "source": "Пылесос",
            "time": "18:45, Сегодня",
            "description": null,
            "icon": "robot-cleaner",
            "size": "s"
        },
        {
            "type": "info",
            "title": "Новый пользователь",
            "source": "Роутер",
            "time": "18:45, Сегодня",
            "description": null,
            "icon": "router",
            "size": "s"
        },
        {
            "type": "info",
            "title": "Изменен климатический режим",
            "source": "Сенсор микроклимата",
            "time": "18:30, Сегодня",
            "description": "Установлен климатический режим «Фиджи»",
            "icon": "thermal",
            "size": "m",
            "data": {
                "temperature": 24,
                "humidity": 80
            }
        },
        {
            "type": "critical",
            "title": "Невозможно включить кондиционер",
            "source": "Кондиционер",
            "time": "18:21, Сегодня",
            "description": "В комнате открыто окно, закройте его и повторите попытку",
            "icon": "ac",
            "size": "m"
        },
        {
            "type": "info",
            "title": "Музыка включена",
            "source": "Яндекс.Станция",
            "time": "18:16, Сегодня",
            "description": "Сейчас проигрывается:",
            "icon": "music",
            "size": "m",
            "data": {
                "albumcover": "https://avatars.yandex.net/get-music-content/193823/1820a43e.a.5517056-1/m1000x1000",
                "artist": "Florence & The Machine",
                "track": {
                    "name": "Big God",
                    "length": "4:31"
                },
                "volume": 80
            }
        },
        {
            "type": "info",
            "title": "Заканчивается молоко",
            "source": "Холодильник",
            "time": "17:23, Сегодня",
            "description": "Кажется, в холодильнике заканчивается молоко. Вы хотите добавить его в список покупок?",
            "icon": "fridge",
            "size": "m",
            "data": {
                "buttons": ["Да", "Нет"]
            }
        },
        {
            "type": "info",
            "title": "Зарядка завершена",
            "source": "Оконный сенсор",
            "time": "16:22, Сегодня",
            "description": "Ура! Устройство «Оконный сенсор» снова в строю!",
            "icon": "battery",
            "size": "s"
        },
        {
            "type": "critical",
            "title": "Пылесос застрял",
            "source": "Сенсор движения",
            "time": "16:17, Сегодня",
            "description": "Робопылесос не смог сменить свое местоположение в течение последних 3 минут. Похоже, ему нужна помощь.",
            "icon": "cam",
            "data": {
                "image": "get_it_from_mocks_:3.jpg"
            },
            "size": "l"
        },
        {
            "type": "info",
            "title": "Вода вскипела",
            "source": "Чайник",
            "time": "16:20, Сегодня",
            "description": null,
            "icon": "kettle",
            "size": "s"
        }
    ];
  const template = document.querySelector('template').content.querySelector('article.event-feed__card');
  const cardContainer = document.querySelector('.event-feed__wrapper');

  // генерация виджетов

  // график
  function createGraph () {
    // построение графиков не реализовано, вставлена картинка
    return `<div class="widget__wrap widget_graph"></div>`;
  }

  // климатические характеристики
  function getClimateParams(data) {
    const { temperature, humidity } = data;

    return (`<div class="widget__wrap widget_climat">
        <div class="climat-widget__temperature">Температура: <span>${temperature} С</span></div>
        <div class="climat-widget__humidity">Влажность : <span>${humidity}%</span></div>
      </div>`);
  }

  // музыкальный плейер
  function createPlayer(data) {
    const { albumcover, artist, volume } = data;

    const { name, length } = data.track;

    return (`<div class="widget__wrap widget_player">
    <div class="player-widget__player">
        <img class="player-widget__album-cover" src="${albumcover}" width="52px" height="53px" alt="Обложка альбома">
        <span class="player-widget__artist">${artist} - </span>
        <span class="player-widget__track-name">${name}</span>
        <div class="player-widget__track-progress-bar">
            <input class="player-widget__track-bar" type="range" value="31" min="0" max="271">
            <span class="player-widget__track-length">${length}</span>
        </div>
    </div>
    <div class="player-widget__controls">
        <button class="player-widget__begin-btn"></button>
        <button class="player-widget__end-btn"></button>
        <div class="player-widget__volume-progress-bar">
            <input class="player-widget__volume-bar" type="range" value="${volume}" min="0" max="100">
            <span class="player-widget__volume-value">${volume}</span>
        </div>
    </div>
  </div>`);
  }

  // диалоговая панель
  function createDialog(data) {
    const { buttons } = data;

    return (`<div class="widget__wrap widget_dialog">
        <button class="dialog-widget__agree-btn">${buttons[0]}</button>
        <button class="dialog-widget__cancel-btn">${buttons[1]}</button>
      </div>`);
  }

  //виджет камеры

 // картинка вставляется из src
  function createVideo() {

    const IMG_PATH = 'img/'; // относительный путь до картинок
    const IMG_NAMES = [
      'BitMap@1x.png',
      'BitMap@2x.png',
      'BitMap@3x.png',
    ]; // массив с названиями картинок

    const IMG_SRCS = IMG_NAMES.map(img => {
      const arr= []; // переименовать
      arr.push(IMG_PATH + img)

      return arr ;
    }); // массив src

    console.log(IMG_SRCS);

    return (`<div class="widget__wrap widget_cam">
        <img class="cam-widget__image" src="${IMG_SRCS[0]}" srcset="${IMG_SRCS[1]} 2x, ${IMG_SRCS[2]} 3x" width="100%" height="100%" alt="Камера">
      </div>`);
  }

  function createCardByData (template, dataItem) {
    const card = template.cloneNode(true);
    const { icon } = dataItem;
    const extraContent = card.querySelector('div.card__extra-content');

    card.classList.add('card_icon_' + icon);
    card.classList.add('card_size_' + dataItem.size);
    card.classList.add('card_action_' + dataItem.type);

    card.querySelector('h3.card__title').textContent = dataItem.title;
    card.querySelector('p.card__source').textContent = dataItem.source;
    card.querySelector('p.card__time').textContent = dataItem.time;

    if(dataItem.description !== null) {
      let description = document.createElement('div');
      description.classList.add('card__description');
      description.textContent = dataItem.description;

      extraContent.appendChild(description);
    } else {
      extraContent.style.display = 'none';
    }


    if(dataItem.hasOwnProperty('data')) {
      let widget = document.createElement('div');
      widget.classList.add('card__widget');
      widget.classList.add('widget');

      const {data} = dataItem;

      switch (icon) {
      case 'stats':
        widget.innerHTML = createGraph();
        console.log(widget);
        break;
      case 'thermal':
        widget.innerHTML = getClimateParams(data);
        break;
      case 'music':
        widget.innerHTML = createPlayer(data);
        break;
      case 'fridge':
        widget.innerHTML = createDialog(data);
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

  function renderCards (data) {
    const fragment = createFragmentWithCards(data);
    cardContainer.appendChild(fragment);

    return cardContainer;
  }

  return renderCards(events);
})();

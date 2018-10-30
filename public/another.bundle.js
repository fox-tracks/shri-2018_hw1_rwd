/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/card-template.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/card-template.ts":
/*!*********************************!*\
  !*** ./src/js/card-template.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// скрипты

Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __webpack_require__(/*! ./data/events */ "./src/js/data/events.ts");
function requireSelector(parent, selector) {
    const element = parent.querySelector(selector);
    if (!(element instanceof HTMLElement)) {
        throw new Error();
    }
    return element;
}
(function () {
    // карточка события
    const events = events_1.data;
    const templateElement = document.querySelector('template');
    if (templateElement === null) {
        throw Error;
    }
    const template = requireSelector(templateElement.content, 'article.event-feed__card');
    const cardContainer = document.querySelector('.event-feed__wrapper');
    // генерация виджетов
    // графикs
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
        const { temperature, humidity } = data;
        return (`<div class="widget__wrap climate">
        <div class="climate__temperature">Температура: <span class="climate__temperature-value">${temperature} С</span></div>
        <div class="climate__humidity">Влажность : <span class="climate__humidity-value">${humidity}%</span></div>
      </div>`);
    }
    // музыкальный плейер
    function createPlayer(data) {
        const { albumcover, artist, volume } = data;
        const { name, length } = data.track;
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
        const { buttons } = data;
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
        if (!(card instanceof HTMLElement)) {
            throw new Error();
        }
        const { icon } = dataItem;
        const extraContent = requireSelector(card, 'div.card__extra-content');
        card.classList.add('card_icon_' + icon);
        card.classList.add('card_size_' + dataItem.size);
        card.classList.add('event-feed__card_size_' + dataItem.size);
        card.classList.add('card_action_' + dataItem.type);
        requireSelector(card, 'h3.card__title').textContent = dataItem.title;
        requireSelector(card, 'p.card__source').textContent = dataItem.source;
        requireSelector(card, 'p.card__time').textContent = dataItem.time;
        if (dataItem.description !== null) {
            let description = document.createElement('div');
            description.classList.add('card__description');
            description.textContent = dataItem.description;
            extraContent.appendChild(description);
        }
        else {
            extraContent.style.display = 'none';
        }
        if (dataItem.hasOwnProperty('data')) {
            let widget = document.createElement('div');
            widget.classList.add('card__widget');
            widget.classList.add('widget');
            const { data } = dataItem;
            switch (icon) {
                case 'stats':
                    widget.innerHTML = createGraph();
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
        if (cardContainer) {
            cardContainer.appendChild(fragment);
            return cardContainer;
        }
    }
    return renderCards(events);
})();


/***/ }),

/***/ "./src/js/data/events.ts":
/*!*******************************!*\
  !*** ./src/js/data/events.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventType;
(function (EventType) {
    EventType["info"] = "info";
    EventType["critical"] = "critical";
})(EventType = exports.EventType || (exports.EventType = {}));
var SizeType;
(function (SizeType) {
    SizeType["s"] = "s";
    SizeType["m"] = "m";
    SizeType["l"] = "l";
})(SizeType = exports.SizeType || (exports.SizeType = {}));
exports.data = [
    {
        "type": EventType.info,
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
        "size": SizeType.l
    },
    {
        "type": EventType.info,
        "title": "Дверь открыта",
        "source": "Сенсор входной двери",
        "time": "18:50, Сегодня",
        "description": null,
        "icon": "key",
        "size": SizeType.s
    },
    {
        "type": EventType.info,
        "title": "Уборка закончена",
        "source": "Пылесос",
        "time": "18:45, Сегодня",
        "description": null,
        "icon": "robot-cleaner",
        "size": SizeType.s
    },
    {
        "type": EventType.info,
        "title": "Новый пользователь",
        "source": "Роутер",
        "time": "18:45, Сегодня",
        "description": null,
        "icon": "router",
        "size": SizeType.s
    },
    {
        "type": EventType.info,
        "title": "Изменен климатический режим",
        "source": "Сенсор микроклимата",
        "time": "18:30, Сегодня",
        "description": "Установлен климатический режим «Фиджи»",
        "icon": "thermal",
        "size": SizeType.m,
        "data": {
            "temperature": 24,
            "humidity": 80
        }
    },
    {
        "type": EventType.critical,
        "title": "Невозможно включить кондиционер",
        "source": "Кондиционер",
        "time": "18:21, Сегодня",
        "description": "В комнате открыто окно, закройте его и повторите попытку",
        "icon": "ac",
        "size": SizeType.m
    },
    {
        "type": EventType.info,
        "title": "Музыка включена",
        "source": "Яндекс.Станция",
        "time": "18:16, Сегодня",
        "description": "Сейчас проигрывается:",
        "icon": "music",
        "size": SizeType.m,
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
        "type": EventType.info,
        "title": "Заканчивается молоко",
        "source": "Холодильник",
        "time": "17:23, Сегодня",
        "description": "Кажется, в холодильнике заканчивается молоко. Вы хотите добавить его в список покупок?",
        "icon": "fridge",
        "size": SizeType.m,
        "data": {
            "buttons": ["Да", "Нет"]
        }
    },
    {
        "type": EventType.info,
        "title": "Зарядка завершена",
        "source": "Оконный сенсор",
        "time": "16:22, Сегодня",
        "description": "Ура! Устройство «Оконный сенсор» снова в строю!",
        "icon": "battery",
        "size": SizeType.s
    },
    {
        "type": EventType.critical,
        "title": "Пылесос застрял",
        "source": "Сенсор движения",
        "time": "16:17, Сегодня",
        "description": "Робопылесос не смог сменить свое местоположение в течение последних 3 минут. Похоже, ему нужна помощь.",
        "icon": "cam",
        "data": {
            "image": "get_it_from_mocks_:3.jpg"
        },
        "size": SizeType.l
    },
    {
        "type": EventType.info,
        "title": "Вода вскипела",
        "source": "Чайник",
        "time": "16:20, Сегодня",
        "description": null,
        "icon": "kettle",
        "size": SizeType.s
    }
];


/***/ })

/******/ });
//# sourceMappingURL=another.bundle.js.map
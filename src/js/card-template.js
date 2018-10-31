// скрипты
'use strict';
exports.__esModule = true;
var events_1 = require("./data/events");
var selector_1 = require("./selector");
function createLayout() {
    // карточка события
    var events = events_1.data;
    var templateElement = document.querySelector('template');
    if (templateElement === null) {
        throw Error;
    }
    var template = selector_1.requireSelector(templateElement.content, 'article.event-feed__card');
    var cardContainer = document.querySelector('.event-feed__wrapper');
    // генерация виджетов
    // графикs
    // todo chart.js(canvas, new chart, data, options)
    function createGraph() {
        var IMG_PATH = 'img/'; // относительный путь до картинок
        var IMG_NAMES = [
            'Richdata@1x.png',
            'Richdata@2x.png',
            'Richdata@3x.png',
        ]; // массив с названиями картинок
        var IMG_SRCS = IMG_NAMES.map(function (img) {
            var srcs = []; // переименовать
            srcs.push(IMG_PATH + img);
            return srcs;
        }); // массив src
        return "<div class=\"widget__wrap widget__wrap_graph\">\n                <img class=\"widget__wrap_graph-img\" src=\"" + IMG_SRCS[0] + "\" srcset=\"" + IMG_SRCS[1] + " 2x, " + IMG_SRCS[2] + " 3x\" width=\"100%\" height=\"100%\" alt=\"\u0413\u0440\u0430\u0444\u0438\u043A\u0438\">\n            </div>";
    }
    // климатические характеристики
    function getClimateParams(data) {
        var temperature = data.temperature, humidity = data.humidity;
        return ("<div class=\"widget__wrap climate\">\n        <div class=\"climate__temperature\">\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430: <span class=\"climate__temperature-value\">" + temperature + " \u0421</span></div>\n        <div class=\"climate__humidity\">\u0412\u043B\u0430\u0436\u043D\u043E\u0441\u0442\u044C : <span class=\"climate__humidity-value\">" + humidity + "%</span></div>\n      </div>");
    }
    // музыкальный плейер
    function createPlayer(data) {
        var albumcover = data.albumcover, artist = data.artist, volume = data.volume;
        var _a = data.track, name = _a.name, length = _a.length;
        return ("<div class=\"widget__wrap player\">\n        <img class=\"player__album-cover\" src=\"" + albumcover + "\" width=\"52px\" height=\"53px\" alt=\"Florence & The Machine\">\n        <div class=\"player__track-info\">\n            <span class=\"player__track-name\">" + artist + " - " + name + "</span>\n        </div>\n        <input class=\"player__track-bar\" type=\"range\" value=\"31\" min=\"0\" max=\"271\">\n        <span class=\"player__track-length\">" + length + "</span>\n        <button class=\"player__back-btn\"></button>\n        <button class=\"player__next-btn\"></button>\n        <input class=\"player__volume-bar\" type=\"range\" value=\"" + volume + "\" min=\"0\" max=\"100\">\n        <span class=\"player__volume-value\">" + volume + "%</span>\n  </div>");
    }
    // диалоговая панель
    function createDialogue(data) {
        var buttons = data.buttons;
        return ("<div class=\"widget__wrap dialogue\">\n        <button class=\"dialogue__btn dialogue__btn_agree\">" + buttons[0] + "</button>\n        <button class=\"dialogue__btn dialogue__btn_cancel\">" + buttons[1] + "</button>\n      </div>");
    }
    //виджет камеры
    // картинка вставляется из src
    function createVideo() {
        return "<div class=\"widget__wrap widget__wrap_cam camera\"><div class=\"camera__scroll\"></div></div>\n            <div class=\"camera__controls\"> \n                <p class=\"camera__zoom\">\u041F\u0440\u0438\u0431\u043B\u0438\u0436\u0435\u043D\u0438\u0435: <span class=\"camera__zoom-value\">78%</span></p>\n                <p class=\"camera__brightness\">\u042F\u0440\u043A\u043E\u0441\u0442\u044C: <span class=\"camera__brightness-value\">50%</span></p>\n            </div>";
    }
    function createCardByData(template, dataItem) {
        var card = template.cloneNode(true);
        if (!(card instanceof HTMLElement)) {
            throw new Error();
        }
        var icon = dataItem.icon;
        var extraContent = selector_1.requireSelector(card, 'div.card__extra-content');
        card.classList.add('card_icon_' + icon);
        card.classList.add('card_size_' + dataItem.size);
        card.classList.add('event-feed__card_size_' + dataItem.size);
        card.classList.add('card_action_' + dataItem.type);
        selector_1.requireSelector(card, 'h3.card__title').textContent = dataItem.title;
        selector_1.requireSelector(card, 'p.card__source').textContent = dataItem.source;
        selector_1.requireSelector(card, 'p.card__time').textContent = dataItem.time;
        if (dataItem.description !== null) {
            var description = document.createElement('div');
            description.classList.add('card__description');
            description.textContent = dataItem.description;
            extraContent.appendChild(description);
        }
        else {
            extraContent.style.display = 'none';
        }
        if (dataItem.hasOwnProperty('data')) {
            var widget = document.createElement('div');
            widget.classList.add('card__widget');
            widget.classList.add('widget');
            var data_1 = dataItem.data;
            switch (icon) {
                case 'stats':
                    widget.innerHTML = createGraph();
                    break;
                case 'thermal':
                    widget.innerHTML = getClimateParams(data_1);
                    break;
                case 'music':
                    widget.innerHTML = createPlayer(data_1);
                    break;
                case 'fridge':
                    widget.innerHTML = createDialogue(data_1);
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
        var fragment = document.createDocumentFragment();
        data.forEach(function (dataItem) {
            var card = createCardByData(template, dataItem);
            fragment.appendChild(card);
        });
        return fragment;
    }
    function renderCards(data) {
        var fragment = createFragmentWithCards(data);
        if (cardContainer) {
            cardContainer.appendChild(fragment);
            return cardContainer;
        }
    }
    return renderCards(events);
}
exports.createLayout = createLayout;

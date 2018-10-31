"use strict";
exports.__esModule = true;
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

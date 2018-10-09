# 1.Описание реализации ДЗ - "Адаптивная верстка".

**Описание реализации ДЗ - "Работа с сенсорным пользовательским вводом"** - ниже

Сборка на `gulp`.

Страница на [GitHub pages](https://fox-tracks.github.io/shri-2018_hw1_rwd/dist)

-----------------

## Запуск:

`npm i`
`npm start`


## Описание:
1. Шаблонизация с использованием тега `<template>` для общего контента в карточках, для доп контента использованы шаблонные строки c переменными.
1. При загрузке определяется тип экрана, если touch - на карточках на всех вьюпортах крестик, галочка, затемнение карточки, тень при нажатии видимы,
контенту добавлен отступ справа, что бы не налезал под кнопки. На обычных экранах крестик, стрелочка, затемнение и тень появляются на hover.
1. Сетка на мобильных - блоками, при переходе на `viewport > 680` сетка реализована на гридах с изменением размера `l` - карточек.
Так же на гридах реализован муыкальный плейер.
1. Контент на ширине экрана больше `viewport > 1024` ограничен по ширине для соответствия макету.
1. Изображения: адаптив сделан для картинки в блоке камеры, и в блоке с графиком. (График планировался на chart.js, но пока картинкой).
Все остальные изображения в svg.
1. Типографика: адаптив реализован через `rem`  и `@media`, там где зависимости от ширины не прослеживаются - шрифт задавался по `@media` напрямую в `px`.
1. Карточке камеры изображение добавлено фоном для использования во 2 задании.
Так же **добавлен элемент** - точка - под картинкой камеры для визуализации положения камеры в моменте.


------------------
_todo:_
1. отрисовка графиков с chart.js
2. обрезка заголовков


------------------
# Описание реализации ДЗ - "Работа с сенсорным пользовательским вводом"

ПОКА реализован только поворот и увеличение, кручение  - в процессе

## Описание:
1. Все `pointer events` реализованы на блоке `".camera"` с фоновой картинкой путем изменения свойств `background-size` - для увеличения (жест `pinch zoom`), `background-position` для поворота (жест `drag`), кручение(жест `rotate`) - реализовано с наложением фильтра css-фильтра `brightness`. 
1. События от каждого прикосновения сохраняются в массив событий, устанавливаются исходные значения координат и состояния элемента, которые меняются по соответствующим `pointer events`. 
1. В верстку добавлен элемент `".camera__scroll"` - точка под блоком, которая дает обратную связь для поворота камеры.
1. (В процессе) реализация кручения: вычисление угла по начальным координатам, сравнение с новым углом после поворота, пропорциональное изменение `brightness`


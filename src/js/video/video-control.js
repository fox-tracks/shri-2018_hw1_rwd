'use strict';
exports.__esModule = true;
var selector_1 = require("../selector");
var hls_js_1 = require("hls.js");
var Hls = hls_js_1["default"];
var context, source, analyserNode;
(function controlVideoStream() {
    var streams = ['sosed', 'cat', 'dog', 'hall'];
    // инициализация видео
    function initVideo(video, url) {
        if (Hls.isSupported()) {
            var hls_1 = new Hls();
            hls_1.loadSource(url);
            hls_1.attachMedia(video);
            hls_1.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play();
            });
        }
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.addEventListener('loadedmetadata', function () {
                video.play();
            });
        }
    }
    //выбор стрима
    function selectStream(elem) {
        var key = Number(elem.dataset.key);
        return streams[key - 1];
    }
    // поиск среднего в массиве
    function average(arr) {
        return arr.reduce(function (p, c) { return p + c; }, 0) / arr.length;
    }
    // создание аналайзера
    function createAnalyser(elem) {
        if (!window.webkitAudioContext && !window.AudioContext) {
            alert('Ваш браузер не поддерживает Web Audio API');
        }
        context = new (window.AudioContext || window.webkitAudioContext)();
        source = context.createMediaElementSource(elem);
        analyserNode = new AnalyserNode(context, {
            fftSize: 64,
            maxDecibels: -25,
            minDecibels: -100,
            smoothingTimeConstant: 0.8
        });
        source.connect(analyserNode);
        analyserNode.connect(context.destination);
    }
    // получение среднего значения громкости
    function getVolume(analyserNode) {
        var frequencies = analyserNode.frequencyBinCount;
        var myDataArray = new Uint8Array(frequencies);
        analyserNode.getByteFrequencyData(myDataArray);
        return average(myDataArray) / 128;
    }
    function arrayFrom(nodeList) {
        var res = [];
        nodeList.forEach(function (nodeItem) {
            res.push(nodeItem);
        });
        return res;
    }
    // инитим потоки в каждый тег video
    var videosList = document.querySelectorAll('main .card__video');
    var videos = arrayFrom(videosList);
    if (videos === null) {
        throw new Error();
    }
    videos.forEach(function (video) {
        var streamItem = selectStream(video);
        initVideo(video, "http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2F" + streamItem + "%2Fmaster.m3u8");
    });
    //попап по клику
    var transform;
    var popupVideo;
    var popup = selector_1.requireSelector(document, '.page__popup');
    var page = selector_1.requireSelector(document, '.page');
    var backBtn = selector_1.requireSelector(document, '.popup__back-btn');
    var controls = document.querySelectorAll('.popup__control-wrap');
    var brightnessControl = selector_1.requireSelector(document, '.popup__control_brightness');
    var contrastControl = selector_1.requireSelector(document, '.popup__control_contrast');
    var volume = selector_1.requireSelector(document, '.popup__volume');
    var intervalId;
    videos.forEach(function (video) {
        video.addEventListener('click', function (e) {
            videos.forEach(function (video) {
                video.pause();
            });
            var offsetX = Math.floor(((e.pageX * 100) / page.clientWidth) - 50);
            var offsetY = Math.floor(((e.pageY * 100) / page.clientHeight) - 50);
            if (!(e.target instanceof HTMLVideoElement)) {
                throw new Error();
            }
            var rate = e.target.getBoundingClientRect().height / page.clientHeight;
            popupVideo = selector_1.requireSelector2(popup, '.card__video');
            transform = "translate(" + offsetX + "%, " + offsetY + "%) scale(" + rate + ")";
            popupVideo.style.transform = transform;
            popup.style.display = 'block';
            page.style.overflow = 'hidden';
            popupVideo.style.transform = transform;
            // инитим поток
            var newStreamItem = selectStream(e.target);
            initVideo(popupVideo, "http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2F" + newStreamItem + "%2Fmaster.m3u8");
            setTimeout(function () {
                if (!(popupVideo instanceof HTMLVideoElement)) {
                    throw new Error();
                }
                popupVideo.classList.add('popup__video_full');
                popupVideo.muted = false;
                if (context === undefined) {
                    createAnalyser(popupVideo);
                }
                // функция обновления высоты столбика громкости
                var updateVolumeBar = function () {
                    var averageVolume = getVolume(analyserNode);
                    volume.style.transform = "scaleY(" + averageVolume + ")";
                };
                intervalId = setInterval(updateVolumeBar, 200);
            }, 0);
            setTimeout(function () {
                backBtn.classList.add('popup__back-btn_active');
                controls.forEach(function (control) {
                    control.classList.add('popup__control-wrap_active');
                });
            }, 0);
        });
    });
    // обратная анимация по кнопке назад (Все камеры)
    backBtn.addEventListener('click', function () {
        selector_1.requireSelector(popup, '.card__video').classList.remove('popup__video_full');
        page.style.overflow = 'auto';
        backBtn.classList.remove('popup__back-btn_active');
        controls.forEach(function (control) {
            control.classList.remove('popup__control-wrap_active');
        });
        if (!(popupVideo instanceof HTMLVideoElement)) {
            throw new Error();
        }
        popupVideo.style.transform = transform;
        videos.forEach(function (video) {
            video.play();
        });
        setTimeout(function () {
            popup.style.display = 'none';
            popupVideo.setAttribute('src', '');
            clearInterval(intervalId); // удаляем обновлялку громкости
        }, 5000);
    });
    // фильтры яркость, контраст
    brightnessControl.addEventListener('input', function (e) {
        if (!(e.target instanceof HTMLInputElement)) {
            throw new Error();
        }
        popupVideo.style.filter = "brightness(" + e.target.value + "%)";
    });
    contrastControl.addEventListener('input', function (e) {
        if (!(e.target instanceof HTMLInputElement)) {
            throw new Error();
        }
        popupVideo.style.filter = "contrast(" + e.target.value + "%)";
    });
    // TODO датчик движения
    // открисовка видео на канвас 10*10, получение скриншотов, обход по rgba, скрин сравнить с предыдущим, если изменился цвет - поменять прозрачность, т.о. квадрат в котором движение затемнен.
})();

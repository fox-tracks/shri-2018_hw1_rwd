'use strict';
(function controlVideoStream() {
    var streams = ['sosed', 'cat', 'dog', 'hall'];
    // инициализация видео
    function initVideo(video, url) {
        if (Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
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
        var key = elem.dataset.key;
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
        window.context = new (window.AudioContext || window.webkitAudioContext)();
        window.source = window.context.createMediaElementSource(elem);
        window.analyserNode = new AnalyserNode(window.context, {
            fftSize: 64,
            maxDecibels: -25,
            minDecibels: -100,
            smoothingTimeConstant: 0.8
        });
        window.source.connect(window.analyserNode);
        window.analyserNode.connect(window.context.destination);
    }
    // получение среднего значения громкости
    function getVolume(analyserNode) {
        var frequencies = analyserNode.frequencyBinCount;
        var myDataArray = new Uint8Array(frequencies);
        analyserNode.getByteFrequencyData(myDataArray);
        return average(myDataArray) / 128;
    }
    // инитим потоки в каждый тег video
    var videos = Array.from(document.querySelectorAll('main .card__video'));
    videos.forEach(function (video) {
        var streamItem = selectStream(video);
        initVideo(video, "http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2F" + streamItem + "%2Fmaster.m3u8");
    });
    //попап по клику
    var transform;
    var popupVideo;
    var popup = document.querySelector('.page__popup');
    var page = document.querySelector('.page');
    var backBtn = document.querySelector('.popup__back-btn');
    var controls = document.querySelectorAll('.popup__control-wrap');
    var brightnessControl = document.querySelector('.popup__control_brightness');
    var contrastControl = document.querySelector('.popup__control_contrast');
    var volume = document.querySelector('.popup__volume');
    var intervalId;
    videos.forEach(function (video) {
        video.addEventListener('click', function (e) {
            videos.forEach(function (video) {
                video.pause();
            });
            var offsetX = Math.floor(((e.pageX * 100) / page.clientWidth) - 50);
            var offsetY = Math.floor(((e.pageY * 100) / page.clientHeight) - 50);
            var rate = e.target.getBoundingClientRect().height / page.clientHeight;
            popupVideo = popup.querySelector('.card__video');
            transform = "translate(" + offsetX + "%, " + offsetY + "%) scale(" + rate + ")";
            popupVideo.style.transform = transform;
            popup.style.display = 'block';
            page.style.overflow = 'hidden';
            popupVideo.style.transform = transform;
            // инитим поток
            var newStreamItem = selectStream(e.target);
            initVideo(popupVideo, "http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2F" + newStreamItem + "%2Fmaster.m3u8");
            setTimeout(function () {
                popupVideo.classList.add('popup__video_full');
                popupVideo.muted = false;
                if (window.context === undefined) {
                    createAnalyser(popupVideo);
                }
                // функция обновления высоты столбика громкости
                var updateVolumeBar = function () {
                    var averageVolume = getVolume(window.analyserNode);
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
        popup.querySelector('.card__video').classList.remove('popup__video_full');
        page.style.overflow = 'auto';
        backBtn.classList.remove('popup__back-btn_active');
        controls.forEach(function (control) {
            control.classList.remove('popup__control-wrap_active');
        });
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
        popupVideo.style.filter = "brightness(" + e.target.value + "%)";
    });
    contrastControl.addEventListener('input', function (e) {
        popupVideo.style.filter = "contrast(" + e.target.value + "%)";
    });
    // TODO датчик движения
    // открисовка видео на канвас 10*10, получение скриншотов, обход по rgba, скрин сравнить с предыдущим, если изменился цвет - поменять прозрачность, т.о. квадрат в котором движение затемнен.
})();

'use strict';

(function controlVideoStream() {
  const streams = ['sosed', 'cat', 'dog', 'hall'];


  // инициализация видео
  function initVideo(video, url) {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.addEventListener('loadedmetadata', function () {
        video.play();
      });
    }
  }

  //выбор стрима
  function selectStream(elem) {
    const key = elem.dataset.key;
    return streams[key - 1];
  }

  // поиск среднего в массиве
  function average(arr) {
    return arr.reduce((p, c) => p + c, 0) / arr.length;
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
      smoothingTimeConstant: 0.8,
    });

    window.source.connect(window.analyserNode);
    window.analyserNode.connect(window.context.destination);
  }

  function getVolume(analyserNode) {
    const frequencies = analyserNode.frequencyBinCount;
    const myDataArray = new Uint8Array(frequencies);
    analyserNode.getByteFrequencyData(myDataArray);

    return average(myDataArray) / 128;
  }


  // инитим потоки  каждый тег video
  const videos = Array.from(document.querySelectorAll('main .card__video'));

  videos.forEach(video => {
    const streamItem = selectStream(video);
    initVideo(video, `http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2F${streamItem}%2Fmaster.m3u8`);
  });

  //попап по клику
  let transform;
  let popupVideo;
  const popup = document.querySelector('.page__popup');
  const page = document.querySelector('.page');
  const backBtn = document.querySelector('.popup__back-btn');
  const controls = document.querySelectorAll('.popup__control-wrap');
  const brightnessControl = document.querySelector('.popup__control_brightness');
  const contrastControl = document.querySelector('.popup__control_contrast');
  const volume = document.querySelector('.popup__volume');
  let intervalId;

  videos.forEach(video => {
    video.addEventListener('click', (e) => {
      videos.forEach(video => {
        video.pause();
      });

      const offsetX = Math.floor(((e.pageX * 100) / page.clientWidth) - 50);
      const offsetY = Math.floor(((e.pageY * 100) / page.clientHeight) - 50);
      const rate = e.target.getBoundingClientRect().height / page.clientHeight;


      popupVideo = popup.querySelector('.card__video');
      transform = `translate(${offsetX}%, ${offsetY}%) scale(${rate})`;
      popupVideo.style.transform = transform;

      popup.style.display = 'block';
      page.style.overflow = 'hidden';

      popupVideo.style.transform = transform;

      const newStreamItem = selectStream(e.target);
      initVideo(popupVideo, `http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2F${newStreamItem}%2Fmaster.m3u8`);

      setTimeout(() => {
        popupVideo.classList.add('popup__video_full');
        popupVideo.muted = false;

        if (window.context === undefined) {
          createAnalyser(popupVideo);
        }

        const updateVolumeBar = () => {
          const averageVolume = getVolume(window.analyserNode);
          volume.style.transform = `scaleY(${averageVolume})`;
        };

        intervalId = setInterval(updateVolumeBar, 200);
      }, 0);

      setTimeout(() => {
        backBtn.classList.add('popup__back-btn_active');
        controls.forEach(control => {
          control.classList.add('popup__control-wrap_active');
        });
      }, 0);
    });
  });

  // обратная анимация по кнопке назад (Все камеры)
  backBtn.addEventListener('click', () => {
    popup.querySelector('.card__video').classList.remove('popup__video_full');
    page.style.overflow = 'auto';
    backBtn.classList.remove('popup__back-btn_active');
    controls.forEach(control => {
      control.classList.remove('popup__control-wrap_active');
    });
    popupVideo.style.transform = transform;
    videos.forEach(video => {
      video.play();
    });

    setTimeout(function () {
      popup.style.display = 'none';
      popupVideo.setAttribute('src', '');
      clearInterval(intervalId);
    }, 5000);
  });

  // фильтры
  brightnessControl.addEventListener('change', (e) => {
    popupVideo.style.filter = `brightness(${e.target.value}%)`;
  });

  contrastControl.addEventListener('change', (e) => {
    popupVideo.style.filter = `contrast(${e.target.value}%)`;
  });

  // TODO датчик движения
  // открисовка видео на канвас 10*10, получение скриншотов, обход по rgba, скрин сравнить с предыдущим, если изменился цвет - поменять прозрачность, т.о. квадрат в котором движение затемнен.

})();
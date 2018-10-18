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

  const videos = Array.from(document.querySelectorAll('main .card__video'));

  videos.forEach(video => {
    const streamItem = selectStream(video);
    initVideo(video, `http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2F${streamItem}%2Fmaster.m3u8`);
  });

  function analyzeAudio(elem) {
    const volume = document.querySelector('.popup__volume');

    const context = new (window.AudioContext || window.webkitAudioContext)();
    if (AudioContext) {
      // ...
    } else {
      alert('Ваш браузер не поддерживает Web Audio API');
    }
    const source = context.createMediaElementSource(elem);
    const destination = context.destination;
    const analyserNode = new AnalyserNode(context, {
      fftSize: 256,
      maxDecibels: -25,
      minDecibels: -100,
      smoothingTimeConstant: 0.8,
    });


    source.connect(analyserNode);
    analyserNode.connect(destination);
    setInterval(() => {
      const frequencies = analyserNode.frequencyBinCount;
      const myDataArray = new Uint8Array(frequencies);
      analyserNode.getByteFrequencyData(myDataArray);
      const max = Math.max(...myDataArray);
      console.log(max);


      volume.style.transform = `scaleY(${max})`;
    }, 200);


  }

  //попап
  let transform;
  let popupVideo;
  const popup = document.querySelector('.page__popup');
  const page = document.querySelector('.page');
  const backBtn = document.querySelector('.popup__back-btn');
  const controls = document.querySelectorAll('.popup__control-wrap');
  const brightnessControl = document.querySelector('.popup__control_brightness');
  const contrastControl = document.querySelector('.popup__control_contrast');

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
        analyzeAudio(popupVideo);
      }, 0);

      setTimeout(() => {
        backBtn.classList.add('popup__back-btn_active');
        controls.forEach(control => {
          control.classList.add('popup__control-wrap_active');
        });
      }, 0);
    });
  });

  // кнопка Все камеры
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
    }, 5000);
  });

  // фильтры
  brightnessControl.addEventListener('change', (e) => {
    popupVideo.style.filter = `brightness(${e.target.value}%)`;
  });

  contrastControl.addEventListener('change', (e) => {
    popupVideo.style.filter = `contrast(${e.target.value}%)`;
  });

  //датчик движения
})();
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

  const videos = Array.from(document.querySelectorAll('.card__video'));

  videos.forEach(video => {
    const streamItem = selectStream(video);
    initVideo(video, `http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2F${streamItem}%2Fmaster.m3u8`);
  });

  function analizeAudio (elem) {
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
      minDecibels: -60,
      smoothingTimeConstant: 0.5,
    });


    source.connect(analyserNode);
    analyserNode.connect(destination);
    // setInterval(() => {
      const frequencies = analyserNode.frequencyBinCount;
      const myDataArray = new Float32Array(frequencies);
      console.log(myDataArray);
    // }, 1000);


  }

  //попап
  let transform;
  let popupVideo;
  const popup = document.querySelector('.page__popup');
  const page = document.querySelector('.page');
  const backBtn = document.querySelector('.popup__back-btn');
  const controls = document.querySelector('.popup__control-wrap');
  const brightnessControl = document.querySelector('.popup__control_brightness');
  const contrastControl = document.querySelector('.popup__control_contrast');

  videos.forEach(video => {
    video.addEventListener('click', (e) => {
      videos.forEach(video => {
        video.pause();
      });

      popup.style.display = 'block';
      page.style.overflow = 'hidden';

      const track = e.target.cloneNode(true);
      const offsetX = Math.floor(((e.pageX * 100) / page.clientWidth) - 50);
      const offsetY = Math.floor(((e.pageY * 100) / page.clientHeight) - 50);
      const rate = e.target.getBoundingClientRect().height / page.clientHeight;
      const newStreamItem = selectStream(e.target);

      popup.insertBefore(track, popup.firstChild);
      popupVideo = popup.querySelector('.card__video');

      initVideo(popupVideo, `http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2F${newStreamItem}%2Fmaster.m3u8`);

      transform = `translate(${offsetX}%, ${offsetY}%) scale(${rate})`;
      popupVideo.style.transform = transform;


      setTimeout(() => {
        track.classList.add('popup__video_full');
        popupVideo.volume = 0.5;
        popupVideo.muted = false;
        analizeAudio(popupVideo);

      }, 0);

      setTimeout(() => {
        backBtn.classList.add('popup__back-btn_active');
        controls.classList.add('popup__controls_active');
      }, 0);
    });
  });

  // кнопка Все камеры
  backBtn.addEventListener('click', () => {
    popup.querySelector('.card__video').classList.remove('popup__video_full');
    backBtn.classList.remove('popup__back-btn_active');
    controls.classList.remove('popup__controls_active');
    popupVideo.style.transform = transform;
    videos.forEach(video => {
      video.play();
    });


    setTimeout(function () {
      popup.style.display = 'none';
      popup.querySelector('.card__video').remove();
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
'use strict';
import {requireSelector, requireSelector2} from '../selector';
import Hls from 'hls.js';


interface MyWindow {
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
    mozAudioContext: typeof AudioContext;
}
declare const window: MyWindow;

let context: AudioContext, source: MediaElementAudioSourceNode, analyserNode: AnalyserNode;

(function controlVideoStream() {
  const streams: string[]= ['sosed', 'cat', 'dog', 'hall'];

  // инициализация видео
  function initVideo(video: HTMLVideoElement, url: string) {
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
  function selectStream(elem: HTMLVideoElement) {
    const key: number = Number(elem.dataset.key);
    return streams[key - 1];
  }

  // поиск среднего в массиве
  function average(arr: Uint8Array) {
    return arr.reduce((p, c) => p + c, 0) / arr.length;
  }

  // создание аналайзера
  function createAnalyser(elem: HTMLVideoElement) {
    if (!window.webkitAudioContext && !window.AudioContext) {
      alert('Ваш браузер не поддерживает Web Audio API');
    }

    context = new (window.AudioContext || window.webkitAudioContext)();
    source = context.createMediaElementSource(elem);

    analyserNode = new AnalyserNode(context, {
      fftSize: 64,
      maxDecibels: -25,
      minDecibels: -100,
      smoothingTimeConstant: 0.8,
    });

    source.connect(analyserNode);
    analyserNode.connect(context.destination);
  }

  // получение среднего значения громкости
  function getVolume(analyserNode: AnalyserNode) {
    const frequencies = analyserNode.frequencyBinCount;
    const myDataArray = new Uint8Array(frequencies);
    analyserNode.getByteFrequencyData(myDataArray);

    return average(myDataArray) / 128;
  }

  function arrayFrom<E extends Element>(nodeList: NodeListOf<E>): E[] {
    const res: E[] = [];

      nodeList.forEach((nodeItem) => {
          res.push(nodeItem)
      });

      return res;
  }

  // инитим потоки в каждый тег video
  const videosList: NodeListOf<HTMLVideoElement> = document.querySelectorAll<HTMLVideoElement>('main .card__video');
  const videos: HTMLVideoElement[] = arrayFrom(videosList);

    if(videos === null) {
        throw new Error();
    }

  videos.forEach(video => {
    const streamItem = selectStream(video);
    initVideo(video, `http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2F${streamItem}%2Fmaster.m3u8`);
  });

  //попап по клику
  let transform: string;
  let popupVideo: HTMLVideoElement;
  const popup = requireSelector(document,'.page__popup');
  const page = requireSelector(document, '.page');
  const backBtn = requireSelector(document,'.popup__back-btn');
  const controls = document.querySelectorAll('.popup__control-wrap');
  const brightnessControl = requireSelector(document,'.popup__control_brightness');
  const contrastControl = requireSelector(document,'.popup__control_contrast');
  const volume = requireSelector(document,'.popup__volume');
  let intervalId: number;

  videos.forEach(video => {
    video.addEventListener('click', (e) => {
      videos.forEach(video => {
        video.pause();
      });

      const offsetX = Math.floor(((e.pageX * 100) / page.clientWidth) - 50);
      const offsetY = Math.floor(((e.pageY * 100) / page.clientHeight) - 50);
      if(!(e.target instanceof HTMLVideoElement)) {
          throw new Error();
      }
      const rate = e.target.getBoundingClientRect().height / page.clientHeight;


      popupVideo = requireSelector2 <HTMLVideoElement>(popup, '.card__video');
      transform = `translate(${offsetX}%, ${offsetY}%) scale(${rate})`;
      popupVideo.style.transform = transform;

      popup.style.display = 'block';
      page.style.overflow = 'hidden';

      popupVideo.style.transform = transform;

      // инитим поток

      const newStreamItem = selectStream(e.target);
      initVideo(popupVideo, `http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2F${newStreamItem}%2Fmaster.m3u8`);

      setTimeout(() => {
        if(!(popupVideo instanceof HTMLVideoElement)) {
            throw new Error();
        }
        popupVideo.classList.add('popup__video_full');
        popupVideo.muted = false;

        if (context === undefined) {
          createAnalyser(popupVideo);
        }

        // функция обновления высоты столбика громкости
        const updateVolumeBar = () => {
          const averageVolume = getVolume(analyserNode);
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
    requireSelector(popup,'.card__video').classList.remove('popup__video_full');
    page.style.overflow = 'auto';
    backBtn.classList.remove('popup__back-btn_active');
    controls.forEach(control => {
      control.classList.remove('popup__control-wrap_active');
    });
    if(!(popupVideo instanceof HTMLVideoElement)) {
        throw new Error();
    }
    popupVideo.style.transform = transform;
    videos.forEach(video => {
      video.play();
    });

    setTimeout(function () {
      popup.style.display = 'none';
      popupVideo.setAttribute('src', '');
      clearInterval(intervalId); // удаляем обновлялку громкости
    }, 5000);
  });

  // фильтры яркость, контраст
  brightnessControl.addEventListener('input', (e) => {
    if(!(e.target instanceof HTMLInputElement)) {
        throw new Error();
    }
    popupVideo.style.filter = `brightness(${e.target.value}%)`;
  });

  contrastControl.addEventListener('input', (e) => {
    if(!(e.target instanceof HTMLInputElement)) {
        throw new Error();
    }
    popupVideo.style.filter = `contrast(${e.target.value}%)`;
  });

  // TODO датчик движения
  // открисовка видео на канвас 10*10, получение скриншотов, обход по rgba, скрин сравнить с предыдущим, если изменился цвет - поменять прозрачность, т.о. квадрат в котором движение затемнен.

})();
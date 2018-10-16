'use strict';


(function controlVideoStream() {

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

  function selectStream(elem) {
    let stream;
    switch (elem.dataset.key) {
      case '1':
        stream = 'sosed';
        break;
      case '2':
        stream = 'cat';
        break;
      case '3':
        stream = 'dog';
        break;
      case '4':
        stream = 'hall';
        break;
      default:
        stream = '';
    }

    return stream;
  }

  const videos = Array.from(document.querySelectorAll('.card__video'));

  videos.forEach(video => {
    const streamItem = selectStream(video);
    console.log(streamItem);

    initVideo(video, `http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2F${streamItem}%2Fmaster.m3u8`);
  });


  function

  let transform;
  let popupVideo;
  //попап

  const popup = document.querySelector('.page__popup');
  const page = document.querySelector('.page');
  const backBtn = document.querySelector('.popup__back-btn');
  const controls = document.querySelector('.popup__control-wrap');
  const brightnessControl = document.querySelector('.popup__control_brightness');
  const contrastControl = document.querySelector('.popup__control_control');



  videos.forEach(video => {
    video.addEventListener('click', (e) => {
      // e.preventDefault();
      popup.style.display = 'block';
      page.style.overflow = 'hidden';

      videos.forEach(video => {
        video.pause();
      });

      const track = e.target.cloneNode(true);
      console.log(e.parentNode);

      const offsetX = Math.floor(((e.pageX * 100) / page.clientWidth) - 50);
      const offsetY = Math.floor(((e.pageY * 100) / page.clientHeight) - 50);

      const rate = e.target.getBoundingClientRect().height / page.clientHeight;

      console.log('rate', rate);

      popup.insertBefore(track, popup.firstChild);

      const newStreamItem = selectStream(e.target);

      popupVideo = popup.querySelector('.card__video');

      initVideo(popupVideo, `http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2F${newStreamItem}%2Fmaster.m3u8`);

      popupVideo.style.transform = `translate(${offsetX}%, ${offsetY}%) scale(${rate})`;
      transform = `translate(${offsetX}%, ${offsetY}%) scale(${rate})`;

      setTimeout(function () {
        track.classList.add('popup__video_full');
      }, 0);

      setTimeout(function () {
        backBtn.classList.add('popup__back-btn_active');
        controls.classList.add('popup__back-btn_active');
      }, 0);

      popupVideo.style.filter = 'brightness(50%)';
    });
  });


  backBtn.addEventListener('click', () => {
    popup.querySelector('.card__video').classList.remove('popup__video_full');
    popupVideo.style.transform = transform;
    videos.forEach(video => {
      video.play();
    });

    setTimeout(function () {
      popup.style.display = 'none';
      popup.querySelector('.card__video').remove();
    }, 5000);


  });

  brightnessControl.addEventListener()

})();
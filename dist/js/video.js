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

      popupVideo.style.transform = `translate(${offsetX}%, ${offsetY}%) scale(${rate})`;
      transform = `translate(${offsetX}%, ${offsetY}%) scale(${rate})`;

      setTimeout(function () {
        track.classList.add('popup__video_full');
      }, 0);

      setTimeout(function () {
        backBtn.classList.add('popup__back-btn_active');
        controls.classList.add('popup__back-btn_active');
      }, 0);


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

  brightnessControl.addEventListener('change', (e) => {
    popupVideo.style.filter = `brightness(${e.target.value}%)`;
  })

  contrastControl.addEventListener('change', (e) => {
    popupVideo.style.filter = `contrast(${e.target.value}%)`;
  })

})();
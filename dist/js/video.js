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

  initVideo(
    document.querySelector('.card__video_stream-1'),
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8'
  );

  initVideo(
    document.querySelector('.card__video_stream-2'),
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8'
  );

  initVideo(
    document.querySelector('.card__video_stream-3'),
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8'
  );

  initVideo(
    document.querySelector('.card__video_stream-4'),
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8'
  );

  //попап
  const videos = Array.from(document.querySelectorAll('.card__video'));
  const popup = document.querySelector('.page__popup');
  const page = document.querySelector('.page');


  videos.forEach(video => {
    video.addEventListener('click', (e)=> {
      // e.preventDefault();
      popup.style.display = 'block';
      page.style.overflow = 'hidden';

      const track = e.target;
        //.cloneNode(true);
      console.log(e.parentNode);

      const offsetX = Math.floor(((e.pageX * 100) / page.clientWidth) - 50);
      const offsetY = Math.floor(((e.pageY * 100) / page.clientHeight) - 50);

      popup.insertBefore(track, popup.firstChild);
      popup.querySelector('.card__video').style.transform = `translate(${offsetX}%, ${offsetY}%) scale(0.2, 0.2)`;

      setTimeout(function () {
        track.classList.add('popup__video_full');
      }, 0);

    });
  });

  const backBtn = document.querySelector('.popup__back-btn');

  backBtn.addEventListener('click', () => {
    videos.forEach(video => video.classList.remove('popup__video_full'));

  });

})();
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


  const videosList = document.querySelectorAll('.card__video');

  const videos = Array.from(videosList);

  videos.forEach(video => {
    video.addEventListener('click', (e)=> {
      const videoContainerParam = e.target.getBoundingClientRect();
      const center = videoContainerParam.

      video.classList.add('card__video_active');
    })
  })

})();
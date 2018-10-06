'use strict';

function initCameraGesture(){

  // поворот камеры:
  const camera = document.querySelector('.camera');
  const scroll = document.querySelector('.camera__scroll');
  const cameraWidth = camera.getBoundingClientRect().width;
  const cameraHight = camera.getBoundingClientRect().height;
  let gesture = null;
  const camState = {
    startPositionX: 0,
    startPositionY: 0
  };

  camera.addEventListener('pointerdown', evt => {
    camera.style.transition = 'none';

    camera.setPointerCapture(evt.pointerId);

    gesture = {
      startX: evt.x,
      startY: evt.y,
      startPositionX: camState.startPositionX,
      startPositionY: camState.startPositionY
    };

  });

  camera.addEventListener('pointermove', evt => {
    if(!gesture) {
      return
    }

    camera.classList.add('camera_moved');
    const cameraMoved = document.querySelector('.camera_moved');
    const { startX, startPositionX } = gesture;
    const { x } = evt;
    let difX = x - startX;


    const cameraBgSize = getComputedStyle(camera).getPropertyValue('background-size');

    const cameraBgSizeValue = cameraBgSize.slice(0, -1);
    console.log(cameraBgSizeValue);

    const cameraBgSizePx = (cameraWidth * cameraBgSizeValue) / 100;
    console.log(cameraBgSizePx);

    console.log(startPositionX + difX);
    const rate = cameraWidth / (cameraBgSizePx - cameraWidth);

    if((startPositionX + difX) >= 0) {
      cameraMoved.style.backgroundPositionX = '0px';
      camState.startPositionX = 0;
      scroll.style.left = 0;
    }
    else if ((startPositionX + difX) < 0 && Math.abs(startPositionX + difX) >= (cameraBgSizePx - cameraWidth)) {

      cameraMoved.style.backgroundPositionX = '-' + (cameraBgSizePx - cameraWidth).toString() + 'px';
      camState.startPositionX = - (cameraBgSizePx - cameraWidth);
      scroll.style.left = (cameraWidth - scroll.getBoundingClientRect().width) + 'px';
    }
    else {
      cameraMoved.style.backgroundPositionX = startPositionX + difX + 'px';
      camState.startPositionX = startPositionX + difX;
      scroll.style.left = Math.abs(startPositionX + difX) * rate + 'px';
    }

  })

}

setTimeout(initCameraGesture, 0);
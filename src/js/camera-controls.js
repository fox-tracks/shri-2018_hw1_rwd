'use strict';

function initCameraGesture(){

  const camera = document.querySelector('.camera');
  let evCache = new Array();
  let prevDiff = -1;

     camera.onpointerdown = pointerdown_handler;
    camera.onpointermove = pointermove_handler;


    camera.onpointerup = pointerup_handler;
    camera.onpointercancel = pointerup_handler;
    camera.onpointerout = pointerup_handler;
    camera.onpointerleave = pointerup_handler;

  function pointerdown_handler(ev) {
    evCache.push(ev);
  }

  function pointermove_handler(ev) {
    ev.target.style.border = 'green';

    for (let i = 0; i < evCache.length; i++) {
      if (ev.pointerId === evCache[i].pointerId) {
        evCache[i] = ev;
        break;
      }
    }

     if (evCache.length === 2) {
      const curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX);

      if (prevDiff > 0) {
        if (curDiff > prevDiff) {
          ev.target.style.border = "5px dashed yellow";
        }
        if (curDiff < prevDiff) {
          ev.target.style.border = "5px dashed red";
        }
      }
      prevDiff = curDiff;
    }

    if(evCache.length < 2) {
      ev.target.style.border = "5px dashed green";

    }
  }

  function remove_event(ev) {
    // Remove this event from the target's cache
    for (let i = 0; i < evCache.length; i++) {
      if (evCache[i].pointerId === ev.pointerId) {
        evCache.splice(i, 1);
        break;
      }
    }
  }

  function pointerup_handler(ev) {
    remove_event(ev);
    ev.target.style.border = "2px solid blue";

    if (evCache.length < 2) prevDiff = -1;
  }
}

setTimeout(initCameraGesture, 0);


//
// // проверем есть ли оно
// if(!gesture) {
//   return
// }
// // если есть реализуем поворот
// camera.classList.add('camera_moved');
// const cameraMoved = document.querySelector('.camera_moved');
// const { startX, startPositionX } = gesture;
// const { x } = evt;
// let difX = x - startX;
//
// const cameraBgSizeValue = camState.startZoom;
// const cameraBgSizePx = (cameraWidth * cameraBgSizeValue) / 100;
// const rate = cameraWidth / (cameraBgSizePx - cameraWidth);
//
// if((startPositionX + difX) >= 0) {
//   cameraMoved.style.backgroundPositionX = '0px';
//   camState.startPositionX = 0;
//   scroll.style.left = 0;
// }
// else if ((startPositionX + difX) < 0 && Math.abs(startPositionX + difX) >= (cameraBgSizePx - cameraWidth)) {
//   cameraMoved.style.backgroundPositionX = '-' + (cameraBgSizePx - cameraWidth).toString() + 'px';
//   camState.startPositionX = - (cameraBgSizePx - cameraWidth);
//   scroll.style.left = (cameraWidth - scroll.getBoundingClientRect().width) + 'px';
// }
// else {
//   cameraMoved.style.backgroundPositionX = startPositionX + difX + 'px';
//   camState.startPositionX = startPositionX + difX;
//   scroll.style.left = Math.abs(startPositionX + difX) * rate + 'px';
// }
// }
//
//
//
// function initCameraGesture(){
//
//   // поворот камеры:
//   const camera = document.querySelector('.camera');
//   // const scroll = document.querySelector('.camera__scroll');
//   // const cameraWidth = camera.getBoundingClientRect().width;
//   // const cameraBgSize = getComputedStyle(camera).getPropertyValue('background-size');
//   let gesture = null;
//   // const camState = {
//   //   startPositionX: 0,
//   //   startZoom: + (cameraBgSize.slice(0, -1))
//   // };
//
//   let evtStorage = {};
//   // let prevDif = -1;
//
//   camera.addEventListener('pointerdown', evt => {
//     camera.style.transition = 'none';
//     camera.setPointerCapture(evt.pointerId);
//
//     // формируем событие
//     gesture = {
//       id: evt.pointerId,
//       startX: evt.x,
//       startPositionX: camState.startPositionX
//     };
//
//     // записываем в объект
//     evtStorage[gesture.id] = gesture;
//   });
//
//   camera.addEventListener('pointermove', evt => {
//
//     const keys = Object.keys(evtStorage);
//
//
//     // если в массиве событий 2 реализуем zoom
//     if (keys.length === 2) {
//
//
//       alert(keys);
      // evtStorage.forEach(e => {
      //   if(!gesture) {
      //     return
      //   }
      //
      //   // если такое событие уже есть в массиве переприсваиваем координаты
      //   if (evt.pointerId === e.id) {
      //     e.startX = evt.x;
      //   }
      // });
      // const currentDif = Math.abs(evtStorage[0].startX - evtStorage[1].startX);
      //
      // if (prevDif > 0) {
      //   const zoom = (currentDif / cameraWidth) * 100;
      //
      //   if(currentDif > prevDif) {
      //     camera.style.backgroundSize = camState.startZoom + zoom + '%';
      //     camState.startZoom = camState.startZoom + zoom;
      //   }
      //
      //   if(currentDif < prevDif) {
      //     camera.style.backgroundSize = camState.startZoom - zoom + '%';
      //     camState.startZoom = camState.startZoom - zoom;
      //   }
      //
      //   prevDif = currentDif;
      // }

  //   }
  // });
  //
  // function deleteGesture (evt) {
  //   alert('!' + JSON.stringify(evt.pointerId) + JSON.stringify(evtStorage));
  //   delete evtStorage[evt.pointerId];
  //   alert('2' + JSON.stringify(evt.pointerId) + JSON.stringify(evtStorage));
  // }
  // camera.addEventListener('pointerup', deleteGesture);
  // camera.addEventListener('pointercancel', deleteGesture);
  // camera.addEventListener('pointerout', deleteGesture);
  // camera.addEventListener('pointerleave', deleteGesture);




}
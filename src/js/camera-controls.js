'use strict';
function initCameraGesture() {
    var PERCENTAGE_COEF = 100;
    var BG_SIZE_COVER_VALUE = 135; // значение background-size при котором фон покрывает контейнер по высоте
    var camera = document.querySelector('.camera');
    var zoomValue = document.querySelector('.camera__zoom-value');
    var brightValue = document.querySelector('.camera__brightness-value');
    var scroll = document.querySelector('.camera__scroll');
    var cameraWidth = camera.getBoundingClientRect().width;
    var curBrightness = 50;
    var prevBgSize = +((getComputedStyle(camera).getPropertyValue('background-size')).slice(0, -1));
    var prevBgPositionX = +(((getComputedStyle(camera).getPropertyValue('background-position-x')).split('px'))[0]) || 0;
    var prevBgPositionY = +(((getComputedStyle(camera).getPropertyValue('background-position-y')).split('px'))[0]) || 0;
    var gesture;
    var evCache = [];
    var rotateCache = [];
    var prevDiff = {
        x: 0,
        y: 0
    };
    var initAngle;
    var initBrightness;
    camera.style.touchAction = 'none';
    camera.setAttribute('touch-action', 'none');
    camera.addEventListener('pointerdown', pointerdownHandler);
    camera.addEventListener('pointermove', pointermoveHandler);
    camera.addEventListener('pointerup', pointerupHandler);
    camera.addEventListener('pointercancel', pointerupHandler);
    camera.addEventListener('pointerout', pointerupHandler);
    camera.addEventListener('pointerleave', pointerupHandler);
    function setcurBrightness(value) {
        curBrightness = value;
        var curBrightnessDisplayValue = Math.round(value) + '%';
        brightValue.innerHTML = curBrightnessDisplayValue;
        camera.style.filter = 'brightness(' + curBrightnessDisplayValue + ')';
    }
    function getAngle(ev1, ev2) {
        var diffX = (ev1.x - ev2.x);
        var diffY = (ev1.y - ev2.y);
        var angleRad = Math.atan2(diffY, diffX);
        return (angleRad * (180 / Math.PI));
    }
    function applyLimit(value, lowLimit, hightLimit) {
        if (value <= lowLimit) {
            return lowLimit;
        }
        if (value >= hightLimit) {
            return hightLimit;
        }
        return value;
    }
    function processRotate(rotateCache) {
        if (rotateCache.length !== 2) {
            initAngle = undefined;
            initBrightness = undefined;
            return;
        }
        var ev1 = rotateCache[0], ev2 = rotateCache[1];
        var angle = getAngle(ev1, ev2);
        if (initAngle === undefined || initBrightness === undefined) {
            initAngle = angle;
            initBrightness = curBrightness;
        }
        else {
            var difAngle = angle - initAngle;
            var newBrightness = initBrightness + difAngle;
            var limitedNewBrightness = applyLimit(newBrightness, 0, 200);
            setcurBrightness(limitedNewBrightness);
        }
    }
    function pointerdownHandler(ev) {
        camera.setPointerCapture(ev.pointerId);
        rotateCache.push(ev);
        // формируем жест
        gesture = {
            id: ev.pointerId,
            startX: ev.x,
            startY: ev.y,
            startPositionX: prevBgPositionX,
            startPositionY: prevBgPositionY
        };
        // записываем в массив эвентов
        evCache.push(gesture);
        if (evCache.length === 2) {
            prevDiff.x = (evCache[1].startX - evCache[0].startX);
        }
    }
    function pointermoveHandler(ev) {
        for (var i = 0; i < rotateCache.length; i++) {
            if (ev.pointerId === rotateCache[i].pointerId) {
                rotateCache[i] = ev;
            }
        }
        processRotate(rotateCache);
        if (evCache.length === 2) {
            for (var i = 0; i < evCache.length; i++) {
                if (ev.pointerId === evCache[i].id) {
                    evCache[i].startX = ev.x;
                    evCache[i].startY = ev.y;
                    break;
                }
            }
            var curDiff = {
                x: 0,
                y: 0
            };
            curDiff.x = evCache[1].startX - evCache[0].startX;
            curDiff.y = evCache[1].startY - evCache[0].startY;
            var increaseX = void 0;
            var currentBgSize = void 0;
            if (Math.abs(prevDiff.x) > 0) {
                // увеличение фонового изображения, нормированное на ширину блока в %, только по x, т.к. увеличивается пропорционально
                increaseX = (Math.abs(curDiff.x) - Math.abs(prevDiff.x)) * PERCENTAGE_COEF / cameraWidth;
                if ((prevBgSize + increaseX) < BG_SIZE_COVER_VALUE) {
                    currentBgSize = BG_SIZE_COVER_VALUE;
                }
                else {
                    currentBgSize = prevBgSize + increaseX;
                }
                camera.style.backgroundSize = currentBgSize + '%';
                prevDiff.x = curDiff.x;
                prevBgSize = currentBgSize;
            }
        }
        if (evCache.length < 2) {
            if (!gesture) {
                return;
            }
            var startX = gesture.startX, startPositionX = gesture.startPositionX;
            var x = ev.x;
            var difX = x - startX;
            var prevBgSizePx = (cameraWidth * prevBgSize) / PERCENTAGE_COEF;
            var rate = cameraWidth / (prevBgSizePx - cameraWidth); // коэффициент для расчета положения точки-скролла
            // ограничение на левую границу
            if ((startPositionX + difX) >= 0) {
                camera.style.backgroundPositionX = '0px';
                prevBgPositionX = 0;
                scroll.style.left = '0';
            }
            // ограничение на правую границу
            else if ((startPositionX + difX) < 0 && Math.abs(startPositionX + difX) >= (prevBgSizePx - cameraWidth)) {
                camera.style.backgroundPositionX = '-' + (prevBgSizePx - cameraWidth).toString() + 'px';
                prevBgPositionX = -(prevBgSizePx - cameraWidth);
                scroll.style.left = (cameraWidth - scroll.getBoundingClientRect().width) + 'px';
            }
            else {
                camera.style.backgroundPositionX = startPositionX + difX + 'px';
                prevBgPositionX = startPositionX + difX;
                scroll.style.left = Math.abs(startPositionX + difX) * rate + 'px';
            }
        }
    }
    function remove_event(ev) {
        for (var i = 0; i < evCache.length; i++) {
            if (evCache[i].id === ev.pointerId) {
                evCache.splice(i, 1);
                break;
            }
        }
    }
    function pointerupHandler(ev) {
        for (var i = 0; i < rotateCache.length; i++) {
            if (rotateCache[i].pointerId === ev.pointerId) {
                rotateCache.splice(i, 1);
                break;
            }
        }
        remove_event(ev);
        if (evCache.length < 2) {
            prevDiff.x = 0;
            prevBgSize = +((getComputedStyle(camera).getPropertyValue('background-size')).slice(0, -1));
            zoomValue.innerHTML = Math.round(prevBgSize - PERCENTAGE_COEF) + '%';
        }
    }
}
setTimeout(initCameraGesture, 0);

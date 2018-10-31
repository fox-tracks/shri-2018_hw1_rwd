import { initMenu } from './menu';
import { createLayout } from './card-template';
import { initCameraGesture } from './camera-controls';

initMenu();
createLayout();
setTimeout(initCameraGesture, 0);

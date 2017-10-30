
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

require('./post-css/remote.css');

var io = require('socket.io-client')('/remotes');

// The angle at which we stop listening for input from the phone's gyro.
var MAX_X_ANGLE = 20,
  MAX_Y_ANGLE = 24;

var loopUpdateTimer,
  position = [],
  latestAlpha,
  baseAlpha = null,
  touching = false;

// Convert the phone's gyro data into screen coordinates.
function handleDeviceOrientation(data) {
  var x, y,
    alpha = latestAlpha = data.alpha,
    beta = data.beta;

  if (baseAlpha !== null) {
    alpha = alpha - baseAlpha;
    alpha += 360;
    alpha %= 360;
  }

  // Left/right rotation.
  if (alpha > 360 - MAX_X_ANGLE) {

    // phone is rotating right:
    x = 100 / MAX_X_ANGLE * (360 - alpha);
  } else if (alpha < MAX_X_ANGLE) {

    // phone is rotating left:
    x = 100 / MAX_X_ANGLE * (0 - alpha);
  } else {

    // Stop rotation at max angle.
    if (alpha > MAX_X_ANGLE && alpha < 180) {
      x = -100;
    } else {
      x = 100;
    }
  }

  // Up/down rotation.
  if (beta > 0 && beta <= MAX_Y_ANGLE
    || beta < 0 && beta >= MAX_Y_ANGLE * -1) {
    y = 100 / MAX_Y_ANGLE * (beta * -1);
  } else {
    if (beta > 0) {
      y = -100;
    } else {
      y = 100;
    }
  }

  // Normalize percentages to from (0, 100) to (0, 1):
  x *= 0.01;
  y *= 0.01;

  position[0] = x;
  position[1] = y;
}

function handleTouchStartEvent(e) {
  e.preventDefault();

  // Every time we touch and hold we calibrate to the center of the screen.
  baseAlpha = latestAlpha;
  touching = true;
  update();
}

function handleTouchEndEvent(e) {
  e.preventDefault();
  touching = false;
}

function update() {
  if (touching) {
    io.emit('position', position);
    loopUpdateTimer = setTimeout(update, 15);
  }
}

// We need to check for DeviceOrientation support because some devices do not
// support it. For example, phones with no gyro.
if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', handleDeviceOrientation, false);

  window.addEventListener('touchstart', handleTouchStartEvent, {
      capture: true,
      passive: false
    }
  );

  window.addEventListener('mousedown', handleTouchStartEvent, {
      capture: true,
      passive: false
    }
  );

  window.addEventListener('touchend', handleTouchEndEvent, {
      capture: true,
      passive: false
    }
  );

  window.addEventListener('mouseup', handleTouchEndEvent, {
      capture: true,
      passive: false
    }
  );
} else {
  alert('This device is not supported.');
}

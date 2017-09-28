
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

require('./post-css/screen.css');

var io = require('socket.io-client')('/screens');
var remotes = null;
var remoteCount = 0;
var rAF = require('raf');
var drawing = false;
var rAFIndex = null;

var width = document.body.offsetWidth;
var height = document.body.offsetHeight;

// Show what address to connect the phone to:
var addressDisplay = document.getElementById('address');

io.once('initialize', firstConnected)
  .on('push', remoteJoined)
  .on('pop', remoteLeaving)

  // Use the phone's gyro data to update the position of the cursor.
  .on('position', function(id, position) {
    if (!remotes) return;
    remotes[id] = remotes[id] || {};
    remotes[id].x = position[0];
    remotes[id].y = position[1];
    requestUpdate();
  });

// Initialize any cursors that that already joined.
function firstConnected({remoteIDs=[],address=''}) {
  addressDisplay.innerHTML = `http://${address}`;
  remotes = {};
  for (var i = 0; i < remoteIDs.length; i++) {
    remoteJoined(remoteIDs[i]);
  }
}

// A remote has joined.
function remoteJoined(id) {
  if (!remotes) return;
  if (!remotes[id]) {
    remoteCount++;
    remotes[id] = {
      x: 0,
      y: 0
    };
    remotes[id].dom = makeCursor();
  }
}

// A remote has left.
function remoteLeaving(id) {
  if (!remotes) return;
  if (remotes[id].dom) remotes[id].dom.parentNode.removeChild(remotes[id].dom);
  remoteCount -= delete remotes[id];
}

function requestUpdate() {
  if (!drawing) {
    drawing = true;
    rAFIndex = rAF(updateDisplay);
  }
} 

// Show cursors on the screen.
function updateDisplay() {
  for (var p in remotes) {
    var cursor = remotes[p];
    var x = cursor.x * (width * .5);
    var y = cursor.y * (height * .5);
    var trans = `translate3d(${x}px,${y}px,0)`;
    cursor.dom.style.webkitTransform = cursor.dom.style.transform = trans;
  }

  drawing = false;
}

// Generates a cursor DOM object.
var makeCursor = function() {
  var cursor = document.createElement('i');
  cursor.classList.add('cursor');
  document.body.appendChild(cursor);
  return cursor;
};

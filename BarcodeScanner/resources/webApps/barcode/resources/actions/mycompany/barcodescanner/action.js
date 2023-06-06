/**
 * Copyright (c)2023 Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['vb/action/action', 'zxing/zxing_reader'], (Action) => {
  'use strict';
  
  var zxing;
  window.ZXing().then(function (value) {
    zxing = value;
  });

  class CustomAction extends Action {
    perform() {
      // open popup dialog
      // shell/page needs to have oj-dalog element with id "barcode-scanning-dialog"
      document.getElementById('barcode-scanning-dialog').open();

      // start scanning
      this.startScanning();

      // return promise which will resolve when barcode was scanned (success outcome)
      // or resolves with failure outcome if scaning was cancelled by user
      var self = this;
      return new Promise(function (resolve, reject) {
        self.resolve = resolve;
        self.reject = reject;
      });

    }

    closeScanningDialogWithBarcode(result) {
      // shell/page needs to have oj-dalog element with id "barcode-scanning-dialog"
      document.getElementById('barcode-scanning-dialog').close();
      this.resolve(Action.createSuccessOutcome({format : result.format, text: result.text}));
    }

    startScanning() {
      var video = document.createElement("video");
      // shell/page needs to have canvas element with id "barcode-scanning-canvas"
      // into which camera frames will be rendered:
      var canvasElement = document.getElementById("barcode-scanning-canvas");
      var canvas = canvasElement.getContext("2d");
      var currentStream = null;
      var cameraStarted = false;
      var self = this;

      function stopCurentCamera() {
        if (currentStream != null) {
          currentStream.getTracks().forEach(track => {
            track.stop();
          });
        }
      }
      
      function startCameraWithDevice(cameraFacing) {
        stopCurentCamera();
        var facingMode = cameraFacing ? { exact: cameraFacing } : "environment";
        navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode } }).then(function (stream) {
          currentStream = stream;
          video.srcObject = stream;
          video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
          video.play();
          if (!cameraStarted) {
            cameraStarted = true;
            requestAnimationFrame(tick);
          }
        });
      }

      startCameraWithDevice("");

      // shell/page needs to have oj-dialog with a button (id="barcode-scanning-dialog-cancel") to cancel it with:
      document.getElementById('barcode-scanning-dialog-cancel').addEventListener("click", () => {
        hideCamera();
        document.getElementById('barcode-scanning-dialog').close();
        self.resolve(Action.createFailureOutcome({status: "cancelled by user"}));
      });


      function drawLine(begin, end, color) {
        canvas.beginPath();
        canvas.moveTo(begin.x, begin.y);
        canvas.lineTo(end.x, end.y);
        canvas.lineWidth = 2;
        canvas.strokeStyle = color;
        canvas.stroke();
      }

      function hideCamera() {
        stopCurentCamera();
        video.remove();
        cameraStarted = false;
      }

      function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvasElement.hidden = false;
          canvasElement.height = video.videoHeight;
          canvasElement.width = video.videoWidth;
          canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
          var format = "";
          var code = self.scanCanvasForBarcode(canvasElement, format);
          if (code.error) {
            // console.log('>>>>>>>>>> Error: '+JSON.stringify(code));
          } else if (code.format) {
            console.log('>>>>>>>>>> Detected: '+JSON.stringify(code));
            drawLine(code.position.topLeft, code.position.topRight, "#2eb816");
            drawLine(code.position.topRight, code.position.bottomRight, "#2eb816");
            drawLine(code.position.bottomRight, code.position.bottomLeft, "#2eb816");
            drawLine(code.position.bottomLeft, code.position.topLeft, "#2eb816");
            
            hideCamera();
            canvas.clearRect(0, 0, canvasElement.width, canvasElement.height);
            self.closeScanningDialogWithBarcode(code);
          } else {
            drawLine({x:0, y: canvasElement.height/2}, {x:canvasElement.width, y: canvasElement.height/2}, "#FF3B58");
          }
        }
        if (cameraStarted) {
          requestAnimationFrame(tick);
        }
      }
    }

    scanCanvasForBarcode(canvasElement, format) {
      var imgWidth = canvasElement.width;
      var imgHeight = canvasElement.height;
      var imageData = canvasElement.getContext('2d').getImageData(0, 0, imgWidth, imgHeight);
      var sourceBuffer = imageData.data;

      if (zxing != null) {
        var time =  Date.now();
        var buffer = zxing._malloc(sourceBuffer.byteLength);
        zxing.HEAPU8.set(sourceBuffer, buffer);
        var result = zxing.readBarcodeFromPixmap(buffer, imgWidth, imgHeight, true, format);
        zxing._free(buffer);
        var time2 =  Date.now();
        // console.log(">>> barcode scanning took "+(time2-time)+"ms");
        time =  time2;
        return result;
      } else {
        return { error: "ZXing not yet initialized" };
      }
    }
    

  }

  return CustomAction;
});

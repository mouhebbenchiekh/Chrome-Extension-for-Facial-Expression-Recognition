function face_analysis_item({ key, image_source, Emotion, angry, fear, happy, neutral, surprised, sad }) {
  return `    
  <div class="face_analysis_element">
  <img class="outputImage" src="${image_source}"/>
  <div class="element" id="element${key}">
  <div class="container">
    <h2>${Emotion}</h2>
    <div class="row">
      <span class="emotionItem">Angry</span>
      <div class="progress ">
        <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="${angry}" aria-valuemin="0" aria-valuemax="100">
        </div>
      </div>
    </div>

    <div class="row">
      <span class="emotionItem">Fear</span>
      <div class="progress skill-bar">
        <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="${fear}" aria-valuemin="0" aria-valuemax="100">

        </div>
      </div>
    </div>
    <div class="row">
      <span class="emotionItem">Happy</span>
      <div class="progress skill-bar">
        <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="${happy}" aria-valuemin="0" aria-valuemax="100">
        </div>
      </div>
    </div>
    <div class="row">
      <span class="emotionItem">Neutral</span>
      <div class="progress skill-bar">
        <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="${neutral}" aria-valuemin="0" aria-valuemax="100">
        </div>
      </div>
    </div>
    <div class="row">
      <span class="emotionItem">Sad</span>
      <div class="progress skill-bar">
        <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="${sad}" aria-valuemin="0" aria-valuemax="100">
        </div>
      </div>
    </div>
    <div class="row">
      <span class="emotionItem">Surprise</span>
      <div class="progress skill-bar">
        <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="${surprised}" aria-valuemin="0" aria-valuemax="100">
          <div>
          </div>
        </div>

      </div>
    </div>
  </div>
 </div>
 `
}

let button = document.getElementById('capture');
let buttonCrop = document.getElementById('crop');
let video = document.getElementById('video');
let whole_container = document.querySelector(".whole_container");
let interval
let isSending = false
let first = true
button.addEventListener('click', async () => {
  if (!isSending) {
    video.style.display = "block";
    button.innerText = "Pause";
    try {
      let model
      if (first) {
        model = await tf.loadLayersModel('http://localhost:3000/model.json');
        first = false;
      }
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),]).then(capture(model));

    } catch (error) {
      console.log({ error });

    }
  } else {
    clearInterval(interval)
  }
  isSending = !isSending
})

function capture(model) {
  chrome.tabCapture.capture({ audio: false, video: true }, (stream) => {
    video.srcObject = stream;
    video.addEventListener('play', () => {
      const canvas = faceapi.createCanvasFromMedia(video)
      document.body.append(canvas)
      const displaySize = { width: video.width, height: video.height }
      faceapi.matchDimensions(canvas, displaySize)
      interval = setInterval(async () => {
        if (isSending) {
          const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          whole_container.innerHTML = "";
          extractFaceFromBox(video, detections[0]._box, model)
          const resizedDetections = faceapi.resizeResults(detections, displaySize)
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
          faceapi.draw.drawDetections(canvas, resizedDetections)

        }
      }, 300)
    })
  })
}

async function extractFaceFromBox(inputImage, box, model) {
  const regionsToExtract = [
    new faceapi.Rect(box.x, box.y, box.width, box.height)
  ]

  let faceImages = await faceapi.extractFaces(inputImage, regionsToExtract)
  console.log(faceImages);
  if (faceImages.length == 0) {
    console.log('Face not found')
  }
  else {
    faceImages.forEach((cnv, key) => {
      let pixelImage = tf.browser.fromPixels(cnv);
      let resized = tf.image.resizeBilinear(pixelImage, [48, 48], false, false);
      let greyImage = resized.mean(2);
      let detect = tf.expandDims(tf.reshape(greyImage, [48, 48, 1]), 0)
      let prediction = model.predict(detect).dataSync();
      let pred = prediction.map(val => Math.round((val * 100)));
      const [angry, fear, happy, neutral, sad, surprised] = pred;
      let Emotion = pred.indexOf(Math.max(...pred));
      const emotionList = ["Angry", "Fear", "Happy", "Neutral", "Sad", "Surprise"];
      var item = document.createElement("div");
      item.innerHTML = face_analysis_item({ key: key, image_source: cnv.toDataURL(), Emotion: emotionList[Emotion], angry: angry, fear: fear, happy: happy, neutral: neutral, sad: sad, surprised: surprised })
      whole_container.appendChild(item);
      $(".progress .progress-bar").css("width", function () {
        return $(this).attr("aria-valuenow") + "%";
      });
    })
  }
}




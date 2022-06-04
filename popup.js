



  function elementFunc({sad,happy,angry,neutral,surprised,fear}){
    return `
   
  <div class="container">
    <h2>Fear</h2>
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
 
    `
  }
 
 


 /* ends here*/

let button= document.getElementById('capture');
let buttonCrop= document.getElementById('crop');
let video= document.getElementById('video');
let element= document.getElementById('element');
let interval
let isSending=false
let first=true
button.addEventListener('click',async ()=>{
  if(!isSending){
    video.style.display="block";
    element.style.display="block";
    try {
      let model 
      if (first){
        model = await tf.loadLayersModel('http://localhost:3000/model.json');
        first=false;
      }
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),]).then(capture(model));
      

      
    } catch (error) {
      console.log({error});
      
    }
  }else{
    clearInterval(interval)
  }
  isSending = !isSending


    
      
})

function capture(model){

chrome.tabCapture.capture({audio:false,video:true},(stream)=>{
    
    video.srcObject = stream;
    video.addEventListener('play', () => {
         const canvas = faceapi.createCanvasFromMedia(video)
        document.body.append(canvas)
        const displaySize = { width: video.width, height: video.height }
        faceapi.matchDimensions(canvas, displaySize) 
        interval = setInterval(async () => {
          
          if(isSending){
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            extractFaceFromBox(video, detections[0]._box,model)
           const resizedDetections = faceapi.resizeResults(detections, displaySize)
           canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
           faceapi.draw.drawDetections(canvas, resizedDetections)
           
          }
         
        }, 300)

      })

      

    
    
})

}

let outputImage = document.getElementById('outputImage')
async function extractFaceFromBox(inputImage, box,model){ 
  const regionsToExtract = [
      new faceapi.Rect( box.x, box.y , box.width , box.height)
  ]
                      
  let faceImages = await faceapi.extractFaces(inputImage, regionsToExtract)
  
  if(faceImages.length == 0){
      console.log('Face not found')
  }
  else
  {
      faceImages.forEach((cnv,key) =>{      
          outputImage.src = cnv.toDataURL(); 
          
           let pixelImage= tf.browser.fromPixels(cnv);
           let resized=tf.image.resizeBilinear(pixelImage,[48,48],false,false);
           let greyImage=resized.mean(2);
           let detect=tf.expandDims(tf.reshape(greyImage,[48,48,1]),0)
           
            // for example
             let can =document.getElementById('can');
            tf.browser.toPixels(tf.reshape(detect,[48,48]),can);
            let prediction = model.predict(detect).dataSync();
            let pred = prediction.map(val => Math.round((val*100)));
            const [angry,fear,happy,neutral,sad,surprised] = pred;
           
            document.querySelector("#element").innerHTML=elementFunc({angry: angry,fear:fear,happy:happy,neutral:neutral,sad:sad,surprised:surprised})
            console.log("lenna naffichiw fel element bars ...")
            console.log(document.querySelector("#element"))
           
              $(".progress .progress-bar").css("width", function () {
                return $(this).attr("aria-valuenow") + "%";
              });
              
                      
              
      })
  }   
} 
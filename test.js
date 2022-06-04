import * as tf from "@tensorflow/tfjs";
import * as tfn from '@tensorflow/tfjs-node';

console.log('mohamedddddddd')
const button = document.getElementById('capture');

button.addEventListener('click',()=>{
    console.log("yesssss");

    test()
})
async function test(){
    
    const handler= tfn.io.fileSystem('./modeljs/model.json')
    
      const model = await tf.loadLayersModel(handler);
      console.log({model},"hhhhhhhhhhhhh");
      
    
    capture(model)
}


    
      

function capture(model){

    const im= new Image();
    im.src="./img.jpg";
    im.onload(()=>{
        const example = tf.browser.fromPixels(im);  // for example
          const prediction = model.predict(example);
          console.log({prediction});
    })

          
      
      

    


}
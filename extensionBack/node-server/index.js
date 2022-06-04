const express = require('express')
const app = express()
var cors = require('cors');
const model= require('./modeljs/model.json');


app.use(cors());
app.use(express.static('models'));
app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/model',function(req,res){
    res.send(model)
})


app.listen(3000);
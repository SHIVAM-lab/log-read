import express from 'express';
import http from 'http';
import fs from 'fs';
import bodyParser from 'body-parser';
import _ from 'lodash';
const app = express();

app.use(bodyParser.urlencoded({extended: true}));//When we want to pass the data that comes in the html form

//while working on the big file , taking help of READABLE STREAM 
// instead of fs.read() coz , it cost more to the browser memory
var mystream=fs.createReadStream(__dirname + '/example.txt', 'utf8');
var currTime='',currDate='',arr=[];
app.get("/", function(req,res){
    res.sendFile(`${__dirname}/index.html`);
});

app.post("/",function (req, res) {
      currDate =new Date(req.body.getDate);
      currTime = new Date(req.body.getTime);
       var time_1 = currTime.setMinutes(currTime.getMinutes()-15);
       var time_2 = currTime.setMinutes(currTime.getMinutes()+15);

mystream.on('data',function (chunk) {
    var json = JSON.parse(chunk.toString());
    //filtering json data by date given
    var result_1 = json.filter(a=>{
        var date =new Date(a.ProductHits);
        return (date==currDate);
    });
    //filtering result_1 data by time range from time_1 to time_2
    var result_2=result_1.filter(a=>{
        var time = new Date(a.ProductHits);
        return (time>=time_1 && time<=time_2);
    });
    arr.push(result_2);
 });
 res.redirect('/response?arr=',JSON.stringify(arr));


 });

 app.get('/response',function (req,res) {
    
     arr=req.query.arr;
     res.send(arr);
 });

port=3000||process.env.PORT;
app.listen(port,function(req,res){
    console.log("server is listening");
})
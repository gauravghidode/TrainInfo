const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("https");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const emptyarray = [];

app.get("/", function(req, res){
    res.render("home",{});
})

app.get("/:branch", function(req, res){
    res.render(req.params.branch, {array: emptyarray});
})

app.post("/:branch", function(req, res){
    console.log(req.body);

    var branchpath = "";
    var traindata = [];

    if(req.params.branch==="searchStation"){
        const query = req.body.station;
        branchpath = "/api/v1/searchStation?query="+query+"";
    }
    else if(req.params.branch==="searchTrain"){
        const query = req.body.trainNo;
        branchpath = "/api/v1/searchTrain?query="+query+"";
    }
    else if(req.params.branch==="trainsBetweenStations"){
        const originStation = req.body.originStaion;
        const destStation = req.body.destStation;
        branchpath = "/api/v2/trainBetweenStations?fromStationCode="+originStation+"&toStationCode="+destStation+"";
    }
    else if(req.params.branch==="getTrainLiveStatus"){
        const trainNo = req.body.trainNo;
        const day = req.body.day;
        branchpath = "/api/v1/liveTrainStatus?trainNo="+trainNo+"&startDay="+day+"";
    }
    else if(req.params.branch==="getTrainSchedule"){
        const trainNo = req.body.trainNo;
        branchpath = "/api/v1/getTrainSchedule?trainNo="+trainNo+"";
    }
    else if(req.params.branch==="getPnrStatus"){
        const pnr = req.body.pnr;
        branchpath = "/api/v3/getPNRStatus?pnrNumber="+pnr+"";
    }
    else if(req.params.branch==="checkSeatAvailability"){
        const trainclass = req.body.class;
        const originStaion =req.body.originStaion;
        const destStation = req.body.destStation;
        const quota = req.body.quota;
        const trainNo = req.body.trainNo;
        const date = req.body.date;
        branchpath = "/api/v1/checkSeatAvailability?classType="+trainclass+"&fromStationCode="+originStaion+"&quota="+quota+"&toStationCode="+destStation+"&trainNo="+trainNo+"&date=2022-05-25";
    }
    else if(req.params.branch==="getTrainClasses"){
        const trainNo = req.body.trainNo;
        branchpath = "/api/v1/getTrainClasses?trainNo="+trainNo+"";
    }
    
    
        
    const options = {
        "method": "GET",
        "hostname": "irctc1.p.rapidapi.com",
        "port": null,
        "path": branchpath,
        "headers": {
            "X-RapidAPI-Key": "99d4265259mshe612d2577a5e1e1p1383eejsn8c74a21fbfc7",
            "X-RapidAPI-Host": "irctc1.p.rapidapi.com",
            "useQueryString": true
        }
    };

    const request = http.request(options, function (response) {
    
        response.on("data", function (data) {
            traindata = JSON.parse(data);
            console.log(traindata);
            res.render(req.params.branch, {array: traindata.data});
        });    
    });
    request.end();
    

    
})

app.listen(3000, function(){
    console.log("server staring at post 3000");
}) 
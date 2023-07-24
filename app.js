const express = require("express");
const bodyParser = require("body-parser");
const app = express();


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const emptyarray = [];

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.get("/:branch", function (req, res) {
    res.render(req.params.branch, { trndata: emptyarray });
})

// app.get('/favico.ico', function (req, res) {/*code*/ });

app.post("/:branch", function (req, res) {
    console.log(req.body);

    var branch = req.params.branch;

    if (branch === "getTrainInfo" || branch === "trainsBetweenStations" || branch === "getTrainSchedule") {
        var path = "";
        if (branch === "getTrainInfo") {
            var trainno = req.body.trainno;
            path = "/trains/getTrain/?trainNo=" + trainno;
        }
        if (branch === "trainsBetweenStations") {
            var from = req.body.from;
            var to = req.body.to;
            path = "/trains/betweenStations/?from=" + from + "&to=" + to;

            if (req.body.checkbox == "on") {
                var date = req.body.date;
                var day = new Date(date);
                var dd = day.getDate(), mm = day.getMonth() + 1, yyyy = day.getFullYear();
                console.log(dd + "-" + mm + "-" + yyyy);
                path = "/trains/gettrainon?from=" + from + "&to=" + to + "&date=" + dd + "-" + mm + "-" + yyyy;
            }
        }
        if (branch === "getTrainSchedule") {
            var trainno = req.body.trainno;
            path = "/trains/getRoute?trainNo=" + trainno;
        }

        var https = require('follow-redirects').https;
        var fs = require('fs');

        var options = {
            'method': 'GET',
            'hostname': 'indian-railway-api.cyclic.app',
            'path': path,
            'headers': {
            }
        };

        var request = https.request(options, function (response) {
            var chunks = [];

            response.on("data", function (chunk) {
                chunks.push(chunk);
            });

            response.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                console.log(JSON.parse(body.toString()));
                res.render(branch, { trndata: body.toString() });
            });

            response.on("error", function (error) {
                console.error(error);
            });

        });

        request.end();

    }
    else if (branch === "getPnrStatus") {
        const http = require('https');
        const pnr = req.body.pnr;
        const options = {
            method: 'GET',
            hostname: 'pnr-status-indian-railway.p.rapidapi.com',
            port: null,
            path: '/pnr-check/'+pnr,
            headers: {
                'X-RapidAPI-Key': '99d4265259mshe612d2577a5e1e1p1383eejsn8c74a21fbfc7',
                'X-RapidAPI-Host': 'pnr-status-indian-railway.p.rapidapi.com'
            }
        };

        const request = http.request(options, function (response) {
            const chunks = [];

            response.on('data', function (chunk) {
                chunks.push(chunk);
            });

            response.on('end', function () {
                const body = Buffer.concat(chunks);
                // console.log(body.toString());
                res.render(branch, {traindata: JSON.parse(body)});
                // res.send(JSON.parse(body));
            });
        });

        request.end();
    }
    else{
        var branchpath = "";

        if(branch==="getTrainLiveStatus"){
            const trainNo = req.body.trainno;
            const day = req.body.day;
            branchpath = "/api/v1/liveTrainStatus?trainNo="+trainNo+"&startDay="+day;
        }
    
        else if(branch==="checkSeatAvailability"){
            const trainclass = req.body.class;
            const from =req.body.from;
            const to = req.body.to;
            const quota = req.body.quota;
            const trainno = req.body.trainno;
            const date = req.body.date;
            
            branchpath= '/api/v1/checkSeatAvailability?classType='+trainclass+'&fromStationCode='+from+'&quota='+quota+'&toStationCode='+to+'&trainNo='+trainno+'&date='+date ;
        }    


        const http = require("https");
        const options = {
            "method": "GET",
            "hostname": "irctc1.p.rapidapi.com",
            "port": null,
            "path": branchpath,
            "headers": {
                "X-RapidAPI-Key": "b3f6dd024emsh575270ba93e7783p1e2752jsn18419183c5a0",
                "X-RapidAPI-Host": "irctc1.p.rapidapi.com",
            }
        };

        const request = http.request(options, function (response) {
            const chunks = [];
        
            response.on('data', function (chunk) {
                chunks.push(chunk);
            });
        
            response.on('end', function () {
                const body = Buffer.concat(chunks);
                console.log(body.toString());
                res.render(branch, {trndata: body.toString()})
            });
        });
        request.end();
    }

})

app.listen(process.env.PORT||3000, function () {
    console.log("server running at port 3000");
}) 
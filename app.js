const { log } = require("console");
const express = require("express");
const https = require("https"); //https is one of the native module bundled in node_modules, so no need to install
//we can also use Request module, Axios,Super Agent, Got
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
    // console.log(req.body.cityName);
    // console.log("Post Received");
    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
    https.get(url, function(response) {
        // console.log(response.statusCode);
        response.on("data", function(data) {
            // console.log(data); //data is printed in hexadecimal code
            const weatherData = JSON.parse(data);
            // console.log(weatherData);
            const temp = weatherData.main.temp;
            const weatherDesc = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            // console.log(weatherDesc);
            // console.log(temp);
            // const object = {
            // name: "Mani",
            // favouriteFood: "Pav Bhaji"
            // }
            // console.log(JSON.stringify(object)); //prints in string form, keys are represented as strings
            res.write("<p>The weather is currently " + weatherDesc + "</p>"); //we can have multiple res.write
            res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celcius.</h1>");
            res.write("<img src=" + imageURL + ">");
            res.send();
        });
    });
});

// res.send("Server is up and running.");//we can only send response once

app.listen(3000, function() {
    console.log("Server is running at port 3000");
});
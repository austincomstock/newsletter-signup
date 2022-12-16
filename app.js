const express = require("express");
const https = require("https"); // https://nodejs.org/docs/latest-v16.x/api/https.html#httpsgeturl-options-callback:~:text=%23-,https.get(url%5B%2C%20options%5D%5B%2C%20callback%5D),-%23
const bodyParser = require("body-parser");

require("dotenv").config();
const MAPI_KEY = process.env.API_KEY;
const MAPI_SERVER = process.env.API_SERVER;
const MLIST_ID = process.env.LIST_ID;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // https://expressjs.com/en/starter/static-files.html

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
  // res.send("Hello World! The Server is working!");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const emailAddress = req.body.email;

  const data = {
    members: [
      {
        email_address: emailAddress,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url =
    "https://" + MAPI_SERVER + ".api.mailchimp.com/3.0/lists/" + MLIST_ID + "";

  const options = {
    method: "POST",
    auth: "austin1:" + MAPI_KEY + "",
  };

  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      // console.log("This is the JSON.parse aka receivedData:", JSON.parse(data));
      const receivedData = JSON.parse(data);

      if (receivedData.error_count != 0) {
        console.log("There was an error");
        res.sendFile(__dirname + "/failure.html");
      } else {
        console.log("You are signed up");
        res.sendFile(__dirname + "/success.html");
      }
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});

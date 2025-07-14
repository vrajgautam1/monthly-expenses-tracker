const express = require("express");
const app = express();
const mainRouter = require("./Routers/mainRouter");
const db = require("./config/dbconnection")

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use("/", mainRouter); 

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
  if (!err) {
    db()
    console.log("Server is running");
    console.log("http://localhost:" + port);
  }
});

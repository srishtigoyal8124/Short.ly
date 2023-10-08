const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const urlRoute= require('./routes/url');
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");
const URL = require('./models/url');
const { connectToMongoDB } = require('./connect');
const { checkForAuthentication, restrictTo } = require("./middlewares/auth");
const app= express();
const port  = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(
    console.log("mongodb connected")
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
app.use(checkForAuthentication);

app.use("/url",restrictTo(["Normal","Admin"] ) , urlRoute);
app.use("/user", userRoute);
app.use("/",staticRoute);


app.get('/url/:shortId', async (req, res)=>{
    const shortId=req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId,
             
        },
        {
            $push: {
                visitHistory :{
                    timestamp : Date.now(),
            },
        },
    }
    );
    res.redirect(entry.redirectUrl);
});



app.listen(port , ()=>{
    console.log(`Server is listening on port : ${port}`);
})
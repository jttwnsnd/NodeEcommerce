var express=require("express"),path=require("path"),favicon=require("serve-favicon"),logger=require("morgan"),cookieParser=require("cookie-parser"),bodyParser=require("body-parser"),routes=require("./routes/index"),users=require("./routes/users"),app=express();app.use(function(e,r,s){r.header("Access-Control-Allow-Origin","*"),r.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept"),s()}),app.set("views",path.join(__dirname,"views")),app.set("view engine","jade"),app.use(logger("dev")),app.use(bodyParser.json()),app.use(bodyParser.urlencoded({extended:!1})),app.use(cookieParser()),app.use(express["static"](path.join(__dirname,"public"))),app.use("/",routes),app.use("/users",users),app.use(function(e,r,s){var a=new Error("Not Found");a.status=404,s(a)}),"development"===app.get("env")&&app.use(function(e,r,s,a){s.status(e.status||500),s.render("error",{message:e.message,error:e})}),app.use(function(e,r,s,a){s.status(e.status||500),s.render("error",{message:e.message,error:{}})}),module.exports=app;
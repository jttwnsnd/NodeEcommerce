var connect=require("connect"),serveStatic=require("serve-static");connect().use(serveStatic(__dirname)).listen(8e3,function(){console.log("Listening on Port 8000...")});
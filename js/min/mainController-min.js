var eComApp=angular.module("ecommerceApp",["ngRoute","ngCookies"]),eController=eComApp.controller("mainController",function(e,o,t,n,a){function s(){$("#instruction-modal").show().css({left:"0px",top:"120px",marginLeft:"auto",marginRight:"auto"}),$(".modal-text").html("For a complete experience, register with fake information")}function r(){$("#instruction-modal").show().css({position:"fixed",left:"10px",top:"165px",margin:"0"}),$(".modal-text").html("Use Card #<br>4242 4242 4242 4242<br>to test payment. <br>Any Exp Date. <br>Any CVC.")}function i(){a.get("token")&&t.get(l+"/getUserData?token="+a.get("token")).then(function s(t){"badToken"===t.data.failure?n.path="/login":"noToken"===t.data.failure?n.path("/login"):(console.log(t.data),a.put("total",t.data.document.weeklyTotal),console.log(t.data.order),e.userInfo=t.data,e.username=t.data.username,o.loggedOut=!0)},function r(e){console.log(e)})}e.test="yo",e.userExists=!1;var l="http://jt-townsend.com:3000";i();var d="sk_test_s0Z6wAo5DRnEVbbwUeD876n1",u="pk_test_ZJna4w56Eih7glMjoWk8csQA",m="sk_live_7foZ0QdZJoeKyiUvFt0YT7LA",c="pk_live_drxWAZfUCsKUQUUVIOvLpbd6";"/"==n.path()&&void 0==a.get("token")?setTimeout(s,1e3):"/payment"==n.path()?setTimeout(r,1e3):$("#instruction-modal").hide(),$(".close-button").click(function(){$("#instruction-modal").hide()}),e.frequencies=["Weekly","Bi-weekly","Monthly"],e.states=["AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"],e.grinds=[{option:"Extra coarse"},{option:"Coarse"},{option:"Medium-coarse"},{option:"Medium"},{option:"Medium-fine"},{option:"Fine"},{option:"Extra fine"}],e.register=function(){console.log(e.username),t.post(l+"/register",{username:e.username,password:e.password,password2:e.password2,email:e.email}).then(function s(t){"inUse"===t.data.taken&&"no match"===t.data.message?e.errorMessage=!0:"inUse"===t.data.taken||"no match"===t.data.message?e.errorMessage=!0:e.errorMessage=!1,"inUse"===t.data.taken?e.userExists=!0:e.userExists=!1,"no match"===t.data.message?(e.noMatch=!0,console.log("passwords dont match")):e.noMatch=!1,"User Added"===t.data.message&&(o.username=t.data.username,a.put("token",t.data.token),a.put("username",e.username),o.loggedOut=!0,n.path("/options"),console.log(t.data))},function r(e){console.log(e.data)})},e.login=function(){t.post(l+"/login",{username:e.username,password:e.password}).then(function s(t){"badPass"===t.data.failure?(e.errorMessage=!0,e.noMatch=!0,console.log("bad password")):(e.errorMessage=!1,e.noMatch=!1),"userFound"===t.data.success&&(o.username=t.data.username,o.loggedOut=!0,a.put("token",t.data.token),a.put("username",e.username),n.path("/options")),"noUser"===t.data.failure&&console.log("Incorrect password")},function r(e){console.log(e)})},e.go=function(){void 0===a.get("token")?n.path("/login"):n.path("/options")},e.payOrder=function(){e.errorMessage="";var o=StripeCheckout.configure({key:"pk_test_ZJna4w56Eih7glMjoWk8csQA",image:"css/images/brand.png",locale:"auto",token:function(o){console.log("The token Id is: "),console.log(o.id),t.post(l+"/stripe",{amount:100*a.get("total"),stripeToken:o.id,token:a.get("token")}).then(function s(o){console.log(o.data),o.data.success?n.path("/receipt"):e.errorMessage=o.data.message},function r(e){console.log(e)})}});o.open({name:"DC Roasters",description:"A Better Way To Grind",amount:100*e.total})},e.logout=function(){o.loggedOut=!0,a.put("token",""),a.remove("token"),a.remove("username"),console.log("hello"),n.path("/")},e.optionsForm=function(o){var s,r,i,d;1===o?(i="Weekly",s="7.00",d="0.35",r=e.grindTypeSolo):2===o?(i="Weekly",d="0.9",s="18.00",r=e.grindTypeFamily):(i=e.frequency,d=e.quantity,s=String(20*e.quantity),r=e.grindTypeCustom),t.post(l+"/options",{username:a.get("username"),frequency:i,amount:d,weeklyTotal:s,grindType:r}).then(function u(e){"updated"===e.data.message&&n.path("/delivery")},function m(e){console.log(e)})},e.deliverForm=function(){t.post(l+"/delivery",{username:a.get("username"),fullName:e.fullName,address:{address1:e.address1,address2:e.address2,city:e.city,state:e.state,zipCode:e.zipCode}}).then(function o(e){console.log(e.data.message),n.path("/payment")},function s(e){console.log(e)})},e.payment=function(){console.log("submitted payment")}});eComApp.config(function(e){e.when("/",{templateUrl:"views/main.html",controller:"mainController"}),e.when("/login",{templateUrl:"views/login.html",controller:"mainController"}),e.when("/register",{templateUrl:"views/register.html",controller:"mainController"}),e.when("/options",{templateUrl:"views/selection.html",controller:"mainController"}),e.when("/delivery",{templateUrl:"views/delivery.html",controller:"mainController"}),e.when("/payment",{templateUrl:"views/payment.html",controller:"mainController"}).otherwise({redirectTo:"/"})});
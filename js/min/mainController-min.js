var eComApp=angular.module("ecommerceApp",["ngRoute","ngCookies"]),eController=eComApp.controller("mainController",function(e,t,o,n,a,s){function r(){$("#instruction-modal").show().css({left:"0px",top:"120px",marginLeft:"auto",marginRight:"auto"}),$(".modal-text").html("For a complete experience, register with fake information")}function i(){$("#instruction-modal").show().css({position:"fixed",left:"10px",top:"165px",margin:"0"}),$(".modal-text").html("Use Card #<br>4242 4242 4242 4242<br>to test payment. <br>Any Exp Date after current year. <br>Any CVC.")}function l(){s.get("token")&&o.get(c+"/getUserData?token="+s.get("token")).then(function n(o){"badToken"===o.data.failure?a.path="/login":"noToken"===o.data.failure?a.path("/login"):(console.log(o.data),s.put("total",o.data.document.weeklyTotal),console.log(o.data.order),e.userInfo=o.data,e.username=o.data.username,t.loggedOut=!0)},function r(e){console.log(e)})}e.test="yo",e.userExists=!1;var c="http://52.34.40.208:3000";l();var d="sk_test_s0Z6wAo5DRnEVbbwUeD876n1",u="pk_test_ZJna4w56Eih7glMjoWk8csQA",m="sk_live_7foZ0QdZJoeKyiUvFt0YT7LA",p="pk_live_drxWAZfUCsKUQUUVIOvLpbd6";"/"==a.path()&&void 0==s.get("token")?setTimeout(r,1e3):"/payment"==a.path()?setTimeout(i,1e3):$("#instruction-modal").hide(),$(".close-button").click(function(){$("#instruction-modal").hide()}),e.frequencies=["Weekly","Bi-weekly","Monthly"],e.states=["AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"],e.grinds=[{option:"Extra coarse"},{option:"Coarse"},{option:"Medium-coarse"},{option:"Medium"},{option:"Medium-fine"},{option:"Fine"},{option:"Extra fine"}],e.register=function(){console.log(e.username),o.post(c+"/register",{username:e.username,password:e.password,password2:e.password2,email:e.email}).then(function n(o){"inUse"===o.data.taken&&"no match"===o.data.message?e.errorMessage=!0:"inUse"===o.data.taken||"no match"===o.data.message?e.errorMessage=!0:e.errorMessage=!1,"inUse"===o.data.taken?e.userExists=!0:e.userExists=!1,"no match"===o.data.message?(e.noMatch=!0,console.log("passwords dont match")):e.noMatch=!1,"User Added"===o.data.message&&(t.username=o.data.username,s.put("token",o.data.token),s.put("username",e.username),t.loggedOut=!0,a.path("/options"),console.log(o.data))},function r(e){console.log(e.data)})},e.login=function(){o.post(c+"/login",{username:e.username,password:e.password}).then(function n(o){"badPass"===o.data.failure?(e.errorMessage=!0,e.noMatch=!0,console.log("bad password")):(e.errorMessage=!1,e.noMatch=!1),"userFound"===o.data.success&&(t.username=o.data.username,t.loggedOut=!0,s.put("token",o.data.token),s.put("username",e.username),a.path("/options")),"noUser"===o.data.failure&&console.log("Incorrect password")},function r(e){console.log(e)})},e.go=function(){void 0===s.get("token")?a.path("/login"):a.path("/options")},e.payOrder=function(){e.errorMessage="";var t=StripeCheckout.configure({key:"pk_test_ZJna4w56Eih7glMjoWk8csQA",image:"css/images/brand.png",locale:"auto",token:function(t){console.log("The token Id is: "),console.log(t.id),o.post(c+"/stripe",{amount:100*s.get("total"),stripeToken:t.id,token:s.get("token")}).then(function n(t){console.log(t.data),"Yess!"===t.data.success?a.path("/receipt"):(e.errorMessage=t.data.message,a.path("/receipt"))},function r(e){console.log(e)})}});t.open({name:"DC Roasters",description:"A Better Way To Grind",amount:100*e.total})},e.logout=function(){t.loggedOut=!0,s.put("token",""),s.remove("token"),s.remove("username"),n.location.reload(),"/"!==a.url()&&a.path("/")},e.optionsForm=function(t){var n,r,i,l;1===t?(i="Weekly",n="7.00",l="0.35",r=e.grindTypeSolo):2===t?(i="Weekly",l="0.9",n="18.00",r=e.grindTypeFamily):(i=e.frequency,l=e.quantity,n=String(20*e.quantity),r=e.grindTypeCustom),o.post(c+"/options",{username:s.get("username"),frequency:i,amount:l,weeklyTotal:n,grindType:r}).then(function d(e){"updated"===e.data.message&&a.path("/delivery")},function u(e){console.log(e)})},e.deliverForm=function(){o.post(c+"/delivery",{username:s.get("username"),fullName:e.fullName,address:{address1:e.address1,address2:e.address2,city:e.city,state:e.state,zipCode:e.zipCode}}).then(function t(e){console.log(e.data.message),a.path("/payment")},function n(e){console.log(e)})},e.payment=function(){console.log("submitted payment")}});eComApp.config(function(e){e.when("/",{templateUrl:"views/main.html",controller:"mainController"}),e.when("/login",{templateUrl:"views/login.html",controller:"mainController"}),e.when("/register",{templateUrl:"views/register.html",controller:"mainController"}),e.when("/options",{templateUrl:"views/selection.html",controller:"mainController"}),e.when("/delivery",{templateUrl:"views/delivery.html",controller:"mainController"}),e.when("/payment",{templateUrl:"views/payment.html",controller:"mainController"}),e.when("/receipt",{templateUrl:"views/receipt.html",controller:"mainController"}).otherwise({redirectTo:"/"})});
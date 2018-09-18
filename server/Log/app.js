
var time = require("../Time")

function Log(component){
  var component = component;

  this.log = function(message){
    if(component == undefined)
      console.log(time.now() + ": " + message)
    else
      console.log(time.now() + " <" + component + ">: " + message)
  }
}

module.exports = function(component){
  return new Log(component)
}



const moment = require('moment');


function BufferedLog(sink, compont){
  const component = (compont == undefined) ? "<Undefined>" : compont;
  this.log = function(message){
    sink.addEvent(component, message);
  }
}



function makeLogFactory() {
  const time = require("../Time");
  const logSize = 1000;
  let end = 0;
  let events = [];
  
  function getEvents() {
    const results = [];
    for(i = end; i< events.length; i++){
      const event = events[i]
      results.push(event);
    }
    for(i = 0; i< end; i++){
      const event = events[i]
      results.push(event);
    }
    return results;
  }

  this.eventToString = function(event){
    return event.time + " - " + event.component + " - " + event.message;
  }

  this.getEvents = function() {
    return getEvents();
  }

  this.getEventsAsStrings = function() {
    return getEvents().map(event => eventToString(event));
  }

  this.addEvent =function(component, msg){
    const event = {
        time: moment(time.now()).format("YYYY MM DD HH:mm:ss"), 
        component: component, 
        message: msg};
    if(events.length < logSize)
      events.push(event)
    else
      events[end] = event
      
      end = end+1;
    if (end == logSize)
      end = 0;
    console.log(eventToString(event))
  }

  this.createLogger = function(component){
    return new BufferedLog(this, component)
  }

  return this;
}


module.exports = makeLogFactory()

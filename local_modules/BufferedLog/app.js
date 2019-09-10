
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
  
  this.eventToString = function(event){
    return event.time + " - " + event.component + " - " + event.mes;
  }

  this.getEvents = function() {
    const results = [];
    for(i = end; i< events.length; i++){
      const event = events[i]
      results.push(eventToString(event));
    }
    for(i = 0; i< end; i++){
      const event = events[i]
      results.push(eventToString(event));
    }
    return results;
  }

  this.addEvent =function(component, message){
    const event = {time: time.now(), component: component, mes: message};
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

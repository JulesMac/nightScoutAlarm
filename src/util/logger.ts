
import configRoot from "../Config/config" 
import moment from 'moment'
import {Time} from "./time"


export class Logger{

  readonly component : string
  public readonly sink : LogFactory
  
  constructor(sink: LogFactory, component: string) {
    this.component = (component == undefined) ? "<Undefined>" : component
    this.sink = sink
  }

  public log = (message: string) => {
    this.sink.addEvent(this.component, message);
  }
}

class Event{
  readonly time: string
  readonly component: string
  readonly message: string

  constructor(time: string, component: string, message: string){
    this.time = time
    this.component = component
    this.message = message
  }
}


export class LogFactory {
  readonly config = configRoot.logger
  readonly logSize = this.config.logSize;
  end = 0;
  events : Event[] = [];
  
  constructor(){
    this.addEvent("logger", "Log size: " + this.logSize);
  }

  getEvents() {
    var results  = [];
    var i : number;
    for(i = this.end; i< this.events.length; i++){
      const event = this.events[i]
      results.push(event);
    }
    for(i = 0; i< this.end; i++){
      const event = this.events[i]
      results.push(event);
    }
    return results;
  }

  eventToString(event: Event){
    return event.time + " - " + event.component + " - " + event.message
  }

  getEventsAsStrings() {
    return this.getEvents().map(this.eventToString)
  }

  addEvent(component : string, msg : string){
    const event = new Event(
        moment(Time.now()).format("YYYY MM DD HH:mm:ss"), 
        component, 
        msg)
    if(this.events.length < this.logSize)
      this.events.push(event)
    else
      this.events[this.end] = event
      
      this.end = this.end+1;
    if (this.end == this.logSize)
      this.end = 0;
    console.log(this.eventToString(event))
  }

  createLogger(component: string){
    return new Logger(this, component)
  }
}

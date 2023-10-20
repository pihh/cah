import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor() { }

  public info(instance:any,callerName:any,...args: any[]){
    console.info(`[${instance.constructor.name}:${callerName}]`,args)
  }
  public warn(instance:any,callerName:any,...args: any[]){
    console.warn(`[${instance.constructor.name}:${callerName}]`,args)
  }
}



import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game.service';
import { StepService } from 'src/app/services/step.service';
import Swiper from 'swiper';
//import { Swiper, SwiperOptions } from 'swiper';//Inside the class we will add our swiper properties, add some dummy slides, set up our swiper config, and initialize the swiper:

const LOREM = `Lorem ipsum dolor sit amet consectetur adipisicing elit.
Necessitatibus ratione eligendi amet facere odio iste dolores
perferendis corporis aperiam, tempore, id recusandae labore deleniti
harum expedita illum nobis! Quo cupiditate beatae numquam velit
nostrum, optio voluptates quaerat nihil incidunt.`

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  swiper?: any | Swiper;
  @ViewChild('swiperRef')
  swiperRef: ElementRef | undefined;
  slides: Array<any> = [
    {
      title: "Welcome",
      description : LOREM,
      image: "https://picsum.photos/500/200"
    },
    {
      title: "Game rules",
      description : LOREM,
      image: "https://picsum.photos/500/200"
    },
    {
      title: "Game controls",
      description : LOREM,
      image: "https://picsum.photos/500/200"
    },
    {
      title: "Get started",
      description : LOREM,
      image: "https://picsum.photos/500/200",
      button: true
    },
  ]

  constructor(public gameService: GameService, public router:Router){
    //this.name = this.gameService.username
    if(this.isFirstTime()){
      this.showWizard()
    }
  }


  ngAfterViewInit() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
    this.swiper.on('reachEnd',function(){console.log('tau')})
    this.swiper.on('sliderMove',function(){console.log('sliderMove')})

  }

  public config: any = {
    slidesPerView: 1,
    // spaceBetween: 25,
    allowSlidePrev: false,
    // navigation:{
    //   enabled:false
    // },
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 1,
      },
      1280: {
        slidesPerView: 1,
      }
    },
    navigation: false,
  }

  public isFirstTime(){
    const username = this.gameService.username;
    const uuid = this.gameService.connection;
    if(username == "" || uuid == ""){
      //this.router.navigate(['/game']);
      return true
    }
    return false;
  }

  get wizardOpen(){
    return  !this.wizardComplete
  }

  public wizardComplete:boolean = true;
  showWizard(){
    this.wizardComplete = false;
  }

  closeWizard(){
    console.log('close wizard')
    this.wizardComplete = true
    console.log('close wizard',this.wizardComplete,this.wizardOpen)
  }


  ngOnInit(): void {

  }


  connect(){

    if(this.gameService.username.trim().length > 3){
      this.gameService.setUsername(this.gameService.username)
      this.gameService.updateUsername();
      // this.gameService.setName(this.name.trim());
      //this.gameService.setUsername(this.name.trim())
      //this.gameService.connect()
      this.router.navigate(['/game'])
    }
  }



}

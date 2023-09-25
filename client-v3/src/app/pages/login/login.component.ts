import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  name = ""

  constructor(public gameService: GameService, public router:Router){

  }
  connect(){
    if(this.name.trim().length > 3){
      // this.gameService.setName(this.name.trim());
      this.gameService.setUsername(this.name.trim())
      this.gameService.connect()
      this.router.navigate(['/game'])
    }
  }
}

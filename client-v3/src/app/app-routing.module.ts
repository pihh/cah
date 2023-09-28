import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { GameComponent } from './pages/game/game.component';
import { connectionGuard } from './guard/connection.guard';

const routes: Routes = [
  {path: "", component: HomeComponent,canActivate:[connectionGuard]},
  {path: "game", component: HomeComponent,canActivate:[connectionGuard]},
  {path:"login", component: LoginComponent},
  {path:"vote", component: GameComponent,canActivate:[connectionGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    useHash: true,
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }

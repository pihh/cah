import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { GameComponent } from './pages/game/game.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "game", component: HomeComponent},
  {path:"login", component: LoginComponent},
  {path:"vote", component: GameComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

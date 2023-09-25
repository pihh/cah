import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const connectionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const connection = localStorage.getItem('connection-identifier') || ""
  const name = localStorage.getItem('username-identifier') || ""
  if(connection =='' || name ==''){
    router.navigate(['/login'])
  }
  return connection !='' || name !=''
};

/*
constructor(private authService: AuthService, private router: Router){};
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):boolean {
      console.log('CanActivate called');
    let isLoggedIn = this.authService.isAuthenticated();
    if (isLoggedIn){
      return true
    } else {
      this.router.navigate(['/contact']);
    }
  }
  */

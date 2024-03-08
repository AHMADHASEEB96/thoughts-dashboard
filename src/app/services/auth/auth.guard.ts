import { CanActivateFn } from '@angular/router';


export const authGuard: CanActivateFn = (route, state) => {
  return true;
};

// this auth guard seems to be through a lot of changes because CanActivate interface is deprecated, so study the section and then implement the auth guard to this application

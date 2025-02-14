import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'log-in' },
  {
    path: 'log-in',
    loadChildren: () =>
      import('./components/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./components/sign-up/sign-up.module').then((m) => m.SignUpModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}

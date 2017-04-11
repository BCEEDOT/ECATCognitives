import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: AppComponent},
  {path: '', redirectTo: '', pathMatch: 'full'}
  //{ path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [

];

//Uses old style routing for older browsers eg... http://localhost/#/Home
// export const appRoutes: any = RouterModule.forRoot(routes, { useHash: true });

export const appRoutes: any = RouterModule.forRoot(routes);

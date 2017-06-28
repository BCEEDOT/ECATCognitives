import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRouteSnapshot } from '@angular/router';

import { UserAuthGuard } from '../core/services/user-auth-guard.service';
import { CognitivesComponent } from './cognitives.component';
import { UserDataContext } from "../core/services/data/user-data-context.service";
import { AssessComponent } from './assess/assess.component';
import { ResultComponent } from './result/result.component';


const cognitivesRoutes: Routes = [
  {
    path: 'cognitives',
    component: CognitivesComponent,
    canActivate: [UserAuthGuard],
    resolve: { results: 'resultsResolver' },
  },
  {
    path: 'cognitive/result/:cogId',
    component: ResultComponent,
    canActivate: [UserAuthGuard],
  },
  {
    path: 'cognitive/assess/:cogId',
    component: AssessComponent,
    resolve: { assess: 'assessResolver' },
    canActivate: [UserAuthGuard],
  }
];

export function resultsResolver(userDataContext: UserDataContext) {
  return (route: ActivatedRouteSnapshot) => userDataContext.getCogResults(true);
}

export function assessResolver(userDataContext: UserDataContext) {
  return (route: ActivatedRouteSnapshot) => userDataContext.getCogInst(+route.params['cogId']);
}

@NgModule({
  imports: [
    RouterModule.forChild(cognitivesRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers:
  [
    {
      provide: 'resultsResolver', useFactory: resultsResolver, deps: [UserDataContext]
    },
    {
      provide: 'assessResolver', useFactory: assessResolver, deps: [UserDataContext]
    }
  ]
})

export class CognitivesRoutingModule { }
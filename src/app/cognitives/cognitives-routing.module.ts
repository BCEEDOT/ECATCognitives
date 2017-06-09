import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRouteSnapshot } from '@angular/router';

import { UserAuthGuard } from '../core/services/user-auth-guard.service';
import { CognitivesComponent } from './cognitives.component';
import { ResultComponent } from './result/result.component';


const cognitivesRoutes: Routes = [
  {
    path: 'cognitives',
    component: CognitivesComponent,
    canActivate: [UserAuthGuard],
    children: [
      {
        path: 'result/:cogId',
        component: ResultComponent,

      }
    ]
  }
];

export function resultResolver(cognitivesComponent: CognitivesComponent) {
  return (route: ActivatedRouteSnapshot) => cognitivesComponent.activate();
}

@NgModule({
  imports: [
    RouterModule.forChild(cognitivesRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers:
  [{
    provide: 'resultResolver', useFactory: resultResolver, deps: [CognitivesComponent]
  }]
})

export class CognitivesRoutingModule { }
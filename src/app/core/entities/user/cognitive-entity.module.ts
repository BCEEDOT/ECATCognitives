import { NgModule } from '@angular/core';
import { CognitiveRegistrationHelper } from './regHelper';
import { CogEcmspeResult } from './cogEcmspeResult';
import { CogInstrument } from './cogInstrument';
import { CogInventory } from './cogInventory';
import { Person } from './person';
import { ProfileFaculty } from './profileFaculty';
import { RoadRunner } from './roadRunner';
import { Security } from './security';
import { ProfileStudent } from './profileStudent';
import { CogEcpeResult } from './cogEcpeResult';
import { CogEsalbResult } from './cogEsalbResult';
import { CogEtmpreResult } from './cogEtmpreResult';
import { CogResponse } from './cogResponse';

@NgModule({
  declarations: [],
  providers: [CognitiveRegistrationHelper]
})
export class EntityCognitiveModule { }

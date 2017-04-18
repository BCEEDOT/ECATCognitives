import { Entity, EntityAspect, EntityType } from 'breeze-client';
import { Person } from "./user/person";


export interface IdToken {

   email: string;
   lastName: string;
   firstName: string;
   mpGender: string;
   mpAffiliation: string;
   mpPaygrade: string;
   mpComponent: string;
   mpInstituteRole: string;

}
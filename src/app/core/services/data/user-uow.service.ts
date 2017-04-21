import { Injectable } from '@angular/core';

import { UnitOfWork, IRepository } from '../../../shared/services';
import { EmProviderService } from '../em-provider.service';
import { Person } from '../../entities/user';
import { DataContext, UserResources } from '../../../app-constants';

@Injectable()
export class UserUow extends UnitOfWork {

    person: IRepository<Person>;

    /**
     *
     */
    constructor(emProvider: EmProviderService) {
        super(DataContext.User, emProvider);
        this.person = this.createRepository<Person>('Person', UserResources.getUsers, true);
        console.log(this.person);
    }
}

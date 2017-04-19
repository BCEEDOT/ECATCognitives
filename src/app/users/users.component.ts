import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MdSnackBar } from '@angular/material';

import { TdLoadingService, TdDialogService, TdMediaService } from '@covalent/core';

import { UsersService} from './services/users.service';
import { Person } from "../core/entities/user";
import { GlobalService } from "../core/services/global.service";

@Component({
  //Selector only needed if another template is going to refernece
  selector: 'qs-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
  //Limits only to current view and not children
  //viewProviders: [ UsersService ],
})
export class UsersComponent implements OnInit {

  person: Person[] = [];

  constructor(private titleService: Title,
              private router: Router,
              private loadingService: TdLoadingService,
              private dialogService: TdDialogService,
              private snackBarService: MdSnackBar,
              private usersService: UsersService,
              public media: TdMediaService,
              private global: GlobalService) {}

  goBack(route: string): void {
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    // broadcast to all listener observables when loading the page
    this.media.broadcast();
    this.titleService.setTitle( 'ECAT Users' );
    this.loadUsers();
  }

  loadUsers(): void {
    //maps to ng-template tag
    this.loadingService.register('users.list');
    this.usersService.getUsers()
    .then(person => { 
      this.person = person
      this.loadingService.resolve('users.list');
  });
    
  }
  

  // loadUsers(): void {
  //   this._loadingService.register('users.list');
  //   this._usersService.query().subscribe((users: IUser[]) => {
  //     this.users = users;
  //     this.filteredUsers = users;
  //     this._loadingService.resolve('users.list');
  //   }, (error: Error) => {
  //     this._usersService.staticQuery().subscribe((users: IUser[]) => {
  //       this.users = users;
  //       this.filteredUsers = users;
  //       this._loadingService.resolve('users.list');
  //     });
  //   });
  // }

  // filterUsers(displayName: string = ''): void {
  //   this.filteredUsers = this.users.filter((user: IUser) => {
  //     return user.displayName.toLowerCase().indexOf(displayName.toLowerCase()) > -1;
  //   });
  // }

  // deleteUser(id: string): void {
  //   this._dialogService
  //     .openConfirm({message: 'Are you sure you want to delete this user?'})
  //     .afterClosed().subscribe((confirm: boolean) => {
  //       if (confirm) {
  //         this._loadingService.register('users.list');
  //         this._usersService.delete(id).subscribe(() => {
  //           this.users = this.users.filter((user: IUser) => {
  //             return user.id !== id;
  //           });
  //           this.filteredUsers = this.filteredUsers.filter((user: IUser) => {
  //             return user.id !== id;
  //           });
  //           this._loadingService.resolve('users.list');
  //           this._snackBarService.open('User deleted', 'Ok');
  //         }, (error: Error) => {
  //           this._dialogService.openAlert({message: 'There was an error'});
  //           this._loadingService.resolve('users.list');
  //         });
  //       }
  //     });
  // }

}

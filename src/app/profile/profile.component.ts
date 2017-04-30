import { Component, AfterViewInit, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MdSnackBar } from '@angular/material';
import { TdLoadingService, TdDialogService, TdMediaService } from '@covalent/core';

//import { ProfileService } from './services/profile.service';
import { ProfileStudent } from "../core/entities/user";
import { GlobalService } from "../core/services/global.service";
import { UserDataContext } from "../core/services/data/user-data-context.service";

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile: ProfileStudent = <ProfileStudent>{};
  prettyName: string;
  isEditing: Boolean = false;
  //affiliationList = this.dCtx.static.milAffil;
  //componentList = this.dCtx.static.milComponent;

  constructor(private titleService: Title,
    private router: Router,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    private snackBarService: MdSnackBar,
    private global: GlobalService,
    private userDataContext: UserDataContext,
    public media: TdMediaService) { }

  goBack(route: string): void {
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    // broadcast to all listener observables when loading the page
    this.media.broadcast();
    this.titleService.setTitle('Profile');
    this.loadingService.register('profileIsLoaded');
    this.loadProfile();
    console.log("It is loading profile object from the ngoninit");
    console.log(this.profile);
  };

  setPrettyName() {
    this.prettyName = `${this.profile.person.firstName} ${this.profile.person.lastName}`;
  };

  editProfile() {
    this.isEditing = !this.isEditing;
    console.log(this.isEditing);
    console.log("You clicked edit");
  };

  saveProfile() {

    console.log(this.profile);
    this.userDataContext.commit()
      .then((res) => {
        console.log(res);
        console.log('Your changes were successfully saved!');
        this.isEditing = false;
      })
      .catch((error) => {
        console.log(error);
        console.log('Unable to save changes, Please try again later!');
      });
  }

  cancelSave() {
    this.isEditing = false;
    this.profile.person.entityAspect.rejectChanges();
  };

  loadProfile(): void {

    this.userDataContext.getProfile()
      .then((profile) => {
        this.profile = profile
        console.log(this.profile);
        this.setPrettyName();
        this.loadingService.resolve('profileIsLoaded');
      })
      .catch(e => {
        this.loadingService.resolve('profileIsLoaded');
        console.log('error getting user profile');
        console.log(e);
      });
  }


}

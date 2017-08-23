import { Component, AfterViewInit, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MdSnackBar } from '@angular/material';
import { TdLoadingService, TdDialogService, TdMediaService } from '@covalent/core';

//import { ProfileService } from './services/profile.service';
import { Person } from "../core/entities/user";
import { GlobalService, ILoggedInUser } from "../core/services/global.service";
import { UserDataContext } from "../core/services/data/user-data-context.service";
import { MpGender, MpAffiliation, MpComponent, MpPaygrade } from "../core/common/mapStrings";
import { EcLocalDataService } from "../core/common/static";

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  viewProviders: [EcLocalDataService]
})
export class ProfileComponent implements OnInit, AfterViewInit {

  userRoles: ILoggedInUser;
  user: Person;
  prettyName: string;
  isEditing: boolean = false;
  jwtRegistrationComplete: boolean;
  gender = MpGender;
  profileLoading = 'profileLoading';
  payGradeList;
  affiliationList;
  componentList;

  constructor(private titleService: Title,
    private router: Router,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    private snackBarService: MdSnackBar,
    private global: GlobalService,
    private userDataContext: UserDataContext,
    public media: TdMediaService,
    public ecLocal: EcLocalDataService) { }

  goBack(route: string): void {
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    // broadcast to all listener observables when loading the page
    //this.media.broadcast();
    this.titleService.setTitle('Profile');
    this.loadingService.register(this.profileLoading);
    this.loadProfile();
    this.payGradeList = this.ecLocal.milPaygradeList;
    this.affiliationList = this.ecLocal.milAffil;
    this.componentList = this.ecLocal.milComponent;
    this.user = this.global.persona.value.person;
  };

  ngAfterViewInit() {
    this.jwtRegistrationComplete = this.user.registrationComplete;
  }

  checkComplete(): void {
    if (this.user.registrationComplete) {
      if (this.user.registrationComplete && !this.jwtRegistrationComplete) {
        this.router.navigate(['/dashboard']);
      }
    } else {
      this.isEditing = true;
      this.dialogService.openAlert({
        message: 'You must complete your profile before using the app.',
        title: 'Profile is not Complete',
        closeButton: 'Dismiss'
      });
    };
  };

  canSave(): boolean {
    if (this.userDataContext.getChanges()) {
      return false;
    } else {
      return true;
    }
  }

  cancelSave() {
    this.isEditing = false;
    this.user.entityAspect.rejectChanges();
  };

  editProfile() {
    this.isEditing = !this.isEditing;
  };

  loadProfile(): void {

    this.userDataContext.getProfile()
      .then(() => {
        //No processing of results. The getProfile method attaches the profiles to the global person object
        this.userRoles = this.global.persona.value;
        console.log(this.user);
        this.setPrettyName();
        this.checkComplete();
        this.loadingService.resolve(this.profileLoading);
      })
      .catch(e => {
        this.loadingService.resolve(this.profileLoading);
      });
  }

  saveProfile() {
    this.loadingService.register(this.profileLoading);
    if (this.user.mpAffiliation !== MpAffiliation.unk && this.user.mpComponent !== MpComponent.unk && this.user.mpGender !== MpGender.unk && this.user.mpPaygrade !== MpPaygrade.unk) {
      this.user.registrationComplete = true;
    }

    this.userDataContext.commit()
      .then((res) => {
        this.loadingService.resolve(this.profileLoading);
        this.snackBarService.open('Profile Updated', 'Dismiss', { duration: 2000 });
        this.isEditing = false;
      })
      .catch((error) => {
        this.loadingService.resolve(this.profileLoading);
        this.dialogService.openAlert({
          message: 'There was an error updating your profile. Please try again.',
          title: 'Error',
          closeButton: 'Ok'
        });
      });
  }

  setPrettyName() {
    this.prettyName = `${this.user.firstName} ${this.user.lastName}`;
  };

  updatePayGradeList(): void {
    const userWPaygrade = this.ecLocal.updatePayGradeList(this.user);

    if (userWPaygrade) {
      this.user = userWPaygrade.user;
      this.payGradeList = userWPaygrade.paygradelist;
    }
  }
}

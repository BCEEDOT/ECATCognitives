import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MdSnackBar } from '@angular/material';

import { TdLoadingService, TdDialogService, TdMediaService } from '@covalent/core';

import { ProfileService} from './services/profile.service';
import { ProfileStudent } from "../core/entities/user";

@Component({
  //Selector only needed if another template is going to refernece
  selector: 'qs-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  viewProviders: [ ProfileService ],
})
export class ProfileComponent implements OnInit {

  profile: ProfileStudent;

  constructor(private titleService: Title,
              private router: Router,
              private loadingService: TdLoadingService,
              private dialogService: TdDialogService,
              private snackBarService: MdSnackBar,
              private profileService: ProfileService,
              public media: TdMediaService) {}

  goBack(route: string): void {
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    // broadcast to all listener observables when loading the page
    this.media.broadcast();
    this.titleService.setTitle( 'Profile' );
    this.loadProfile();
  }

  loadProfile(): void {
    //maps to ng-template tag
    this.loadingService.register('users.list');
    this.profileService.getProfile()
    .then(profile => { 
      this.profile = profile
      console.log(this.profile);
      this.loadingService.resolve('users.list');
  });
    
  }

}

import { Component, AfterViewInit, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MdSnackBar } from '@angular/material';

import { TdLoadingService, TdDialogService, TdMediaService } from '@covalent/core';

import { ProfileService } from './services/profile.service';
import { ProfileStudent } from "../core/entities/user";

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  viewProviders: [ProfileService],
})
export class ProfileComponent implements AfterViewInit {

  profile: ProfileStudent = <ProfileStudent>{};

  constructor(private titleService: Title,
    private router: Router,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    private snackBarService: MdSnackBar,
    private profileService: ProfileService,
    public media: TdMediaService) { }

  goBack(route: string): void {
    this.router.navigate(['/']);
  }

  ngAfterViewInit(): void {
    // broadcast to all listener observables when loading the page
    this.media.broadcast();
    this.titleService.setTitle('Profile');
    this.loadProfile();
    console.log(this.profile);
  }

  loadProfile(): void {

  }


}

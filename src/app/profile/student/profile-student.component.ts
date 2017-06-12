import { Component, OnInit, Input } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { TdLoadingService, TdDialogService, TdMediaService } from '@covalent/core';

import { ProfileStudent } from "../../core/entities/user";
import { UserDataContext } from "../../core/services/data/user-data-context.service";

@Component({
  selector: 'ecat-profile-student',
  templateUrl: './profile-student.component.html',
  styleUrls: ['./profile-student.component.scss']
})
export class ProfileStudentComponent implements OnInit {
  @Input() profile: ProfileStudent;

  isEditing: boolean = false;
  profileLoading = 'studentProfileLoading';

  constructor(private loadingService: TdLoadingService, private snackBarService: MdSnackBar, 
  private dialogService: TdDialogService, private userDataContext: UserDataContext) { }

  ngOnInit() {
    //console.log("this is the profile from profile-main");
    console.log(this.profile);
  }

  cancelStudentSave() {
    this.isEditing = false;
    this.profile.entityAspect.rejectChanges();
  }
  
  editStudentProfile() {
    this.isEditing = !this.isEditing;
  }

  saveStudentProfile() {
    this.loadingService.register(this.profileLoading);

    this.userDataContext.commit()
      .then((res) => {
        this.loadingService.resolve(this.profileLoading);
        this.snackBarService.open('Student Profile Updated', 'Dismiss');
        this.isEditing = false;
      })
      .catch((error) => {
        this.loadingService.resolve(this.profileLoading);
        this.dialogService.openAlert({
          message: 'There was an error updating your student profile. Please try again.',
          title: 'Error',
          closeButton: 'Ok'
        });
      });
  }


}

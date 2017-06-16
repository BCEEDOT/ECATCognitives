import { Component, OnInit } from '@angular/core'
import { RoadrunnerService } from '../services/roadrunner.service';
import { UserDataContext } from "../../core/services/data/user-data-context.service";
import { RoadRunner } from "../../core/entities/user";
import { Router } from '@angular/router';


import { ActivatedRoute } from '@angular/router';

@Component({
    //selector: 'roadrunner-details',
    templateUrl: './roadrunner-details.component.html',
    styleUrls: ['./roadrunner-details.component.scss']

})

export class RoadrunnerDetailsComponent implements OnInit {

    event: RoadRunner[];
    leavedate: string;
    oneEvent: RoadRunner;
    tempEvent: RoadRunner;
    id: number;
    checkNew: string;
    isNew: boolean;

    constructor(private roadRunnerService: RoadrunnerService,
        private userDataContext: UserDataContext,
        private route: ActivatedRoute,
        //private global: GlobalService,   
        private router: Router) {

    }

    ngOnInit() {

        //this.getInfo();

        this.roadRunnerService.roadRunnerData.subscribe((road) => {
            console.log("roadrunner update")
            this.event = road;
            console.log(this.event)
        })
        console.log(this.event);

        this.checkNew = (this.route.snapshot.params['id']);

        console.log(this.checkNew);

        // if (this.isNewString === 'New') {
        //     this.isNew = false;
        // } else {
        //     this.isNew = true;
        // }


        //console.log(this.isNew);
        if (this.checkNew === "New") {
            console.log('new event');
            this.oneEvent = this.userDataContext.addRoadRunner();

            var today = new Date();
            this.oneEvent.leaveDate = today;
            this.oneEvent.returnDate = today;

            console.log(this.oneEvent);

        } else {
            this.id = (+this.route.snapshot.params['id']);
            this.event = this.event.filter(single => single.id === this.id);
            console.log(this.event);
            console.log(this.id);

            this.oneEvent = this.event.find(single => single.id === this.id);
            console.log(this.oneEvent);

            if(this.oneEvent.prevSignOut === true){
                this.tempEvent = this.oneEvent;
                
                this.oneEvent = this.userDataContext.addRoadRunner();

                var today = new Date();
                this.oneEvent.location = this.tempEvent.location;
                this.oneEvent.phoneNumber = this.tempEvent.phoneNumber;
                this.oneEvent.leaveDate = today;
            this.oneEvent.returnDate = today;
               //var today = new Date();




            }
            //this.oneEvent = this.roadRunnerService.roadRunnerData.value.roadrunner;
        }
    }

    cancel() {

        this.oneEvent.entityAspect.rejectChanges();
        // this.roadRunnerService.roadRunnerData.value.rejectChanges();
        //this.roadRunnerService.roadRunnerData.value.entityAspect.rejectChanges();
        //this.userDataContext.Entry(this.event).Reload();
        this.router.navigate(['roadrunnerStudent/']);
    }

    save() {
        this.userDataContext.commit()
            .then((res) => {
                console.log('check roadrunner database');
                this.router.navigate(['roadrunnerStudent/']);
            })

        
    }


    delete(){

        this.oneEvent.entityAspect.setDeleted();

        this.userDataContext.commit()
        .then((res) =>{
            console.log('check roadrunner database');
            this.router.navigate(['roadrunnerStudent/']);
        })

    }

}

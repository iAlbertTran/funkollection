import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router }      from '@angular/router';
import { FunkollectionApiService } from '../services/funkollection-api.service';
import { HelperService } from '../services/helper.service';
import { FunkoPop } from '../models/funkopop';
import swal from 'sweetalert2';
import * as $ from 'jquery';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', '../../assets/css/flip-card.css']
})
export class DashboardComponent implements OnInit {

  funkopops = [];

  loading = true;

  constructor(public router: Router, private apiService: FunkollectionApiService, private _helperService: HelperService) { }

  ngOnInit() {
    this.refreshDashboard();
  }

  refreshDashboard(){
    this.getRandomPops(20);
    this._helperService.getUserCollection();
    this._helperService.getUserWishlist();
  }
  getRandomPops(count : number){
    this.apiService.getRandomFunkoPops(count)
      .subscribe(
        res => { 
          if(res['statusCode'] == 200){

            //this.funkopops = res['funkopops'];
            let pops = res['funkopops'];
            let size = 0;

            setInterval(() =>{
              if(size == pops.length)
                return;
              this.funkopops.push(pops[size]);
              ++size;
            }, 50);
          }
        },
        err => {
          this._helperService.addErrorToMessages(this._helperService.getFunkoPopFailedMessage);
        }

      );
  }
}

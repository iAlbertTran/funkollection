import { Component, OnInit } from '@angular/core';
import { FunkollectionApiService } from '../services/funkollection-api.service';
import { HelperService } from '../services/helper.service';
import { FunkoPop } from '../models/funkopop';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  getFunkoPopFailedMessage: String = 'Unable to retrieve Pop! Vinyls';
  funkopops: FunkoPop[];

  constructor(private apiService: FunkollectionApiService, private _helperService: HelperService) { }

  ngOnInit() {
    this.getUserPops();
  }

  getUserPops(){
    this.apiService.getAllFunkoPops()
      .subscribe(
        res => { 
          if(res['statusCode'] == 200){
            var popArray = res['funkopops'];
            this.funkopops = popArray;
          }
        },
        err => {
          this._helperService.addErrorToMessages(this.getFunkoPopFailedMessage);
        }

      );
  }
}

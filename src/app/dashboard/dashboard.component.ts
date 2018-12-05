import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
            popArray.sort((a,b) => {
              return a.series.localeCompare(b.series) || a.category.localeCompare(b.category) || a.number - b.number || a.name.localeCompare(b.name);
            });
            this.funkopops = popArray;
          }
        },
        err => {
          this._helperService.addErrorToMessages(this.getFunkoPopFailedMessage);
        }

      );
  }

  showOverlay(id: string){
    let popOverlay = document.getElementById(id + '-pop-overlay');
    let popOptions = document.getElementById(id + '-overlay-options');
    let popName = document.getElementById(id + '-overlay-name');

    popOverlay.className = "pop-overlay opacity";
    popOptions.className  = "animated faster fadeInUp";
    popName.className = "pop-overlay-name animated faster fadeInDown";
  
  }

  hideOverlay(id: string){
    let popOverlay = document.getElementById(id + '-pop-overlay');
    let popOptions = document.getElementById(id + '-overlay-options');
    let popName = document.getElementById(id + '-overlay-name');

    popOverlay.className="pop-overlay";
    popOptions.className  = "animated faster fadeOutDown";
    popName.className = "pop-overlay-name animated faster fadeOutUp";
  }
}

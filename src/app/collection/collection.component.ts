import { Component, OnInit } from '@angular/core';
import { Router }      from '@angular/router';
import { FunkollectionApiService } from '../services/funkollection-api.service';
import { HelperService } from '../services/helper.service';
import { FunkoPop } from '../models/funkopop';
import * as $ from 'jquery';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {

  getFunkoPopFailedMessage: string = 'Unable to retrieve any Pop! Vinyls ';
  addFailedMessage: String = 'Unable to add ';
  removeFailedMessage: String = 'Unable to remove ';
  addSuccess: String = 'Successfully added ';
  removeSuccess: String = 'Successfully removed ';

  collection = [];
  wishlist = [];

  constructor(public router: Router, private apiService: FunkollectionApiService, private _helperService: HelperService) { }

  ngOnInit() {
    this.getUserCollection();
    this.getUserWishlist();
  }


  getUserCollection(){
    this.apiService.getUserCollection()
      .subscribe(
        res => { 
          if(res['statusCode'] == 200){
            let pops = res['funkopops'];
            let size = 0;

            setInterval(() =>{
              if(size == pops.length)
                return;
              this.collection.push(pops[size]);
              ++size;
            }, 50);
          }
        },
        err => {
          this._helperService.addErrorToMessages(this.getFunkoPopFailedMessage);
        }

      );
  }

  getUserWishlist(){
    this.apiService.getUserWishlistID()
      .subscribe(
        res => { 
          if(res['statusCode'] == 200){
            this.wishlist = res['funkopops'];
          }
        },
        err => {
          this._helperService.addErrorToMessages(this.getFunkoPopFailedMessage);
        }

      );
  }
  /*
  sortBySeries(popArray: FunkoPop[]){
    
    while(popArray != null && popArray.length > 0){
      let popJSON = {};
      let series = popArray[0].series;
      let popsInSeries = popArray.filter((pop) => {
        return pop.series == series;
      });
      
      let popCount = popsInSeries.length;
      popArray.splice(0, popCount);
      popJSON['seriesName'] = series;
      popJSON['popList'] = popsInSeries;
      
      this.funkopops.push(popJSON);
    }

  }
  */
}

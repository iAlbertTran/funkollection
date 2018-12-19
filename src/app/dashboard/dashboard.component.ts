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

  getFunkoPopFailedMessage: string = 'Unable to retrieve any Pop! Vinyls ';
  addFailedMessage: String = 'Unable to add ';
  removeFailedMessage: String = 'Unable to remove ';
  addSuccess: String = 'Successfully added ';
  removeSuccess: String = 'Successfully removed ';

  funkopops = [];
  collection = [];
  wishlist = [];

  constructor(public router: Router, private apiService: FunkollectionApiService, private _helperService: HelperService) { }

  ngOnInit() {
    this.refreshDashboard();
  }

  refreshDashboard(){
    this.getRandomPops(20);
    this.getUserCollection();
    this.getUserWishlist();
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
            }, 150);
          }
        },
        err => {
          this._helperService.addErrorToMessages(this.getFunkoPopFailedMessage);
        }

      );
  }

  getUserCollection(){
    this.apiService.getUserCollection()
      .subscribe(
        res => { 
          if(res['statusCode'] == 200){
            this.collection = res['funkopops'];
          }
        },
        err => {
          this._helperService.addErrorToMessages(this.getFunkoPopFailedMessage);
        }

      );
  }

  getUserWishlist(){
    this.apiService.getUserWishlist()
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

  addToCollection(id: string, name: string){
    $(`#${id}-collection-button`).addClass('animated faster pulse');

    setTimeout(() => {
      $(`#${id}-collection-button`).removeClass('animated faster pulse');
    }, 500);

    if(this.collection.includes(id)){
      this.removeFromCollection(id, name);
    }

    else{

      this.apiService.addToCollection(id).subscribe(
        res => { 
          this.getUserCollection();
          this._helperService.addSuccessToMessages(`${this.addSuccess} ${name} to collection!`);
        },
        err => {
          this.getUserCollection();
          this._helperService.addErrorToMessages(`${this.addFailedMessage} ${name} to collection!`);
        }

      );
    }
  }

  removeFromCollection(id: string, name: string){

    this.apiService.removeFromCollection(id).subscribe(
      res => { 
        this.getUserCollection();
        this._helperService.addSuccessToMessages(`${this.removeSuccess} ${name} from collection!`);

      },
      err => {
        this.getUserCollection();
        this._helperService.addErrorToMessages(`${this.removeFailedMessage} ${name} from collection!`);
      }

    );
  }

  addToWishlist(id: string, name: string){
    $(`#${id}-wishlist-button`).addClass('animated faster pulse');

    setTimeout(() => {
      $(`#${id}-wishlist-button`).removeClass('animated faster pulse');
    }, 500);

    if(this.wishlist.includes(id)){
      this.removeFromWishlist(id, name);
    }

    else{

      this.apiService.addToWishlist(id).subscribe(
        res => { 
          this.getUserWishlist();
          this._helperService.addSuccessToMessages(`${this.addSuccess} ${name} to wishlist!`);

        },
        err => {
          this.getUserWishlist();
          this._helperService.addErrorToMessages(`${this.addFailedMessage} ${name} to wishlist!`);
        }

      );
    }
  }

  removeFromWishlist(id: string, name: string){

    this.apiService.removeFromWishlist(id).subscribe(
      res => { 
        this.getUserWishlist();
        this._helperService.addSuccessToMessages(`${this.removeSuccess} ${name} from wishlist!`);

      },
      err => {
        this.getUserWishlist();
        this._helperService.addErrorToMessages(`${this.removeFailedMessage} ${name} from wishlist.`);
      }

    );
  }

  moreInformation(funkopop: FunkoPop){
    this._helperService.removeAllErrors();
    this._helperService.removeAllSuccess();
    let series: string = funkopop.series.toString().replace(/ /g, '-').toLowerCase();
    let category = funkopop.category.toString().replace(/ /g, '-').toLowerCase();
    let name = funkopop.name.replace(/ /g, '-').toLowerCase();

    this.router.navigate([`funko/${series}/${category}/${name}`]);
  }
}

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

  getFunkoPopFailedMessage: String = 'Unable to retrieve Pop! Vinyls';
  addFailedMessage: String = 'Unable to add Pop! Vinyl to your';
  removeFailedMessage: String = 'Unable to remove Pop! Vinyl from your';

  funkopops = [];
  collection = [];
  wishlist = [];

  constructor(public router: Router, private apiService: FunkollectionApiService, private _helperService: HelperService) { }

  ngOnInit() {
    this.refreshDashboard();
  }

  refreshDashboard(){
    this.getRandomPops();
    this.getUserCollection();
    this.getUserWishlist();
  }
  getRandomPops(){
    this.apiService.getRandomFunkoPops()
      .subscribe(
        res => { 
          if(res['statusCode'] == 200){

            this.funkopops = res['funkopops'];
            /*
            var popArray = res['funkopops'];
            
            popArray.sort((a,b) => {
              return a.series.localeCompare(b.series) || a.category.localeCompare(b.category) || a.number - b.number || a.name.localeCompare(b.name);
            });

            this.sortBySeries(popArray);*/
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

  addToCollection(id: string){
    $(`#${id}-collection-button`).addClass('animated faster pulse');

    setTimeout(() => {
      $(`#${id}-collection-button`).removeClass('animated faster pulse');
    }, 500);

    if(this.collection.includes(id)){
      this.removeFromCollection(id);
    }

    else{

      this.apiService.addToCollection(id).subscribe(
        res => { 
          this.getUserCollection();
        },
        err => {
          this.getUserCollection();
          this._helperService.addErrorToMessages(`${this.addFailedMessage} collection.`);
        }

      );
    }
  }

  removeFromCollection(id: string){

    this.apiService.removeFromCollection(id).subscribe(
      res => { 
        this.getUserCollection();

      },
      err => {
        this.getUserCollection();
        this._helperService.addErrorToMessages(`${this.removeFailedMessage} collection.`);
      }

    );
  }

  addToWishlist(id: string){
    $(`#${id}-wishlist-button`).addClass('animated faster pulse');

    setTimeout(() => {
      $(`#${id}-wishlist-button`).removeClass('animated faster pulse');
    }, 500);

    if(this.wishlist.includes(id)){
      this.removeFromWishlist(id);
    }

    else{

      this.apiService.addToWishlist(id).subscribe(
        res => { 
          this.getUserWishlist();
        },
        err => {
          this.getUserWishlist();
          this._helperService.addErrorToMessages(`${this.removeFailedMessage} wishlist.`);
        }

      );
    }
  }

  removeFromWishlist(id: string){

    this.apiService.removeFromWishlist(id).subscribe(
      res => { 
        this.getUserWishlist();

      },
      err => {
        this.getUserWishlist();
        this._helperService.addErrorToMessages(`${this.removeFailedMessage} wishlist.`);
      }

    );
  }

  moreInformation(funkopop: FunkoPop){
    let series: string = funkopop.series.toString().replace(/ /g, '-').toLowerCase();
    let category = funkopop.category.toString().replace(/ /g, '-').toLowerCase();
    let name = funkopop.name.replace(/ /g, '-').toLowerCase();

    this.router.navigate([`funko/${series}/${category}/${name}`]);
  }
}

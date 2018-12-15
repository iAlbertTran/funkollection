import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FunkollectionApiService } from '../services/funkollection-api.service';
import { HelperService } from '../services/helper.service';


@Component({
  selector: 'app-funkopop',
  templateUrl: './funkopop.component.html',
  styleUrls: ['./funkopop.component.css']
})
export class FunkopopComponent implements OnInit {

  series: string;
  category: string;
  name: string;
  basicInfo = null;

  collection = [];
  wishlist = [];
  seriespops = null;
  categorypops = null;

  getFunkoPopFailedMessage: string = 'Unable to retrieve information on Pop! Vinyl.';
  addFailedMessage: String = 'Unable to add Pop! Vinyl to your';
  removeFailedMessage: String = 'Unable to remove Pop! Vinyl from your';
  
  constructor(private route: ActivatedRoute, private apiService: FunkollectionApiService, private _helperService: HelperService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.series = params.get("series");
      this.category = params.get("category");
      this.name = params.get("name");

      this.getInfo();
      this.getUserCollection();
      this.getUserWishlist();
    })
  }

  getInfo(){
    this.apiService.getFunkoPop(this.series, this.category, this.name).subscribe(
      res => { 
        if(res['statusCode'] == 200){
          this.basicInfo = res['funkopop'];
          
          if(this.basicInfo == null){
            this._helperService.addErrorToMessages(this.getFunkoPopFailedMessage);
          }
          else{
            this.getPopsInSeries(this.basicInfo.series);
          }
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

  getPopsInSeries(series: string){
    console.log(series);
    this.apiService.getPopsInSeries(series)
      .subscribe(
        res => { 
          if(res['statusCode'] == 200){
            this.seriespops = res['funkopops'].filter( element => {
              return element.name != this.basicInfo.name;
            });
          }
        },
        err => {
        }

      );
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

}

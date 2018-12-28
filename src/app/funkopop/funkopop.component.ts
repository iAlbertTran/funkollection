import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FunkollectionApiService } from '../services/funkollection-api.service';
import { HelperService } from '../services/helper.service';
import * as moment from 'moment';

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

  availableEbayListings = null;
  ebaySearchText = null;

  getFunkoPopFailedMessage: string = 'Unable to retrieve information on ';
  addFailedMessage: String = 'Unable to add ';
  removeFailedMessage: String = 'Unable to remove ';
  addSuccess: String = 'Successfully added ';
  removeSuccess: String = 'Successfully removed ';
  
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
            this._helperService.addErrorToMessages(`${this.getFunkoPopFailedMessage} ${this.name}`);
          }
          else{
            this.getEbayListings(10);
            this.getPopsInSeries(this.basicInfo.series);
            this.getPopsInCategory(this.basicInfo.category);
          }
        }
      },
      err => {
        this._helperService.addErrorToMessages(`${this.getFunkoPopFailedMessage} ${this.name}`);
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
          this._helperService.addErrorToMessages(`${this.getFunkoPopFailedMessage} ${this.name}`);
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
          this._helperService.addErrorToMessages(`${this.getFunkoPopFailedMessage} ${this.name}`);
        }

      );
  }

  getPopsInCategory(category: string){
    this.apiService.getPopsInCategory(category)
      .subscribe(
        res => { 
          if(res['statusCode'] == 200){
            this.categorypops = res['funkopops'].filter( element => {
              
              if(element.name != this.basicInfo.name){
                element.series = this._helperService.replaceSpecialCharacters(element.series);
                element.category = this._helperService.replaceSpecialCharacters(element.category);
                element.name = this._helperService.replaceSpecialCharacters(element.name); 

                return true;
              }

              
              return false;
            });
          }
        },
        err => {
        }

      );
  }

  getPopsInSeries(series: string){
    this.apiService.getPopsInSeries(series)
      .subscribe(
        res => { 
          if(res['statusCode'] == 200){
            this.seriespops = res['funkopops'].filter( element => {

              if(element.name != this.basicInfo.name){
                element.series = this._helperService.replaceSpecialCharacters(element.series);
                element.category = this._helperService.replaceSpecialCharacters(element.category);
                element.name = this._helperService.replaceSpecialCharacters(element.name); 

                return true;
              }

              
              return false;
            });
          }
        },
        err => {
        }

      );
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
          this._helperService.addErrorToMessages(`${this.addFailedMessage} ${name} to  collection.`);
        }

      );
    }
  }

  removeFromCollection(id: string, name: string){

    this.apiService.removeFromCollection(id).subscribe(
      res => { 
        this.getUserCollection();
        this._helperService.addSuccessToMessages(`${this.removeSuccess} ${name} from  collection!`);
      },
      err => {
        this.getUserCollection();
        this._helperService.addErrorToMessages(`${this.removeFailedMessage} ${name} from  collection.`);
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
          this._helperService.addSuccessToMessages(`${this.addSuccess} ${name} to  wishlist!`);
        },
        err => {
          this.getUserWishlist();
          this._helperService.addErrorToMessages(`${this.removeFailedMessage} ${name} to  wishlist.`);
        }

      );
    }
  }

  removeFromWishlist(id: string, name: string){

    this.apiService.removeFromWishlist(id).subscribe(
      res => { 
        this.getUserWishlist();
        this._helperService.addSuccessToMessages(`${this.removeSuccess} ${name} from  wishlist!`);
      },
      err => {
        this.getUserWishlist();
        this._helperService.addErrorToMessages(`${this.removeFailedMessage} ${name} from  wishlist.`);
      }

    );
  }


  getEbayListings(count: number){
    let searchText = `${this.basicInfo.categoryName} ${this.basicInfo.name} ${this.basicInfo.number}`;

    this.ebaySearchText = searchText;

    this.apiService.getEbayListings(searchText, count).subscribe(
      res => { 

        let ebayListings = res['findItemsByKeywordsResponse'][0].searchResult[0].item;


        ebayListings.forEach((listing) => {
          listing.sellingStatus[0].convertedCurrentPrice[0].__value__ = parseFloat(listing.sellingStatus[0].convertedCurrentPrice[0].__value__).toFixed(2);
          
          let location = listing.location[0].split(',');
          listing.location[0] = `${location[0]}, ${location[1]}`;
          listing.location.push(location[2]);
        });
        this.availableEbayListings = ebayListings;
        console.log(this.availableEbayListings);
        console.log(res);
      },
      err => {
        //this._helperService.addErrorToMessages(`${this.removeFailedMessage} ${name} from  wishlist.`);
      }

    );

  }
}

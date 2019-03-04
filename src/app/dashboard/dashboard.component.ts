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
            }, 50);
          }
        },
        err => {
          this._helperService.addErrorToMessages(this._helperService.getFunkoPopFailedMessage);
        }

      );
  }


  getUserCollection(){
    this.apiService.getUserCollectionID()
      .subscribe(
        res => { 
          if(res['statusCode'] == 200){
            this.collection = res['funkopops'];
          }
        },
        err => {
          this._helperService.addErrorToMessages(this._helperService.getFunkoPopFailedMessage);
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
          this._helperService.addErrorToMessages(this._helperService.getFunkoPopFailedMessage);
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
          this._helperService.addSuccessToMessages(`${this._helperService.addSuccess} ${name} to collection!`);
        },
        err => {
          this.getUserCollection();
          this._helperService.addErrorToMessages(`${this._helperService.addFailedMessage} ${name} to collection!`);
        }

      );
    }
  }
  
  removeFromCollection(id: string, name: string){

    this.apiService.removeFromCollection(id).subscribe(
      res => { 
        this.getUserCollection();
        this._helperService.addSuccessToMessages(`${this._helperService.removeSuccess} ${name} from collection!`);

      },
      err => {
        this.getUserCollection();
        this._helperService.addErrorToMessages(`${this._helperService.removeFailedMessage} ${name} from collection!`);
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
          this._helperService.addSuccessToMessages(`${this._helperService.addSuccess} ${name} to wishlist!`);

        },
        err => {
          this.getUserWishlist();
          this._helperService.addErrorToMessages(`${this._helperService.addFailedMessage} ${name} to wishlist!`);
        }

      );
    }
  }
    
  removeFromWishlist(id: string, name: string){

    this.apiService.removeFromWishlist(id).subscribe(
      res => { 
        this.getUserWishlist();
        this._helperService.addSuccessToMessages(`${this._helperService.removeSuccess} ${name} from wishlist!`);

      },
      err => {
        this.getUserWishlist();
        this._helperService.addErrorToMessages(`${this._helperService.removeFailedMessage} ${name} from wishlist.`);
      }

    );
  }
}

import { Component, OnInit } from '@angular/core';
import { Router }      from '@angular/router';
import { FunkollectionApiService } from '../services/funkollection-api.service';
import { HelperService } from '../services/helper.service';
import { FunkoPop } from '../models/funkopop';
import * as $ from 'jquery';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

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
    this.apiService.getUserCollectionID()
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
            let pops = res['funkopops'];
            let size = 0;

            setInterval(() =>{
              if(size == pops.length)
                return;
              this.wishlist.push(pops[size]);
              ++size;
            }, 50);
          }
        },
        err => {
          this._helperService.addErrorToMessages(this.getFunkoPopFailedMessage);
        }

      );
  }

}

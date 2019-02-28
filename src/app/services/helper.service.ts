import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FunkoPop } from '../models/funkopop';
import { Router }      from '@angular/router';
import { FunkollectionApiService } from '../services/funkollection-api.service';

@Injectable()
export class HelperService {

    errorOccured: boolean = false;
    errorText: string = "";
    
    errorMessages = [];

    successOccured: boolean = false;
    successText: string = "";
    
    successMessages = [];

    getFunkoPopFailedMessage: string = 'Unable to retrieve any Pop! Vinyls ';
    addFailedMessage: String = 'Unable to add ';
    removeFailedMessage: String = 'Unable to remove ';
    addSuccess: String = 'Successfully added ';
    removeSuccess: String = 'Successfully removed ';

    collection = [];
    wishlist = [];
    constructor(private router: Router, private apiService: FunkollectionApiService){}

    ngOnInit(){
    }

    addErrorToMessages(msg: String){
        var index = this.errorMessages.indexOf(msg);

        if (index == -1) {
            this.errorMessages.push(msg);
        }

        this.showErrorMessages();

    }

    removeErrorFromMessages(msg: String){

        var index = this.errorMessages.indexOf(msg);

        if (index > -1) {
        this.errorMessages.splice(index, 1);
        }

        this.showErrorMessages();
    }
  
    showErrorMessages(){

        if(this.errorMessages.length > 0){
            this.errorText = "";
            this.errorMessages.forEach(element => {
                this.errorText += element + " ";
            });

            this.errorOccured = true;
        }
        else{
            this.hideErrorMessages();
        }
    }

    hideErrorMessages(){
        this.errorOccured = false;
    }

    removeAllErrors(){
        this.errorMessages = [];
        this.hideErrorMessages();
    }


    addSuccessToMessages(msg: String){
        this.removeAllSuccess();
        var index = this.successMessages.indexOf(msg);

        if (index == -1) {
            this.successMessages.push(msg);
        }

        this.showSuccessMessages();

    }

    removeSuccessFromMessages(msg: String){

        var index = this.successMessages.indexOf(msg);

        if (index > -1) {
        this.successMessages.splice(index, 1);
        }

        this.showSuccessMessages();
    }


  
    showSuccessMessages(){

        if(this.successMessages.length > 0){
            this.successText = "";
            this.successMessages.forEach(element => {
                this.successText += element + " ";
            });

            this.successOccured = true;
        }
        else{
            this.hideSuccessMessages();
        }
    }

    hideSuccessMessages(){
        this.successOccured = false;
    }

    removeAllSuccess(){
        this.successMessages = [];
        this.hideSuccessMessages();
    }



    replaceSpecialCharacters(phrase: string){
        phrase = phrase.replace(/ \&? ?/g, '-');
        phrase = phrase.replace(/\(/g, '');
        phrase = phrase.replace(/\)/g, '');
        phrase = phrase.replace(/\&/g, '');
        phrase = phrase.replace(/\:/g, '');

        return phrase;
    }

    moreInformation(funkopop: FunkoPop){
        this.removeAllErrors();
        this.removeAllSuccess();
        let series: string = funkopop.series.toString().replace(/ /g, '-').toLowerCase();
        let category = funkopop.category.toString().replace(/ /g, '-').toLowerCase();
        let name = funkopop.name.replace(/ /g, '-').toLowerCase();

        this.router.navigate([`funko/${series}/${category}/${name}`]);
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
              this.addErrorToMessages(this.getFunkoPopFailedMessage);
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
              this.addErrorToMessages(this.getFunkoPopFailedMessage);
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
              this.addSuccessToMessages(`${this.addSuccess} ${name} to collection!`);
            },
            err => {
              this.getUserCollection();
              this.addErrorToMessages(`${this.addFailedMessage} ${name} to collection!`);
            }
    
          );
        }
      }
    
      removeFromCollection(id: string, name: string){
    
        this.apiService.removeFromCollection(id).subscribe(
          res => { 
            this.getUserCollection();
            this.addSuccessToMessages(`${this.removeSuccess} ${name} from collection!`);
    
          },
          err => {
            this.getUserCollection();
            this.addErrorToMessages(`${this.removeFailedMessage} ${name} from collection!`);
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
              this.addSuccessToMessages(`${this.addSuccess} ${name} to wishlist!`);
    
            },
            err => {
              this.getUserWishlist();
              this.addErrorToMessages(`${this.addFailedMessage} ${name} to wishlist!`);
            }
    
          );
        }
      }
    
      removeFromWishlist(id: string, name: string){
    
        this.apiService.removeFromWishlist(id).subscribe(
          res => { 
            this.getUserWishlist();
            this.addSuccessToMessages(`${this.removeSuccess} ${name} from wishlist!`);
    
          },
          err => {
            this.getUserWishlist();
            this.addErrorToMessages(`${this.removeFailedMessage} ${name} from wishlist.`);
          }
    
        );
      }
}
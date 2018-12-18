import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class HelperService {

    errorOccured: boolean = false;
    errorText: string = "";
    
    errorMessages = [];
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



    replaceSpecialCharacters(phrase: string){
        phrase = phrase.replace(/ \&? ?/g, '-');
        phrase = phrase.replace(/\(/g, '');
        phrase = phrase.replace(/\)/g, '');
        phrase = phrase.replace(/\&/g, '');
        phrase = phrase.replace(/\:/g, '');

        return phrase;
    }

    
}
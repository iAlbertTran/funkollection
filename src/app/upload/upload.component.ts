import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FunkollectionApiService } from '../services/funkollection-api.service';
import { HelperService } from '../services/helper.service';
import { map } from "rxjs/operators";

import { Series } from "../models/series";
import { Category } from "../models/category";
import { FunkoPop } from "../models/funkopop";


@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  providers: [FunkollectionApiService, FunkoPop],
  styleUrls: ['./upload.component.css']
})

export class UploadComponent implements OnInit {

  imageSrc: any;
  event: any;

  series: Series[];
  categories: Category[];

  displayNewSeriesInput: boolean = false;
  displayNewCategoryInput: boolean = false;

  imagePath: string;
  imageData: any;
  name: string;
  seriesSelector: string;
  seriesInput: string;
  categorySelector: string;
  categoryInput: string;
  number: number;
  
  seriesExists: Boolean = false;

  categoryExists: Boolean = false;

  unableToUploadFunkoPopMessage: String = "Unable to upload funko pop. Please try again later";
  unableToAddNewCategoryMessage: String = "Unable to add new category. Please try again later";
  unableToAddNewSeriesMessage: String = 'Unable to add new series. Please try again later';

  constructor( private apiService: FunkollectionApiService, private _helperService: HelperService, private _funkoPopModel: FunkoPop) { 
  }

  ngOnInit() {
    this.getSeries();
    this.displayNewSeriesInput = false;
  }

  getSeries(): void{
    this.apiService.getSeries()
      .subscribe(series => {
        series.sort(function (a, b) {
          return a.name.localeCompare(b.name);
      });

        this.series = series;

      });
    

  }

  getCategories(seriesID: string): void{
    this.apiService.getCategoriesForSeries(seriesID)
      .subscribe(categories => {
        categories.sort(function (a, b) {
          return a.name.localeCompare(b.name);
      });
        this.categories = categories;

      });
    

  }


  readURL(event: Event): void {
    this.event = event;
    if (this.event.target.files && this.event.target.files[0]) {
        this.imageData = this.event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.imageSrc = reader.result;

        reader.readAsDataURL(this.imageData);
    }
  }

  checkSeriesSelection(value: any){
    
    this.categoryInput = "";

    if(value == 'Add new series...'){
      this.displayNewSeriesInput = true;
      this.categories = [];

    }
    else{

      this.seriesInput = "";

      this.displayNewSeriesInput = false;

      const selectedSeries = this.series.find((element) => {
        return element.name == value;
      });

      this.getCategories(selectedSeries.id);
    }
  }

  checkCategorySelection(value: any){

    if(value == 'Add new category...'){
      this.displayNewCategoryInput = true;
    }
    else{

      this.categoryInput = "";

      this.displayNewCategoryInput = false;
    }
  }

  uploadPop(){
    
    this._funkoPopModel.name = this.name;
    this._funkoPopModel.number = this.number;

    if(this.seriesSelector == "Add new series..."){
        this.addSeries();
    }
    else{

      const selectedSeries = this.series.find((element) => {
        return element.name == this.seriesSelector;
      });

      this._funkoPopModel.series = selectedSeries;

      if(this.categorySelector == "Add new category..."){
        this.addCategory(selectedSeries.id, this.categoryInput);
      }

      else{
  
        const selectedCategory = this.categories.find((element) => {
          return element.name == this.categorySelector;
        });
  
        this._funkoPopModel.category = selectedCategory;


        let formData = new FormData();

        formData.append("user", sessionStorage.getItem("LoggedInUser"));
        formData.append("funkopop", JSON.stringify(this._funkoPopModel));
        formData.append('file', this.imageData);

        this.uploadFunkoPop(formData);

      }
    } 
  }

  addSeries(){
    this.apiService.addSeries(this.seriesInput)
        .subscribe(
          res => {
            if(res["statusCode"] == 200){

              this._helperService.removeErrorFromMessages(this.unableToAddNewSeriesMessage);

              var id = res["seriesID"];
              this._funkoPopModel.series =  {id: id, name: this.seriesInput };

              if(this.categorySelector == "Add new category..."){
                this.addCategory(id, this.categoryInput)
              }
            }
          },
          err => {
            this._helperService.addErrorToMessages(this.unableToAddNewSeriesMessage);
          }
        );
  }

  addCategory(series: string, category: string){
    this.apiService.addCategoryForSeries(series, category)
        .subscribe(
          res => {
            if(res["statusCode"] == 200){

              this._helperService.removeErrorFromMessages(this.unableToAddNewCategoryMessage);

              var id = res["categoryID"];
              this._funkoPopModel.category = { id: id, name: category };


              let formData = new FormData();

              formData.append("user", sessionStorage.getItem("LoggedInUser"));
              formData.append("funkopop", JSON.stringify(this._funkoPopModel));
              formData.append('file', this.imageData);

              this.uploadFunkoPop(formData);
            }
          },
          err => {
            this._helperService.addErrorToMessages(this.unableToAddNewCategoryMessage);
          }
        );
  }

  uploadFunkoPop(formData: FormData){
    this.apiService.uploadFunkoPop(formData)
      .subscribe(
        res => {
          if(res["statusCode"] == 200){
            this._helperService.removeErrorFromMessages(this.unableToUploadFunkoPopMessage);
          }
          
        },
        err => { 
          this._helperService.addErrorToMessages(this.unableToUploadFunkoPopMessage);
        }   
    );
  }

  checkNewSeriesInput(){
    this.seriesExists = false;
    var seriesName = '';
    this.series.forEach(element => {
      if(element.name.toLowerCase() == this.seriesInput.toLowerCase()){
        this.seriesExists = true;
        seriesName = element.name;
      }
    });

    if(this.seriesExists){
      
      this.displayNewSeriesInput = false;
      this.seriesSelector = seriesName;
      this.seriesInput = "";

      this.checkSeriesSelection(this.seriesSelector);
    }



  }

  checkNewCategoryInput(){
    this.categoryExists = false;
    var categoryName = '';
    this.categories.forEach(element => {
      if(element.name.toLowerCase() == this.categoryInput.toLowerCase()){
        this.categoryExists = true;
        categoryName = element.name;
      }
    });

    if(this.categoryExists){
      this.displayNewCategoryInput = false;
      this.categorySelector = categoryName;
      this.categoryInput = '';

      this.checkCategorySelection(this.categorySelector);
    }



  }
}
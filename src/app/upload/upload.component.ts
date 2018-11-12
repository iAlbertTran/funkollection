import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FunkollectionApiService } from '../services/funkollection-api.service';

import { map } from "rxjs/operators";

import { Series } from "../models/Series";
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
  

  constructor( private apiService: FunkollectionApiService, private _funkoPopModel: FunkoPop) { 
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

    if(value == 'Other'){
      this.displayNewSeriesInput = true;
      this.categories = [];
    }
    else{
      this.displayNewSeriesInput = false;

      const selectedSeries = this.series.find((element) => {
        return element.name == value;
      });

      this.getCategories(selectedSeries.id);
    }
  }

  checkCategorySelection(value: any){

    if(value == 'Other'){
      this.displayNewCategoryInput = true;
    }
    else{
      this.displayNewCategoryInput = false;
    }
  }

  uploadPop(){
    
    this._funkoPopModel.name = this.name;
    this._funkoPopModel.number = this.number;

    if(this.seriesSelector == "Other"){
        this.addSeries();
    }
    else{

      const selectedSeries = this.series.find((element) => {
        return element.name == this.seriesSelector;
      });

      this._funkoPopModel.series = selectedSeries;

      if(this.categorySelector == "Other"){
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
              var id = res["seriesID"];
              this._funkoPopModel.series =  {id: id, name: this.seriesInput };

              if(this.categorySelector == "Other"){
                this.addCategory(id, this.categoryInput)
              }
            }
        });
  }

  addCategory(series: string, category: string){
    this.apiService.addCategoryForSeries(series, category)
        .subscribe(
          res => {
            if(res["statusCode"] == 200){
              var id = res["categoryID"];
              this._funkoPopModel.category = { id: id, name: category };


              let formData = new FormData();

              formData.append("user", sessionStorage.getItem("LoggedInUser"));
              formData.append("funkopop", JSON.stringify(this._funkoPopModel));
              formData.append('file', this.imageData);

              this.uploadFunkoPop(formData);
            }
        });
  }

  uploadFunkoPop(formData: FormData){
    this.apiService.uploadFunkoPop(formData)
      .subscribe(
        res => {
          if(res["statusCode"] == 200){
          }
          
        },
        err => { 
          if(err.error.statusCode == 409){
          }
          else{
          }
        }   
    );
  }
}
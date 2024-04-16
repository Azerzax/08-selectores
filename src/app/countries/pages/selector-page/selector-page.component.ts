import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.serice';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit{

  public countriesByRegion: SmallCountry[]=[];

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService,
  ){

  }
  ngOnInit(): void {
    this.onRegionChanged();
  }

  public myform:FormGroup = this.fb.group({
    region : ['', Validators.required],
    country: ['', Validators.required],
    borders: ['', Validators.required]
  })

  get regions():Region[]{
    return this.countriesService.regions
  }

  onRegionChanged():void {
    this.myform.get('region')!.valueChanges
    .pipe(
      tap(() => this.myform.get('country')!.setValue('')), //limpiar el selector de pais al cambiar el select de los continentes.
      switchMap( region => this.countriesService.getCountryByRegion(region))
    )
    .subscribe(val =>{
      this.countriesByRegion = val;
      console.log({val});
    });
  }

}

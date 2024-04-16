import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.serice';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit{

  public countriesByRegion: SmallCountry[]=[];
  public borders:SmallCountry[] = [];

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService,
  ){

  }
  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChanged();
  }

  public myform:FormGroup = this.fb.group({
    region : ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required]
  })

  get regions():Region[]{
    return this.countriesService.regions
  }

  onRegionChanged():void {
    this.myform.get('region')!.valueChanges
    .pipe(
      tap(() => this.myform.get('country')!.setValue('')),
      tap(() => this.borders = []), //limpiar el selector de pais al cambiar el select de los continentes.
      switchMap( region => this.countriesService.getCountryByRegion(region))
    )
    .subscribe(val =>{
      this.countriesByRegion = val;
      console.log({val});
    });
  }

  onCountryChanged():void {
    this.myform.get('country')!.valueChanges
    .pipe(
      tap(() => this.myform.get('border')!.setValue('')), //limpiar el selector de pais al cambiar el select de los continentes.
      filter((value: string) => value.length>0),
      switchMap( (alphacode) => this.countriesService.getCountryByAplhaCode(alphacode)),
      switchMap( (country) => this.countriesService.getCountryBordersByCodes(country.borders))
    )
    .subscribe(countries =>{
      this.borders = countries;
      console.log({borders: countries});
    });
  }

}

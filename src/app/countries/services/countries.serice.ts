import { Injectable } from '@angular/core';
import { Region } from '../interfaces/country.interfaces';

@Injectable({providedIn: 'root'})
export class CountriesService {
  constructor() { }

  private _regions: Region[] = [Region.Africa, Region.Asia, Region.Oceania, Region.Europa, Region.Americas];

  get regions(): Region[]{
    return [...this._regions]
  }

}

import { Injectable } from '@angular/core';
import { Country, Region, SmallCountry } from '../interfaces/country.interfaces';
import { Observable, combineLatest, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class CountriesService {
  constructor(
    private http: HttpClient
  ) { }

  private baseUrl:string= 'https://restcountries.com/v3.1'

  private _regions: Region[] = [Region.Africa, Region.Asia, Region.Oceania, Region.Europa, Region.Americas];

  get regions(): Region[]{
    return [...this._regions]
  }

  getCountryByRegion(region: Region): Observable<SmallCountry[]>{

    if(!region){
      return of([])
    }

    const url: string = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`;

    return this.http.get<Country[]>(url) //aunque querammos trabajar con small country la llamada devuelve country, asique se coge y se transforma con map
      .pipe(
        map(resp => resp.map(country =>({
          name:country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? []
        }))),
        tap(response => console.log({response}))
      )
  }


  getCountryByAplhaCode(alphaCode: string): Observable<SmallCountry>{

    const url: string = `${this.baseUrl}/alpha/${alphaCode}?fields=cca3,name,borders`;

    return this.http.get<Country>(url) //aunque querammos trabajar con small country la llamada devuelve country, asique se coge y se transforma con map
      .pipe(
        map(resp => ({
          name:resp.name.common,
          cca3: resp.cca3,
          borders: resp.borders ?? []
        })),
        tap(response => console.log({response}))
      )
  }

  getCountryBordersByCodes(borders: string[]): Observable<SmallCountry[]>{

    if (!borders || borders.length===0){
      return of([]);
    }

    const countriesRequest: Observable<SmallCountry>[] = [];

    borders.forEach(code => {
      const request = this.getCountryByAplhaCode(code)
      countriesRequest.push(request);
    })

    return combineLatest( countriesRequest )

  }

}

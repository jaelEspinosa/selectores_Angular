import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pais, PaisSmall } from '../interfaces/paises.interface';
import { Observable, combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _regiones = ['africa','americas','asia','europe','oceania']
  private _baseUrl = 'https://restcountries.com/v3.1'

  get regiones():string[] {
    return [...this._regiones]
  }

  constructor(private http: HttpClient) { }

  getPaisesPorRegion( region:string ):Observable<PaisSmall[]>{

    const url = `${this._baseUrl}/region/${region}/?fields=cca3,name`

   return this.http.get<PaisSmall[]>(url)
  }

  getPaisPorCodigo( codigo: string): Observable<Pais[] | []>{

    if(!codigo){
      return of([])
    }

    const url = `${this._baseUrl}/alpha/${codigo}`
    return this.http.get<Pais[]>( url )
  }

  getPaisPorCodigoSmall (codigo: string):Observable<PaisSmall> {

    const url = `${this._baseUrl}/alpha/${codigo}/?fields=cca3,name`
    return this.http.get<PaisSmall>( url )
  }

  getPaisesPorCodigos(borders: string[]):Observable<PaisSmall[]>{

    if( !borders ) {
      return of([])
    }
    const peticiones: Observable<PaisSmall>[] = []
    borders.forEach( codigo => {
      const peticion = this.getPaisPorCodigoSmall( codigo );
      peticiones.push( peticion );
    });

    return combineLatest( peticiones)
  }

}




import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import {  PaisSmall } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs';


@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html'
})
export class SelectorPageComponent implements OnInit {

  // llenar el selector

  regiones  : string[] = []
  paises    : PaisSmall[] = []
  fronteras : PaisSmall[] = []

  //ui
  cargando: boolean = false

  miFormulario: FormGroup = this.fb.group({
     region: ['', Validators.required],
     pais:['', Validators.required],
     frontera:['', Validators.required]
  })

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones

    // cuando cambie la region

       this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( ( _ ) =>{
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true
        }),
        switchMap(region => this.paisesService.getPaisesPorRegion( region ))
      )
      .subscribe( paises => {
        this.paises = paises;
        this.cargando = false
      })

    // cuando cambie el pais

    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(()=>{
          this.fronteras = []
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true
        }),
        switchMap(codigo => this.paisesService.getPaisPorCodigo( codigo )),
        switchMap(pais => this.paisesService.getPaisesPorCodigos( pais[0]?.borders ))
      )
      .subscribe( paises => {
        console.log(paises);
        this.cargando = false;
        this.fronteras = paises

      })
  }

  constructor( private fb:FormBuilder,
               private paisesService: PaisesService){}


  guardar() {
    console.log(this.miFormulario.value);

  }
}

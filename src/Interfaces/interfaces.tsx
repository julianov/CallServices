import { Dispatch, SetStateAction } from "react"



  export interface usuario{
    email:string
    nombre:string
    apellido:string
    foto:string
    calificacion:number
    tipoCliente:string
  }



  export type UsuarioType = {
    user: usuario;
    setUser: Dispatch<SetStateAction<usuario>>;
  }


  export interface itemRubro {
    rubro:string
    radius:string
    description:string
    hace_orden_emergencia:string
    calificacion:number
    pais:string
    provincia:string
    ciudad:string
    calle:string
    numeracion:string
    days_of_works:string
    hour_init:string
    hour_end:string
    certificate:string
    picture1:string
    picture2:string
    picture3:string

  }

  
  export type RubroType = {
    rubros : itemRubro [];
    setRubro: Dispatch<SetStateAction<itemRubro []>>;
  }

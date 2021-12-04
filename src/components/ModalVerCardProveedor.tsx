import { IonContent, IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import React from "react";
import { parentPort } from "worker_threads";
import CardProveedor from "../utilidades/CardProveedor";



const ModalVerCardProveedor = (props:{caracteres:any, imagenes:any, emailCliente:String, email:any, proveedorEmail:string, setVerEmail:any, setItem:any})  =>{

    console.log("ha llegado a este modal")
    return(
      <IonContent>

        
        <div id="completo">
          <IonIcon icon={arrowBack} onClick={() => (props.setVerEmail(""), props.setItem(""))} id="volver-ExplorerContainerCliente">  </IonIcon>
          <div id="contenedor-central">

          <CardProveedor data={props.caracteres} imagenes={props.imagenes} emailCliente={props.emailCliente}  proveedorEmail={props.proveedorEmail} ></CardProveedor>
          </div> 
          </div> 
      </IonContent>
      )
    } 



export default ModalVerCardProveedor;

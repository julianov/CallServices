import { IonAvatar, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonModal, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { add, arrowForwardCircle, chevronDown, closeCircle, pin } from 'ionicons/icons';
import React, { Component, useRef, useState } from 'react';
import './ExploreContainer.css';

import {Geoposition} from "@ionic-native/geolocation";
import { Geolocation } from '@capacitor/core/dist/esm/web/geolocation';
import { useEffect } from 'react';

const getLocation = async () => {
  try {
      const position = await Geolocation.getCurrentPosition();
      const posicion=position.coords.latitude +"/"+ position.coords.longitude
      return posicion;

  } catch (e) {
    return 0;
  }
}
const ExploreContainerProveedor  = (props:{ url:string}) => {

  const [proveedores, setProveedores]=useState()

  
  const [verEmail, setVerEmail]=useState("")
  const[item, setItem]=useState("")

  useEffect(() => {

   

  }, []);

  return (
    <div id="container-principal-ExplorerContainer-Cliente"> 
        <Solicitudes /> 
        < CampanaPublicidad ></CampanaPublicidad>

                
  </div>
  )
}
  
const Solicitudes  = () => {

  return(
    <>
    <IonCard id="IonCardExplorerContainer">
      <IonCardHeader>
      <h1 id="textoCentrado" > NO POSEE SOLICITUDES DE TRABAJO ACTUALMENTE </h1 > 

      </IonCardHeader>
   

    </IonCard>
    </>

  )
}

const CampanaPublicidad  = () => {

  return(
    <>
    <IonCard id="IonCardExplorerContainer">
      <IonCardHeader>
      <div id="contenedorCentrado">
      <img src={"./assets/CampañasDePublicidad.png"} id="imagenCampañaPublicidad" />
      </div>
      </IonCardHeader>
      <div id="contenedorCentrado">

      <strong id="textoCentrado">Cree campañas de publicidad para llegar a más clientes</strong>
      <IonButton color="warning">CREAR CAMPAÑA</IonButton>

      </div>

    </IonCard>
    </>

  )
}


export default ExploreContainerProveedor;

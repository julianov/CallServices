import { IonAvatar, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonModal, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { add, arrowForwardCircle, chevronDown, closeCircle, pin } from 'ionicons/icons';
import React, { Component, useRef, useState } from 'react';
import './ExploreContainer.css';

import {Geoposition} from "@ionic-native/geolocation";
import { Geolocation } from '@capacitor/core/dist/esm/web/geolocation';
import { useEffect } from 'react';
import { ordenes } from '../pages/HomeProveedor';
import OrdenSimple from '../pages/Orden';

const getLocation = async () => {
  try {
      const position = await Geolocation.getCurrentPosition();
      const posicion=position.coords.latitude +"/"+ position.coords.longitude
      return posicion;

  } catch (e) {
    return 0;
  }
}

let proveedores = new Array<ordenes>();


const ExploreContainerProveedor  = (props:{ ordenes:any} ) => {

  //const [proveedores, setProveedores]=useState()

  
  const [hayOrdenes, setHayOrdenes]=useState(false)
  const [verOrden, setVerOrden] = useState(false)

  useEffect(() => {

    for (let i=0; i<props.ordenes.length;i++){     

        proveedores.push({ tipo:props.ordenes[i].tipo,
        status:props.ordenes[i].status,
        fecha_creacion:props.ordenes[i].fecha_creacion,
        ticket:props.ordenes[i].ticket,
        dia:props.ordenes[i].dia,
        hora:props.ordenes[i].hora,
        titulo:props.ordenes[i].titulo,
        descripcion:props.ordenes[i].descripcion,
        imagen:props.ordenes[i].imagen_cliente})

    }

    if(props.ordenes.length > 0){
      setHayOrdenes(true)
    }
   

  }, [props.ordenes]);

  if(!verOrden){
    if(hayOrdenes){
      return (
        <div id="container-principal-ExplorerContainer-Cliente"> 
            <IonCard id="IonCardExplorerContainer">
            <IonCardHeader>
  
            <h1 id="textoCentrado" > ORDENES DE TRABAJO ACTIVAS </h1 > 
            </IonCardHeader>
  
            <Elements proveedores={proveedores} setVerOrden={setVerOrden} />
            </IonCard>
            < CampanaPublicidad ></CampanaPublicidad>
    
                    
      </div>
      )
    }else{
      return (
        <div id="container-principal-ExplorerContainer-Cliente"> 
            <Solicitudes /> 
            < CampanaPublicidad ></CampanaPublicidad>
    
                    
      </div>
      )
    }
  }else{
    return(
      <div id="container-principal-ExplorerContainer-Cliente"> 
      </div > 

    )
  }
 
 
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

const Elements = (props:{ proveedores: Array <ordenes> , setVerOrden:any }) => {

  var i=0
  //if (props.proveedores!=[]){
    return (
      <div  onClick={()=> props.setVerOrden(true)} >
        {props.proveedores.map((a) => {
          i=i+1
          return (<CardVistaVariasOrdenes key={i} tipo={a.tipo} status={a.status} fecha_creacion={a.fecha_creacion} ticket={a.ticket} 
            dia={a.dia} hora={a.hora} titulo={a.titulo} descripcion={a.descripcion} imagen={a.imagen}
           ></CardVistaVariasOrdenes> ) 
        })
        }
    </div>
  )
  //}
      
}




const CardVistaVariasOrdenes= (props:{tipo:string,status:string,fecha_creacion:string,ticket: string,
  dia: string,hora:string,titulo:string,descripcion:string, imagen:string }) => {
        
    var estado="Enviada"
    if (props.status=="ENV"){
      estado="PEDIDO DE TRABAJO"
    }else if(props.status=="REC"){
      estado="PEDIDO DE TRABAJO RECIBIDO"
    }else if(props.status=="ACE"){
      estado="PEDIDO DE TRABAJO ACEPTADO"
    }else if(props.status=="EVI"){
      estado="EN VIAJE"
    }else if(props.status=="ENS"){
      estado="EN SITIO"
    }

 
    return (
    <IonCard id="ionCard-explorerContainer-Proveedor">
      <IonGrid>
      <IonRow  id="row-busqueda">
        <IonCol size="auto"  id="col-explorerContainerCliente"><img id="img-explorerContainerCliente" src={props.imagen}></img></IonCol>
        <IonCol size="auto" id="col-explorerContainerCliente">
          <IonCardSubtitle>TIPO: {props.tipo.toUpperCase( )}</IonCardSubtitle>
          <IonCardSubtitle>STATUS: {estado}</IonCardSubtitle>
          <IonCardSubtitle>TICKET: {props.ticket}</IonCardSubtitle>
        </IonCol>
      </IonRow>
      
      </IonGrid>
        
  
    </IonCard>
       
  );
}

export default ExploreContainerProveedor;

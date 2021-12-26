import { IonAvatar, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonModal, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { add, arrowBack, arrowForwardCircle, chevronDown, closeCircle, pin } from 'ionicons/icons';
import React, { Component, useRef, useState } from 'react';
import './ExploreContainer.css';

import {Geoposition} from "@ionic-native/geolocation";
import { Geolocation } from '@capacitor/core/dist/esm/web/geolocation';
import { useEffect } from 'react';
import { ordenes } from '../pages/HomeProveedor';
import OrdenSimple from '../pages/Orden';
import axios from 'axios';
import Https from '../utilidades/HttpsURL';
import ModalVerOrdenes from './ModalVerOrdenesProveedor';
import ModalVerOrdenesProveedor from './ModalVerOrdenesProveedor';

const url=Https


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


const ExploreContainerProveedor  = (props:{ ordenes:any, emailProveedor:any} ) => {

  //const [proveedores, setProveedores]=useState()

  
  const [hayOrdenes, setHayOrdenes]=useState(false)
 // const [showModal2, setShowModal2] = useState({ isOpen: false });
  const [verOrden, setVerOrden] = useState( false );

  const [posicion, setPosicion] = useState(0)

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
        email_cliente:props.ordenes[i].email_cliente,
        imagen_cliente:props.ordenes[i].imagen_cliente,
        location_lat:props.ordenes[i].location_lat,
        location_long:props.ordenes[i].location_long,
        picture1:props.ordenes[i].picture1,
        picture2:props.ordenes[i].picture2,
        presupuesto_inicial:props.ordenes[i].presupuesto,
        pedido_mas_información:props.ordenes[i].pedidoMasInformacion,
        respuesta_cliente_pedido_mas_información:props.ordenes[i].respuesta_cliente_pedido_mas_información,
        picture1_mas_información:props.ordenes[i].picture1_mas_información,
        picture2_mas_información:props.ordenes[i].picture2_mas_información
      })

    }

    if(props.ordenes.length > 0){
      setHayOrdenes(true)
    }
   

  }, [props.ordenes]);

    if(hayOrdenes){
      return (
        <><div id="container-principal-ExplorerContainer-Cliente">
          <IonCard id="IonCardExplorerContainer">
            <IonCardHeader>

              <h1 id="textoCentrado"> ORDENES DE TRABAJO ACTIVAS </h1>
            </IonCardHeader>

            <Elements proveedores={proveedores} setVerOrden={setVerOrden} setPosicion={setPosicion} />
          </IonCard>
          <CampanaPublicidad></CampanaPublicidad>




        </div>
        
        <IonModal
      animated={true}
      isOpen={verOrden}
      onDidDismiss={() => setVerOrden( false )}
    >
      <ModalVerOrdenesProveedor 
        datos={proveedores[posicion-1]}
        setVolver={setVerOrden}
        emailProveedor={props.emailProveedor}
        
      />  
    </IonModal>
    </>
      )
    }else{
      return (
        <div id="container-principal-ExplorerContainer-Cliente"> 
            <Solicitudes /> 
            < CampanaPublicidad ></CampanaPublicidad>
    
                    
      </div>
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

const Elements = (props:{ proveedores: Array <ordenes> , setVerOrden:any,setPosicion:any }) => {

  var i=0
  //if (props.proveedores!=[]){
    return (
      <div   >
        {props.proveedores.map((a) => {
          i=i+1
          return (<CardVistaVariasOrdenes key={i} posicion={i} tipo={a.tipo} status={a.status} fecha_creacion={a.fecha_creacion} ticket={a.ticket} 
            dia={a.dia} hora={a.hora} titulo={a.titulo} descripcion={a.descripcion} imagen={a.imagen_cliente} setVerOrden={props.setVerOrden} setPosicion={props.setPosicion}
           ></CardVistaVariasOrdenes> ) 
        })
        }
    </div>
  )
  //}
      
}




const CardVistaVariasOrdenes= (props:{posicion:any,tipo:string,status:string,fecha_creacion:string,ticket: string,
  dia: string,hora:string,titulo:string,descripcion:string, imagen:string, setVerOrden:any, setPosicion:any }) => {
        
    const [mensaje, setMensaje] = useState("")

    const [estado,setEstado]=useState("Enviada")
    
    useEffect(() => {


    if (props.status=="ENV"){
      setEstado("PEDIDO DE TRABAJO")
    }else if(props.status=="REC"){
      setEstado("PEDIDO DE TRABAJO RECIBIDO")
    }else if(props.status=="PRE"){
      setEstado("PEDIDO DE TRABAJO PRE ACEPTADO")
      setMensaje("EN ESPERA DE LA RESPUESTA DEL CLIENTE")
    } else if(props.status=="ACE"){
      setEstado("PEDIDO DE TRABAJO ACEPTADO")
      setMensaje("VER RESPUESTA DEL CLIENTE")
    }else if(props.status=="EVI"){
      setEstado("EN VIAJE")
    }else if(props.status=="ENS"){
      setEstado("EN SITIO")
    }

  }, []);
 
    return (
    <IonCard id="ionCard-explorerContainer-Proveedor" onClick={()=> {props.setVerOrden(true); props.setPosicion(props.posicion)}}>
      <IonGrid>
      <IonRow  id="row-busqueda">
        <IonCol size="auto"  id="col-explorerContainerCliente"><img id="img-explorerContainerCliente" src={props.imagen}></img></IonCol>
        <IonCol size="auto" id="col-explorerContainerCliente">
          <p>TIPO: {props.tipo.toUpperCase( )}</p>
          <p>STATUS: {estado}</p>
          <p>TICKET: {props.ticket}</p>
          <p>{mensaje}</p>
        </IonCol>
      </IonRow>
      </IonGrid>
    </IonCard>  
  )
}



export default ExploreContainerProveedor;

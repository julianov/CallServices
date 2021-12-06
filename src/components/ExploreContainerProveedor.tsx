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
import ModalVerOrdenes from './ModalVerOrdenes';

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


const ExploreContainerProveedor  = (props:{ ordenes:any} ) => {

  //const [proveedores, setProveedores]=useState()

  
  const [hayOrdenes, setHayOrdenes]=useState(false)
  const [showModal2, setShowModal2] = useState({ isOpen: false });
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
        imagen_cliente:props.ordenes[i].imagen_cliente,
        location_lat:props.ordenes[i].location_lat,
        location_long:props.ordenes[i].location_long,
        picture1:props.ordenes[i].picture1,
        picture2:props.ordenes[i].picture2,
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
      <ModalVerOrdenes 
        datos={proveedores[posicion-1]}
        setVolver={setVerOrden}
        
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
    <IonCard id="ionCard-explorerContainer-Proveedor" onClick={()=> {props.setVerOrden(true); props.setPosicion(props.posicion)}}>
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

/*
interface datos_orden {
  tipo:string
  status:string
  fecha_creacion:string
  ticket: string
  dia: string
  hora:string
  titulo:string
  descripcion:string
  imagen_cliente:string
  location_lat:any
  location_long:any
  picture1:string
  picture2:string
  }

  let llego = new Array<datos_orden>();


const ModalVerOrdenes = (props:{datos:any,setVolver:any})  =>{

console.log("llego a modal ver ordenes "+ props.datos)

  const [datosOrden, setDatosOrden] = useState <datos_orden>(  );

  useEffect(() => {

      
      axios.get(url+"orden/verordenparticular/"+"proveedor/"+props.datos.ticket).then((resp: { data: any; }) => {
          
        if (resp.data!="bad"){
             
          setDatosOrden(resp.data)
              setDatosOrden(
                {
                  tipo:resp.data.tipo,
                  status:resp.data.status,
                  fecha_creacion:resp.data.fecha_creacion,
                  ticket:resp.data.ticket,
                  dia:resp.data.dia,
                  hora:resp.data.hora,
                  titulo:resp.data.titulo,
                  descripcion:resp.data.descripcion,
                  imagen_cliente:resp.data.imagen_cliente,
                  location_lat:resp.data.location_lat,
                  location_long:resp.data.location_long,
                  picture1:resp.data.picture1,
                  picture2:resp.data.picture2,

                })   
          }

        })
    }, [])


    var estado="Enviada"
    if (datosOrden.status=="ENV"){
      estado="PEDIDO DE TRABAJO"
    }else if(datosOrden.status=="REC"){
      estado="PEDIDO DE TRABAJO RECIBIDO"
    }else if(datosOrden.status=="ACE"){
      estado="PEDIDO DE TRABAJO ACEPTADO"
    }else if(datosOrden.status=="EVI"){
      estado="EN VIAJE"
    }else if(datosOrden.status=="ENS"){
      estado="EN SITIO"
    }
 
    if(datosOrden){

      var estado="Enviada"
    if (datosOrden.status=="ENV"){
      estado="PEDIDO DE TRABAJO"
    }else if(datosOrden.status=="REC"){
      estado="PEDIDO DE TRABAJO RECIBIDO"
    }else if(datosOrden.status=="ACE"){
      estado="PEDIDO DE TRABAJO ACEPTADO"
    }else if(datosOrden.status=="EVI"){
      estado="EN VIAJE"
    }else if(datosOrden.status=="ENS"){
      estado="EN SITIO"
    }

      return (
     

        <><div id="modalProveedor-flechaVolver">
          <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
        </div><IonCard id="ionCard-explorerContainer-Proveedor">
            <IonGrid>
              <IonRow id="row-busqueda">
                <IonCol size="auto" id="col-explorerContainerCliente"><img id="img-explorerContainerCliente" src={datosOrden.imagen_cliente}></img></IonCol>
                <IonCol size="auto" id="col-explorerContainerCliente">
                  <IonCardSubtitle>TIPO: {datosOrden.tipo}</IonCardSubtitle>
                  <IonCardSubtitle>STATUS: {estado}</IonCardSubtitle>
                  <IonCardSubtitle>TICKET: {datosOrden.ticket}</IonCardSubtitle>
                </IonCol>
              </IonRow>
  
            </IonGrid>
  
  
          </IonCard><IonCard id="ionCard-explorerContainer-Proveedor">
            <IonCardSubtitle>FECHA DE SOLICITUD: {datosOrden.fecha_creacion}</IonCardSubtitle>
            <IonCardSubtitle>TÍTULO: {datosOrden.titulo}</IonCardSubtitle>
            <IonCardSubtitle>DESCRIPCIÓN DE LA SOLICITUD: {datosOrden.descripcion}</IonCardSubtitle>
          </IonCard><IonCard id="ionCard-explorerContainer-Proveedor">
            <Imagenes picture1={datosOrden.picture1} picture2={datosOrden.picture2}></Imagenes>
          </IonCard></>
  
  
         
    );
    }
    else{
      return(<></>)
    }
   
}

const Imagenes = (props:{picture1:any,picture2:any})=>{
if(props.picture1!="" && props.picture2!="" ){
  return(
    <div id="CardProveedoresImg">
      <img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture1}></img>
      <img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture2}></img>
      </div>
  )
}
else if(props.picture1!="" && props.picture2==""){
  return(
    <div id="CardProveedoresImg"><img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture1}></img>
    </div>
  )
}
else if(props.picture1=="" && props.picture2!="" ){
  return(
    <div id="CardProveedoresImg"><img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture2}></img>
    </div>
  )
}else{
  return(
    <div id="CardProveedoresImg">
      <strong>El proveedor no ha adjuntado imágenes de referencia</strong>
    </div>
  )
}
}*/

export default ExploreContainerProveedor;

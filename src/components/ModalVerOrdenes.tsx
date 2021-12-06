import { IonCard, IonCardSubtitle, IonCol, IonContent, IonGrid, IonIcon, IonRow } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import React, { useEffect, useState } from "react";

import Https from "../utilidades/HttpsURL";

const url=Https


const axios = require('axios');

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

const ModalVerOrdenes = (props:{datos:any,setVolver:any})  =>{



    const [datosOrden, setDatosOrden] = useState <datos_orden>(  );

    var estado="Enviada"

    useEffect(() => {
        
   
            if (props.datos.status=="ENV"){
              estado="PEDIDO DE TRABAJO"
            }else if(props.datos.status=="REC"){
              estado="PEDIDO DE TRABAJO RECIBIDO"
            }else if(props.datos.status=="ACE"){
              estado="PEDIDO DE TRABAJO ACEPTADO"
            }else if(props.datos.status=="EVI"){
              estado="EN VIAJE"
            }else if(props.datos.status=="ENS"){
              estado="EN SITIO"
            }
        
      }, [])


  
   
      return (
        <IonContent>

        <div id="modalProveedor-flechaVolver">
          <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
        </div>
      <IonCard id="ionCard-explorerContainer-Proveedor">
        <IonGrid>
        <IonRow  id="row-busqueda">
          <IonCol size="auto"  id="col-explorerContainerCliente"><img id="img-explorerContainerCliente" src={props.datos.imagen_cliente}></img></IonCol>
          <IonCol size="auto" id="col-explorerContainerCliente">
            <IonCardSubtitle>TIPO: {props.datos.tipo}</IonCardSubtitle>
            <IonCardSubtitle>STATUS: {estado}</IonCardSubtitle>
            <IonCardSubtitle>TICKET: {props.datos.ticket}</IonCardSubtitle>
          </IonCol>
        </IonRow>
        
        </IonGrid>
          
    
      </IonCard>

      <IonCard id="ionCard-explorerContainer-Proveedor">
            <IonCardSubtitle>FECHA DE SOLICITUD: {props.datos.fecha_creacion}</IonCardSubtitle>
            <IonCardSubtitle>TÍTULO: {props.datos.titulo}</IonCardSubtitle>
            <IonCardSubtitle>DESCRIPCIÓN DE LA SOLICITUD: {props.datos.descripcion}</IonCardSubtitle>        
      </IonCard>

      <IonCard id="ionCard-explorerContainer-Proveedor">
      < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
      </IonCard>

      </IonContent>

         
    );
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
}

export default ModalVerOrdenes;

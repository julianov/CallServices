import { dashToPascalCase } from "@ionic/react/dist/types/components/utils";
import { useEffect, useState } from "react";
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

const ModalVerOrdenes = (props:{tipo:string,datos:any,setVolver:any})  =>{

    const [datosOrden, setDatosOrden] = useState <datos_orden>(
        {
          tipo:"",
          status:"",
          fecha_creacion:"",
          ticket: "",
          dia: "",
          hora:"",
          titulo:"",
          descripcion:"",
          imagen_cliente:"",
          location_lat:0,
          location_long:0,
          picture1:"",
          picture2:"",
          }
    );
    useEffect(() => {
        
        axios.get(url+"orden/verordenparticular/"+"proveedor/"+props.datos.ticket).then((resp: { data: any; }) => {
            if (resp.data!="bad"){
                setDatosOrden((resp.data))
  

              
            }
  
          })
      }, [])

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
        <IonContent>

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
      </IonContent>

         
    );
}

export default ModalVerOrdenes;

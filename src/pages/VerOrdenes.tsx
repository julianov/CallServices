
import { IonCard, IonContent, IonIcon, IonTitle } from '@ionic/react';
import axios from 'axios';
import { arrowBack } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import Estrellas from '../utilidades/Estrellas';
import Https from '../utilidades/HttpsURL';

import './VerOrdenes.css';

const url=Https


export interface informacionOrdenes{
    rubro:string
    status:string
    fecha:string
  }
  
  let informacion = new Array<informacionOrdenes>();

const VerOrdenesCliente = (props:{clienteEmail:any , setCerrar:any}) => {

    const [hayOrdenes, setHayOrdenes] = useState (false)

    useEffect(() => {

        axios.get(url+"orden/consultarOrdenes/"+props.clienteEmail).then((resp: { data: any; }) => {
            if (resp.data!="bad"){

                console.log("check what it has come!: "+JSON.stringify(resp.data))
                
                for (let i=0; i<resp.data.length;i++){               
                    informacion.push({rubro:resp.data[i].rubro,status:resp.data[i].status, fecha:resp.data[i].fecha})
                    
                  }
                  setHayOrdenes(true)
             
              }
            })

    }, [])

    if(hayOrdenes){
        return( 
            <IonContent>
                <div id="flechaVolver">
                    <IonIcon icon={arrowBack} onClick={() => props.setCerrar(null)} slot="start" id="flecha-volver">  </IonIcon>
                </div>
                <div id="contenedorCentroVerOrdenes">

                    <MostrarOrdenes informacion={informacion} setCerrar={props.setCerrar} />
                </div>
            </IonContent>
        )
    }else{
        return (
            <>
                <div id="contenedorCentroVerOrdenes">
                    <div id="contenedorPrincipal">
                        <div id="contenedorHijoCentrado">
                            <IonTitle>NO HA SOLICITADO ÓRDENES DE TRABAJO</IonTitle>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    

}


const MostrarOrdenes = (props:{ informacion:Array<informacionOrdenes>,setCerrar:any}) => {

    var i=0
    //if (props.proveedores!=[]){
      return (
        <div id="elementos">
          {informacion.map((a) => {
            i=i+1
            //item, imagen personal, distancia, calificación, email, nombre, apellido, tipo
            return (
                
            <Card key={i} rubro={a.rubro} status={a.status} fecha={a.fecha} ></Card> 
            
            ) 
          })
          }
      </div>
    )
}



const Card = (props:{ rubro: string, status:string, fecha:string }) => {

    const [estado, setEstado] = useState("REALIZADA")
    useEffect(() => {
    if (props.status=="ENV"){
        setEstado("GENERADA")
      }else if(props.status=="REC"){
        setEstado("ORDEN RECIBIDA POR PROVEEDOR")
      }else if(props.status=="ABI"){
        setEstado("ORDEN RECIBIDA POR PROVEEDOR")
      }else if(props.status=="PEI"){
        setEstado("ORDEN CON SOLCITUD DE MÁS INFORMACIÓN")
      } else if(props.status=="PRE"){
        setEstado("ORDEN PRE ACEPTADA POR PROVEEDOR")
      }else if(props.status=="ACE"){
        setEstado("ORDEN ACEPTADA")
      }else if(props.status=="EVI"){
        setEstado("PROVEEDOR EN VIAJE")
      }else if(props.status=="ENS"){
        setEstado("PROVEEDOR EN SITIO")
      }else if(props.status=="RED"){
        setEstado("REALIZADA")
      }else if (props.status=="REX"){
        setEstado("RECHAZADA")
      }else if (props.status=="CAN"){
        setEstado("CANCELADA")
      }
    }, [])
    return(
        <IonCard id="ionCardOrden">
        <div id="contenedorCamposCentro">
        <div id="divSentencias">
        <p>RUBRO: {props.rubro} </p>
        <p>ESTADO: {estado} </p> 
        <p>FECHA DE ORDEN: {props.fecha} </p>
        </div>
        </div>
        </IonCard>
    )
}


export default VerOrdenesCliente 
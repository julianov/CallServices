
import { IonCard, IonContent, IonIcon } from "@ionic/react";
import axios from "axios";
import { arrowBack } from "ionicons/icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Estrellas from "./Estrellas";
import Https from "./HttpsURL";
import './Resenas.css';

const url=Https

interface reseñados{
    calificación:string,
    reseña:string,
   
     }

let reseñas = new Array<reseñados>();


const Resenas = (props:{email_a_ver_reseñas:any,  tipo:any, setVolver:any}) => {

    const [sinReseñas, setSinReseñas] = useState(false)

   //tipo puede ser: "cliente", Proveedor de servicio independiente o Empresa de servicios
    axios.get(url+"resena/"+props.email_a_ver_reseñas+"/0/"+props.tipo.current).then((resp: { data: any; }) => {
      if (resp.data!="bad"){
            for (let i=0; i<resp.data.length;i++){               
                reseñas.push({calificación: resp.data[i].calificación, reseña: resp.data[i].reseña })
              }
        }
        else{
            setSinReseñas(true)
        }

      })
      if(sinReseñas){
        return (
            <IonContent >
              <div id="contenedorPrincipal">
                <div id="modalProveedor-flechaVolver">
                    <IonIcon icon={arrowBack} onClick={() => props.setVolver({ isOpen: false })} slot="start" id="flecha-volver">  </IonIcon>
                </div>
                
                <div id="contenedorHijoCentrado">
                    <h1>NO HAY RESEÑAS HASTA EL MOMENTO</h1>
                </div>
                </div>      
            </IonContent>
        
        )

      }else{
        return (
            <IonContent >
                <div id="modalProveedor-flechaVolver">
                    <IonIcon icon={arrowBack} onClick={() => props.setVolver({ isOpen: false })} slot="start" id="flecha-volver">  </IonIcon>
                </div>
                
                <Elementos reseñas={reseñas} />
                
            </IonContent>
        
        )
      }


}

const Elementos = (props:{ reseñas: Array<reseñados> }) => {

    var i=0
    //if (props.proveedores!=[]){
      return (
        <div id="elementos">
          {props.reseñas.map((a) => {
            i=i+1
            //item, imagen personal, distancia, calificación, email, nombre, apellido, tipo
            return (
                
            <Card key={i} calificación={a.calificación} reseña={a.reseña} ></Card> 
            
            ) 
          })
          }
      </div>
    )
    //}
        
  }

  const Card = (props:{ calificación: string, reseña:string }) => {

    return(
        <IonCard id="ionCardOrden">
        <div id="contenedorCamposCentro">
        <h2>CALIFICACIÓN:</h2>
        <Estrellas calificacion={props.calificación}></Estrellas>
        <h2>RESEÑA:</h2> 
        <p> {props.reseña} </p>
        </div>
        </IonCard>
    )

  }
export default Resenas;

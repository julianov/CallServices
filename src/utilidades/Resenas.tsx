
import { IonCard, IonContent, IonIcon } from "@ionic/react";
import axios from "axios";
import { arrowBack } from "ionicons/icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Estrellas from "./Estrellas";
import Https from "./HttpsURL";
import './Resenas.css';

const url=Https

export interface reseñados{
  calificación:any
  resena:any
}

let resenas = new Array<reseñados>();


const Resenas = (props:{email_a_ver_reseñas:any,  tipo:any, setVolver:any}) => {

    const [sinReseñas, setSinReseñas] = useState(false)


   //tipo puede ser: "cliente", Proveedor de servicio independiente o Empresa de servicios
   useEffect(() => { 
   axios.get(url+"resena/"+props.email_a_ver_reseñas+"/0/"+props.tipo).then((resp: { data: any; }) => {
      if (resp.data!="bad"){
        
        resenas= []
            for (let i=0; i<resp.data.length;i++){               
                resenas.push({calificación:resp.data[i].calificación,resena:resp.data[i].resena})
                
              }
              setSinReseñas(false)
             
        }
        else{
            setSinReseñas(true)
        }

      })
    }, [])

      if(sinReseñas){
        return (
            <IonContent>
            <div id="contenedorCentralReseñas">

              <div id="contenedorPrincipal">
                <div id="modalProveedor-flechaVolver">
                    <IonIcon icon={arrowBack} onClick={() => props.setVolver(false )} slot="start" id="flecha-volver">  </IonIcon>
                </div>
                
                <div id="contenedorHijoCentrado">
                    <h1>NO HAY RESEÑAS HASTA EL MOMENTO</h1>
                </div>
                </div>    
                </div>    
            </IonContent>
        
        )

      }else{
        return (
            <IonContent >
              <div id="ReseñaColor">
                <div id="modalProveedor-flechaVolver">
                    <IonIcon icon={arrowBack} onClick={() => props.setVolver( false)} slot="start" id="flecha-volver">  </IonIcon>
                </div>
                <div id="contenedorCentralReseñas">

                <Elementos reseñas={resenas!} />
                </div>
                </div>
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
                
            <Card key={i} calificacion={a.calificación} reseña={a.resena} ></Card> 
            
            ) 
          })
          }
      </div>
    )
    //}
        
  }

  const Card = (props:{ calificacion: string, reseña:string }) => {

    if (props.reseña!=""){
      return(
        <IonCard id="ionCardOrden">
        <div id="contenedorCamposCentro">
        <h2>CALIFICACIÓN:</h2>
        <Estrellas calificacion={props.calificacion}></Estrellas>
        <h2>RESEÑA:</h2> 
        <p> {props.reseña} </p>
        </div>
        </IonCard>
    )
    }else{
      return(
        <IonCard id="ionCardOrden">
        <div id="contenedorCamposCentro">
        <h2>CALIFICACIÓN:</h2>
        <Estrellas calificacion={props.calificacion}></Estrellas>
        <h2>RESEÑA:</h2> 
        <p>SIN RESEÑA DE CLIENTE</p>
        </div>
        </IonCard>
    )
    }
    

  }
export default Resenas;

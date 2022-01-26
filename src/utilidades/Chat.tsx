import { IonCard, IonChip, IonContent, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel } from '@ionic/react';
import axios from 'axios';
import { arrowBack, send } from 'ionicons/icons';
import React, { Component, useEffect, useRef, useState } from 'react';
import Https from './HttpsURL';

const url = Https 


export interface mensajes{
    usuario:any
    mensaje:any
    dia:any
    hora:any
  }


  let msg = new Array<mensajes>();


const Chat = (props:{emai:any,  ticket:any, setVolver:any}) => {

    const [hayMensajes, setHayMensajes] = useState(false)

    const mensaje = useRef("")

    useEffect(() => {

        axios.get(url+"chat/"+props.ticket).then((resp: { data: any; }) => {

            if (resp.data!="bad"){
                console.log("esto es lo que llego del chat: "+resp.data)
                for (let i=0; i<resp.data.length;i++){               
                    msg.push({usuario:resp.data[i].user,mensaje:resp.data[i].mensaje, dia:resp.data[i].dia, hora:resp.data[i].hora}) 
                }
                setHayMensajes(true)
            }
          });  

    }, []);

    if(hayMensajes){

    }else{

        return (
            <IonContent>
                <div id="modalProveedor-flechaVolver">
                    <IonIcon icon={arrowBack} onClick={() => props.setVolver(false )} slot="start" id="flecha-volver">  </IonIcon>
                </div>
                <IonCard id="ionCardOrden">
                    <div id="contenedorCamposCentro">
                    
                    <p> SIN MENSAJES</p>
                    </div>
                </IonCard>
                <IonItemDivider>INGRESE MENSAJE</IonItemDivider>
                <IonItem>
                    <IonInput value={mensaje.current} placeholder="Mensaje" onIonChange={e => mensaje.current=(e.detail.value!)} clearInput></IonInput>
                </IonItem>
                <IonChip>
                    <IonIcon icon={send} />
                    <IonLabel>ENVIAR</IonLabel>
                </IonChip>
            </IonContent>
        )
    }
}
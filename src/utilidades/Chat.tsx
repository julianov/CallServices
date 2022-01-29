import { IonCard, IonChip, IonCol, IonContent, IonFooter, IonGrid, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonRow } from '@ionic/react';
import axios from 'axios';
import { arrowBack, send } from 'ionicons/icons';
import React, { Component, useEffect, useRef, useState } from 'react';
import Https from './HttpsURL';

import './Chat.css';

const url = Https 


export interface mensajes{
    usuario:any
    mensaje:any
    dia:any
    hora:any
  }


  let msg = new Array<mensajes>();


const Chat = (props:{email:any,  ticket:any, setVolver:any}) => {

    const [hayMensajes, setHayMensajes] = useState(false)

    const mensaje = useRef("")

    useEffect(() => {

        axios.get(url+"chat/"+props.ticket).then((resp: { data: any; }) => {
            console.log("esto es lo que verdaderamente llego del chat: "+resp.data)
            if (resp.data!="bad"){
                console.log("esto es lo que llego del chat: "+JSON.stringify(resp.data))
                for (let i=0; i<resp.data.length;i++){               
                    msg.push({usuario:resp.data[i].user,mensaje:resp.data[i].mensaje, dia:resp.data[i].dia, hora:resp.data[i].hora}) 
                }
                setHayMensajes(true)
            }
          });  

    }, []);

    const enviar = () =>{

        if (mensaje.current!=""){
            axios.get(url+"chat/mensaje/"+props.email+"/"+props.ticket+"/"+mensaje.current).then((resp: { data: any; }) => {
                if (resp.data!="bad"){
                    msg.push({usuario:props.email,mensaje:mensaje.current, dia:"reciente", hora:"-"}) 
                }
              }); 
              
              setHayMensajes(true)
        }
    }

    if(hayMensajes){

        return (
           
                <><div id="modalProveedor-flechaVolver">
                <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
            </div><IonCard id="ionCardMensaje">
            
                    <ElementosMensaje mensajes={msg}></ElementosMensaje>
                    
                </IonCard><IonFooter>
                    <IonItemDivider>INGRESE MENSAJE</IonItemDivider>
                    <div id="div1">
                        <IonItem id="item">
                            <IonInput value={mensaje.current} placeholder="Mensaje" onIonChange={e => mensaje.current = (e.detail.value!)} clearInput></IonInput>
                        </IonItem>
                    </div>
                    <div id="div2">
                        <IonChip onClick={() => enviar()}>
                            <IonIcon icon={send} />
                            <IonLabel>ENVIAR</IonLabel>
                        </IonChip>
                    </div>
                </IonFooter></>
          
        )

    }else{

        return (
            <IonContent >
                <div id="chatContenedorPrincipal">
                <div id="modalProveedor-flechaVolver">
                    <IonIcon icon={arrowBack} onClick={() => props.setVolver(false )} slot="start" id="flecha-volver">  </IonIcon>
                </div>
                <IonCard id="ionCardMensaje">
                    <div id="contenedorCamposCentro">
                    
                    <p> SIN MENSAJES</p>
                    </div>
                </IonCard>
                
                <IonItemDivider>INGRESE MENSAJE</IonItemDivider>
                <div id="div1">
                            <IonItem>
                                <IonInput value={mensaje.current} placeholder="Mensaje" onIonChange={e => mensaje.current=(e.detail.value!)} clearInput></IonInput>
                            </IonItem>
                </div> 
                <div id="div2">
                            <IonChip onClick={() => enviar () } >
                                <IonIcon icon={send} />
                                <IonLabel>ENVIAR</IonLabel>
                            </IonChip>
                </div>      
                 
                </div>
            </IonContent>
        )
    }
}

const ElementosMensaje = (props:{mensajes: Array<mensajes> }) => {
    var i=0
      return (
        <div id="elementos">
          {props.mensajes.map((a) => {
            i=i+1
            return (
            <Card key={i} usuario={a.usuario} mensaje={a.mensaje} dia={a.dia} hora={a.hora} ></Card> 
            ) 
          })
          }
      </div>
    )
}

const Card = (props:{ usuario:string, mensaje:string, dia:string, hora:string  }) => {
    return(
        <div id="contenedorMensajesChat">
        <IonCard id="cardMensajeChat">
            <p id="p-textoMensaje"> {props.mensaje} </p>
        </IonCard>
        <p id="p-textoMensaje"> {props.dia}+" "+{props.hora} </p>
        </div>
    )
}

export default Chat;
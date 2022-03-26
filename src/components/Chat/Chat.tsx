import axios from 'axios';
import { arrowBack, send } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import Https from '../../utilidades/HttpsURL';
import { IonCard, IonChip,  IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonTitle } from '@ionic/react';

import './Chat.css';

const url = Https 


export interface mensajes{
    usuario:any
    mensaje:any
    dia:any
    hora:any
}


let msg = new Array<mensajes>();


const Chat = (props:{email:any,  ticket:any, setVolver:any, setVista:any, desdeDondeEstoy:any}) => {

   
    const [hayMensajes, setHayMensajes] = useState(false)
    //const [nuevoMensaje, setNuevoMensaje]=useState(0)

    const [mensaje, setMensaje ] = useState("")
    
    const [arregloMensajes, setArregloMensajes] =  useState <mensajes []> ( [])

    useEffect(() => {

        axios.get(url+"chat/"+props.ticket+"/"+props.email).then((resp: { data: any; }) => {
            
            if (resp.data!="bad"){
                msg=[]
                for (let i=0; i<resp.data.length;i++){
                    let dia=""
                    if(i==0){
                        dia=resp.data[i].dia
                    } 
                    else if(i!=0 && resp.data[i-1].dia!=resp.data[i].dia){
                        dia=resp.data[i].dia
                    }    
                    
                   msg.push({usuario:resp.data[i].user,mensaje:resp.data[i].mensaje, dia:dia, hora:resp.data[i].hora}) 

                    //setArregloMensajes([...arregloMensajes, {usuario:resp.data[i].user,mensaje:resp.data[i].mensaje, dia:dia, hora:resp.data[i].hora} ] )

                }
                setMensaje("")
                setArregloMensajes(msg.reverse())
                setHayMensajes(true)
                
            }
          });  

    }, []);

    const enviar = () =>{

        if (mensaje!=""){
            let date: Date = new Date();
            const mes=(date.getMonth()+1)

            const dia=date.getDate()+"-"+mes+"-"+date.getFullYear()
            const hora=date.getHours()+":"+date.getMinutes()

            axios.get(url+"chat/mensaje/"+props.email+"/"+props.ticket+"/"+mensaje+"/"+dia+"/"+hora).then((resp: { data: any; }) => {
                
                if (resp.data!="bad"){
                    //msg=msg.reverse()
                    //msg.push({usuario:props.email,mensaje:mensaje, dia:date.getDate()+"-"+date.getMonth()+1+"-"+date.getFullYear() , hora:date.getHours()+":"+date.getMinutes()}) 
                    
                    setArregloMensajes([ {usuario:props.email,mensaje:mensaje, dia:dia , hora:date.getHours()+":"+date.getMinutes()} , ...arregloMensajes] )
                }
              }); 
              //setNuevoMensaje(nuevoMensaje+1)
             
              setHayMensajes(true)
              setMensaje("")
        }
    }

    if(hayMensajes){

        return (
           
            <><div id="contenedorChat">
                <div id="modalChat-flechaVolver">
                    <IonIcon icon={arrowBack} onClick={() => props.setVista(props.desdeDondeEstoy)} slot="start" id="flecha-volver">  </IonIcon>
                </div>
                <div id="modalChat-titulo">
                    <IonTitle id="chatTitulo">CHAT</IonTitle>
                </div>
                <div id="modalChat-card">

                <IonCard id="ionCardMensaje">

                    <ElementosMensaje miemail={props.email} mensajes={arregloMensajes}></ElementosMensaje>

                </IonCard>
                </div>
                <footer id="chatFooter">
                    <IonItemDivider>INGRESE MENSAJE</IonItemDivider>
                    <div id="div1">
                        <IonItem id="item">
                            <IonInput value={mensaje} placeholder="Mensaje" onIonChange={e => setMensaje(e.detail.value!)} clearInput></IonInput>
                        </IonItem>
                    </div>
                    <div id="div2">
                        <IonChip onClick={() => enviar()}>
                            <IonIcon icon={send} />
                            <IonLabel>ENVIAR</IonLabel>
                        </IonChip>
                    </div>
                </footer>
            </div>
          </>
        )

    }else{

        return (


            <><div id="contenedorChat">
                <div id="modalChat-flechaVolver">
                    <IonIcon icon={arrowBack} onClick={() => props.setVista(props.desdeDondeEstoy)} slot="start" id="flecha-volver">  </IonIcon>
                </div>
                <div id="modalChat-titulo">
                    <IonTitle id="chatTitulo">CHAT</IonTitle>
                </div>
                <div id="modalChat-card">

                <IonCard id="ionCardMensaje">

                <div id="contenedorCamposCentro">
                    
                    <p> SIN MENSAJES</p>
                    </div>
                </IonCard>
                </div>
                <footer id="chatFooter">
                    <IonItemDivider>INGRESE MENSAJE</IonItemDivider>
                    <div id="div1">
                        <IonItem id="item">
                            <IonInput value={mensaje} placeholder="Mensaje" onIonChange={e => setMensaje(e.detail.value!)} clearInput></IonInput>
                        </IonItem>
                    </div>
                    <div id="div2">
                        <IonChip onClick={() => enviar()}>
                            <IonIcon icon={send} />
                            <IonLabel>ENVIAR</IonLabel>
                        </IonChip>
                    </div>
                </footer>
            </div>
          </>






       
        )
    }
}

const ElementosMensaje = (props:{miemail:string,mensajes: Array<mensajes> }) => {

    var i=0
      return (
        <div id="Mensajes">
          {props.mensajes.map((a) => {
            i=i+1
            
            if(props.miemail==a.usuario){
                return (
                    <Card key={i} usuario={a.usuario} mensaje={a.mensaje} dia={a.dia} hora={a.hora} ></Card> 
                    ) 
            }
            else{
                return (
                    <Card2 key={i} usuario={a.usuario} mensaje={a.mensaje} dia={a.dia} hora={a.hora} ></Card2> 
                    )             
                }
            
          })
          }
      </div>
    )
}

const Card = (props:{ usuario:string, mensaje:string, dia:string, hora:string  }) => {
    return(
        <><div id="contenedorMensajesChat">
                <IonCard id="cardMensajeChat">
                    <p id="p-textoMensaje"> {props.mensaje} </p>
                    <p id="p-textoMensajehora"> {props.hora} </p>
                </IonCard>
            </div>
            <div id="contenedorMensajesFecha">
            <p id="p-textoMensaje-dia1"> {props.dia} </p>
        </div>
        </>
    )
}

const Card2 = (props:{ usuario:string, mensaje:string, dia:string, hora:string  }) => {
    return(
        <><div id="contenedorMensajesChat2">
                <IonCard id="cardMensajeChat2">
                    <p id="p-textoMensaje2"> {props.mensaje} </p>
                    <p id="p-textoMensajehora"> {props.hora} </p>

                </IonCard>
            </div>
            <div id="contenedorMensajesFecha">
            <p id="p-textoMensaje-dia1"> {props.dia} </p>
        </div>
            </>
    )
}




export default Chat;
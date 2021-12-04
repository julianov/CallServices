import './Orden.css';
import axios from "axios";
import Estrellas from "../utilidades/Estrellas";

import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import CardProveedor from "../utilidades/CardProveedor";
import { removeItem } from "../utilidades/Storage";
import Https from "../utilidades/HttpsURL";
import React, { useEffect, useRef, useState } from 'react';
import { IonCard, IonCardHeader, IonGrid, IonRow, IonCol, IonCardTitle, IonCardSubtitle, IonItemDivider, IonItem, IonButton, IonInput, IonLabel, IonImg, IonActionSheet, IonFabButton, IonIcon, IonAlert, IonContent, IonDatetime } from '@ionic/react';
import { Photo, usePhotoGallery } from "../hooks/usePhotoGallery";
import { base64FromPath } from '@ionic/react-hooks/filesystem';
import { b64toBlob } from '../utilidades/b64toBlob';
import { arrowBack, camera, trash } from 'ionicons/icons';
import { isSetAccessorDeclaration } from 'typescript';
import { allowedNodeEnvironmentFlags } from 'process';

const url=Https+"orden/"

let posicion: string;

const getLocation = async () => {
    try {
        const position = await Geolocation.getCurrentPosition();
        posicion=position.coords.latitude +"/"+ position.coords.longitude
        return posicion;
  
    } catch (e) {
      return "";
    }
  }

const OrdenSimple = (props:{data:any, clienteEmail:any , setVolver:any	}) => {

    console.log("llego a orden simple")
    console.log("el email mio es: "+ props.data.items)

    
    const [vista,setVista] = useState ("primeraVista")

    const posicionCliente = useRef("")
    const titulo = useRef("")
    const descripcion = useRef("")
    const foto1Mostrar= useRef <String>()
    const foto2Mostrar= useRef <String>()

    const foto1= useRef <Blob>()
    const foto2= useRef <Blob>()

    const fecha = useRef("")
    const hora = useRef("")

    const [showAlertCompletarCampos, setShowAlertCompletarCampos]=useState(false)
    const [showAlertInconvenienteSolicitud, setShowAlertInconvenienteSolicitud]=useState(false)
    const [showAlertOrdenCreada,setShowAlertOrdenCreada]=useState(false)
    const [showAlertYaHayOrden,setShowAlertYaHayOrden]=useState(false)
    
    const ticket = useRef()

    useEffect(() => {
        
        const ubicacion = getLocation();
        ubicacion.then((value)=>{
            posicionCliente.current=(value)
        });

      }, [])

    const irASiguiente =() => {
        if (vista=="primeraVista")
        {   
            if(titulo.current!="" && descripcion.current!=""){
                setVista("imagenes")
            }else{
                setShowAlertCompletarCampos(true)
            }
            
        }
    }

    const enviar =() => {

        /*
        <clienteEmail>/<tipoProveedor>/<ProveedorEmail>/<itemProveedor>/
            <clienteLat>/<clienteLong>/<tituloPedido>/
        <diaPedido>/<horaPedido>/<descripcion_problema>/<imagen1>/<imagen2></imagen2>
        */

        console.log("llego a enviar")

        if (posicionCliente.current!=""){
            console.log("paso esto")

            console.log("pues veamos que tenemos que da error: "+hora.current)

            var formDataToUpload = new FormData();
            formDataToUpload.append("clienteEmail", props.clienteEmail)
            formDataToUpload.append("tipoProveedor",props.data.tipo)
            formDataToUpload.append("ProveedorEmail",props.data.proveedorEmail)
            formDataToUpload.append("itemProveedor",props.data.items)
            formDataToUpload.append("clienteLat",posicionCliente.current.split("/")[0])
            formDataToUpload.append("clienteLong",posicionCliente.current.split("/")[1])
            formDataToUpload.append("tituloPedido",titulo.current)

            if(fecha.current!=undefined || fecha.current!=""){
                formDataToUpload.append("diaPedido",fecha.current.split("T")[0])
            }
                
            if ( hora.current!=""){
                formDataToUpload.append("horaPedido",(hora.current.split("T")[1]).split(".")[0])
            }
                
            formDataToUpload.append("descripcion_problema",descripcion.current)
            
    
            if(foto1.current!=null || foto1.current!=undefined){
                formDataToUpload.append("imagen1", foto1.current);
                
            }
            if(foto2.current!=null || foto2.current!=undefined){
                formDataToUpload.append("imagen2", foto2.current);
                
            }
    
    
            const axios = require('axios');
                axios({
                    url:url+"ordengeneral",
                    method:'POST',
                    headers: {"content-type": "multipart/form-data"},
                    data:formDataToUpload
                }).then(function(res: any){
    
                    console.log("veamos que pasó: "+ res.data)
                    if(res.data!="bad" && res.data!="ya hay una orden"){
                        ticket.current=res.data
                        setShowAlertOrdenCreada(true)

                    }
                    else{
                        if(res.data=="ya hay una orden"){
                            setShowAlertYaHayOrden(true)
                        }else{
                            setShowAlertInconvenienteSolicitud(true)
                        }
                        
                        
                    }
                
                }).catch((error: any) =>{
      //              setVista(0)
                    //Network error comes in
                });
        }
        
    }
    
    if (vista=="primeraVista"){
        return (
            <IonContent>
            <>
            <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver({ isOpen: false })} slot="start" id="flecha-volver">  </IonIcon>
            </div>
            <div id="contenderCentralOrden">
            <IonCardTitle>SOLICITUD DE SERVICIO</IonCardTitle>

                <IonCard id="ionCard-CardProveedor">
                    <IonCardHeader>
                        <img id="ionCard-explorerContainer-Cliente-Imagen" src={props.data.picture}></img>
                        <h2  > {props.data.items} </h2>
                        <h2> {props.data.nombre} </h2>
                        <IonItem id="CardProveedorItem" lines="none"> {props.data.calificacion} </IonItem>
                    </IonCardHeader>

                    <IonItem id="item-Orden">
                        <IonLabel position="floating">Ingrese un título para su pedido</IonLabel>
                        <IonInput onIonInput={(e: any) => titulo.current = (e.target.value)}></IonInput>
                    </IonItem>

                    <IonItem id="item-Orden">
                        <IonLabel position="floating">Ingrese una descripción</IonLabel>
                        <IonInput onIonInput={(e: any) => descripcion.current = (e.target.value)}></IonInput>
                    </IonItem>

                </IonCard>
                <IonButton color="warning" id="botonContratar" onClick={() => irASiguiente()}>SIGUIENTE</IonButton>

            </div>
                <IonAlert
                    isOpen={showAlertCompletarCampos}
                    onDidDismiss={() => setShowAlertCompletarCampos(false)}
                    cssClass='my-custom-class'
                    header={'Completar campos'}
                    subHeader={''}
                    message={'Debe completar todos los campos para continuar'}
                    buttons={['OK']} />
                </>
        </IonContent>
        )
    }
   else if (vista=="imagenes"){

    return (
        <IonContent>
            <div id="modalProveedor-flechaVolver">
                <IonIcon icon={arrowBack} onClick={() => setVista("primeraVista")} slot="start" id="flecha-volver">  </IonIcon>
            </div>
        <div id="contenderCentralOrden">
            <IonCard id="ionCard-CardProveedor">
                
                    <IonCardTitle id="tituloOrden">IMÁGENES DE REFERENCIA</IonCardTitle>
                    <IonCardSubtitle>¿Desea agregar imágenes para que el proveedor tenga referencia del trabajo a realizar?</IonCardSubtitle>

                    <IonGrid>
                        <IonRow>
                            <IonCol >
                                <TomarFotografia imagen={foto1Mostrar} setFilepath={foto1} />
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol >
                                <TomarFotografia imagen={foto2Mostrar} setFilepath={foto2} />
                            </IonCol>
                        </IonRow>                                              
                    </IonGrid>

          </IonCard>
          <IonButton  color="warning"  id="botonContratar" onClick={() => setVista("final")}>SIGUIENTE</IonButton>
        </div>
    </IonContent>
    )

    }else if (vista=="final"){

        return (
            <IonContent>
            <div id="modalProveedor-flechaVolver">
                <IonIcon icon={arrowBack} onClick={() => setVista("imagenes")} slot="start" id="flecha-volver">  </IonIcon>
            </div>
            <div id="contenderCentralOrden">
            <IonCardTitle>PROGRAMAR FECHA</IonCardTitle>

                <IonCard id="ionCard-CardProveedor">
                    
                        <IonCardSubtitle>Ingrese día y horario estimativo</IonCardSubtitle>
    
                        <IonGrid>
                            <IonRow>
                                <IonCol >
                                    <IonItem id="item-completarInfo">
                                        <IonLabel position="floating">Fecha estimativa</IonLabel>                                    
                                        <IonDatetime displayFormat="DD-MM-YYYY"  value={fecha.current} onIonChange={e => fecha.current=(e.detail.value!)}></IonDatetime>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol >
                                    <IonItem id="item-completarInfo">
                                        <IonLabel position="floating">Hora estimativa</IonLabel>
                                        <IonDatetime displayFormat="HH:mm" value={hora.current} onIonChange={e => hora.current=(e.detail.value!)}></IonDatetime>

                                    </IonItem>
                                </IonCol>
                            </IonRow>                                              
                        </IonGrid>
    
              </IonCard>
              <IonButton  color="warning"  id="botonContratar" onClick={() => enviar()}>SOLICITAR</IonButton>
            </div>

            <IonAlert
                    isOpen={showAlertInconvenienteSolicitud}
                    onDidDismiss={() => setShowAlertInconvenienteSolicitud(false)}
                    cssClass='my-custom-class'
                    header={'INCONVENIENTE EN LA SOLICITUD DEL SERVICIO'}
                    subHeader={''}
                    message={'INTENTE MÁS TARDE'}
                    buttons={[
                        {
                          text: 'OK',
                          role: 'cancel',
                          cssClass: 'secondary',
                          handler: blah => {
                            props.setVolver({ isOpen: false })
                          }
                        }
                      ]} />

                <IonAlert
                    isOpen={showAlertYaHayOrden}
                    onDidDismiss={() => setShowAlertYaHayOrden(false)}
                    cssClass='my-custom-class'
                    header={'INCONVENIENTE EN LA SOLICITUD DEL SERVICIO'}
                    subHeader={''}
                    message={'Ya posee una orden de servicio con el proveedor del servicio'}
                    buttons={[
                        {
                          text: 'OK',
                          role: 'cancel',
                          cssClass: 'secondary',
                          handler: blah => {
                            props.setVolver({ isOpen: false })
                          }
                        }
                      ]} />
            <IonAlert
                    isOpen={showAlertOrdenCreada}
                    onDidDismiss={() => setShowAlertOrdenCreada(false)}
                    cssClass='my-custom-class'
                    header={'ORDEN DE SERVICIO CREADA CON ÉXITO'}
                    subHeader={''}
                    message={'Se ha creado con éxito la orden de servicio: '+ticket.current }
                    buttons={[
                        {
                          text: 'OK',
                          role: 'cancel',
                          cssClass: 'secondary',
                          handler: blah => {
                            setVista("orden creada")
                          }
                        }
                      ]} />
                
                

         </IonContent>
        )

    }else{
        return(
        <IonContent>

<>
            <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver({ isOpen: false })} slot="start" id="flecha-volver">  </IonIcon>
            </div>

            <div id="contenderCentralOrden">
            <h1>ORDEN DE SERVICIO</h1>

                <IonCard id="cardOrdenTicket">
                    <IonCardHeader>
                    <IonCardTitle> NÚMERO DE TICKET: {ticket.current} </IonCardTitle>
                    <IonCardTitle>STATUS: SOLICITUD ENVIADA </IonCardTitle>
                      
                    </IonCardHeader>
                    <p>En espera de confirmación por parte del proveedor </p>

                    
                    
                </IonCard>
                <h1>PROVEEDOR</h1>

                <IonCard id="ionCard-CardProveedor">
                        <img id="ionCard-explorerContainer-Cliente-Imagen" src={props.data.picture}></img>
                        <IonCardTitle> {props.data.nombre} </IonCardTitle>
                        <IonCardTitle  > {props.data.items} </IonCardTitle>
                        <IonItem id="CardProveedorItem" lines="none"> {props.data.calificacion} </IonItem>
                </IonCard>

            </div>
            </>
               
        </IonContent>
        )
    }
   


} 




const TomarFotografia = (props: {imagen:any, setFilepath:any}) => {

    const { deletePhoto, photos, takePhoto } = usePhotoGallery();
    const [photoToDelete, setPhotoToDelete] = useState(false);
    const [presioneParaBorrar,setPresioneParaBorrar]=useState("")
    
    const [fotoTomada, setFotoTomada]=useState(false)

    const onClickPhotoData=()=>{
        //props.setFilepath(photo.webviewPath)
        setPhotoToDelete(true)
    }

    useEffect(() => {

            if (props.imagen.current!="" && props.imagen.current!=undefined && props.imagen.current!=null){
                setFotoTomada(true)
            }
            
    }, []);
    
    const tomarFoto =()=>{
        takePhoto().then(async res => {
            if(res!=null){
               // props.setImagen(res[0].webviewPath!)
                const base64Data = await base64FromPath(res[0].webviewPath!);
                //props.imagen.current=res[0].webviewPath!
                props.imagen.current= base64Data

                var block = base64Data!.split(";");
                var contentType = block[0].split(":")[1];
                var realData = block[1].split(",")[1];
                var blob = b64toBlob(realData, contentType,1);
                props.setFilepath.current=( blob!)

                
                setFotoTomada(true)
                setPresioneParaBorrar("Presione la imagen para eliminarla")            
            }
        })
    }
    
    if(fotoTomada){
        return(
            <><IonGrid>
                <IonRow>
                    <IonCol>
                        <strong>Seleccionar foto de galería o tomar fotografia</strong>
                    </IonCol>
                </IonRow>
            
                <IonRow>
                    <IonCol>
                     <IonImg id="foto" onClick={() => onClickPhotoData()} src={props.imagen.current} />
                    </IonCol>
                </IonRow>
    
                <IonRow>
                    <IonCol>
                        <p> {presioneParaBorrar} </p>
                    </IonCol>
                </IonRow>
            </IonGrid>
    
                <IonActionSheet
                    isOpen={photoToDelete}
                    buttons={[{
                        text: 'Eliminar',
                        role: 'destructive',
                        icon: trash,
                        handler: () => {
                            if (photoToDelete) {
                                props.setFilepath.current=(null)
                                props.imagen.current=""
                                setFotoTomada(false)
                                setPresioneParaBorrar("")

                            }
                        }
                    }, {
                        text: 'Cancelar',
                        role: 'cancel'
                    }]}
                    onDidDismiss={() => setPhotoToDelete(false)} 
                    />
                </>
        );
    }else{
        return(
            <>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <strong>Seleccionar foto de galería o tomar fotografia</strong>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonFabButton onClick={() => tomarFoto()}>
                            <IonIcon icon={camera}></IonIcon>
                        </IonFabButton>
                    </IonCol>
                </IonRow>
    
                <IonRow>
                    <IonCol>
                        <p> {presioneParaBorrar} </p>
                    </IonCol>
                </IonRow>
            </IonGrid>
    
                <IonActionSheet
                    isOpen={photoToDelete}
                    buttons={[{
                        text: 'Eliminar',
                        role: 'destructive',
                        icon: trash,
                        handler: () => {
                            if (photoToDelete) {
                                props.setFilepath(null)
                            }
                        }
                    }, {
                        text: 'Cancelar',
                        role: 'cancel'
                    }]}
                    onDidDismiss={() => setPhotoToDelete(false)} 
                    />
                </>
        );
    }
    
}  


export default OrdenSimple 

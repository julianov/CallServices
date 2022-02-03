import './PedirOrden.css';
import axios from "axios";
import Estrellas from "../utilidades/Estrellas";

import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import CardProveedor from "../utilidades/CardProveedor";
import { removeItem } from "../utilidades/Storage";
import Https from "../utilidades/HttpsURL";
import React, { useEffect, useRef, useState } from 'react';
import { IonCard, IonCardHeader, IonGrid, IonRow, IonCol, IonCardTitle, IonCardSubtitle, IonItemDivider, IonItem, IonButton, IonInput, IonLabel, IonImg, IonActionSheet, IonFabButton, IonIcon, IonAlert, IonContent, IonDatetime, IonCheckbox, IonLoading, IonTitle, IonSegment, IonSegmentButton } from '@ionic/react';
import { Photo, usePhotoGallery } from "../hooks/usePhotoGallery";
import { base64FromPath } from '@ionic/react-hooks/filesystem';
import { b64toBlob } from '../utilidades/b64toBlob';
import { arrowBack, camera, trash } from 'ionicons/icons';
import { isSetAccessorDeclaration } from 'typescript';
import { allowedNodeEnvironmentFlags } from 'process';
import { BotonDia } from './CompletarRubros';
import { setDB } from '../utilidades/dataBase';

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

const OrdenSimple = (props:{data:any, clienteEmail:any , setVolver:any, proveedorVaALocacion:any}) => {

    
    const [vista,setVista] = useState ("primeraVista")

    const [showLoading, setShowLoading] =useState(false)

    const posicionCliente = useRef("")
    const titulo = useRef("")
    const descripcion = useRef("")
    const latitudCliente = useRef("0")
    const longitudCliente=useRef("0")
    const foto1Mostrar= useRef <String>()
    const foto2Mostrar= useRef <String>()

    const foto1= useRef <Blob>()
    const foto2= useRef <Blob>()

    const fecha = useRef("")
    const hora = useRef("")

    const direccion = useRef("")

    const [showAlertCompletarCampos, setShowAlertCompletarCampos]=useState(false)
    const [showAlertInconvenienteSolicitud, setShowAlertInconvenienteSolicitud]=useState(false)
    const [showAlertOrdenCreada,setShowAlertOrdenCreada]=useState(false)
    const [showAlertYaHayOrden,setShowAlertYaHayOrden]=useState(false)
    
    const ticket = useRef()

    useEffect(() => {
        
        const ubicacion = getLocation();
        ubicacion.then((value)=>{
            posicionCliente.current=(value)
            latitudCliente.current=(value).split("/")[0]
            longitudCliente.current=(value).split("/")[1]
        });

      }, [])

    const irASiguiente =() => {
        if (vista=="primeraVista")
        {   
            if(titulo.current!="" && descripcion.current!="" ){
                setVista("imagenes")
            }else{
                setShowAlertCompletarCampos(true)
            }
            
        }
    }

    const enviar =() => {

        if (posicionCliente.current!=""){

            setShowLoading(true)
         
            var formDataToUpload = new FormData();
            formDataToUpload.append("clienteEmail", props.clienteEmail)
            formDataToUpload.append("tipoProveedor",props.data.tipo)
            formDataToUpload.append("ProveedorEmail",props.data.proveedorEmail)
            formDataToUpload.append("itemProveedor",props.data.items)
            formDataToUpload.append("clienteLat",latitudCliente.current)
            formDataToUpload.append("clienteLong",longitudCliente.current)
            formDataToUpload.append("tituloPedido",titulo.current)
            formDataToUpload.append("direccion",direccion.current)

            

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
    
                    setShowLoading(false)

                    if(res.data!="bad" && res.data!="ya hay una orden"){
                        ticket.current=res.data
                        setShowAlertOrdenCreada(true)
                        setDB(res.data.toString(), "ENV")


                    }
                    else{
                        if(res.data=="ya hay una orden"){
                            setShowAlertYaHayOrden(true)
                        }else{
                            setShowAlertInconvenienteSolicitud(true)
                        }
                        
                        
                    }
                
                }).catch((error: any) =>{
                    setShowLoading(false)
      //              setVista(0)
                    //Network error comes in
                });
        }
        
    }
    
    if (vista=="primeraVista"){
        return (
            <IonContent >
            <div id="GenerarOrdenContainer">
            <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver( false )} slot="start" id="flecha-volver">  </IonIcon>
            </div>
            <div id="contenderCentralOrden">
            <IonCardTitle>FORMULARIO DE SOLICITUD DE SERVICIO</IonCardTitle>

                <IonCard id="ionCardOrden">
                    <div id="contenedorCamposCentro">
                        <h2>RUBRO DE SERVICIO:</h2>
                        <p>{props.data.items}</p>
                        <h2>PROVEEDOR DEL SERVICIO:</h2> 
                        <p> {props.data.nombre} </p>
                        <Estrellas calificacion={props.data.calificacion}></Estrellas>

                    </div>
                    <div id="contenedorCamposCentro">
                    <p id="subtituloPedirOrden">INGRESE UN TÍTULO PARA EL SERVICIO</p>
                    </div>
                    <div id="contenedorCamposIzquierda">
                        <IonItem id="item-Orden">
                            <IonLabel position="floating">TÍTULO</IonLabel>
                            <IonInput onIonInput={(e: any) => titulo.current = (e.target.value)}></IonInput>
                        </IonItem>
                        </div>
                        <div id="contenedorCamposCentro">
                        <p id="subtituloPedirOrden">INGRESE UNA BREVE DESCRIPCIÓN DEL PROBLEMA</p>
                    </div>
                    <div id="contenedorCamposIzquierda">
 
                        <IonItem id="item-Orden">
                            <IonLabel position="floating">DESCRIPCIÓN</IonLabel>
                            <IonInput onIonInput={(e: any) => descripcion.current = (e.target.value)}></IonInput>
                        </IonItem>
                    </div>
                </IonCard>
                    

                <IonCard id="ionCard-ionCardOrden">
                    <LocacionServicio direccion={direccion} posicionCliente={posicionCliente} latitudCliente={latitudCliente} longitudCliente={longitudCliente} ></LocacionServicio>
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
                </div>
        </IonContent>
        )
    }
   else if (vista=="imagenes"){

    return (
        <IonContent>
            <div id="GenerarOrdenContainer">
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
        </div>
    </IonContent>
    )

    }else if (vista=="final"){

        return (
            <IonContent>
                <div id="GenerarOrdenContainer">
            <div id="modalProveedor-flechaVolver">
                <IonIcon icon={arrowBack} onClick={() => setVista("imagenes")} slot="start" id="flecha-volver">  </IonIcon>
            </div>
            <div id="contenderCentralOrden">
            <IonCardTitle>PROGRAMAR FECHA</IonCardTitle>

                    <IonCard id="ionCard-CardProveedor">
                    
                        <IonCardSubtitle>Ingrese día y horario estimativo para su servicio</IonCardSubtitle>
    
                        <IonGrid>
                            <IonRow>
                                <IonCol >

                                <IonItem id="item-completarInfo">
                                        <IonLabel position="floating">DÍAS DISPONIBLES DEL PROVEEDOR</IonLabel>                                    
                                        < Dias  dias={props.data.dias_proveedor} cliente={false} />

                                    </IonItem>
                                    </IonCol>
                            </IonRow>
                                    <IonRow>
                                <IonCol >

                                    <IonItem id="item-completarInfo">
                                        <IonLabel position="floating">MIS DÍAS DISPONIBLES PARA EL SERVICIO</IonLabel>                                    
                                        < Dias  dias={fecha} cliente={true} />

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

            <IonLoading
            cssClass='my-custom-class'
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            message={'Generando Orden de trabajo...'}
            duration={7000}
          />

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
                
                
</div>
         </IonContent>
        )

    }else{
       // aca tengo que cambiar que la flecha valla al home
        return(
        <IonContent>

            <div id="GenerarOrdenContainer">
            <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver( false )} slot="start" id="flecha-volver">  </IonIcon>
            </div>

            <div id="contenderCentralOrden">
            <h1>ORDEN DE SERVICIO</h1>

                <IonCard id="ionCard-Orden">
                    <IonCardHeader>
                    <IonCardTitle> NÚMERO DE TICKET: {ticket.current} </IonCardTitle>
                    <IonCardTitle>STATUS: SOLICITUD ENVIADA </IonCardTitle>
                    <p id="p-estado">En espera de confirmación por parte del proveedor </p>
                    </IonCardHeader>
                </IonCard>

                <IonTitle>PROVEEDOR</IonTitle>  
                <IonCard id="ionCard-Orden">
                    <img id="ionCard-explorerContainer-Cliente-Imagen" src={props.data.picture}></img>
                    <IonCardTitle> {props.data.nombre} </IonCardTitle>
                    <IonCardTitle  > {props.data.items} </IonCardTitle>
                    <IonItem id="CardProveedorItem" lines="none"> {props.data.calificacion} </IonItem>
                </IonCard>
            </div>
        </div>
               
        </IonContent>
        )
    }
   


} 




export const TomarFotografia = (props: {imagen:any, setFilepath:any}) => {

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

const LocacionServicio = ( props:{direccion:any, posicionCliente:any, latitudCliente:any, longitudCliente:any } ) =>{

    const [siEsElLugar, setSiEsElLugar] = useState(true)
    const [domicilio, setDomicilio] = useState("enmicasa")
      
    if(domicilio=="enmicasa"){
        props.latitudCliente.current=props.posicionCliente.current.split("/")[0]
        props.longitudCliente.current=props.posicionCliente.current.split("/")[1]
    }else{
        props.latitudCliente.current="0"
        props.longitudCliente.current="0"
    }
        
     
    //}, [siEsElLugar]);

   
    return(
        <div id="contenderCentralOrden">

        <div id="contenedorCamposCentro">
            <p>¿SE ENCUENTRA ACTUALMENTE EN EL DOMICILIO DONDE SE REALIZARÁ EL SERVICIO?</p>
         
            <IonSegment mode="ios" value={domicilio} select-on-focus={true} onIonChange={e => setDomicilio(  e.detail.value!)} >
                <IonSegmentButton value="enmicasa">
                    <IonLabel>SERVICIO EN MI DOMICILIO</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="otrolugar">
                    <IonLabel>SERVICIO EN OTRO LUGAR</IonLabel>
                </IonSegmentButton>
            </IonSegment>
            </div>
            <div id="contenedorCamposCentro">

            <p >ESPECIFIQUE LA DIRECCIÓN DE LA LOCACIÓN DONDE SOLICITA EL SERVICIO</p>
            <p id="subtituloPedirOrden" >La misma debe ser lo más específica posible en cuanto a dirección y numeración de calle</p>
            </div>
            <div id="contenedorCamposIzquierda">
            <IonItem id="item-Orden">
                <IonLabel position="floating" >DIRECCIÓN</IonLabel>
                <IonInput onIonInput={(e: any) => props.direccion.current = (e.target.value)}></IonInput>
            </IonItem>
        
        
        </div>
        </div>
    )
   
}

const Dias =(props:{dias:any, cliente:boolean})=>{

    const [lunes, setLunes]= useState (false)
    const [martes, setMartes]= useState (false)
    const [miercoles, setMiercoles]= useState (false)
    const [jueves, setJueves]= useState (false)
    const [viernes, setViernes]= useState (false)
    const [sabado, setSabado]= useState (false)
    const [domingo, setDomingo]= useState (false)

    if (props.cliente){
        let dia: string[] = ['', '', '', '', '', '', ''];
    
        if(lunes){dia[0]='Lunes'}else{dia[0]=''}
        if(martes){dia[1]='Martes'}else{dia[1]=''}
        if(miercoles){dia[2]='Miercoles'}else{dia[2]=''}
        if(jueves){dia[3]='Jueves'}else{dia[3]=''}
        if(viernes){dia[4]='Viernes'}else{dia[4]=''}
        if(sabado){dia[5]='Sabado'}else{dia[5]=''}
        if(domingo){dia[6]='Domingo'}else{dia[6]=''}
    
    
        if (lunes || martes || miercoles || jueves ||  viernes || sabado || domingo ){
            props.dias.current=dia[0]+" "+dia[1]+" "+dia[2]+" "+dia[3]+" "+dia[4]+" "+dia[5]+" "+dia[6]
        }


        return (
                <IonGrid>
                <IonRow>
                    <IonCol><BotonDia dia={"LU"} setDia={setLunes} ></BotonDia></IonCol>
                    <IonCol><BotonDia dia={"MA"} setDia={setMartes} ></BotonDia></IonCol>
                    <IonCol><BotonDia dia={"MI"} setDia={setMiercoles} ></BotonDia></IonCol>
                    <IonCol><BotonDia dia={"JU"} setDia={setJueves} ></BotonDia></IonCol>
                    <IonCol><BotonDia dia={"VI"} setDia={setViernes} ></BotonDia></IonCol>
                    <IonCol><BotonDia dia={"SA"} setDia={setSabado} ></BotonDia></IonCol>
                    <IonCol><BotonDia dia={"DO"} setDia={setDomingo} ></BotonDia></IonCol>
    
                    </IonRow>
                </IonGrid>
    
    
            );
    }else{
        
            let valores = props.dias.split(" ")

            return (
                <IonGrid>
                <IonRow>
                    <IonCol><BotonDiaProveedor dia={"LU"} valor={valores[0]} ></BotonDiaProveedor></IonCol>
                    <IonCol><BotonDiaProveedor dia={"MA"} valor={valores[1]} ></BotonDiaProveedor></IonCol>
                    <IonCol><BotonDiaProveedor dia={"MI"} valor={valores[2]} ></BotonDiaProveedor></IonCol>
                    <IonCol><BotonDiaProveedor dia={"JU"} valor={valores[3]} ></BotonDiaProveedor></IonCol>
                    <IonCol><BotonDiaProveedor dia={"VI"} valor={valores[4]} ></BotonDiaProveedor></IonCol>
                    <IonCol><BotonDiaProveedor dia={"SA"} valor={valores[5]} ></BotonDiaProveedor></IonCol>
                    <IonCol><BotonDiaProveedor dia={"DO"} valor={valores[6]} ></BotonDiaProveedor></IonCol>
    
                    </IonRow>
                </IonGrid>
    
    
            );

        

    }
   

}

const BotonDiaProveedor=  (props:{dia:any, valor:any})=> {
    
    const [marcar, setMarcar] =useState(false)


    useEffect(() => {
     
        if (props.valor!=''){
            setMarcar(true)
        }else{
            setMarcar(false)
        }
    }, []);

    return (
        marcar ? <IonButton color="primary" shape="round"  id="diaSelecionado">{props.dia}</IonButton> : <IonButton color="white" shape="round" id="diaNoSelecionado" >{props.dia}</IonButton>

    )
}

export default OrdenSimple 

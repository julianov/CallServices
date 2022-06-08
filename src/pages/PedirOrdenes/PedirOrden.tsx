import './PedirOrden.css';
import axios from "axios";

import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import React, { useEffect, useRef, useState } from 'react';
import { arrowBack, camera, close, logoWindows, trash } from 'ionicons/icons';
import { isSetAccessorDeclaration } from 'typescript';
import { allowedNodeEnvironmentFlags } from 'process';
import { IonCard, IonCardHeader, IonGrid, IonRow, IonCol, IonCardTitle, IonCardSubtitle, IonItem, IonButton, IonInput, IonLabel, IonImg, IonActionSheet, IonFabButton, IonIcon, IonAlert, IonContent, IonDatetime, IonCheckbox, IonLoading, IonTitle, IonSegment, IonSegmentButton, IonItemDivider } from '@ionic/react';
import { Link, useHistory } from 'react-router-dom';
import Https from '../../utilidades/HttpsURL';
import { setDB } from '../../utilidades/dataBase';
import Estrellas from '../../components/Estrellas/Estrellas';
import { usePhotoGallery } from '../../hooks/usePhotoGallery';
import { base64FromPath } from '@ionic/react-hooks/filesystem';
import { b64toBlob } from '../../utilidades/b64toBlob';
import { BotonDia } from '../CompletarRubros/CompletarRubros';
import { retornarIconoCategoria } from '../../utilidades/retornarIconoCategoria';

const url=Https+"orden/"

let posicion: string;

export const getLocation = async () => {
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
    let history = useHistory();

    const irAHome = () => {

        history.push("/home");
        window.location.reload();

    }

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

    const reload =() => {
        window.location.reload();
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

                    console.log("veamos que llegó: "+res.data)
    
                    setShowLoading(false)

                    if(res.data!="bad" && res.data!="ya hay una orden"){
                        ticket.current=res.data
                        setShowAlertOrdenCreada(true)
                        setDB(res.data, "ENV")


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
                        <IonCard id="ionCardOrden">
                            <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                                <h2 id="tituloPedirOrdenEnCard">RUBRO DE SERVICIO:</h2>
                                <p style={{fontWeight:"600", fontSize:"1.2em", marginBottom:"15px"}}>{props.data.items}</p>
                                <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria(props.data.items)}></img>
                                <IonItemDivider />
                                <h2 id="tituloPedirOrdenEnCard">PROVEEDOR DEL SERVICIO:</h2> 
                                <p style={{fontWeight:"600", fontSize:"1.2em", marginBottom:"15px"}}> {props.data.nombre} </p>
                                <Estrellas calificacion={props.data.qualification}></Estrellas>
                            </div>
                        </IonCard>

                        <IonCard id="ionCardOrden">
                        <h1 style={{fontSize:"1.2em", color:"black", fontWeight:"bold"}}>FORMULARIO DE SOLICITUD DE SERVICIO</h1>
                        <IonItemDivider />

                            <div id="contenedorCamposCentro">
                                <h2 style={{fontSize:"1.3em"}}>TÍTULO DEL SERVICIO</h2 >
                            </div>
                            <div style={{display:"flex", width:"90%", justifyContent:"center", alignItems:"center"}}>
                                <IonItem >
                                    <IonLabel position="floating">INGRESE TÍTULO</IonLabel>
                                    <IonInput onIonInput={(e: any) => titulo.current = (e.target.value)}></IonInput>
                                </IonItem>
                            </div>
                            <div id="contenedorCamposCentro">
                                <h2 style={{fontSize:"1.3em"}}>BREVE DESCRIPCIÓN DEL PROBLEMA</h2>
                            </div>
                            <div style={{display:"flex", width:"90%", justifyContent:"center", alignItems:"center"}}>
                                <IonItem >
                                    <IonLabel position="floating">INGRESE DESCRIPCIÓN</IonLabel>
                                    <IonInput onIonInput={(e: any) => descripcion.current = (e.target.value)}></IonInput>
                                </IonItem>
                            </div>
                        </IonCard>
                            
                        <IonCard id="ionCardOrden">
                        <h1 style={{fontSize:"1.2em", color:"black", fontWeight:"bold"}}>DIRECCIÓN DEL SERVICIO</h1>
                        <IonItemDivider />
                            <LocacionServicio direccion={direccion} posicionCliente={posicionCliente} latitudCliente={latitudCliente} longitudCliente={longitudCliente} ></LocacionServicio>
                        </IonCard>

                        <div style={{width:"100%", display:"flex", justifyContent:"right", marginRight:"15px"}}>
                        <IonButton shape="round" color="warning" style={{float:"right",width:"50%", marginTop:"20px"}} onClick={() => irASiguiente()}>SIGUIENTE</IonButton>
                        </div>
                    </div>

                    
                        <IonAlert
                            isOpen={showAlertCompletarCampos}
                            onDidDismiss={() => setShowAlertCompletarCampos(false)}
                            cssClass='my-custom-class'
                            header={'COMPLETAR CAMPOS'}
                            subHeader={''}
                            mode='ios'
                            message={'Debe completar todos los campos para continuar'}
                            buttons={['OK']} />
            </div>
        </IonContent>
        )
    }
   else if (vista=="imagenes"){

    return (
        <IonContent>
            <div style={{display:"flex", flexDirection:"column", width:"100%", minHeight:"100%" ,height:"auto", background: "#f3f2ef"}}>

                <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto"}}>
                    <div id="modalProveedor-flechaVolver">
                        <IonIcon icon={arrowBack} onClick={() => setVista("primeraVista")} slot="start" id="flecha-volver">  </IonIcon>
                    </div>
                </div>

                <div style={{ justifyContent:"center",alignItems:"center", textAlign:"center" ,display:"flex", flexDirection:"column", width:"100%", height:"100%"}}>
                    <IonCard id="ionCardOrden">
                    <h1 style={{fontSize:"1.2em", color:"black", fontWeight:"bold"}}>IMÁGENES DE REFERENCIA</h1>
                        <IonItemDivider />
                            <p style={{fontSize:"1em", color:"black"}}>¿Desea agregar imágenes para que el proveedor tenga referencia del trabajo a realizar?</p>

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

                </div>

                <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto", marginTop:"25px"}}>
                <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => enviar()}> <p style={{fontSize:"1.2em", color:"black", fontWeight:"bold"}}>SOLICITAR SERVICIO</p></IonButton>
                </div>

                <IonAlert
                    isOpen={showAlertYaHayOrden}
                    onDidDismiss={() => setShowAlertYaHayOrden(false)}
                    cssClass='my-custom-class'
                    header={'YA POSEE UNA ORDEN CON EL PROVEEDOR'}
                    subHeader={''}
                    mode="ios"
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
                    mode="ios"
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

    }else if (vista=="final"){

        return (
            <IonContent>
            <div style={{display:"flex", flexDirection:"column", width:"100%", minHeight:"100%" ,height:"auto", background: "#f3f2ef"}}>
                <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto"}}>
                    <div id="modalProveedor-flechaVolver">
                        <IonIcon icon={arrowBack} onClick={() => setVista("imagenes")} slot="start" id="flecha-volver">  </IonIcon>
                    </div>
                </div>
                <div style={{ justifyContent:"center",alignItems:"center" ,display:"flex", flexDirection:"column", width:"100%", height:"100%"}}>
                <h1 style={{fontSize:"1.2em"}}>PROGRAMAR FECHA</h1>

                <IonCard id="ionCard-CardProveedor">
                    
                    <h2 style={{fontSize:"1.3em", color:"black"}}>INGRESE DÍA ESTIMATIVO PARA EL SERVICIO</h2>
    
                    <IonLabel style={{margin:"10px 0px 10px 0px"}}>DÍAS DISPONIBLES DEL PROVEEDOR</IonLabel>                                    

                    <IonItem lines='none'>
                        < Dias dias={props.data.dias_proveedor} cliente={false} />
                    </IonItem>

                    <IonLabel style={{margin:"10px 0px 10px 0px"}}>MIS DÍAS DISPONIBLES PARA EL SERVICIO</IonLabel>                                    
                    <IonItem lines='none'>
                        < Dias  dias={fecha} cliente={true} />
                    </IonItem>

                    <IonItemDivider />

                    <h2 style={{fontSize:"1.2em", color:"black"}}>INGRESE HORA ESTIMATIVA PARA EL SERVICIO</h2>

                    <IonItem id="item-completarInfo">
                        <IonLabel position="floating">Hora estimativa</IonLabel>
                        <IonDatetime value={hora.current} onIonChange={e => hora.current=(e.detail.value!)}></IonDatetime>
                    </IonItem>
                               
    
              </IonCard>
            </div>

            <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto"}}>
            <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => enviar()}>SOLICITAR</IonButton>
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
                    mode="ios"
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
            <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto", background: "#f3f2ef"}}>
                    <div style={{width:"100%", height:"auto", justifyContent:"right"}}>
                    <IonIcon icon={close} onClick={() => irAHome( )} slot="end" id="flecha-cerrar">  </IonIcon>
                    </div>

                <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100%", justifyContent:"center", alignItems:"center"}}>

                <IonCard id="ionCardOrden">
                        <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100%", justifyContent:"center", alignItems:"center"}}>
                            <IonCardTitle style={{margin:"0px 0px 15px 0px"}}> NÚMERO DE TICKET: {ticket.current} </IonCardTitle>
                            <IonCardTitle style={{margin:"0px 0px 0px 0px"}}>STATUS: SOLICITUD ENVIADA </IonCardTitle>
                            <p id="p-estado">En espera de confirmación por parte del proveedor </p>
                        </div>
                    </IonCard>
                
                <IonCard id="ionCardOrden">
                    <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100%", justifyContent:"center", alignItems:"center"}}>
                        <IonCardTitle style={{marginTop:"20px", marginBottom:"20px"}} > {props.data.items} </IonCardTitle>
                        <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria(props.data.items)}></img>
                        <IonItemDivider />
                        <IonCardTitle>PROVEEDOR</IonCardTitle>  
                        <img id="ionCard-explorerContainer-Cliente-Imagen" src={props.data.picture}></img>
                        <IonCardTitle style={{marginTop:"20px", marginBottom:"20px"}}> {props.data.nombre} </IonCardTitle>
                        <Estrellas calificacion={props.data.qualification} />

                    </div>
                </IonCard>        
                </div>

            <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto"}}>
            <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => reload()}>IR A HOME</IonButton>
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
        takePhoto().then(async res =>  {
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

        <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",textAlign:"center" , width:"100%"}}>
            <h2 style={{fontSize:"1.3em"}}>¿SE ENCUENTRA ACTUALMENTE EN EL DOMICILIO DONDE SE REALIZARÁ EL SERVICIO?</h2>
            <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", marginTop:"25px"}}>
                <IonSegment mode="ios" value={domicilio} select-on-focus={true} onIonChange={e => setDomicilio(  e.detail.value!)} >
                    <IonSegmentButton value="enmicasa">
                        <IonLabel>SERVICIO EN MI DOMICILIO</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="otrolugar">
                        <IonLabel>SERVICIO EN OTRO LUGAR</IonLabel>
                    </IonSegmentButton>
                </IonSegment>
            </div>
            </div>
            <IonItemDivider />

            <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",textAlign:"center" , width:"100%"}}>
                <h2 style={{fontSize:"1.3em"}}>ESPECIFIQUE LA DIRECCIÓN DE LA LOCACIÓN DONDE SOLICITA EL SERVICIO</h2>
                <p style={{fontSize:"1em", fontWeight:"200", margin:"3px 20px 20px 20px"}}>La misma debe ser específica</p>
            </div>
            <div style={{display:"flex", width:"90%", justifyContent:"center", alignItems:"center"}}>
            <IonItem>
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
            <div style={{width:"100%", height:"auto", margin:"15px 0px 15px 0px"}}>
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
            </div>
    
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

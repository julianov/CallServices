import { IonAlert, IonButton, IonCard, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonRow } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { isConstructorDeclaration, isSetAccessorDeclaration } from "typescript";

import Https from "../utilidades/HttpsURL";
import './Modal.css';

import { Geolocation, Geoposition } from '@ionic-native/geolocation';

const url=Https


const axios = require('axios');


interface datos_cliente {
  nombre:string
  apellido:string
  imagen:string
  calificacion: number
}

const verUbicacion = (latitud:any, longitud:any) =>{


  const link="https://www.google.com/maps/search/?api=1&query="+latitud+"%2C"+longitud
  const win= window.open(   link, '_blank')?.focus();
  
}



const ModalVerOrdenesProveedor = (props:{datos:any,emailProveedor:any,setVolver:any})  =>{


    const [vista, setVista] = useState("primero")

    const [estado, setEstado] =useState("Enviada")

    const [showAlertInconvenienteChat, setShowAlertInconvenienteChat] = useState(false)
    const [showAlertOrdenAceptada, setShowAlertOrdenAceptada] = useState(false)
    const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false)

    const precio = useRef ("")


    useEffect(() => {
            if (props.datos.status=="ENV"){
              setEstado("GENERADO POR CLIENTE")
              axios.get(url+"orden/cambiarestado/"+props.datos.ticket+"/"+props.datos.tipo+"/"+"REC", {timeout: 7000})
              .then((resp: { data: any; }) => {

                console.log("lo que llego al cambiar el estado de la orden es: "+resp.data)
                if(resp.data!="bad"){
                  setEstado("RECIBIDO")
                }
               })
            }else if(props.datos.status=="REC"){
              setEstado("RECIBIDO")
            }else if(props.datos.status=="ACE"){
              setEstado("ORDEN ACEPTADA")
            }else if(props.datos.status=="EVI"){
              setEstado("EN VIAJE")
            }else if(props.datos.status=="ENS"){
              setEstado("EN SITIO")
            }
        
      }, [])


      const aceptarOrden = ()=> {

        if (estado=="RECIBIDO"){
          axios.get(url+"orden/cambiarestado/"+props.datos.ticket+"/"+props.datos.tipo+"/"+"ABI", {timeout: 7000})
              .then((resp: { data: any; }) => {

                if(resp.data!="bad"){
                  setEstado("ORDEN EN PROGRESO")
                  setShowAlertOrdenAceptada(true)
                }
        
  
               })
        }
        
      }

      const rechazarOrden = ()=> {

        if (estado=="RECIBIDO"){

          axios.get(url+"orden/cambiarestado/"+props.datos.ticket+"/"+props.datos.tipo+"/"+"REX", {timeout: 7000})
          .then((resp: { data: any; }) => {

            if(resp.data!="bad"){
              setEstado("ORDEN RECHAZADA")
            }
    

           })
        }

      }
   
      if(vista=="primero"){
        return (
          <IonContent>
          <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
          </div>
        <IonCard id="ionCard-explorerContainer-Proveedor">
          <img id="img-orden" src={props.datos.imagen_cliente}></img>
          <p>TIPO: {props.datos.tipo}</p>
          <p>STATUS: {estado}</p>
          <p>TICKET: {props.datos.ticket}</p>
          <IonButton  id="botonContratar" onClick={() => setVista("datosClientes")} >DATOS DE CLIENTE</IonButton>
        </IonCard>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          <p>FECHA DE SOLICITUD: {props.datos.fecha_creacion}</p>
          <p>TÍTULO: {props.datos.titulo}</p>
          <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
          <p>{props.datos.descripcion}</p>
          <IonButton  id="botonContratar" onClick={() =>verUbicacion(props.datos.location_lat, props.datos.location_long) } >VER UBICACIÓN DEL CLIENTE</IonButton>

        </IonCard>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
        </IonCard>
  
        <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => setVista("chat")} >CHAT</IonButton>
        
        <IonGrid>
        <IonRow>

        <IonCol><IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton></IonCol>
        <IonCol><IonButton shape="round" color="warning"  id="botonContratar" onClick={() => aceptarOrden()} >ACEPTAR ORDEN</IonButton></IonCol>

        </IonRow>
        </IonGrid>

        <IonAlert
            isOpen={showAlertOrdenAceptada}
            onDidDismiss={() => setShowAlertOrdenAceptada(false)}
            cssClass='my-custom-class'
            header={'ORDEN DE SERVICIO EN PROGRESO'}
            subHeader={''}
            message={'Si está en condiciones de presupuestar el trabajo/servicio coloque precio'+'\n'+"Sino solicite más información"}
            buttons={[
              {
                text: 'OK',
                role: 'cancel',
                cssClass: 'secondary',
                handler: blah => {
                  setVista("preaceptada");
                }
              }
            ]} />


          <IonAlert
            isOpen={showAlertRechazarOrden}
            onDidDismiss={() => setShowAlertRechazarOrden(false)}
            cssClass='my-custom-class'
            header={'¿DESEA RECHAZAR LA ORDEN?'}
            subHeader={''}
            message={'Agregar una indicación de por qué es mala rechazar ordenes'}
            buttons={[
              {
                text: 'SI',
                role: 'cancel',
                cssClass: 'secondary',
                handler: blah => {
                  rechazarOrden();
                },  
               
              },
              {
                text: 'NO',
                role: 'cancel',
                cssClass: 'secondary',
                handler: blah => {
                  setShowAlertRechazarOrden(false);
                }
              }
            ]} />
  
        </IonContent>
             
      );
      }else if (vista=="datosClientes"){

        return (
        < VerDatosCliente ticket={props.datos.ticket} tipo={props.datos.tipo} latitud={props.datos.location_lat} longitud={props.datos.location_long} setVista={setVista}  />
        )
      }else if (vista=="chat") {
        return(
        <><Chatear estado={estado} email_proveedor={props.emailProveedor} email_cliente={props.datos.email_cliente} setVista={setVista} setAlert={setShowAlertInconvenienteChat} />
        
        <IonAlert
            isOpen={showAlertInconvenienteChat}
            onDidDismiss={() => setShowAlertInconvenienteChat(false)}
            cssClass='my-custom-class'
            header={'NO ES POSIBLE ABRIR COMUNICACIÓN CON EL CLIENTE'}
            subHeader={''}
            message={'Para poder dialogar con el cliente debe aceptar la orden de trabajo'}
            buttons={[
              {
                text: 'OK',
                role: 'cancel',
                cssClass: 'secondary',
                handler: blah => {
                  setVista("primero");
                }
              }
            ]} /></>
        )
      } else if (vista=="preaceptada") {


        return (
          <IonContent>
          <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
          </div>
       
  
          <IonCardTitle>PRESUPUESTO</IonCardTitle>

        <IonCard id="ionCard-explorerContainer-Proveedor">
        <IonItem id="item-Orden">
          <IonLabel position="floating">INGRESE PRECIO ESTIMATIVO </IonLabel>
          <IonInput onIonInput={(e: any) => precio.current = (e.target.value)}></IonInput>
          </IonItem>
        </IonCard>
  
              
        <IonGrid>
        <IonRow>

        <IonCol><IonButton shape="round" color="warning"  id="botonContratar" onClick={() => aceptarOrden()} >ENVIAR PRESUPUESTO</IonButton></IonCol>

        </IonRow>
        </IonGrid>

      
  
        </IonContent>

        )



      }
      else{

        return (
          <IonContent>
       
        </IonContent>
             
      );
      }
      
}

const VerDatosCliente = (props:{ticket:any, tipo:any,latitud:any, longitud:any,setVista:any})  =>{

  const [datosCliente, setDatosCliente] = useState <datos_cliente>({
    nombre:"",
    apellido:"",
    imagen:"",
    calificacion: 0
  })
  
  useEffect(() => { 
  axios.get(url+"orden/datocliente/"+props.ticket+"/"+props.tipo).then((resp: { data: any; }) => {

    if (resp.data!="bad"){
      setDatosCliente(resp.data)
    }
  }) 
}, []);


  

  return (
    <IonContent>
      <div id="modalProveedor-flechaVolver">
        <IonIcon icon={arrowBack} onClick={() => props.setVista("primero")} slot="start" id="flecha-volver">  </IonIcon>
      </div>
      <IonCard id="ionCard-explorerContainer-Proveedor">
        <img id="img-orden" src={datosCliente.imagen}></img>
        <p>NOMBRE: {datosCliente.nombre}</p>
        <p>APELLIDO: {datosCliente.apellido}</p>
        <p>CALIFICACIÓN: {datosCliente.calificacion}</p>
        <IonButton  id="botonContratar" onClick={() => verUbicacion(props.latitud, props.longitud) } >VER UBICACIÓN DEL CLIENTE</IonButton>

        <IonButton  id="botonContratar" onClick={() => props.setVista("chat")} >CHAT CON CLIENTE</IonButton>
  </IonCard>
  </IonContent>
       
);
}

const Chatear = (props:{estado:any, email_proveedor:any, email_cliente:any, setVista:any, setAlert:any})=>{


  if (props.estado!="RECIBIDO" || props.estado!="GENERADO POR CLIENTE"){
    props.setAlert(true)
    return(
      <IonContent>
       
      </IonContent>
    )
  }else{
    return(
      <IonContent>
      </IonContent>
    )
  }

}




const Imagenes = (props:{picture1:any,picture2:any})=>{
  if(props.picture1!="" && props.picture2!="" ){
    return(
      <div id="CardProveedoresImg">
        <img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture1}></img>
        <img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture2}></img>
        </div>
    )
  }
  else if(props.picture1!="" && props.picture2==""){
    return(
      <div id="CardProveedoresImg"><img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture1}></img>
      </div>
    )
  }
  else if(props.picture1=="" && props.picture2!="" ){
    return(
      <div id="CardProveedoresImg"><img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture2}></img>
      </div>
    )
  }else{
    return(
      <div id="CardProveedoresImg">
        <p>CLIENTE NO HA ADJUNTADO IMÁGENES DE REFERENCIA DEL PEDIDO DE SERVICIO</p>
      </div>
    )
  }
}

export default ModalVerOrdenesProveedor;

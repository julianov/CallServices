import { arrowBack, camera, chatbox, close, eye, location, logoWindows } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { isConstructorDeclaration, isPropertyDeclaration, isSetAccessorDeclaration } from "typescript";

import Https from "../../../utilidades/HttpsURL";
import '../../ModalGeneral/Modal.css';

import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import axios from "axios";
import { createStore, removeDB, setDB } from "../../../utilidades/dataBase";
import Chat from "../../Chat/Chat";
import { IonAlert, IonButton, IonCard, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonRow, IonTitle } from "@ionic/react";
import { ordenesCliente } from "../../../pages/Home/HomeCliente";
import { TomarFotografia } from "../../../pages/PedirOrdenes/PedirOrden";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { Calificacion, Imagenes } from "../VerOrdenesProveedor/VerOrdenesProveedorOrdenesGenerales";
import ModalVerOrdenesClienteGenerales, { VerDatosProveedor } from "./VerOrdenesClienteGenerales";
import { ordenes } from "../../../pages/Home/HomeProveedor";

const url=Https

interface datos_proveedor {
    nombre:string
    apellido:string
    imagen:string
    calificacion: number
  }


const verUbicacion = ( latitud:any, longitud:any) =>{


    const link="https://www.google.com/maps/search/?api=1&query="+latitud+"%2C"+longitud
    const win= window.open(link, 'Locación')?.focus();

  }

  const ModalVerOrdenesCliente = (props:{ticket:any, datosCompletos:any, setDatosCompletos:any, nuevasOrdenes:any, setNuevasOrdenes:any, notifications:any, setNotifications:any,emailCliente:any, setVolver:any, tipo:String})  =>{

    if (props.tipo=="Orden de emergencia"){

      return (
        <ModalVerOrdenesClienteEmergencia ticket={props.ticket} datosCompletos={props.datosCompletos} setDatosCompletos={props.setDatosCompletos} nuevasOrdenes={props.nuevasOrdenes} setNuevasOrdenes={props.setNuevasOrdenes} notifications={props.notifications} setNotifications={props.setNotifications} emailCliente={props.emailCliente} setVolver={props.setVolver} ></ModalVerOrdenesClienteEmergencia>
      )

    }else{
      return (
        <ModalVerOrdenesClienteGenerales ticket={props.ticket} datosCompletos={props.datosCompletos} setDatosCompletos={props.setDatosCompletos} nuevasOrdenes={props.nuevasOrdenes} setNuevasOrdenes={props.setNuevasOrdenes} notifications={props.notifications} setNotifications={props.setNotifications} emailCliente={props.emailCliente} setVolver={props.setVolver} ></ModalVerOrdenesClienteGenerales>
      )
    }
  }


  const ModalVerOrdenesClienteEmergencia = (props:{ticket:any, datosCompletos:any, setDatosCompletos:any, nuevasOrdenes:any, setNuevasOrdenes:any, notifications:any, setNotifications:any,emailCliente:any, setVolver:any})  =>{

    const [vista, setVista] = useState("PRIMERO")

    const [estado, setEstado] =useState("ENVIADA POR EL CLIENTE")
  
    const [showAlertInconvenienteChat, setShowAlertInconvenienteChat] = useState(false)
  
    const desdeDondeEstoy=useRef("")
    const ticketeck = useRef <string>("")
  
    const [orden, setOrden] = useState <ordenesCliente>(
      {
        rubro:"",
        tipo:"",
        status:"",
        fecha_creacion:"",
        ticket:"",
        dia:"",
        hora:"",
        titulo:"",
        descripcion:"",
        email_proveedor:"",
        imagen_proveedor:"",
        location_lat:"",
        location_long:"",
        picture1:"",
        picture2:"",
        presupuesto:"",
        pedido_mas_información:"",
        respuesta_cliente_pedido_mas_información:"",
        picture1_mas_información:"",
        picture2_mas_información:"",
      }
    );

    
    useEffect(() => {
        
      console.log("ESTE MENSAJE INDICA QUE SE GUARDO EN LA BASE DE DATOS"+orden.status)

      if(orden.ticket!=""){
          setDB(orden.ticket+"cliente", orden.status)
          props.setNuevasOrdenes(props.nuevasOrdenes.filter((item:string) => item !== orden.ticket));
      }

      if (orden.status=="ENV"){
        setVista("PRIMERO")
      }
      else if(orden.status=="ACE"){
        setEstado("ORDEN ACEPTADA POR PROVEEDOR")
        setVista("ACEPTADA")

      }else if(orden.status=="EVI"){
        setEstado("ORDEN EN VIAJE")
        setVista("EN VIAJE")

      }else if(orden.status=="ENS"){
        setEstado("EN SITIO")
        setVista("EN SITIO")

      }else if(orden.status=="RED"){
        setEstado("ORDEN REALIZADA")
        setVista("REALIZADA")

      }else{

      }
      
  }, [orden]) 


    useEffect(() => {

      for (let i=0; i < props.datosCompletos.length ; i++){

        if(props.datosCompletos[i].ticket==props.ticket){
          setOrden(
            {
              rubro:props.datosCompletos[i].rubro,
              tipo:props.datosCompletos[i].tipo,
              status:props.datosCompletos[i].status,
              fecha_creacion:props.datosCompletos[i].fecha_creacion,
              ticket: props.datosCompletos[i].ticket,
              dia: props.datosCompletos[i].dia,
              hora:props.datosCompletos[i].hora,
              titulo:props.datosCompletos[i].titulo,
              descripcion:props.datosCompletos[i].descripcion,
              email_proveedor:props.datosCompletos[i].email_proveedor,
              imagen_proveedor:props.datosCompletos[i].imagen_proveedor,
              location_lat:props.datosCompletos[i].location_lat,
              location_long:props.datosCompletos[i].location_long,
              picture1:props.datosCompletos[i].picture1,
              picture2:props.datosCompletos[i].picture2,
              presupuesto:props.datosCompletos[i].presupuesto,
              pedido_mas_información:props.datosCompletos[i].pedido_mas_información,
              respuesta_cliente_pedido_mas_información:props.datosCompletos[i].respuesta_cliente_pedido_mas_información,
              picture1_mas_información:props.datosCompletos[i].picture1_mas_información,
              picture2_mas_información:props.datosCompletos[i].picture2_mas_información
            }
          )
        }
      }
    }, [props.datosCompletos]) 


  if(vista=="PRIMERO"){
    desdeDondeEstoy.current="PRIMERO"
    return (
      <Primero datos={orden} setVolver={props.setVolver} estado={estado} setEstado={setEstado} setVista={setVista} emailCliente={props.emailCliente} />
    )
  }else if (vista=="ACEPTADA") {
    desdeDondeEstoy.current="ACEPTADA"
    return (
      <OrdenAceptada setVista={setVista} datos={orden} setDatos={setOrden} setEstado={setEstado} setVolver={props.setVolver} estado={estado} emailCliente={props.emailCliente}  />
    )
  }else if(vista=="EN VIAJE"){
    desdeDondeEstoy.current="EN VIAJE"
    return(
    <OrdenEnViaje datos={orden} setDatos={setOrden} estado={estado} setVista={setVista} setEstado={setEstado} setVolver={props.setVolver}/>
    )
  }else if (vista=="EN SITIO"){
      desdeDondeEstoy.current="EN SITIO"
    return(
      <OrdenEnSitio datos={orden} setDatos={setOrden} estado={estado} setVista={setVista} setEstado={setEstado} setVolver={props.setVolver} />
    )
  }else if (vista=="REALIZADA"){
      desdeDondeEstoy.current="REALIZADA"
    return(
      <OrdenRealizada datos={orden} setDatos={setOrden} estado={estado} setVista={setVista} setEstado={setEstado} setVolver={props.setVolver} />
    )
  }else if (vista=="chat"){
    return(
      <>
        <Chat notifications={props.notifications} setNotifications={props.setNotifications} email={props.emailCliente}  ticket={orden.ticket} setVolver={props.setVolver} setVista={setVista} desdeDondeEstoy={desdeDondeEstoy.current} />
        <IonAlert
              isOpen={showAlertInconvenienteChat}
              onDidDismiss={() => setShowAlertInconvenienteChat(false)}
              cssClass='my-custom-class'
              header={'NO ES POSIBLE ABRIR COMUNICACIÓN CON EL CLIENTE'}
              subHeader={''}
              mode='ios'
              message={'Para poder dialogar con el cliente debe aceptar la orden de trabajo'}
              buttons={[
                {
                  text: 'OK',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: blah => {
                    setVista("PRIMERO");
                  }
                }
              ]} 
        />
      </>
    )
  }else if (vista=="CANCELAR"){

      return(
        <OrdenCancelar desdeDondeEstoy={desdeDondeEstoy.current} datos={orden} setVista={setVista} setEstado={setEstado} setVolver={props.setVolver} />

      )
      
  } else if (vista=="datosProveedor"){
    return (
    < VerDatosProveedor ticket={orden.ticket} tipo={orden.tipo} latitud={orden.location_lat} longitud={orden.location_long} setVista={setVista} rubro={orden.rubro} desdeDondeEstoy={desdeDondeEstoy} />
    )

  }else{
    return (
      <></>
    )
  }

}

const Primero = (props:{datos:any, setVolver:any, estado:any, setEstado:any, 
  setVista:any, emailCliente:any})  =>{
 
   const [showAlertOrdenAceptada, setShowAlertOrdenAceptada] = useState(false)
   const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false)
   const [showAlertUbicacion,setShowAlertUbicacion]=useState(false)
   const [showAlertChat,setShowAlertChat]=useState(false)
 
   return ( 
     <IonContent>
       <div id="ionContentModalOrdenes">
         <div id="modalProveedor-flechaVolver">
             <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
         </div>
         <IonCard id="ionCard-explorerContainer-Proveedor">
           <h1>EN BUSCA DE PROVEEDOR</h1>
           <div id="divSentencias">
            <p style={{fontSize:"1em", color:"black"}}>RUBRO: {props.datos.rubro.toUpperCase()}</p>
             <p style={{fontSize:"1em", color:"black"}}>{props.datos.tipo.toUpperCase()}</p>
             <p style={{fontSize:"1em", color:"black"}}>STATUS: {props.estado}</p>
             <p style={{fontSize:"1em", color:"black"}}>TICKET: {props.datos.ticket}</p>
           </div>
         </IonCard>
 
         <IonCard id="ionCard-explorerContainer-Proveedor">
           <h1 style={{fontSize:"1.2em", color:"black"}}>DATOS GENERALES DE ORDEN</h1>
           <IonItemDivider />
           <div id="divSentencias">
             <p style={{fontSize:"1em", color:"black"}}>FECHA DE SOLICITUD:</p>
             <p style={{fontSize:"1em", color:"blue"}} >{props.datos.fecha_creacion}</p>
             <p style={{fontSize:"1em", color:"black"}}>TÍTULO:</p>
             <p style={{fontSize:"1em", color:"blue"}}>{props.datos.titulo}</p>
             <p style={{fontSize:"1em", color:"black"}}>DESCRIPCIÓN DE LA SOLICITUD: </p>        
             <p style={{fontSize:"1em", color:"blue"}}>{props.datos.descripcion}</p>
           </div>
         </IonCard>
 
         <IonCard id="ionCard-explorerContainer-Proveedor">
               < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
         </IonCard>
        
         <div id="botonCentral">
           <div id="botonCentralIzquierda">
             <IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton>
           </div>
         </div>
      
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
                     props.setVista("CANCELAR");
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
               ]} 
         />
 
          <IonAlert
           isOpen={showAlertChat}
           onDidDismiss={() => setShowAlertChat(false)}
           cssClass='my-custom-class'
           header={'ACEPTAR ORDEN'}
           subHeader={''}
           mode='ios'
           message={'Acepte la orden para chatear con el cliente'}
           buttons={['OK']}
         />



       </div>
     </IonContent>
   )
 }


 const OrdenAceptada = (props:{datos:any, setDatos:any, setVolver:any, estado:any, setEstado:any, 
  setVista:any, emailCliente:any})  =>{

    const [showAlertOrdenAceptada, setShowAlertOrdenAceptada] = useState(false)
    const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false)
    const [showAlertUbicacion,setShowAlertUbicacion]=useState(false)

    return ( 
      <IonContent>
        <div id="ionContentModalOrdenes">
          <div id="modalProveedor-flechaVolver">
              <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
          </div>

          <IonCard id="ionCard-explorerContainer-Proveedor">
          <img src={"./assets/icon/sirena.png"} style={{width:"50px", height:"50px"}} />
            <div id="divSentencias">
              <p style={{fontSize:"1em", color:"black"}}>{props.datos.tipo.toUpperCase()}</p>
              <h1>PROVEEDOR SELECCIONADO</h1>

              <IonItemDivider />
              <p style={{fontSize:"1em", color:"black"}}>RUBRO: {props.datos.rubro.toUpperCase()}</p>
              <p style={{fontSize:"1em", color:"black"}}>STATUS: {props.estado}</p>
              <p style={{fontSize:"1em", color:"black"}}>TICKET: {props.datos.ticket}</p>
            </div>
            <IonGrid>
              <IonRow>
                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosProveedor")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={eye} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER DATOS DE PROVEEDOR</small></IonRow>
                </IonCol>
  
  
                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("chat")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={chatbox} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>CHAT CON PROVEEDOR</small></IonRow>
                </IonCol>

              </IonRow>
            </IonGrid>
          </IonCard>
  
          <IonCard id="ionCard-explorerContainer-Proveedor">
            <h1 style={{fontSize:"1.2em", color:"black"}}>DATOS GENERALES DE ORDEN</h1>
            <IonItemDivider />
            <div id="divSentencias">
              <p style={{fontSize:"1em", color:"black"}}>FECHA DE SOLICITUD:</p>
              <p style={{fontSize:"1em", color:"blue"}} >{props.datos.fecha_creacion}</p>
              <p style={{fontSize:"1em", color:"black"}}>TÍTULO:</p>
              <p style={{fontSize:"1em", color:"blue"}}>{props.datos.titulo}</p>
              <p style={{fontSize:"1em", color:"black"}}>DESCRIPCIÓN DE LA SOLICITUD: </p>        
              <p style={{fontSize:"1em", color:"blue"}}>{props.datos.descripcion}</p>
            </div>
          </IonCard>
  
          <IonCard id="ionCard-explorerContainer-Proveedor">
                < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
          </IonCard>
         
          <div id="botonCentral">
            <div id="botonCentralIzquierda">
              <IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton>
            </div>
          </div>
          
          <IonAlert
                isOpen={showAlertOrdenAceptada}
                onDidDismiss={() => setShowAlertOrdenAceptada(false)}
                cssClass='my-custom-class'
                header={'ORDEN DE SERVICIO EN PROGRESO'}
                subHeader={''}
                mode='ios'
                message={'Si está en condiciones de presupuestar el trabajo/servicio coloque precio'+'\n'+"Sino solicite más información"}
                buttons={[
                  {
                    text: 'OK',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: blah => {
                      props.setVista("ACEPTADA");
                    }
                  }
                ]} 
          />
 
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
                      props.setVista("CANCELAR");
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
                ]} 
          />
  
        </div>
      </IonContent>
    )


  }



  const OrdenEnViaje = (props:{datos:any, setDatos:any, setVolver:any, estado:any, setEstado:any, 
    setVista:any, })  =>{


    const [showAlertOrdenAceptada, setShowAlertOrdenAceptada] = useState(false)
    const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false)

    return ( 
      <IonContent>
        <div id="ionContentModalOrdenes">
          <div id="modalProveedor-flechaVolver">
              <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
          </div>
          <IonCard id="ionCard-explorerContainer-Proveedor">
          <img src={"./assets/icon/sirena.png"} style={{width:"50px", height:"50px"}} />
            <div id="divSentencias">
              <p style={{fontSize:"1em", color:"black"}}>{props.datos.tipo.toUpperCase()}</p>
              <h1>PROVEEDOR SE ENCUENTRA EN CAMINO</h1>

              <IonItemDivider />
              <p style={{fontSize:"1em", color:"black"}}>RUBRO: {props.datos.rubro.toUpperCase()}</p>
              <p style={{fontSize:"1em", color:"black"}}>STATUS: {props.estado}</p>
              <p style={{fontSize:"1em", color:"black"}}>TICKET: {props.datos.ticket}</p>
            </div>
            <IonGrid>
              <IonRow>
                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosProveedor")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={eye} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER DATOS DE PROVEEDOR</small></IonRow>
                </IonCol>
  
                <IonCol id="ioncol-homecliente"  onClick={() => verUbicacion(props.datos.latitud, props.datos.longitud) }   >
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={location} /></IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER UBICACIÓN DE PROVEEDOR</small></IonRow>
                </IonCol>
  
                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("chat")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={chatbox} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>CHAT CON PROVEEDOR</small></IonRow>
                </IonCol>

              </IonRow>
            </IonGrid>
          </IonCard>
  
          <IonCard id="ionCard-explorerContainer-Proveedor">
            <h1 style={{fontSize:"1.2em", color:"black"}}>DATOS GENERALES DE ORDEN</h1>
            <IonItemDivider />
            <div id="divSentencias">
              <p style={{fontSize:"1em", color:"black"}}>FECHA DE SOLICITUD:</p>
              <p style={{fontSize:"1em", color:"blue"}} >{props.datos.fecha_creacion}</p>
              <p style={{fontSize:"1em", color:"black"}}>TÍTULO:</p>
              <p style={{fontSize:"1em", color:"blue"}}>{props.datos.titulo}</p>
              <p style={{fontSize:"1em", color:"black"}}>DESCRIPCIÓN DE LA SOLICITUD: </p>        
              <p style={{fontSize:"1em", color:"blue"}}>{props.datos.descripcion}</p>
            </div>
          </IonCard>
  
          <IonCard id="ionCard-explorerContainer-Proveedor">
                < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
          </IonCard>
         
          <div id="botonCentral">
            <div id="botonCentralIzquierda">
              <IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton>
            </div>
          </div>
          
          <IonAlert
                isOpen={showAlertOrdenAceptada}
                onDidDismiss={() => setShowAlertOrdenAceptada(false)}
                cssClass='my-custom-class'
                header={'ORDEN DE SERVICIO EN PROGRESO'}
                subHeader={''}
                mode='ios'
                message={'Si está en condiciones de presupuestar el trabajo/servicio coloque precio'+'\n'+"Sino solicite más información"}
                buttons={[
                  {
                    text: 'OK',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: blah => {
                      props.setVista("ACEPTADA");
                    }
                  }
                ]} 
          />
 
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
                      props.setVista("CANCELAR");
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
                ]} 
          />
  

        </div>
      </IonContent>
    )

  }

  const OrdenEnSitio  = (props:{datos:any, setDatos:any, setVolver:any, estado:any, setEstado:any, 
    setVista:any})  =>{
  
      const [showAlertOrdenAceptada, setShowAlertOrdenAceptada] = useState(false)
      const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false)
    
      return ( 
        <IonContent>
          <div id="ionContentModalOrdenes">
            <div id="modalProveedor-flechaVolver">
                <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
            </div>
            <IonCard id="ionCard-explorerContainer-Proveedor">
            <img src={"./assets/icon/sirena.png"} style={{width:"50px", height:"50px"}} />
            <div id="divSentencias">
              <p style={{fontSize:"1em", color:"black"}}>{props.datos.tipo.toUpperCase()}</p>
              <h1>PROVEEDOR EN SITIO</h1>

              <IonItemDivider />
              <p style={{fontSize:"1em", color:"black"}}>RUBRO: {props.datos.rubro.toUpperCase()}</p>
              <p style={{fontSize:"1em", color:"black"}}>STATUS: {props.estado}</p>
              <p style={{fontSize:"1em", color:"black"}}>TICKET: {props.datos.ticket}</p>
            </div>
              <IonGrid>
                <IonRow>
                  <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosProveedor")}>
                    <IonRow id="ionrow-homecliente">
                    <IonIcon icon={eye} /> </IonRow>
                    <IonRow id="ionrow-homecliente"><small>VER DATOS DE PROVEEDOR</small></IonRow>
                  </IonCol>
    
                  <IonCol id="ioncol-homecliente"  onClick={() => verUbicacion(props.datos.latitud, props.datos.longitud) }   >
                    <IonRow id="ionrow-homecliente">
                    <IonIcon icon={location} /> </IonRow>
                    <IonRow id="ionrow-homecliente"><small>VER UBICACIÓN DE PROVEEDOR</small></IonRow>
                  </IonCol>
    
                  <IonCol id="ioncol-homecliente" onClick={() => props.setVista("chat")}>
                    <IonRow id="ionrow-homecliente">
                    <IonIcon icon={chatbox} /> </IonRow>
                    <IonRow id="ionrow-homecliente"><small>CHAT CON PROVEEDOR</small></IonRow>
                  </IonCol>
  
                </IonRow>
              </IonGrid>
            </IonCard>
    
            <IonCard id="ionCard-explorerContainer-Proveedor">
              <h1 style={{fontSize:"1.2em", color:"black"}}>DATOS GENERALES DE ORDEN</h1>
              <IonItemDivider />
              <div id="divSentencias">
                <p style={{fontSize:"1em", color:"black"}}>FECHA DE SOLICITUD:</p>
                <p style={{fontSize:"1em", color:"blue"}} >{props.datos.fecha_creacion}</p>
                <p style={{fontSize:"1em", color:"black"}}>TÍTULO:</p>
                <p style={{fontSize:"1em", color:"blue"}}>{props.datos.titulo}</p>
                <p style={{fontSize:"1em", color:"black"}}>DESCRIPCIÓN DE LA SOLICITUD: </p>        
                <p style={{fontSize:"1em", color:"blue"}}>{props.datos.descripcion}</p>
              </div>
            </IonCard>
    
            <IonCard id="ionCard-explorerContainer-Proveedor">
                  < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
            </IonCard>
           
            <div id="botonCentral">
              <div id="botonCentralIzquierda">
                <IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton>
              </div>
            </div>
               
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
                        props.setVista("CANCELAR");
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
                  ]} 
            />
    
  
          </div>
        </IonContent>
      )
    }

 const OrdenRealizada = (props:{datos:any, setDatos:any, setVolver:any, estado:any, setEstado:any, 
      setVista:any})  =>{
  
        const calificacion = useRef ("0")
        const reseña = useRef ("")
      
        const [showAlertCalificacion, setShowAlertCalificacion] = useState(false)
        const [showAlertConexion, setShowAlertConexion] = useState(false)
      
        const enviar = ()=>{
          if (calificacion.current=="0") {
            setShowAlertCalificacion(true)
          }else{
            var formDataToUpload = new FormData();
            formDataToUpload.append("ticket",props.datos.ticket)
            formDataToUpload.append("resena", reseña.current)
            formDataToUpload.append("calificacion", calificacion.current)
      
            const axios = require('axios');
            axios({
                url:url+"orden/ordenEmergencia/finalizar/cliente",
                method:'POST',
                headers: {"content-type": "multipart/form-data"},
                data:formDataToUpload
            }).then(function(res: any){
        
              if(res.data=="ok"){
                  props.setVolver(false)
                  window.location.reload();
      
              }else{
                setShowAlertConexion(true)
              }
            }).catch((error: any) =>{
        //              setVista(0)
                //Network error comes in
                setShowAlertConexion(true)
      
            });
          }
        }
      
        return (
          <IonContent>
            <div id="ionContentModalOrdenes">
            <div id="modalProveedor-flechaVolver">
                <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
            </div>
              
              <IonCard id="ionCardModalCentro">
                <h2 style={{ fontSize: "1.2em", color: "black" }}>TRABAJO REALIZADO</h2>
                <h2 style={{ fontSize: "1em", color: "blue" }}>COMPLETE LOS SIGUIENTES CAMPOS</h2>
                <IonItemDivider />
      
                <h2 style={{ fontSize: "1em", color: "black" }}>INGRESE LA CALIFICACIÓN DEL PROVEEDOR</h2>
                <Calificacion calificacion={calificacion} ></Calificacion>
                <h2 style={{ fontSize: "1em", color: "black" }}>¿DESEA INGRESAR UNA RESEÑA DEL PROVEEDOR?</h2>
                <IonItem id="item-completarInfo">
                  <IonLabel position="floating">RESEÑA</IonLabel>
                  <IonInput onIonInput={(e: any) => reseña.current=(e.target.value)}></IonInput>
                </IonItem>
            </IonCard>
      
           <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => enviar()} >ENVIAR</IonButton>
         
                <IonAlert
                      isOpen={showAlertCalificacion}
                      onDidDismiss={() => setShowAlertCalificacion(false)}
                      cssClass='my-custom-class'
                      header={'CALIFICACIÓN'}
                      subHeader={''}
                      message={'Debe ingresar una calificación para el cliente'}
                      buttons={['OK']} />
                <IonAlert
                      isOpen={showAlertConexion}
                      onDidDismiss={() => setShowAlertConexion(false)}
                      cssClass='my-custom-class'
                      header={'INCONVENIENTE CON EL SERVIDOR'}
                      subHeader={''}
                      message={'Ingrese la calificación luego'}
                      buttons={['OK']} />
           </div>
            </IonContent>
        )
  
      }
  
 const OrdenCancelar = (props:{desdeDondeEstoy:any, datos:any, setVista:any, setEstado:any, setVolver:any})  =>{
 
     const motivo = useRef("") 

     const [showAlertMotivoRechazo, setShowAlertMotivoRechazo] = useState(false)

     
     const cancelarOrden = ()=> {

      if(motivo.current==""){
        setShowAlertMotivoRechazo(true)
      }else{

      axios.get(url+"orden/ordenEmergencia/rechazarOrdenCliente/"+props.datos.ticket+"/"+motivo.current, {timeout: 7000})
      .then((resp: { data: any; }) => {
        if(resp.data!="bad"){
          props.setEstado("ORDEN RECHAZADA")
          props.setVista("cancelarOrden")

          createStore("ordenesActivas")
          removeDB(props.datos.ticket.toString())

          props.setVolver(false)
          window.location.reload()

        }
       })
    }
  }
     
     return (
      <IonContent>
      
            <div id="ionContentModalOrdenes">
      
            <div id="modalProveedor-flechaVolver">
                <IonIcon icon={arrowBack} onClick={() => props.setVista(props.desdeDondeEstoy.current)} slot="start" id="flecha-volver">  </IonIcon>
            </div>
              
              <IonCard id="ionCardModalCentro">
                <h2 style={{ fontSize: "1.2em", color: "black" }}>CANCELAR ORDEN</h2>
                <h2 style={{ fontSize: "1em", color: "blue" }}>PARA CANCELAR COMPLETE LOS SIGUIENTES CAMPOS</h2>
                <IonItemDivider />
                 
                <h2 style={{ fontSize: "1em", color: "black" }}>MOTIVO DE CANCELACIÓN</h2>
                <IonItem id="item-completarInfo">
                  <IonLabel position="floating">INGRESE MOTIVO</IonLabel>
                  <IonInput onIonInput={(e: any) => motivo.current=(e.target.value)}></IonInput>
                </IonItem>
            </IonCard>
      
           <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => cancelarOrden()}>CANCELAR ORDEN</IonButton>
         
                <IonAlert
                      isOpen={showAlertMotivoRechazo}
                      onDidDismiss={() => setShowAlertMotivoRechazo(false)}
                      cssClass='my-custom-class'
                      header={'MOTIVO'}
                      subHeader={''}
                      message={'Debe ingresra un motivo de rechazo'}
                      buttons={['OK']} />
             
           </div>
            </IonContent>
        )
  
 
 }

export default ModalVerOrdenesCliente;

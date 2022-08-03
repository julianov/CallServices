import { arrowBack, chatbox, close, eye, location } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { isConstructorDeclaration, isSetAccessorDeclaration, visitParameterList } from "typescript";

import '../ModalGeneral/Modal.css';

import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import Https from "../../../utilidades/HttpsURL";
import Chat from "../../Chat/Chat";
import { IonAlert, IonButton, IonCard, IonCardSubtitle, IonCardTitle, IonCheckbox, IonCol, IonContent, IonDatetime, IonGrid, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonLoading, IonRow, IonSegment, IonSegmentButton, IonTitle } from "@ionic/react";
import { getDB, setDB } from "../../../utilidades/dataBase";
import { Redirect } from "react-router";
import { ordenesCliente } from "../../../pages/Home/HomeCliente";
import { ordenes } from "../../../pages/Home/HomeProveedor";
import ModalVerOrdenesProveedorGenerales from "./VerOrdenesProveedorOrdenesGenerales";



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


const ModalVerOrdenesProveedor = (props:{notifications:any,setNotifications:any, datosCompletos:any, setDatosCompletos:any,emailProveedor:any,setVolver:any,setNuevasOrdenes:any, nuevasOrdenes:any, ticket:any, tipo:any})  =>{

  if (props.tipo=="Orden de emergencia"){
    return(
         < ModalVerOrdenesProveedorEmergencia notifications={props.notifications} setNotifications={props.setNotifications} 
      datosCompletos={props.datosCompletos} setDatosCompletos={props.setDatosCompletos} 
      emailProveedor={props.emailProveedor} setVolver={props.setVolver} setNuevasOrdenes={props.setNuevasOrdenes} 
      nuevasOrdenes={props.nuevasOrdenes} ticket={props.ticket} ></ModalVerOrdenesProveedorEmergencia>
    )
  }else{
    return (
      < ModalVerOrdenesProveedorGenerales notifications={props.notifications} setNotifications={props.setNotifications} 
      datosCompletos={props.datosCompletos} setDatosCompletos={props.setDatosCompletos} 
      emailProveedor={props.emailProveedor} setVolver={props.setVolver} setNuevasOrdenes={props.setNuevasOrdenes} 
      nuevasOrdenes={props.nuevasOrdenes} ticket={props.ticket} ></ModalVerOrdenesProveedorGenerales>
    )
  }
}


const ModalVerOrdenesProveedorEmergencia = (props:{notifications:any,setNotifications:any, datosCompletos:any, setDatosCompletos:any,emailProveedor:any,setVolver:any,setNuevasOrdenes:any, nuevasOrdenes:any, ticket:any})  =>{


  const [vista, setVista] = useState("PRIMERO")

  const [estado, setEstado] =useState("ENVIADA POR EL CLIENTE")

  const [showAlertInconvenienteChat, setShowAlertInconvenienteChat] = useState(false)

  const desdeDondeEstoy=useRef("")
  const ticketeck = useRef <string>("")


  const [orden, setOrden] = useState <ordenes>(
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
      email_cliente:"",
      imagen_cliente:"",
      location_lat:"",
      location_long:"",
      picture1:"",
      picture2:"",
      presupuesto_inicial:"",
      pedido_mas_información:"",
      respuesta_cliente_pedido_mas_información:"",
      picture1_mas_información:"",
      picture2_mas_información:"",
    }
  );


  useEffect(() => {
    ticketeck.current= orden.ticket 

          if (orden.status=="ENV"){
            setVista("PRIMERO")
          }
          else if(orden.status=="ACE"){
            setEstado("ORDEN ACEPTADA")
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

          if(orden.ticket!=""){
            props.setNuevasOrdenes(props.nuevasOrdenes.filter((item:string) => item !== ticketeck.current));

            getDB(ticketeck.current.toString( )+"proveedor").then(res => {
              if(res!=undefined || res!=null){
              //arreglo.push(res)
              //aca copia todo, el numero 1 del arreglo no es el rubro sino la primer letra del rubro y así.
                if(res!=orden.status || orden.status=="ENV"){
                // setNuevoStatus(true)
                  setDB(orden.ticket+"proveedor",orden.status)
                  
                }  
                }else{
                  setDB(orden.ticket+"proveedor", orden.status)
                  //setNuevoStatus(false)
                }
            })

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
            ticket:props.datosCompletos[i].ticket,
            dia:props.datosCompletos[i].dia,
            hora:props.datosCompletos[i].hora,
            titulo:props.datosCompletos[i].titulo,
            descripcion:props.datosCompletos[i].descripcion,
            email_cliente:props.datosCompletos[i].email_cliente,
            imagen_cliente:props.datosCompletos[i].imagen_cliente,
            location_lat:props.datosCompletos[i].location_lat,
            location_long:props.datosCompletos[i].location_long,
            picture1:props.datosCompletos[i].picture1,
            picture2:props.datosCompletos[i].picture2,
            presupuesto_inicial:props.datosCompletos[i].presupuesto_inicial,
            pedido_mas_información:props.datosCompletos[i].pedido_mas_información,
            respuesta_cliente_pedido_mas_información:props.datosCompletos[i].respuesta_cliente_pedido_mas_información,
            picture1_mas_información:props.datosCompletos[i].picture1_mas_información,
            picture2_mas_información:props.datosCompletos[i].picture2_mas_información,
          }
        )
      }

    }
    }, [props.datosCompletos]) 


    const rechazarOrden = ()=> {

        axios.get(url+"orden/ordenEmergencia/rechazarOrdenProveedor/"+props.emailProveedor+"/"+orden.ticket, {timeout: 7000})
        .then((resp: { data: any; }) => {

          if(resp.data!="bad"){
            setEstado("ORDEN RECHAZADA")
            setVista("ir a home")
            window.location.reload();

          }
  
         })
    }
 
    if(vista=="PRIMERO"){
      desdeDondeEstoy.current="PRIMERO"
      return (
        <Primero datos={orden} setVolver={props.setVolver} estado={estado} setEstado={setEstado} setVista={setVista} rechazarOrden={rechazarOrden} proveedorEmail={props.emailProveedor} />
      )
    }else if (vista=="ACEPTADA") {
      desdeDondeEstoy.current="ACEPTADA"
      return (
        <OrdenAceptada setVista={setVista} datos={orden} setDatos={setOrden} setEstado={setEstado} ticket={orden.ticket} setVolver={props.setVolver} />
      )
    }else if(vista=="EN VIAJE"){
      desdeDondeEstoy.current="EN VIAJE"
      return(
      <OrdenEnViaje datos={orden} setDatos={setOrden} estado={estado} setVista={setVista} setEstado={setEstado} setVolver={props.setVolver} rechazarOrden={rechazarOrden} />
      )
    }else if (vista=="EN SITIO"){
      return(
        <OrdenEnViaje datos={orden} setDatos={setOrden} estado={estado} setVista={setVista} setEstado={setEstado} setVolver={props.setVolver} rechazarOrden={rechazarOrden} />

      )
    }else if (vista=="REALIZADA"){

      return(

      )
    }else if (vista=="chat") {
      return(
        <>
          <Chat notifications={props.notifications} setNotifications={props.setNotifications} email={props.emailProveedor}  ticket={orden.ticket} setVolver={props.setVolver} setVista={setVista} desdeDondeEstoy={desdeDondeEstoy.current} />
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
    }else{
      return (
        <></>
      )
    }
}



const Primero = (props:{datos:any, setVolver:any, estado:any, setEstado:any, 
  setVista:any, rechazarOrden:any, proveedorEmail:any})  =>{
 
   const [showAlertOrdenAceptada, setShowAlertOrdenAceptada] = useState(false)
   const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false)
   const [showAlertUbicacion,setShowAlertUbicacion]=useState(false)
   const [showAlertChat,setShowAlertChat]=useState(false)


   const aceptarOrden = ()=> {
 
     if (props.estado=="ENVIADA POR EL CLIENTE"){
       axios.get(url+"orden/ordenEmergencia/proveedorAcepta/"+props.proveedorEmail+"/"+props.datos.ticket, {timeout: 7000})
       .then((resp: { data: any; }) => {
 
         if(resp.data!="bad"){

           props.setEstado("ORDEN EN PROGRESO")
           setShowAlertOrdenAceptada(true)
           props.datos.status="ACE"
           props.setVista("ACEPTADA")

         }
     
 
       })
     }
     
   }
 
   return ( 
     <IonContent>
       <div id="ionContentModalOrdenes">
         <div id="modalProveedor-flechaVolver">
             <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
         </div>
         <IonCard id="ionCard-explorerContainer-Proveedor">
           <img id="img-orden" src={props.datos.imagen_cliente}></img>
           <div id="divSentencias">
             <p style={{fontSize:"1em", color:"black"}}>TIPO: {props.datos.tipo}</p>
             <p style={{fontSize:"1em", color:"black"}}>STATUS: {props.estado}</p>
             <p style={{fontSize:"1em", color:"black"}}>TICKET: {props.datos.ticket}</p>
           </div>
           <IonGrid>
             <IonRow>
               <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosClientes")}>
                 <IonRow id="ionrow-homecliente">
                 <IonIcon icon={eye} /> </IonRow>
                 <IonRow id="ionrow-homecliente"><small>VER DATOS CLIENTE</small></IonRow>
               </IonCol>
 
               <IonCol id="ioncol-homecliente"  onClick={() =>verUbicacion(props.datos.latitud, props.datos.longitud) }   >
                 <IonRow id="ionrow-homecliente">
                 <IonIcon icon={location} /> </IonRow>
                 <IonRow id="ionrow-homecliente"><small>VER UBICACIÓN CLIENTE</small></IonRow>
               </IonCol>
               <IonCol id="ioncol-homecliente" onClick={() => setShowAlertChat(true)}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={chatbox} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>CHAT CON CLIENTE</small></IonRow>
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
           <div id="botonCentralDerecha"> 
             <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => aceptarOrden()} >ACEPTAR ORDEN</IonButton>
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
                     props.rechazarOrden();
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
  setVista:any, rechazarOrden:any, proveedorEmail:any})  =>{

    const [showAlertOrdenAceptada, setShowAlertOrdenAceptada] = useState(false)
    const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false)
    const [showAlertUbicacion,setShowAlertUbicacion]=useState(false)

    const enViaje = ()=> {
 
        axios.get(url+"orden/ordenEmergencia/proveedorEnViaje/"+props.datos.ticket, {timeout: 7000})
        .then((resp: { data: any; }) => {
  
          if(resp.data!="bad"){
 
            props.setEstado("ORDEN EN PROGRESO")
            setShowAlertOrdenAceptada(true)
            props.datos.status="EVI"
            props.setVista("EN VIAJE")
 
          }
        })
      
      
    }


    return ( 
      <IonContent>
        <div id="ionContentModalOrdenes">
          <div id="modalProveedor-flechaVolver">
              <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
          </div>
          <IonCard id="ionCard-explorerContainer-Proveedor">
            <img id="img-orden" src={props.datos.imagen_cliente}></img>
            <div id="divSentencias">
              <p style={{fontSize:"1em", color:"black"}}>TIPO: {props.datos.tipo}</p>
              <p style={{fontSize:"1em", color:"black"}}>STATUS: {props.estado}</p>
              <p style={{fontSize:"1em", color:"black"}}>TICKET: {props.datos.ticket}</p>
            </div>
            <IonGrid>
              <IonRow>
                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosClientes")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={eye} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER DATOS CLIENTE</small></IonRow>
                </IonCol>
  
                <IonCol id="ioncol-homecliente"  onClick={() => verUbicacion(props.datos.latitud, props.datos.longitud) }   >
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={location} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER UBICACIÓN CLIENTE</small></IonRow>
                </IonCol>
  
                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("chat")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={chatbox} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>CHAT CON CLIENTE</small></IonRow>
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
            <div id="botonCentralDerecha"> 
              <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => enViaje()} >EN VIAJE</IonButton>
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
                      props.rechazarOrden();
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
            isOpen={showAlertUbicacion}
            onDidDismiss={() => setShowAlertUbicacion(false)}
            cssClass='my-custom-class'
            header={'UBICACIÓN DEL CLIENTE'}
            subHeader={''}
            mode='ios'
            message={'La orden debe ser aceptada para ver la ubicación del cliente'}
            buttons={['OK']}
          />
        </div>
      </IonContent>
    )


  }
 


export default ModalVerOrdenesProveedor

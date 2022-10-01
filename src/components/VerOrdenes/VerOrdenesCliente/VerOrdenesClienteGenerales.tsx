import { arrowBack, camera, chatbox, close, eye, location, logoWindows } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { isConstructorDeclaration, isPropertyDeclaration, isSetAccessorDeclaration } from "typescript";

import Https from "../../../utilidades/HttpsURL";
import '../../ModalGeneral/Modal.css';

import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import axios from "axios";
import { clearDB, createStore, removeDB, setDB } from "../../../utilidades/dataBase";
import Chat from "../../Chat/Chat";
import { IonAlert, IonButton, IonCard, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonRow, IonTextarea, IonTitle } from "@ionic/react";
import { ordenesCliente } from "../../../pages/Home/HomeCliente";
import { TomarFotografia } from "../../../pages/PedirOrdenes/PedirOrden";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { Calificacion } from "../VerOrdenesProveedor/VerOrdenesProveedorOrdenesGenerales";
import { removeItem } from "../../../utilidades/Storage";

const url=Https

interface datos_proveedor {
    nombre:string
    apellido:string
    imagen:string
    calificacion: number
  }

const verUbicacion = ( latitud:any, longitud:any) =>{

    const link="https://www.google.com/maps/search/?api=1&query="+latitud+"%2C"+longitud
    const win= window.open(   link, '_blank')?.focus();

  }

  
  const ModalVerOrdenesClienteGenerales = (props:{ticket:any, datosCompletos:any, setDatosCompletos:any, nuevasOrdenes:any, setNuevasOrdenes:any, notifications:any, setNotifications:any,emailCliente:any, setVolver:any})  =>{
   
    const [vista, setVista] = useState("primero")

    const [estado, setEstado] =useState("Enviada")
   
    const desdeDondeEstoy=useRef("")

    const respuesta=useRef("")
    const imagen1=useRef<String>()
    const imagen2=useRef<String>()


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
        
        if(orden.ticket!=""){
            setDB(orden.ticket+"cliente", orden.status)
            props.setNuevasOrdenes(props.nuevasOrdenes.filter((item:string) => item !== orden.ticket));
        }
        if (orden.status=="ENV"){
            setEstado("GENERADA")
        }else if(orden.status=="REC"){
            setEstado("ORDEN RECIBIDA POR PROVEEDOR")
        }else if(orden.status=="PEI"){
            setEstado("ORDEN CON SOLCITUD DE MÁS INFORMACIÓN")
            setVista("masinfo")
        }else if(orden.status=="RES"){
            setEstado("INFORMACIÓN ADICIONAL ENVIADA")
            setVista("respuestaEnviada")
        }else if(orden.status=="PRE"){
            setEstado("PRESUPUESTADA")
            setVista("PRESUPUESTADA")
        }else if(orden.status=="ACE"){
            setEstado("PRESUPUESTO ACEPTADO")
            setVista("enEsperaDelPRoveedor")
        }else if(orden.status=="EVI"){
            setEstado("ORDEN ACEPTADA")
            setVista("enEsperaDelPRoveedor")
        }else if(orden.status=="ENS"){
            setEstado("PROVEEDOR EN SITIO")
        }else if(orden.status=="RED"){
            setVista("finalizada")
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

      const cancelarOrden = ()=> {
        setVista("cancelarOrden")
      }
   
      if(vista=="primero"){

        desdeDondeEstoy.current="primero"
        return (
          <Primero datos={orden!} setVista={setVista} estado={estado} setEstado={setEstado}
          setVolver={props.setVolver} cancelarOrden={cancelarOrden} />
        );
          
      }else if(vista=="masinfo"){

        desdeDondeEstoy.current="masinfo"
        return(
          < ProveedorPideMasInfo setOrden={setOrden} datos={orden!} respuesta={respuesta} imagen1={imagen1} imagen2={imagen2} setVista={setVista} estado={estado} setEstado={setEstado}
          setVolver={props.setVolver} cancelarOrden={cancelarOrden}/>
        )

      } else if (vista=="PRESUPUESTADA"){

        desdeDondeEstoy.current="PRESUPUESTADA"
        return(
          <OrdenPresupuestada datos={orden!} setVista={setVista} estado={estado} setEstado={setEstado}
          setVolver={props.setVolver} cancelarOrden={cancelarOrden}/>
        )

      }else if(vista=="respuestaEnviada"){

        desdeDondeEstoy.current="respuestaEnviada"
        return(
          <RespuestaDeInfoEnviada datos={orden!} setVista={setVista} estado={estado} setEstado={setEstado}
          setVolver={props.setVolver} cancelarOrden={cancelarOrden} respuesta={respuesta} imagen1={imagen1} imagen2={imagen2} />
        )

      } else if (vista=="enEsperaDelPRoveedor"){

        desdeDondeEstoy.current="enEsperaDelPRoveedor"
        return(
          <EnEsperaDelProveedor datos={orden!} setVista={setVista} estado={estado} setEstado={setEstado}
          setVolver={props.setVolver} cancelarOrden={cancelarOrden} />
        )

      }else if(vista=="proveedorEnViaje"){

        desdeDondeEstoy.current="proveedorEnViaje"
        return(
          <OrdenEnViaje datos={orden!} setVista={setVista} estado={estado} setEstado={setEstado}
          setVolver={props.setVolver} cancelarOrden={cancelarOrden} />
        )

      }else if(vista=="finalizada"){

        return(
        <Finalizada datos={orden!} setVista={setVista} estado={estado} setEstado={setEstado}
          setVolver={props.setVolver} />
        )

      } else if (vista=="datosProveedor"){
        return (
        < VerDatosProveedor ticket={orden.ticket} tipo={orden.tipo} latitud={orden.location_lat} longitud={orden.location_long} setVista={setVista} rubro={orden.rubro} desdeDondeEstoy={desdeDondeEstoy} />
        )

      }else if (vista=="chat") {

        return(
          <IonContent>
            <div style={{display:"flex",height:"100%", width:"100%"}}>
                <Chat notifications={props.notifications} setNotifications={props.setNotifications} email={props.emailCliente}  ticket={orden.ticket} setVolver={props.setVolver} setVista={setVista} desdeDondeEstoy={desdeDondeEstoy.current}/>
            </div>
          </IonContent>
        )
        
      }else if (vista=="cancelarOrden"){
        return (
          <RechazarOrden datos={orden} setVolver={props.setVolver} setVista={setVista} estado={estado} setEstado={setEstado} />
    
        )
                
      }else{

        return (
          <IonContent>
       
        </IonContent>
             
      );
      }
      
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Primero = ( props:{datos:any, setVolver:any, setVista:any, setEstado:any, estado:any, cancelarOrden:any} )=>{

    const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false)
  
    return (
        <IonContent >
            <div id="ionContentModalOrdenes">
                <div id="modalProveedor-flechaVolver">
                    <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
                </div>
                <IonCard id="ionCard-explorerContainer-Proveedor">

                    <img id="img-orden" src={props.datos.imagen_proveedor}></img>

                      <div id="divSentencias">
                        <p style={{fontSize:"1em", color:"black"}}>TIPO: {props.datos.tipo.toUpperCase()}</p>
                        <p style={{fontSize:"1em", color:"black"}}>STATUS: {props.estado}</p>
                        <p style={{fontSize:"1em", color:"black"}}>TICKET: {props.datos.ticket}</p>
                      </div>

                      <IonGrid>
                        <IonRow>

                        <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosProveedor")}>
                              <IonRow id="ionrow-homecliente">
                              <IonIcon icon={eye} /> </IonRow>
                              <IonRow id="ionrow-homecliente"><small>VER DATOS PROVEEDOR</small></IonRow>
                            </IonCol>

                          <IonCol id="ioncol-homecliente" onClick={() => props.setVista("chat")}>
                              <IonRow id="ionrow-homecliente">
                              <IonIcon icon={chatbox} /> </IonRow>
                              <IonRow id="ionrow-homecliente"><small>CHAT PROVEEDOR</small></IonRow>
                            </IonCol>

                        </IonRow>
                      </IonGrid>
                </IonCard>
  
                
                <IonCard id="ionCard-explorerContainer-Proveedor">
                  <div id="titulo">
                      <IonTitle >DATOS DE ORDEN DE SERVICIO</IonTitle>  
                  </div>
                  <IonItemDivider />
                    <div id="divSentencias">
                        <p style={{fontSize:"1em", color:"black"}}>FECHA DE SOLICITUD: {props.datos.fecha_creacion}</p>
                        <p style={{fontSize:"1em", color:"blue"}}>TÍTULO: {props.datos.titulo}</p>
                        <p style={{fontSize:"1em", color:"black"}}>DESCRIPCIÓN DE LA SOLICITUD: </p>        
                        <p style={{fontSize:"1em", color:"blue"}}>{props.datos.descripcion}</p>
                    </div>
                </IonCard>
  
                <IonCard id="ionCard-explorerContainer-Proveedor">
                    <Imagenes picture1={props.datos.picture1} picture2={props.datos.picture2}  ticket={props.datos.ticket} tipo={props.datos.tipo} ></Imagenes>
                </IonCard>
                
                <IonCol>
                    <IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >CANCELAR ORDEN</IonButton>
                </IonCol>
                
                <IonAlert
                    isOpen={showAlertRechazarOrden}
                    mode='ios'
                    onDidDismiss={() => setShowAlertRechazarOrden(false)}
                    cssClass='my-custom-class'
                    header={'¿DESEA CANCELAR LA ORDEN?'}
                    subHeader={''}
                    message={'Agregar una indicación de por qué es mala rechazar ordenes'}
                    buttons={[
                      {
                        text: 'SI',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: blah => {
                            props.cancelarOrden();
                        },  

                      },
                      {
                        text: 'NO',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: blah => {
                          setShowAlertRechazarOrden(false);
                        }
                      }]}
                    />
            </div>
        </IonContent>
    )

}

const ProveedorPideMasInfo = ( props:{setOrden:any, datos:any, setVolver:any, setVista:any, setEstado:any, estado:any, cancelarOrden:any, respuesta:any, imagen1:any, imagen2:any} )=>{

  const respuesta_informacion=useRef("")
  const foto1Mostrar= useRef <String>()
  const foto2Mostrar= useRef <String>()

  const foto1= useRef <Blob>()
  const foto2= useRef <Blob>()

  const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false)
 // const [showAlertUbicacion,setShowAlertUbicacion] = useState(false)

 const [showAlerAgregarPresupuesto, setShowAlerAgregarPresupuesto]= useState(false)

  const enviarMasInfo = () =>{

      if(respuesta_informacion.current!=""){
          var formDataToUpload = new FormData();
          formDataToUpload.append("ticket",props.datos.ticket)
          formDataToUpload.append("respuesta_informacion",respuesta_informacion.current)
          props.respuesta.current=respuesta_informacion.current

          if(foto1.current!=null || foto1.current!=undefined){
            formDataToUpload.append("imagen1", foto1.current);
            props.imagen1.current=foto1Mostrar.current

          }
          if(foto2.current!=null || foto2.current!=undefined){
            formDataToUpload.append("imagen2", foto2.current); 
            props.imagen2.current=foto2Mostrar.current
          }

          props.setOrden({
            rubro:props.datos.rubro, 
            tipo:props.datos.tipo,
            status:props.datos.status,
            fecha_creacion:props.datos.fecha_creacion,
            ticket:props.datos.ticket,
            dia:props.datos.dia,
            hora:props.datos.hora,
            titulo:props.datos.titulo,
            descripcion:props.datos.descripcion,
            email_proveedor:props.datos.email_proveedor,
            presupuesto:props.datos.presupuesto,
            imagen_proveedor:props.datos.imagen_proveedor,
            location_lat:props.datos.lacation_lat,
            location_long:props.datos.location_long,
            picture1:props.datos.picture1,
            picture2:props.datos.picture2,
            pedido_mas_información:props.datos.pedidoMasInformacion,
            respuesta_cliente_pedido_mas_información:respuesta_informacion.current,
            picture1_mas_información:foto1Mostrar.current,
            picture2_mas_información:foto2Mostrar.current
          })

          const axios = require('axios');
                    axios({
                        url:url+"orden/masInfo/cliente",
                        method:'POST',
                        headers: {"content-type": "multipart/form-data"},
                        data:formDataToUpload
                    }).then(function(res: any){

                      if(res.data=="ok"){
                       // aca cambiar porque cuando se envia lo que el proveedor requiere aparece como aceptada pero en realidad no está aceptada, solo se envio lo que pedía el proveedor

                      props.setEstado("ORDEN CON SOLCITUD DE MÁS INFORMACIÓN")
                      props.setVista("respuestaEnviada")
                      setDB(props.datos.ticket+"cliente", "RES")


                      }



                    }).catch((error: any) =>{
          //              setVista(0)
                        //Network error comes in
                    });
      }else{
        setShowAlerAgregarPresupuesto(true)
      }
  }

  return (
      <IonContent>
        <div id="ionContentModalOrdenes">
            <div id="modalProveedor-flechaVolver">
                <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
            </div>
            
            <IonCard id="ionCard-explorerContainer-Proveedor">
                <div id="divSentencias">
                    <p style={{fontSize:"1em", color:"black"}}>TIPO: {props.datos.tipo}</p>
                    <p style={{fontSize:"1em", color:"black"}}>STATUS: {props.estado}</p>
                    <p style={{fontSize:"1em", color:"black"}}>TICKET: {props.datos.ticket}</p>
                </div>
                <IonGrid>
                    <IonRow>
                        <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosProveedor")}>
                            <IonRow id="ionrow-homecliente">
                            <IonIcon icon={eye} /> </IonRow>
                            <IonRow id="ionrow-homecliente"><small>VER DATOS PROVEEDOR</small></IonRow>
                        </IonCol>
                        <IonCol id="ioncol-homecliente" onClick={() => props.setVista("chat")}>
                          <IonRow id="ionrow-homecliente">
                          <IonIcon icon={chatbox} /> </IonRow>
                          <IonRow id="ionrow-homecliente"><small>CHAT PROVEEDOR</small></IonRow>
                        </IonCol>
                    </IonRow>
                </IonGrid> 
            </IonCard>
            
            <div id="titulo">
                <h1>SOLICITUD DE MÁS INFORMACIÓN </h1>
            </div>
            
            <IonCard id="ionCard-explorerContainer-Proveedor">
                <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", width:"90%", height:"auto"}}>
                    <h2 style={{fontWeight:"100", fontSize:"1em"}}>EL PROVEEDOR DE SERVICIO LE HA ENVIADO EL SIGUIENTE COMENTARIO</h2> 
                </div>
                <IonItemDivider style={{margin:"0px"}}></IonItemDivider>
                <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", width:"90%", height:"auto"}}>
                    <p style={{fontWeight:"600", fontSize:"1.2em", marginBottom:"25px"}}>{props.datos.pedido_mas_información}</p> 
                </div>
            </IonCard>
            
            <IonItemDivider></IonItemDivider>
            
            <IonCard id="ionCard-explorerContainer-Proveedor">
                <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", width:"90%", height:"auto"}}>
                    <h2 style={{fontWeight:"100", fontSize:"1em"}}>INGRESE SU RESPUESTA</h2> 
                </div>
                <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", width:"90%", height:"auto"}}>
                    <IonItem style={{width:"90%",margin:"0px 0px 20px 0px"}}>
                      <IonLabel position="floating">Respuesta</IonLabel>
                      <IonInput onIonInput={(e: any) => respuesta_informacion.current = (e.target.value)}></IonInput>
                    </IonItem>
                </div>
                <IonItemDivider/>
                <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", width:"90%", height:"auto"}}>
                    <h2 style={{fontWeight:"100", fontSize:"1em"}}>¿DESEA AGREGAR FOTOS?</h2> 
                </div>
                <IonGrid>
                    <IonRow>
                        <IonCol>
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
            
            <div id="botonCentral">
                <div id="botonCentralIzquierda">
                    <IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >CANCELAR ORDEN</IonButton>
                </div>
                <div id="botonCentralDerecha">  
                    <IonButton shape="round" color="warning" id="botonContratar" onClick={() => enviarMasInfo()}>RESPONDER</IonButton>
                </div>
            </div>

            <IonAlert
              isOpen={showAlertRechazarOrden}
              onDidDismiss={() => setShowAlertRechazarOrden(false)}
              cssClass='my-custom-class'
              header={'¿DESEA CANCELAR LA ORDEN?'}
              subHeader={''}
              mode='ios'
              message={'Agregar una indicación de por qué es mala rechazar ordenes'}
              buttons={[
              {
                text: 'SI',
                role: 'cancel',
                cssClass: 'secondary',
                handler: blah => {
                    props.cancelarOrden();
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

            <IonAlert
              isOpen={showAlerAgregarPresupuesto}
              onDidDismiss={() => setShowAlerAgregarPresupuesto(false)}
              cssClass='my-custom-class'
              header={'RESPONDER AL PROVEEDOR'}
              subHeader={''}
              mode='ios'
              message={'Debe responderle al proveedor para continuar'}
              buttons={[
              {
                text: 'OK',
                role: 'cancel',
                cssClass: 'secondary',
                handler: blah => {
                  setShowAlerAgregarPresupuesto(false);
                },  

              }
              
              ]} />
          </div>
      </IonContent>
  )
}


const RespuestaDeInfoEnviada  = (props:{datos:any, setVolver:any, setVista:any, setEstado:any, estado:any, cancelarOrden:any, respuesta:any, imagen1:any, imagen2:any} )=>{
  
  const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false)
  
  const volver = () => {
    props.setVolver(false)
    window.location.reload()
    }

  return (
      <IonContent>
        <div id="ionContentModalOrdenes">
          <div style={{display:"flex", alignItems:"right", justifyContent:"right",width:"100%",height:"auto"}}>
            <IonIcon icon={close} onClick={() => volver()} slot="right" id="flecha-cerrar">  </IonIcon>
          </div>
          <IonTitle>ESPERE PRESUPUESTO DEL PROVEEDOR</IonTitle>
            
            <IonCard id="ionCard-explorerContainer-Proveedor">
                <img id="img-orden" src={props.datos.imagen_proveedor}></img>
                <div id="divSentencias">
                  <p style={{fontSize:"1em", color:"black"}}>TIPO: {props.datos.tipo}</p>
                  <p style={{fontSize:"1em", color:"black"}}>STATUS: {props.estado}</p>
                  <p style={{fontSize:"1em", color:"black"}}>TICKET: {props.datos.ticket}</p>
                </div>
                <IonGrid>
                    <IonRow>

                    <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosProveedor")}>
                        <IonRow id="ionrow-homecliente">
                        <IonIcon icon={eye} /> </IonRow>
                        <IonRow id="ionrow-homecliente"><small>VER DATOS PROVEEDOR</small></IonRow>
                      </IonCol>

                    <IonCol id="ioncol-homecliente" onClick={() => props.setVista("chat")}>
                        <IonRow id="ionrow-homecliente">
                        <IonIcon icon={chatbox} /> </IonRow>
                        <IonRow id="ionrow-homecliente"><small>CHAT PROVEEDOR</small></IonRow>
                      </IonCol>

                    </IonRow>
                </IonGrid>
            </IonCard>
            
            <IonCard id="ionCard-explorerContainer-Proveedor">
                <div id="divSentencias">
                    <p style={{fontSize:"1em", color:"black"}}>FECHA DE SOLICITUD: {props.datos.fecha_creacion}</p>
                    <p style={{fontSize:"1em", color:"black"}}>TÍTULO: {props.datos.titulo}</p>
                    <p style={{fontSize:"1em", color:"black"}}>DESCRIPCIÓN DE LA SOLICITUD: </p>        
                    <p style={{fontSize:"1em", color:"black"}}>{props.datos.descripcion}</p>
                </div>
            </IonCard>
            
            <IonCard id="ionCard-explorerContainer-Proveedor">
                <Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}  ticket={props.datos.ticket} tipo={props.datos.tipo} ></Imagenes>
            </IonCard>
        
            <IonItemDivider style={{margin:"35px 0px 0px 0px"}}></IonItemDivider>

            <div id="titulo">
                <strong>PEDIDO DE MÁS INFORMACIÓN</strong>
            </div>
        
            <IonCard id="ionCard-explorerContainer-Proveedor">
                <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", width:"90%", height:"auto"}}>
                    <h2 style={{fontWeight:"100", fontSize:"1em"}}>PREGUNTA PROVEEDOR:</h2>
                </div>
                <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", width:"90%", height:"auto"}}>
                    <p style={{fontWeight:"600", fontSize:"1.2em", marginBottom:"15px"}}>{props.datos.pedido_mas_información}</p>
                </div>
                <IonItemDivider style={{margin:"35px 0px 0px 0px"}}></IonItemDivider>
                <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", width:"90%", height:"auto"}}>
                    <h2 style={{fontWeight:"100", fontSize:"1em"}}>RESPUESTA SUMINISTRADA AL PROVEEDOR:</h2>
                </div>
                <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", width:"90%", height:"auto"}}>
                    <p style={{fontWeight:"600", fontSize:"1.2em", marginBottom:"15px"}}>{props.datos.respuesta_cliente_pedido_mas_información}</p>
                </div>
                <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", width:"90%", height:"auto"}}>
                    <h2 style={{fontWeight:"100", fontSize:"1em"}}>IMÁGENES SUMINISTRADAS:</h2>
                </div>
                <Imagenes2 picture1={props.datos.picture1_mas_información} picture2={props.datos.picture2_mas_información} />
            </IonCard>
  
            <IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >CANCELAR ORDEN</IonButton>

            <IonAlert
                isOpen={showAlertRechazarOrden}
                onDidDismiss={() => setShowAlertRechazarOrden(false)}
                cssClass='my-custom-class'
                header={'¿DESEA CANCELAR LA ORDEN?'}
                subHeader={''}
                mode='ios'
                message={'Agregar una indicación de por qué es mala rechazar ordenes'}
                buttons={[
                  {
                    text: 'SI',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: blah => {
                        props.cancelarOrden();
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

          </div>
      </IonContent>
  )
}



const OrdenPresupuestada = ( props:{datos:any, setVolver:any, setVista:any, setEstado:any, estado:any, cancelarOrden:any} )=>{

  const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false)

  const aceptarPresupuesto = () => {

    var formDataToUpload = new FormData();
    formDataToUpload.append("ticket",props.datos.ticket)
    const axios = require('axios');
    axios({
        url:url+"orden/presupuesto/cliente",
        method:'POST',
        headers: {"content-type": "multipart/form-data"},
        data:formDataToUpload
    }).then(function(res: any){

      if(res.data=="ok"){
          props.setEstado("ORDEN ACEPTADA")
          props.setVista("enEsperaDelPRoveedor")
          props.datos.status="ACE"
          setDB(props.datos.ticket+"cliente", "ACE")

      }

    }).catch((error: any) =>{
//              setVista(0)
        //Network error comes in
    });
}

        return(
            <IonContent>
                <div id="ionContentModalOrdenes">
                    <div id="modalProveedor-flechaVolver">
                        <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
                    </div>

                    <IonTitle>SOLICITUD PRESUPUESTADA</IonTitle>  
                    <IonCard id="ionCard-explorerContainer-Proveedor">
                        <div id="divSentencias">
                            <p style={{fontSize:"1em", color:"black"}}>TIPO: {props.datos.tipo}</p>
                             <p style={{fontSize:"1em", color:"black"}}>STATUS: {props.estado}</p>
                             <p style={{fontSize:"1em", color:"black"}}>TICKET: {props.datos.ticket}</p>
                        </div>
                        <IonGrid>
                            <IonRow> 
                                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosProveedor")}>
                                    <IonRow id="ionrow-homecliente">
                                        <IonIcon icon={eye} /> 
                                    </IonRow>
                                    <IonRow id="ionrow-homecliente">
                                        <small>VER DATOS PROVEEDOR</small>
                                    </IonRow>
                                </IonCol>
                                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("chat")}>
                                    <IonRow id="ionrow-homecliente">
                                        <IonIcon icon={chatbox} /> </IonRow>
                                    <IonRow id="ionrow-homecliente">
                                        <small>CHAT PROVEEDOR</small>
                                    </IonRow>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCard>
                    
                    <IonCard id="ionCard-explorerContainer-Proveedor">
                        <Imagenes picture1={props.datos.picture1} picture2={props.datos.picture2}  ticket={props.datos.ticket} tipo={props.datos.tipo} ></Imagenes>
                    </IonCard>
                    
                    <IonItemDivider />

                    <Presupuesto presupuesto={props.datos.presupuesto} />

                    <FechaProgramadaPorProveedor hora={props.datos.hora} dia={props.datos.dia} setVista={props.setVista} />
                    
                    <InfoIntercambiada 
                      pedido_mas_información={props.datos.pedido_mas_información} 
                      respuesta_cliente_pedido_mas_información={props.datos.respuesta_cliente_pedido_mas_información}
                      picture1_mas_información={props.datos.picture1_mas_información}
                      picture2_mas_información={props.datos.picture2_mas_información} 
                    />
                    
                    
                    <div id="botonCentral">
                        <div id="botonCentralIzquierda">
                            <IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >CANCELAR ORDEN</IonButton>
                        </div>
                        <div id="botonCentralDerecha">  
                            <IonButton shape="round" color="warning" id="botonContratar" onClick={() => aceptarPresupuesto()}>ACEPTAR PRESUPUESTO</IonButton>
                        </div>
                    </div>
                    
                    <IonAlert
                        isOpen={showAlertRechazarOrden}
                        onDidDismiss={() => setShowAlertRechazarOrden(false)}
                        cssClass='my-custom-class'
                        header={'¿DESEA CANCELAR LA ORDEN?'}
                        subHeader={''}
                        message={'Agregar una indicación de por qué es mala rechazar ordenes'}
                        buttons={[
                          {
                            text: 'SI',
                            role: 'cancel',
                            cssClass: 'secondary',
                            handler: blah => {
                                props.cancelarOrden();
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
                </div>
            </IonContent>
        )
   
    
}


const EnEsperaDelProveedor = (props:{datos:any, setVolver:any, setVista:any, setEstado:any, estado:any, cancelarOrden:any} )=>{

  const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false)
  //const [showAlertUbicacion,setShowAlertUbicacion] = useState(false)


  const volver = () => {
    props.setVolver(false)
    window.location.reload()
  }

      return (
        <IonContent>
              <div id="ionContentModalOrdenes">
                    <div style={{display:"flex", alignItems:"right", justifyContent:"right",width:"100%",height:"auto"}}>
                        <IonIcon icon={close} onClick={() => volver()} slot="right" id="flecha-cerrar">  </IonIcon>
                    </div>
                  <IonTitle>ORDEN ACEPTADA </IonTitle>  
                  <IonTitle>ESPERE AL PROVEEDOR</IonTitle>  
  
          
                  <IonCard id="ionCard-explorerContainer-Proveedor">
                      <img id="img-orden" src={props.datos.imagen_proveedor}></img>
                      <div id="divSentencias">
                          <p style={{fontSize:"1em", color:"black"}}>TIPO: {props.datos.tipo}</p>
                          <p style={{fontSize:"1em", color:"black"}}>STATUS: {props.estado}</p>
                          <p style={{fontSize:"1em", color:"black"}}>TICKET: {props.datos.ticket}</p>
                      </div>
                      <IonGrid>
                          <IonRow>  
                          <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosProveedor")}>
                              <IonRow id="ionrow-homecliente">
                              <IonIcon icon={eye} /> </IonRow>
                              <IonRow id="ionrow-homecliente"><small>VER DATOS PROVEEDOR</small></IonRow>
                            </IonCol>

                            <IonCol id="ioncol-homecliente" onClick={() => props.setVista("chat")}>
                              <IonRow id="ionrow-homecliente">
                              <IonIcon icon={chatbox} /> </IonRow>
                              <IonRow id="ionrow-homecliente"><small>CHAT PROVEEDOR</small></IonRow>
                            </IonCol>              

                          </IonRow>
                      </IonGrid>
                  </IonCard>

                  <IonCard id="ionCard-explorerContainer-Proveedor">
                      <div id="divSentencias">
                          <p style={{fontSize:"1em", color:"black"}}>FECHA DE SOLICITUD: {props.datos.fecha_creacion}</p>
                          <p style={{fontSize:"1em", color:"black"}}>TÍTULO: {props.datos.titulo}</p>
                          <p style={{fontSize:"1em", color:"black"}}>DESCRIPCIÓN DE LA SOLICITUD: </p>        
                          <p style={{fontSize:"1em", color:"black"}}>{props.datos.descripcion}</p>
                      </div>
                  </IonCard>
    
                  <IonCard id="ionCard-explorerContainer-Proveedor">
                      <Imagenes picture1={props.datos.picture1} picture2={props.datos.picture2}  ticket={props.datos.ticket} tipo={props.datos.tipo} ></Imagenes>
                  </IonCard>

                  <IonItemDivider />

                  <Presupuesto presupuesto={props.datos.presupuesto} />

                  <FechaProgramadaPorProveedor hora={props.datos.hora} dia={props.datos.dia} setVista={props.setVista} />

                  <InfoIntercambiada 
                      pedido_mas_información={props.datos.pedido_mas_información} 
                      respuesta_cliente_pedido_mas_información={props.datos.respuesta_cliente_pedido_mas_información}
                      picture1_mas_información={props.datos.picture1_mas_información}
                      picture2_mas_información={props.datos.picture2_mas_información} 
                    />
    
                  <IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >CANCELAR ORDEN</IonButton>
          
                  <IonAlert
                      isOpen={showAlertRechazarOrden}
                      onDidDismiss={() => setShowAlertRechazarOrden(false)}
                      cssClass='my-custom-class'
                      header={'¿DESEA CANCELAR LA ORDEN?'}
                      subHeader={''}
                      mode='ios'
                      message={'Agregar una indicación de por qué es mala rechazar ordenes'}
                      buttons={[
                        {
                          text: 'SI',
                          role: 'cancel',
                          cssClass: 'secondary',
                          handler: blah => {
                              props.cancelarOrden();
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
              </div>
          </IonContent>
      )
  
}

const OrdenEnViaje = ( props:{datos:any, setVolver:any, setVista:any, setEstado:any, estado:any, cancelarOrden:any} )=>{

  const respuesta_informacion=useRef("")
  const [showAlertCancelarOrden,setShowAlertCancelarOrden] = useState(false)


  const setShowAlertUbicacion = () =>{

  }
  
    //ACA ACEPTAR PRESUPUESTO 
    return (
      <IonContent>
        <div id="ionContentModalOrdenes">
      <div id="modalProveedor-flechaVolver">
        <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
      </div>

      <IonTitle>PROVEEDOR EN VIAJE</IonTitle>  

      <IonCard id="ionCard-explorerContainer-Proveedor">
            <img id="img-orden" src={props.datos.imagen_proveedor}></img>
            <div id="divSentencias">
              <p style={{fontSize:"1em", color:"black"}}>TIPO: {props.datos.tipo}</p>
              <p style={{fontSize:"1em", color:"black"}}>STATUS: {props.estado}</p>
              <p style={{fontSize:"1em", color:"black"}}>TICKET: {props.datos.ticket}</p>
            </div>
  
            <IonGrid>
              <IonRow>  

              <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosProveedor")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={eye} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER DATOS PROVEEDOR</small></IonRow>
                </IonCol>

                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("chat")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={chatbox} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>CHAT PROVEEDOR</small></IonRow>
                </IonCol>
                
              </IonRow>
            </IonGrid>
          </IonCard>
    
          <IonCard id="ionCard-explorerContainer-Proveedor">
            <div id="divSentencias">
              <p style={{fontSize:"1em", color:"black"}}>FECHA DE SOLICITUD: {props.datos.fecha_creacion}</p>
              <p style={{fontSize:"1em", color:"black"}}>TÍTULO: {props.datos.titulo}</p>
              <p style={{fontSize:"1em", color:"black"}}>DESCRIPCIÓN DE LA SOLICITUD: </p>        
              <p style={{fontSize:"1em", color:"black"}}>{props.datos.descripcion}</p>
            </div>
          </IonCard>
    
          <div id="titulo">
          <strong>IMÁGENES ADJUNTAS</strong>
        </div>
        <IonCard id="ionCard-explorerContainer-Proveedor">
        < Imagenes2   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes2>
        </IonCard>
  
        <IonItemDivider style={{margin:"35px 0px 0px 0px"}}></IonItemDivider>

        <Presupuesto presupuesto={props.datos.presupuesto} />

        <FechaProgramadaPorProveedor hora={props.datos.hora} dia={props.datos.dia} setVista={props.setVista} />

        <InfoIntercambiada 
                      pedido_mas_información={props.datos.pedido_mas_información} 
                      respuesta_cliente_pedido_mas_información={props.datos.respuesta_cliente_pedido_mas_información}
                      picture1_mas_información={props.datos.picture1_mas_información}
                      picture2_mas_información={props.datos.picture2_mas_información} 
                    />

      
          
      <IonButton color="warning" id="botonContratar" onClick={() => setShowAlertCancelarOrden(true)}>CANCELAR ORDEN</IonButton>

    <IonAlert
              isOpen={showAlertCancelarOrden}
              onDidDismiss={() => setShowAlertCancelarOrden(false)}
              cssClass='my-custom-class'
              header={'¿DESEA RECHAZAR LA ORDEN?'}
              subHeader={''}
              mode='ios'
              message={'Agregar una indicación de por qué es mala rechazar ordenes'}
              buttons={[
                {
                  text: 'SI',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: blah => {
                    props.cancelarOrden();
                  },  
                
                },
                {
                  text: 'NO',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: blah => {
                    setShowAlertCancelarOrden(false);
                  }
                }
              ]} />
                
      </div>
    </IonContent>

    )
  
}

const Finalizada = ( props:{datos:any, setVolver:any, setVista:any, setEstado:any, estado:any} )=>{

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
          url:url+"orden/finalizar/cliente",
          method:'POST',
          headers: {"content-type": "multipart/form-data"},
          data:formDataToUpload
      }).then(function(res: any){
  
        if(res.data=="ok"){
            props.datos.status="RED"
            props.setVolver(false)
            createStore("ordenesActivas")
            removeDB(props.datos.ticket.toString())
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

          <h2 style={{ fontSize: "1em", color: "black" }}>INGRESE LA CALIFICACIÓN DEL CLIENTE</h2>
          <Calificacion calificacion={calificacion} ></Calificacion>

          <h2 style={{ fontSize: "1em", color: "black" }}>¿DESEA INGRESAR UNA RESEÑA DEL CLIENTE?</h2>
          <IonItem id="item-completarInfo">
            <IonLabel position="floating">RESEÑA</IonLabel>
            <IonInput onIonInput={(e: any) => reseña.current=(e.target.value)}></IonInput>

          </IonItem>

        </IonCard>
    
     <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => enviar()} >ENVIAR CALIFICACIÓN</IonButton>
   
          <IonAlert
                isOpen={showAlertCalificacion}
                onDidDismiss={() => setShowAlertCalificacion(false)}
                cssClass='my-custom-class'
                header={'CALIFICACIÓN'}
                subHeader={''}
                message={'Debe ingresra una calificación para el cliente'}
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
      </IonContent>)

}

export const VerDatosProveedor = (props:{ticket:any, tipo:any,latitud:any, longitud:any,setVista:any, rubro:any, desdeDondeEstoy:any})  =>{

  const [datosCliente, setDatosCliente] = useState <datos_proveedor>({
    nombre:"",
    apellido:"",
    imagen:"",
    calificacion: 0
  })
  
  useEffect(() => { 
  axios.get(url+"orden/datoproveedor/"+props.ticket+"/"+props.tipo+"/"+props.rubro                                ).then((resp: { data: any; }) => {

    if (resp.data!="bad"){
      setDatosCliente(resp.data)
    }
  }) 
}, []);

const [showAlertUbicacion,setShowAlertUbicacion] =useState(false)

  return (
    <IonContent>
      <div id="ionContentModalOrdenes">
      <div id="modalProveedor-flechaVolver">
        <IonIcon icon={arrowBack} onClick={() => props.setVista(props.desdeDondeEstoy.current)} slot="start" id="flecha-volver">  </IonIcon>
      </div>
      <IonCard id="ionCard-explorerContainer-Proveedor">
        <img id="img-orden" src={datosCliente.imagen}></img>
        <p style={{fontSize:"1em", color:"black"}}>NOMBRE: {datosCliente.nombre}</p>
        <p style={{fontSize:"1em", color:"black"}}>APELLIDO: {datosCliente.apellido}</p>
        <p style={{fontSize:"1em", color:"black"}}>CALIFICACIÓN: {datosCliente.calificacion}</p>

        <IonGrid>
        <IonRow>
          
        <IonCol id="ioncol-homecliente"  onClick={() =>setShowAlertUbicacion(true) }  >
            <IonRow id="ionrow-homecliente">
            <IonIcon icon={location} /> </IonRow>
            <IonRow id="ionrow-homecliente"><small>UBICACIÓN PROVEEDOR</small></IonRow>
          </IonCol>

          <IonCol id="ioncol-homecliente" onClick={() => props.setVista("chat")}>
            <IonRow id="ionrow-homecliente">
            <IonIcon icon={chatbox} /> </IonRow>
            <IonRow id="ionrow-homecliente"><small>CHAT PROVEEDOR</small></IonRow>
          </IonCol>

          </IonRow>
    </IonGrid>


  </IonCard>

           <IonAlert
              isOpen={showAlertUbicacion}
              onDidDismiss={() => setShowAlertUbicacion(false)}
              cssClass='my-custom-class'
              header={'UBICACIÓN DEL PROVEEDOR'}
              subHeader={''}
              message={'El proveedor debe estar en camino para ver su ubicación'}
              buttons={['OK']}
              />
  </div>
  </IonContent>
       
);
}



const Imagenes = (props:{picture1:any,picture2:any, ticket:any, tipo:any})=>{

  const [agregarFotografia, setAgregarFotografia]=useState(false)
  const [badResponse, setBadResponse]=useState(false)


  const foto1Mostrar= useRef <String>()
  const foto2Mostrar= useRef <String>()

  const foto1= useRef <Blob>()
  const foto2= useRef <Blob>()

  const enviarFoto = ()=>{

    if ((foto1.current!=null || foto1.current!=undefined) && (foto2.current!=null || foto2.current!=undefined) ){
      var formDataToUpload = new FormData();

      if(foto1.current!=null || foto1.current!=undefined){
        formDataToUpload.append("imagen1", foto1.current);
        
      }
      if(foto2.current!=null || foto2.current!=undefined){
        formDataToUpload.append("imagen2", foto2.current); 
      }
      formDataToUpload.append("ticket", props.ticket)
      formDataToUpload.append("tipo", props.tipo)
  
  
  
    const axios = require('axios');
    axios({
        url:url+"orden/agregarfoto",
        method:'POST',
        headers: {"content-type": "multipart/form-data"},
        data:formDataToUpload
    }).then(function(res: any){
      if(res.data!="bad"){
        setAgregarFotografia(false)
    }else{
      setBadResponse(true)
    }
  
    })
    }else{
      setAgregarFotografia(false)

    }
    

  }

  if(!badResponse){
    if(!agregarFotografia){
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
          <>
          <div id="CardProveedoresImg"><img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture1}></img>
          </div>
          <IonGrid><IonRow>
          <IonCol id="ioncol-homecliente"onClick={() => setAgregarFotografia(true)}>
            <IonRow id="ionrow-homecliente">
            <IonIcon icon={camera} /> </IonRow>
            <IonRow id="ionrow-homecliente"><small>CARGAR OTRA IMÁGEN</small></IonRow>
          </IonCol></IonRow>
          </IonGrid>
          </>
        )
      }
      else if(props.picture1=="" && props.picture2!="" ){
        return(
          <>
          <div id="CardProveedoresImg"><img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture2}></img>
          </div>
          <IonGrid><IonRow>
          <IonCol id="ioncol-homecliente"onClick={() => setAgregarFotografia(true)}>
            <IonRow id="ionrow-homecliente">
            <IonIcon icon={camera} /> </IonRow>
            <IonRow id="ionrow-homecliente"><small>CARGAR OTRA IMÁGEN</small></IonRow>
          </IonCol></IonRow>
          </IonGrid>          </>
        )
      }else{
        return(
          <><div id="CardProveedoresImg">
            <p id="pChico">NO HA ADJUNTADO IMÁGENES DE REFERENCIA PARA ESTE SERVICIO</p>
          </div>
          <IonGrid><IonRow>
          <IonCol id="ioncol-homecliente"onClick={() => setAgregarFotografia(true)}>
            <IonRow id="ionrow-homecliente">
            <IonIcon icon={camera} /> </IonRow>
            <IonRow id="ionrow-homecliente"><small>CARGAR OTRA IMÁGEN</small></IonRow>
          </IonCol></IonRow>
          </IonGrid>          </>
    
        ) }
    }else{
      if(props.picture1!="" && props.picture2==""){
        return (
          <div id="CardProveedoresImg">
  
          <TomarFotografia imagen={foto2Mostrar} setFilepath={foto2} />
          <IonButton id="botonContratar" onClick={() => enviarFoto()}>ENVIAR FOTO</IonButton>
          </div>
        )
      }else if(props.picture1=="" && props.picture2!="" ){
        return(
          <div id="CardProveedoresImg">
          <TomarFotografia imagen={foto1Mostrar} setFilepath={foto1} />
          <IonButton id="botonContratar" onClick={() => enviarFoto()}>ENVIAR FOTO</IonButton>
  
          </div>
        )}else{
          return(
            <div id="CardProveedoresImg">
            <TomarFotografia imagen={foto1Mostrar} setFilepath={foto1} />
            <TomarFotografia imagen={foto2Mostrar} setFilepath={foto2} />
            <IonButton id="botonContratar" onClick={() => enviarFoto()}>ENVIAR FOTO</IonButton>
  
  
            </div>
          )
  
        }
    
   
    }
  }else{
    return(
    <div id="CardProveedoresImg">
      <p>ERROR AL CARGAR LAS IMÁGENES. INTENTE MÁS TARDE</p>
      <IonButton id="botonContratar" onClick={() => setBadResponse(false)}>OK</IonButton>


    </div>
)
  }




}

const Imagenes2 = (props:{picture1:any,picture2:any})=>{
  console.log("a ver las imágenes: "+props.picture1)
  console.log("a ver las imágenes: "+props.picture2)
  if(props.picture1!="" && props.picture1!=undefined && props.picture2!="" && props.picture2!=undefined){
    return(
      <div id="CardProveedoresImg">
        <img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture1}></img>
        <img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture2}></img>
        </div>
    )
  }
  else if((props.picture1!="" && props.picture1!=undefined) && (props.picture2=="" || props.picture2==undefined)){
    return(
      <div id="CardProveedoresImg"><img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture1}></img>
      </div>
    )
  }
  else if( (props.picture1=="" || props.picture1==undefined) && (props.picture2!="" && props.picture2!=undefined) ){
    return(
      <div id="CardProveedoresImg"><img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture2}></img>
      </div>
    )
  }else{
    return(
      <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", width:"90%", height:"auto"}}>
            <p style={{fontWeight:"600", fontSize:"1.2em", marginBottom:"15px"}}>NO HA ADJUNTADO IMÁGENES DE REFERENCIA</p>
          </div>
      
    )
  }
}



const InfoIntercambiada = (props:{pedido_mas_información:any, respuesta_cliente_pedido_mas_información:any, picture1_mas_información:any, picture2_mas_información:any}) => 
{

  let respuesta="No ha sido suministrada"
  useEffect(() => {
    if (props.respuesta_cliente_pedido_mas_información==""){
      respuesta="No ha sido suministrada"
    }else{
      respuesta=props.respuesta_cliente_pedido_mas_información
    }
  }, []);

  if (props.pedido_mas_información!=""){
    return (
      <><div id="titulo">
        <strong>PEDIDO DE MÁS INFORMACIÓN</strong>
      </div><IonCard id="ionCard-explorerContainer-Proveedor">
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "90%", height: "auto" }}>
            <h2 style={{ fontWeight: "100", fontSize: "1em" }}>PREGUNTA PROVEEDOR:</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "90%", height: "auto" }}>
            <p style={{ fontWeight: "600", fontSize: "1.2em", marginBottom: "15px" }}>{props.pedido_mas_información}</p>
          </div>
          <IonItemDivider style={{ margin: "35px 0px 0px 0px" }}></IonItemDivider>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "90%", height: "auto" }}>
            <h2 style={{ fontWeight: "100", fontSize: "1em" }}>RESPUESTA SUMINISTRADA AL PROVEEDOR:</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "90%", height: "auto" }}>
            <p style={{ fontWeight: "600", fontSize: "1.2em", marginBottom: "15px" }}>{respuesta}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "90%", height: "auto" }}>
            <h2 style={{ fontWeight: "100", fontSize: "1em" }}>IMÁGENES SUMINISTRADAS:</h2>
          </div>
          <Imagenes2 picture1={props.picture1_mas_información} picture2={props.picture2_mas_información} />
        </IonCard></>
    )

  }else{
    return(<></>)
  }
  
}


const Presupuesto = ( props:{presupuesto:any}) => 
{
  return (
    <>
     
      <IonCard id="ionCard-explorerContainer-Proveedor">
          <h1 style={{ fontSize: "1em", color: "black" }}>PRESUPUESTO DEL PROVEEDOR:</h1>
          <img style={{width:"32px", height:"32px"}} src={"./assets/icon/presupuesto.png"} />
          <IonItemDivider />
          <h2 style={{ fontSize: "1em", color: "blue" }}>{props.presupuesto}</h2>
      </IonCard>
    </>
  )
}


const FechaProgramadaPorProveedor = ( props:{hora:any, dia:any, setVista:any}) => {

  return (

    <IonCard id="ionCard-explorerContainer-Proveedor">
      <h1 style={{ fontSize: "1em", color: "black", marginTop: "20px" }}>FECHA Y HORA DE VISITA ESTIMATIVA:</h1>
      <img style={{width:"32px", height:"32px"}} src={"./assets/icon/fecha.png"} />
      <IonItemDivider />
      <h2 style={{ fontSize: "1em", color: "black" }}>DÍA DE VISITA PROPUESTA</h2>
      <h2 style={{ fontSize: "0.9em", color: "blue" }}>{props.dia}</h2>
      <h2 style={{ fontSize: "1em", color: "black" }}>HORA DE VISITA PROPUESTA</h2>
      <h2 style={{ fontSize: "0.9em", color: "blue" }}>{props.hora} hs.</h2>

      <IonButton shape="round" style={{width:"50%", marginTop:"15px", marginBottom:"32px"}} onClick={() => props.setVista("chat")}>SOLICITAR CAMBIO DE FECHA</IonButton>
    </IonCard>

  );

}

const RechazarOrden = (props:{datos:any, setVolver:any, setVista:any, estado:any, setEstado:any})=>{


  const motivoRechazo= useRef("")
  const [showAlertOrdenMotivo, setShowAlertOrdenMotivo]=useState(false)

  const enviarRechazo = () =>{

    if (motivoRechazo.current==""){
      setShowAlertOrdenMotivo(true)
    }else{
      axios.get(url+"orden/cancelar/"+props.datos.ticket+"/"+props.datos.tipo+"/"+"CAN/"+motivoRechazo.current, {timeout: 7000})
      .then((resp: { data: any; }) => {
        console.log("SE BORRO" +resp.data)

        if(resp.data!="bad"){
          
          removeDB(props.datos.ticket+"cliente").then( ()=>{
            removeDB("ordenes").then( ()=>{
              props.setEstado("ORDEN RECHAZADA")
              props.setVista("cancelarOrden")
              props.setVolver(false)
              window.location.reload()
            })
          })
          
        }
       })
    }

  }

  return (

    <IonContent>

      <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100vh",background:"#f3f2ef" }}>

        <div style={{ display:"flex",flexDirection:"column", width:"100%",  height:"auto", alignItems:"center", justifyContent:"center"}}>
          <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
          </div>
          <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
            <h1>RECHAZAR ORDEN</h1>
          </div>
        </div>                            

      <div style={{display:"flex",flexDirection:"column", alignItems:"center", justifyContent:"center" ,width:"100%",  height:"100%"}}>
        <IonCard style={{display:"flex",flexDirection:"column",width:"90%", height:"auto"}}>
          <h1 style={{fontSize:"1em", color:"black", alignSelf:"left"}}>MOTIVO DE RECHAZO DE ORDEN</h1>

            <IonItem style={{width:"100%",margin:"25px 0px 25px 0px"}}>
              <IonLabel position="floating">INGRESE MOTIVO DEL RECHAZO </IonLabel>
              <IonTextarea cols={25} autoGrow={true} onIonInput={(e: any) => motivoRechazo.current = (e.target.value)}></IonTextarea>
            </IonItem>
          </IonCard>
      </div>
      <div style={{ display:"flex",flexDirection:"column", alignItems:"center", justifyContent:"center" ,width:"100%",  height:"auto"}}>
        <IonButton shape="round" color="danger"  id="botonContratar" onClick={() => enviarRechazo()} >RECHAZAR ORDEN</IonButton>  
      </div>

      </div>


    <IonAlert
              isOpen={showAlertOrdenMotivo}
              onDidDismiss={() => setShowAlertOrdenMotivo(false)}
              cssClass='my-custom-class'
              header={'MOTIVO'}
              subHeader={''}
              mode='ios'
              message={"Debe ingresar un motivo para rechazar la orden"}
              buttons={[
                {
                  text: 'OK',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: blah => {
                    setShowAlertOrdenMotivo(false);
                  }
                }
              ]} 
        />

    </IonContent>

  )
}

export default ModalVerOrdenesClienteGenerales;
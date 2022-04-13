import { arrowBack, camera, chatbox, eye, location, logoWindows } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { isConstructorDeclaration, isSetAccessorDeclaration } from "typescript";

import Https from "../../utilidades/HttpsURL";
import '../ModalGeneral/Modal.css';

import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import axios from "axios";
import { Calificacion } from "./ModalVerOrdenesProveedor";
import { createStore, removeDB } from "../../utilidades/dataBase";
import Chat from "../Chat/Chat";
import { IonAlert, IonButton, IonCard, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonRow, IonTitle } from "@ionic/react";
import { ordenesCliente } from "../../pages/Home/HomeCliente";
import { TomarFotografia } from "../../pages/PedirOrdenes/PedirOrden";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";

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

const ModalVerOrdenesCliente = (props:{datos:any,emailCliente:any, setVolver:any})  =>{
    const [vista, setVista] = useState("primero")

    const [estado, setEstado] =useState("Enviada")

   // const [showAlertInconvenienteChat, setShowAlertInconvenienteChat] = useState(false)
   
    const desdeDondeEstoy=useRef("")

    
    useEffect(() => {
        
          if (props.datos.status=="ENV"){
              setEstado("GENERADA")
            }else if(props.datos.status=="REC"){
              setEstado("ORDEN RECIBIDA POR PROVEEDOR")
            }else if(props.datos.status=="ABI"){
              setEstado("ORDEN RECIBIDA POR PROVEEDOR")
            }else if(props.datos.status=="PEI"){
              
              if(props.datos.respuesta_cliente_pedido_mas_información!="0" && props.datos.respuesta_cliente_pedido_mas_información!=undefined){
                setEstado("ORDEN CON SOLCITUD DE MÁS INFORMACIÓN")
                setVista("respuestaEnviada")
              }else{
                setEstado("ORDEN CON SOLCITUD DE MÁS INFORMACIÓN")
                setVista("masinfo")
              }
              
            } else if(props.datos.status=="PRE"){
              setEstado("ORDEN PRE ACEPTADA POR PROVEEDOR")
              setVista("preaceptada")
            }else if(props.datos.status=="ACE"){
              setEstado("ORDEN ACEPTADA")
              setVista("enEsperaDelPRoveedor")
            }else if(props.datos.status=="EVI"){
              setEstado("PROVEEDOR EN VIAJE")
              setVista("proveedorEnViaje")

            }else if(props.datos.status=="ENS"){
              setEstado("PROVEEDOR EN SITIO")
            }else if(props.datos.status=="RED"){
              setVista("finalizada")
            }
        
      }, [vista])


    

      const cancelarOrden = ()=> {

          axios.get(url+"orden/cambiarestado/"+props.datos.ticket+"/"+props.datos.tipo+"/"+"CAN", {timeout: 7000})
          .then((resp: { data: any; }) => {
            if(resp.data!="bad"){
              console.log("se cancelò")
              setEstado("ORDEN RECHAZADA")
              setVista("cancelarOrden")

              createStore("ordenesActivas")
              removeDB(props.datos.ticket.toString())

              props.setVolver(false)
              window.location.reload()

            }
           })
        

      }
   
      if(vista=="primero"){
        desdeDondeEstoy.current="primero"

        return (
          < Primero datos={props.datos} setVista={setVista} estado={estado} setEstado={setEstado}
          setVolver={props.setVolver} cancelarOrden={cancelarOrden} />

      );
      }else if(vista=="masinfo"){
        desdeDondeEstoy.current="masinfo"


        return(
          < PedidoMasInfo datos={props.datos} setVista={setVista} estado={estado} setEstado={setEstado}
          setVolver={props.setVolver} cancelarOrden={cancelarOrden}/>
        )

      } else if (vista=="preaceptada"){
        desdeDondeEstoy.current="preaceptada"

        return(
          <OrdenPreAceptada datos={props.datos} setVista={setVista} estado={estado} setEstado={setEstado}
          setVolver={props.setVolver} cancelarOrden={cancelarOrden}/>
  
        )
      }else if(vista=="respuestaEnviada"){
        desdeDondeEstoy.current="respuestaEnviada"
        return(
          <RespuestaEnviada datos={props.datos} setVista={setVista} estado={estado} setEstado={setEstado}
          setVolver={props.setVolver} cancelarOrden={cancelarOrden} />
          )
      } else if (vista=="enEsperaDelPRoveedor"){
        desdeDondeEstoy.current="enEsperaDelPRoveedor"
        return(
          <EnEsperaDelProveedor datos={props.datos} setVista={setVista} estado={estado} setEstado={setEstado}
          setVolver={props.setVolver} cancelarOrden={cancelarOrden} />
          )
      }else if(vista=="proveedorEnViaje"){
        desdeDondeEstoy.current="proveedorEnViaje"
        return(
          <OrdenEnViaje datos={props.datos} setVista={setVista} estado={estado} setEstado={setEstado}
          setVolver={props.setVolver} cancelarOrden={cancelarOrden} />
        )
      }else if(vista=="finalizada"){
        return(
        <Finalizada datos={props.datos} setVista={setVista} estado={estado} setEstado={setEstado}
          setVolver={props.setVolver} />
        )
      } else if (vista=="datosProveedor"){

        return (
        < VerDatosProveedor ticket={props.datos.ticket} tipo={props.datos.tipo} latitud={props.datos.location_lat} longitud={props.datos.location_long} setVista={setVista}  />
        )
      }else if (vista=="chat") {
        return(
        <>
        <Chat email={props.emailCliente}  ticket={props.datos.ticket} setVolver={props.setVolver} setVista={setVista} desdeDondeEstoy={desdeDondeEstoy.current}/>
        
        </>
        )
      }else if (vista=="cancelarOrden") {
        return(
        <>        
        </>
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
  const [showAlertUbicacion,setShowAlertUbicacion] = useState(false)

return (
  <IonContent >
    <div id="ionContentModalOrdenes">
          <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
          </div>
        <IonCard id="ionCard-explorerContainer-Proveedor">

          <img id="img-orden" src={props.datos.imagen_proveedor}></img>

          <div id="divSentencias">
          <p >TIPO: {props.datos.tipo.toUpperCase()}</p>
          <p >STATUS: {props.estado}</p>
          <p >TICKET: {props.datos.ticket}</p>
          </div>

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
                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosProveedor")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={eye} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER DATOS PROVEEDOR</small></IonRow>
                </IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>
  
        <div id="titulo">
        <IonTitle >DATOS DE ORDEN DE SERVICIO</IonTitle>  
        </div>
        <IonCard id="ionCard-explorerContainer-Proveedor">

          <div id="divSentencias">
            <p>FECHA DE SOLICITUD: {props.datos.fecha_creacion}</p>
            <p>TÍTULO: {props.datos.titulo}</p>
            <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
            <p>{props.datos.descripcion}</p>
          </div>
        </IonCard>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}  ticket={props.datos.ticket} tipo={props.datos.tipo} ></Imagenes>
        </IonCard>
  
        
        <IonCol><IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >CANCELAR ORDEN</IonButton></IonCol>

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
              }
            ]} />

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
             
)

}

const PedidoMasInfo = ( props:{datos:any, setVolver:any, setVista:any, setEstado:any, estado:any, cancelarOrden:any} )=>{

  const respuesta_informacion=useRef("")
  const foto1Mostrar= useRef <String>()
  const foto2Mostrar= useRef <String>()

  const foto1= useRef <Blob>()
  const foto2= useRef <Blob>()

  const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false)
  const [showAlertUbicacion,setShowAlertUbicacion] = useState(false)

  const enviarMasInfo = () =>{

    if(respuesta_informacion.current!=""){
      var formDataToUpload = new FormData();
      formDataToUpload.append("ticket",props.datos.ticket)
      formDataToUpload.append("respuesta_informacion",respuesta_informacion.current)

      if(foto1.current!=null || foto1.current!=undefined){
        formDataToUpload.append("imagen1", foto1.current);
      }
      if(foto2.current!=null || foto2.current!=undefined){
        formDataToUpload.append("imagen2", foto2.current); 
      }
      
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
                  }
    
                  
                
                }).catch((error: any) =>{
      //              setVista(0)
                    //Network error comes in
                });
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
            <p>TIPO: {props.datos.tipo}</p>
            <p>STATUS: {props.estado}</p>
            <p>TICKET: {props.datos.ticket}</p>
          </div>
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
                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosProveedor")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={eye} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER DATOS PROVEEDOR</small></IonRow>
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

  )
}


const OrdenPreAceptada = ( props:{datos:any, setVolver:any, setVista:any, setEstado:any, estado:any, cancelarOrden:any} )=>{


  const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false)
  const [showAlertUbicacion,setShowAlertUbicacion] = useState(false)

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
      }

      
    
    }).catch((error: any) =>{
//              setVista(0)
        //Network error comes in
    });
}


    //ACA ACEPTAR PRESUPUESTO 
    if(props.datos.pedido_mas_información!=""){

      return(
        <IonContent>
        <div id="ionContentModalOrdenes">
          <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
          </div>

      <IonTitle>SOLICITUD PRESUPUESTADA</IonTitle>  
      <IonCard id="ionCard-explorerContainer-Proveedor">
        <div id="divSentencias">
          <p>TIPO: {props.datos.tipo}</p>
          <p>STATUS: {props.estado}</p>
          <p>TICKET: {props.datos.ticket}</p>
        </div>

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
            <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosProveedor")}>
              <IonRow id="ionrow-homecliente">
              <IonIcon icon={eye} /> </IonRow>
              <IonRow id="ionrow-homecliente"><small>VER DATOS PROVEEDOR</small></IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCard>

      <IonCard id="ionCard-explorerContainer-Proveedor">
            < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}  ticket={props.datos.ticket} tipo={props.datos.tipo} ></Imagenes>
          </IonCard>

      <IonItemDivider />

      <div id="contenedorcentro">
      <IonTitle>PRESUPUESTO DEL TRABAJO</IonTitle>  
      </div>
     
      <IonCard id="ionCard-explorerContainer-Proveedor">
        <h1 style={{fontSize:"1.2em", color:"black"}}>PRESUPUESTO RECIBIDO:</h1>
        <h2 style={{fontSize:"1.2em", color:"blue"}}>{props.datos.presupuesto}</h2>
      </IonCard>

      <div style={{display:"flex", flexDirection:"column", textAlign:"center", width:"100%", height:"auto"}}>
            <h1 style={{fontSize:"1.2em"}}>INFORMACIÓN INTERCAMBIADA</h1>
          </div>
          <IonCard id="ionCard-explorerContainer-Proveedor">
          <h1 style={{fontSize:"1em", color:"black", marginTop:"20px"}}>INFORMACIÓN SOLICITADA AL CLIENTE:</h1>
          <h2 style={{fontSize:"1em", color:"blue"}}>{props.datos.pedido_mas_información}</h2>
          <IonItemDivider />

            <h1 style={{fontSize:"1em", color:"black"}}>RESPUESTA:</h1>
            <h2 style={{fontSize:"1em", color:"blue"}}>{props.datos.respuesta_cliente_pedido_mas_información}</h2>
            
            <Imagenes2 picture1={props.datos.picture1_mas_información} picture2={props.datos.picture2_mas_información} />
          </IonCard>

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

      )
    }else{
    return (
      <IonContent>
        <div id="ionContentModalOrdenes">
          <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
          </div>

      <IonTitle>SOLICITUD PRESUPUESTADA</IonTitle>  
      <IonCard id="ionCard-explorerContainer-Proveedor">
        <div id="divSentencias">
          <p>TIPO: {props.datos.tipo}</p>
          <p>STATUS: {props.estado}</p>
          <p>TICKET: {props.datos.ticket}</p>
        </div>

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
            <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosProveedor")}>
              <IonRow id="ionrow-homecliente">
              <IonIcon icon={eye} /> </IonRow>
              <IonRow id="ionrow-homecliente"><small>VER DATOS PROVEEDOR</small></IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCard>

      <IonCard id="ionCard-explorerContainer-Proveedor">
        < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}  ticket={props.datos.ticket} tipo={props.datos.tipo} ></Imagenes>
      </IonCard>

      <IonItemDivider />

      <div id="contenedorcentro">
      <IonTitle>PRESUPUESTO DEL TRABAJO</IonTitle>  
      </div>
     
      <IonCard id="ionCard-explorerContainer-Proveedor">
        <div id="divSentencias">
          <p>PRESUPUESTO:</p>
          <p>{props.datos.presupuesto}</p>
        </div>
      </IonCard>

      <IonCard id="ionCard-explorerContainer-Proveedor">
            <h1 style={{fontSize:"1.2em", color:"black"}}>PRESUPUESTO RECIBIDO:</h1>
            <h2 style={{fontSize:"1.2em", color:"blue"}}>{props.datos.presupuesto}</h2>

        </IonCard>

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

    )
  }

}

const RespuestaEnviada  = (props:{datos:any, setVolver:any, setVista:any, setEstado:any, estado:any, cancelarOrden:any} )=>{
  
  const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false)
  const [showAlertUbicacion,setShowAlertUbicacion] = useState(false)

  return (

    <IonContent>
      <div id="ionContentModalOrdenes">
          <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
          </div>
          <IonTitle>ESPERE PRESUPUESTO DEL PROVEEDOR</IonTitle>  

        <IonCard id="ionCard-explorerContainer-Proveedor">
          <img id="img-orden" src={props.datos.imagen_proveedor}></img>
          <div id="divSentencias">
          <p>TIPO: {props.datos.tipo}</p>
          <p>STATUS: {props.estado}</p>
          <p>TICKET: {props.datos.ticket}</p>
          </div>

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

          <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosProveedor")}>
            <IonRow id="ionrow-homecliente">
            <IonIcon icon={eye} /> </IonRow>
            <IonRow id="ionrow-homecliente"><small>VER DATOS PROVEEDOR</small></IonRow>
          </IonCol>
        
        </IonRow>
    </IonGrid>
        </IonCard>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          <div id="divSentencias">
            <p>FECHA DE SOLICITUD: {props.datos.fecha_creacion}</p>
            <p>TÍTULO: {props.datos.titulo}</p>
            <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
            <p>{props.datos.descripcion}</p>
          </div>
        </IonCard>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}  ticket={props.datos.ticket} tipo={props.datos.tipo} ></Imagenes>
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

<IonAlert
              isOpen={showAlertUbicacion}
              onDidDismiss={() => setShowAlertUbicacion(false)}
              cssClass='my-custom-class'
              header={'UBICACIÓN DEL PROVEEDOR'}
              subHeader={''}
              message={'El proveedor debe estar en camino para ver su ubicación'}
              buttons={['OK']}
              />
        </IonContent>

  )
}

const EnEsperaDelProveedor = (props:{datos:any, setVolver:any, setVista:any, setEstado:any, estado:any, cancelarOrden:any} )=>{

  const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false)
  const [showAlertUbicacion,setShowAlertUbicacion] = useState(false)


  if(props.datos.pedido_mas_información!=""){
    return (

      <IonContent>
        <div id="ionContentModalOrdenes">
            <div id="modalProveedor-flechaVolver">
              <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
            </div>
            <IonTitle>ORDEN ACEPTADA </IonTitle>  
            <IonTitle>ESPERE AL PROVEEDOR</IonTitle>  
  
          <IonCard id="ionCard-explorerContainer-Proveedor">
            <img id="img-orden" src={props.datos.imagen_proveedor}></img>
            <div id="divSentencias">
              <p>TIPO: {props.datos.tipo}</p>
              <p>STATUS: {props.estado}</p>
              <p>TICKET: {props.datos.ticket}</p>
            </div>
  
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
                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosProveedor")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={eye} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER DATOS PROVEEDOR</small></IonRow>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCard>
    
          <IonCard id="ionCard-explorerContainer-Proveedor">
            <div id="divSentencias">
              <p>FECHA DE SOLICITUD: {props.datos.fecha_creacion}</p>
              <p>TÍTULO: {props.datos.titulo}</p>
              <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
              <p>{props.datos.descripcion}</p>
            </div>
          </IonCard>
    
          <IonCard id="ionCard-explorerContainer-Proveedor">
            < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}  ticket={props.datos.ticket} tipo={props.datos.tipo} ></Imagenes>
          </IonCard>

          
      <IonItemDivider />

      <div id="contenedorcentro">
      <IonTitle>PRESUPUESTO DEL TRABAJO</IonTitle>  
      </div>

      <IonCard id="ionCard-explorerContainer-Proveedor">
        <h1 style={{fontSize:"1.2em", color:"black"}}>PRESUPUESTO RECIBIDO:</h1>
        <h2 style={{fontSize:"1.2em", color:"blue"}}>{props.datos.presupuesto}</h2>
      </IonCard>

      <div style={{display:"flex", flexDirection:"column", textAlign:"center", width:"100%", height:"auto"}}>
            <h1 style={{fontSize:"1.2em"}}>INFORMACIÓN INTERCAMBIADA</h1>
          </div>
          <IonCard id="ionCard-explorerContainer-Proveedor">
          <h1 style={{fontSize:"1em", color:"black", marginTop:"20px"}}>INFORMACIÓN SOLICITADA AL CLIENTE:</h1>
          <h2 style={{fontSize:"1em", color:"blue"}}>{props.datos.pedido_mas_información}</h2>
          <IonItemDivider />

            <h1 style={{fontSize:"1em", color:"black"}}>RESPUESTA:</h1>
            <h2 style={{fontSize:"1em", color:"blue"}}>{props.datos.respuesta_cliente_pedido_mas_información}</h2>
            
            <Imagenes2 picture1={props.datos.picture1_mas_información} picture2={props.datos.picture2_mas_información} />
          </IonCard>
    
          
          <IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >CANCELAR ORDEN</IonButton>
          
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
  
    )
  }else{
    return (

      <IonContent>
        <div id="ionContentModalOrdenes">
            <div id="modalProveedor-flechaVolver">
              <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
            </div>
            <IonTitle>ORDEN ACEPTADA </IonTitle>  
            <IonTitle>ESPERE AL PROVEEDOR</IonTitle>  
  
          <IonCard id="ionCard-explorerContainer-Proveedor">
            <img id="img-orden" src={props.datos.imagen_proveedor}></img>
            <div id="divSentencias">
              <p>TIPO: {props.datos.tipo}</p>
              <p>STATUS: {props.estado}</p>
              <p>TICKET: {props.datos.ticket}</p>
            </div>
  
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
                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosProveedor")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={eye} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER DATOS PROVEEDOR</small></IonRow>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCard>
    
          <IonCard id="ionCard-explorerContainer-Proveedor">
            <div id="divSentencias">
              <p>FECHA DE SOLICITUD: {props.datos.fecha_creacion}</p>
              <p>TÍTULO: {props.datos.titulo}</p>
              <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
              <p>{props.datos.descripcion}</p>
            </div>
          </IonCard>
    
          <IonCard id="ionCard-explorerContainer-Proveedor">
            < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}  ticket={props.datos.ticket} tipo={props.datos.tipo} ></Imagenes>
          </IonCard>
    
          
          <IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >CANCELAR ORDEN</IonButton>
          
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
  
    )
  }
  
}

const OrdenEnViaje = ( props:{datos:any, setVolver:any, setVista:any, setEstado:any, estado:any, cancelarOrden:any} )=>{

  const respuesta_informacion=useRef("")
  const [showAlertCancelarOrden,setShowAlertCancelarOrden] = useState(false)


  const setShowAlertUbicacion = () =>{

  }
  if(props.datos.pedido_mas_información=="" ){
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
              <p>TIPO: {props.datos.tipo}</p>
              <p>STATUS: {props.estado}</p>
              <p>TICKET: {props.datos.ticket}</p>
            </div>
  
            <IonGrid>
              <IonRow>  
                <IonCol id="ioncol-homecliente"  onClick={() =>setShowAlertUbicacion() }  >
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={location} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>UBICACIÓN PROVEEDOR</small></IonRow>
                  </IonCol>
                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("chat")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={chatbox} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>CHAT PROVEEDOR</small></IonRow>
                </IonCol>
                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosProveedor")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={eye} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER DATOS PROVEEDOR</small></IonRow>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCard>
    
          <IonCard id="ionCard-explorerContainer-Proveedor">
            <div id="divSentencias">
              <p>FECHA DE SOLICITUD: {props.datos.fecha_creacion}</p>
              <p>TÍTULO: {props.datos.titulo}</p>
              <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
              <p>{props.datos.descripcion}</p>
            </div>
          </IonCard>
    
          <div id="titulo">
          <strong>IMÁGENES ADJUNTAS</strong>
        </div>
        <IonCard id="ionCard-explorerContainer-Proveedor">
        < Imagenes2   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes2>
        </IonCard>
  
        <IonItemDivider style={{margin:"35px 0px 0px 0px"}}></IonItemDivider>
        
        <div id="titulo">
          <strong>PRESUPUESTO DEL TRABAJO</strong>
        </div>

      <IonCard id="ionCard-explorerContainer-Proveedor">
        <h1 style={{fontSize:"1.2em", color:"black"}}>PRESUPUESTO RECIBIDO:</h1>
        <h2 style={{fontSize:"1.2em", color:"blue"}}>{props.datos.presupuesto}</h2>
      </IonCard>

      
          
      <IonButton color="warning" id="botonContratar" onClick={() => setShowAlertCancelarOrden(true)}>CANCELAR ORDEN</IonButton>

    <IonAlert
              isOpen={showAlertCancelarOrden}
              onDidDismiss={() => setShowAlertCancelarOrden(false)}
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
  else if(props.datos.pedido_mas_información!="" ){
      return (
        <IonContent>
          <div id="ionContentModalOrdenes">
        <div id="modalProveedor-flechaVolver">
          <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
        </div>

      <IonTitle>PROVEEDOR EN VIAJE</IonTitle>  
      <IonCard id="ionCard-explorerContainer-Proveedor">
        <div id="divSentencias">
          <p>TIPO: {props.datos.tipo}</p>
          <p>STATUS: {props.estado}</p>
          <p>TICKET: {props.datos.ticket}</p>
        </div>
        <IonGrid>
          <IonRow>
          
            <IonCol id="ioncol-homecliente"   onClick={() =>verUbicacion(props.datos.location_lat, props.datos.location_long) } >
              <IonRow id="ionrow-homecliente">
                <IonIcon icon={location} /> </IonRow>
              <IonRow id="ionrow-homecliente"><small>UBICACIÓN PROVEEDOR</small></IonRow>
            </IonCol>

            <IonCol id="ioncol-homecliente" onClick={() => props.setVista("chat")}>
              <IonRow id="ionrow-homecliente">
                <IonIcon icon={chatbox} /> </IonRow>
              <IonRow id="ionrow-homecliente"><small>CHAT PROVEEDOR</small></IonRow>
            </IonCol>

            <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosProveedor")}>
              <IonRow id="ionrow-homecliente">
                <IonIcon icon={eye} /> </IonRow>
              <IonRow id="ionrow-homecliente"><small>VER DATOS PROVEEDOR</small></IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCard>

      <IonCard id="ionCard-explorerContainer-Proveedor">
        <div id="divSentencias">
          <p>FECHA DE SOLICITUD:</p>
          <p>{props.datos.fecha_creacion}</p>
          <p>TÍTULO:</p>
          <p>{props.datos.titulo}</p>
          <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
          <p>{props.datos.descripcion}</p>
        </div>
      </IonCard>

        <div id="titulo">
          <strong>IMÁGENES ADJUNTAS</strong>
        </div>
        <IonCard id="ionCard-explorerContainer-Proveedor">
        < Imagenes2   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes2>
        </IonCard>
  
        <IonItemDivider style={{margin:"35px 0px 0px 0px"}}></IonItemDivider>
        
        <div id="titulo">
          <strong>PRESUPUESTO DEL TRABAJO</strong>
        </div>

      <IonCard id="ionCard-explorerContainer-Proveedor">
        <h1 style={{fontSize:"1.2em", color:"black"}}>PRESUPUESTO RECIBIDO:</h1>
        <h2 style={{fontSize:"1.2em", color:"blue"}}>{props.datos.presupuesto}</h2>
      </IonCard>

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

  
      <IonButton color="danger" id="botonContratar" onClick={() => setShowAlertCancelarOrden(true)}>CANCELAR ORDEN</IonButton>

      <IonAlert
              isOpen={showAlertCancelarOrden}
              onDidDismiss={() => setShowAlertCancelarOrden(false)}
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
  }else{

  }
  return (
    <IonContent>
      <div id="ionContentModalOrdenes">
    <div id="modalProveedor-flechaVolver">
      <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
    </div>asdfasdf
  <IonCard id="ionCard-explorerContainer-Proveedor">
    <img id="img-orden" src={props.datos.imagen_proveedor}></img>
    <div id="divSentencias">
      <p>TIPO: {props.datos.tipo}</p>
      <p>STATUS: {props.estado}</p>
      <p>TICKET: {props.datos.ticket}</p>
    </div>
    <IonGrid>
        <IonRow>
          
        <IonCol id="ioncol-homecliente"   onClick={() =>verUbicacion(props.datos.location_lat, props.datos.location_long) } >
            <IonRow id="ionrow-homecliente">
            <IonIcon icon={location} /> </IonRow>
            <IonRow id="ionrow-homecliente"><small>UBICACIÓN PROVEEDOR</small></IonRow>
          </IonCol>

        <IonCol id="ioncol-homecliente" onClick={() => props.setVista("chat")}>
            <IonRow id="ionrow-homecliente">
            <IonIcon icon={chatbox} /> </IonRow>
            <IonRow id="ionrow-homecliente"><small>CHAT PROVEEDOR</small></IonRow>
          </IonCol>

          <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosProveedor")}>
            <IonRow id="ionrow-homecliente">
            <IonIcon icon={eye} /> </IonRow>
            <IonRow id="ionrow-homecliente"><small>VER DATOS PROVEEDOR</small></IonRow>
          </IonCol>
        
        </IonRow>
    </IonGrid>
  </IonCard>
 
 </div>
  </IonContent>
);

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

        <div id="contenedorcentro">
        <IonGrid>
        <IonRow><IonCol>
            <IonTitle>TRABAJO REALIZADO</IonTitle>
            </IonCol></IonRow>
            <IonRow><IonCol>   
            <p id="pcentrado">COMPLETE LOS SIGUIENTES CAMPOS</p>
            </IonCol></IonRow>
            </IonGrid>
          </div>
          
          <IonCard id="ionCardModalCentro">


        <p>INGRESE LA CALIFICACIÓN DEL CLIENTE</p>
        <Calificacion calificacion={calificacion} ></Calificacion>

        <p>¿DESEA INGRESAR UNA RESEÑA DEL CLIENTE=?</p>
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

const VerDatosProveedor = (props:{ticket:any, tipo:any,latitud:any, longitud:any,setVista:any})  =>{

  const [datosCliente, setDatosCliente] = useState <datos_proveedor>({
    nombre:"",
    apellido:"",
    imagen:"",
    calificacion: 0
  })
  
  useEffect(() => { 
  axios.get(url+"orden/datoproveedor/"+props.ticket+"/"+props.tipo).then((resp: { data: any; }) => {

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
        <IonIcon icon={arrowBack} onClick={() => props.setVista("primero")} slot="start" id="flecha-volver">  </IonIcon>
      </div>
      <IonCard id="ionCard-explorerContainer-Proveedor">
        <img id="img-orden" src={datosCliente.imagen}></img>
        <p>NOMBRE: {datosCliente.nombre}</p>
        <p>APELLIDO: {datosCliente.apellido}</p>
        <p>CALIFICACIÓN: {datosCliente.calificacion}</p>

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



export default ModalVerOrdenesCliente;
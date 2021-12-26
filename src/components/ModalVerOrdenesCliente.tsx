import { IonAlert, IonButton, IonCard, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonRow, IonTitle } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { isConstructorDeclaration, isSetAccessorDeclaration } from "typescript";

import Https from "../utilidades/HttpsURL";
import './Modal.css';

import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import axios from "axios";
import { TomarFotografia } from "../pages/Orden";

const url=Https

interface datos_proveedor {
    nombre:string
    apellido:string
    imagen:string
    calificacion: number
  }

const verUbicacion = (latitud:any, longitud:any) =>{


    const link="https://www.google.com/maps/search/?api=1&query="+latitud+"%2C"+longitud
    const win= window.open(   link, '_blank')?.focus();
    
  }

const ModalVerOrdenesCliente = (props:{datos:any,emailCliente:any,setVolver:any})  =>{
    const [vista, setVista] = useState("primero")

    const [estado, setEstado] =useState("Enviada")

    const [showAlertInconvenienteChat, setShowAlertInconvenienteChat] = useState(false)
    const [showAlertOrdenAceptada, setShowAlertOrdenAceptada] = useState(false)
    const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false)


    useEffect(() => {
        
   
            if (props.datos.status=="ENV"){
              setEstado("GENERADA")
        
            }else if(props.datos.status=="REC"){
              setEstado("ORDEN RECIBIDA POR PROVEEDOR")
            }else if(props.datos.status=="PRE"){
              setEstado("ORDEN PRE ACEPTADA POR PROVEEDOR")
              setVista("preaceptada")
            }else if(props.datos.status=="ACE"){
              setEstado("ORDEN ACEPTADA")
              setVista("enEsperaDelPRoveedor")
            }else if(props.datos.status=="EVI"){
              setEstado("PROVEEDOR EN VIAJE")
            }else if(props.datos.status=="ENS"){
              setEstado("PROVEEDOR EN SITIO")
            }
        
      }, [])


    

      const cancelarOrden = ()=> {

        if (estado=="ORDEN ACEPTADA POR PROVEEDOR"){

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
          <img id="img-orden" src={props.datos.imagen_proveedor}></img>
          <p>TIPO: {props.datos.tipo}</p>
          <p>STATUS: {estado}</p>
          <p>TICKET: {props.datos.ticket}</p>
          <IonButton  id="botonContratar" onClick={() => setVista("datosClientes")} >DATOS DEL PROVEEDOR</IonButton>
        </IonCard>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          <p>FECHA DE SOLICITUD: {props.datos.fecha_creacion}</p>
          <p>TÍTULO: {props.datos.titulo}</p>
          <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
          <p>{props.datos.descripcion}</p>
          <IonButton  id="botonContratar" onClick={() =>verUbicacion(props.datos.location_lat, props.datos.location_long) } >VER UBICACIÓN DEL PROVEEDOR</IonButton>

        </IonCard>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}  ticket={props.datos.ticket} tipo={props.datos.tipo} ></Imagenes>
        </IonCard>
  
        <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => setVista("chat")} >CHAT</IonButton>
        
        <IonCol><IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >CANCELAR ORDEN</IonButton></IonCol>

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
                    cancelarOrden();
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
        < VerDatosProveedor ticket={props.datos.ticket} tipo={props.datos.tipo} latitud={props.datos.location_lat} longitud={props.datos.location_long} setVista={setVista}  />
        )
      }else if (vista=="chat") {
        return(
        <><Chatear estado={estado} email_proveedor={props.datos.email_proveedor} email_cliente={props.emailCliente} setVista={setVista} setAlert={setShowAlertInconvenienteChat} />
        
        <IonAlert
            isOpen={showAlertInconvenienteChat}
            onDidDismiss={() => setShowAlertInconvenienteChat(false)}
            cssClass='my-custom-class'
            header={'NO ES POSIBLE ABRIR COMUNICACIÓN CON EL PROVEEDOR'}
            subHeader={''}
            message={'Para poder dialogar con el proveedor este debe aceptar la orden de trabajo'}
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
      }else if (vista=="preaceptada"){

        return(
          <OrdenPreAceptada datos={props.datos} setVista={setVista} estado={estado} setEstado={setEstado}
          setVolver={props.setVolver} />
        )
      }else if (vista=="enEsperaDelPRoveedor"){
        
        return(<IonContent>
          <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
          </div>
          <IonTitle>ORDEN ACEPTADA </IonTitle>  
          <IonTitle>ESPERE AL PROVEEDOR</IonTitle>  

        <IonCard id="ionCard-explorerContainer-Proveedor">
          <img id="img-orden" src={props.datos.imagen_proveedor}></img>
          <p>TIPO: {props.datos.tipo}</p>
          <p>STATUS: {estado}</p>
          <p>TICKET: {props.datos.ticket}</p>
          <IonButton  id="botonContratar" onClick={() => setVista("datosClientes")} >DATOS DEL PROVEEDOR</IonButton>
        </IonCard>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          <p>FECHA DE SOLICITUD: {props.datos.fecha_creacion}</p>
          <p>TÍTULO: {props.datos.titulo}</p>
          <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
          <p>{props.datos.descripcion}</p>
          <IonButton  id="botonContratar" onClick={() =>verUbicacion(props.datos.location_lat, props.datos.location_long) } >VER UBICACIÓN DEL PROVEEDOR</IonButton>

        </IonCard>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}  ticket={props.datos.ticket} tipo={props.datos.tipo} ></Imagenes>
        </IonCard>
  
        <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => setVista("chat")} >CHAT</IonButton>
        
        <IonCol><IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >CANCELAR ORDEN</IonButton></IonCol>
        </IonContent>)
      } else{

        return (
          <IonContent>
       
        </IonContent>
             
      );
      }
      
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
        <IonButton  id="botonContratar" onClick={() => verUbicacion(props.latitud, props.longitud) } >VER UBICACIÓN DEL PROVEEDOR</IonButton>

        <IonButton  id="botonContratar" onClick={() => props.setVista("chat")} >CHAT CON PROVEEDOR</IonButton>
  </IonCard>
  </IonContent>
       
);
}


const OrdenPreAceptada = ( props:{datos:any, setVolver:any, setVista:any, setEstado:any, estado:any} )=>{

  const respuesta_informacion=useRef("")
  const foto1Mostrar= useRef <String>()
  const foto2Mostrar= useRef <String>()

  const foto1= useRef <Blob>()
  const foto2= useRef <Blob>()

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

      console.log(res.data)
      if(res.data=="ok"){
          props.setEstado("ORDEN ACEPTADA")
          props.setVista("enEsperaDelPRoveedor")
      }

      
    
    }).catch((error: any) =>{
//              setVista(0)
        //Network error comes in
    });
}

  

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

                  console.log(res.data)
                  if(res.data=="ok"){
                      props.setEstado("ORDEN ACEPTADA")
                      props.setVista("enEsperaDelPRoveedor")
                  }
    
                  
                
                }).catch((error: any) =>{
      //              setVista(0)
                    //Network error comes in
                });
    }

  }

  if(props.datos.pedido_mas_información=="" &&props.datos.presupuesto_inicial!="0" ){
    //ACA ACEPTAR PRESUPUESTO 
    return (
      <IonContent>
      <div id="modalProveedor-flechaVolver">
        <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
      </div>

      <IonTitle>SOLICITUD PRESUPUESTADA</IonTitle>  
      <IonCard id="ionCard-explorerContainer-Proveedor">
        <p>TIPO: {props.datos.tipo}</p>
        <p>STATUS: {props.estado}</p>
        <p>TICKET: {props.datos.ticket}</p>
        <IonButton onClick={() => props.setVista("datosClientes")} >DATOS DEL PROVEEDOR</IonButton>
      </IonCard>

      <div id="tituloCardPRoveedor">
          <strong>PRESUPUESTO DEL TRABAJO</strong>
      </div>
      <IonCard id="ionCard-explorerContainer-Proveedor">
      <p>PRESUPUESTO: {props.datos.presupuesto_inicial}</p>
     
    </IonCard>
    <IonButton color="warning" id="botonContratar" onClick={() => aceptarPresupuesto()}>ACEPTAR PRESUPUESTO</IonButton>

    </IonContent>

    )
  }
  else if(props.datos.pedido_mas_información!="" &&props.datos.presupuesto_inicial=="0"){
      return (
        <IonContent>
        <div id="modalProveedor-flechaVolver">
          <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
        </div>

      <IonTitle>SOLICITUD DE MÁS INFORMACIÓN</IonTitle>  
      <IonCard id="ionCard-explorerContainer-Proveedor">
        <p>TIPO: {props.datos.tipo}</p>
        <p>STATUS: {props.estado}</p>
        <p>TICKET: {props.datos.ticket}</p>
        <IonButton onClick={() => props.setVista("datosClientes")} >DATOS DEL PROVEEDOR</IonButton>
      </IonCard>

      <div id="tituloCardPRoveedor">
          <strong>SOLICITUD DE MÁS INFORMACIÓN </strong>
      </div>
      <IonCard id="ionCard-explorerContainer-Proveedor">
        <p>MAS INFORMACIÓN REQUERIDA POR EL PROVEEDOR:</p> 
        <p>{props.datos.pedido_mas_información}</p> 
        <IonItemDivider></IonItemDivider>

        <IonItem id="item-Orden">
          <IonLabel position="floating">Respuesta</IonLabel>
          <IonInput onIonInput={(e: any) => respuesta_informacion.current = (e.target.value)}></IonInput>
        </IonItem>

        <p>Agregar Fotos:</p> 

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
      <IonButton color="warning" id="botonContratar" onClick={() => enviarMasInfo()}>RESPONDER</IonButton>


      </IonContent>

      )
  }else{

  }
  return (
    <IonContent>
    <div id="modalProveedor-flechaVolver">
      <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
    </div>
  <IonCard id="ionCard-explorerContainer-Proveedor">
    <img id="img-orden" src={props.datos.imagen_proveedor}></img>
    <p>TIPO: {props.datos.tipo}</p>
    <p>STATUS: {props.estado}</p>
    <p>TICKET: {props.datos.ticket}</p>
    <IonButton  id="botonContratar" onClick={() => props.setVista("datosClientes")} >DATOS DEL PROVEEDOR</IonButton>
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
          </div><IonButton id="botonContratar" onClick={() => setAgregarFotografia(true)}>CARGAR FOTO</IonButton></>
        )
      }
      else if(props.picture1=="" && props.picture2!="" ){
        return(
          <>
          <div id="CardProveedoresImg"><img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture2}></img>
          </div><IonButton id="botonContratar" onClick={() => setAgregarFotografia(true)}>CARGAR FOTO</IonButton></>
        )
      }else{
        return(
          <><div id="CardProveedoresImg">
            <p>NO HA ADJUNTADO IMÁGENES DE REFERENCIA PARA ESTE SERVICIO</p>
          </div><IonButton id="botonContratar" onClick={() => setAgregarFotografia(true)}>CARGAR FOTO</IonButton></>
    
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



export default ModalVerOrdenesCliente;
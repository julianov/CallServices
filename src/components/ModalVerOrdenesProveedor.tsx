import { IonAlert, IonButton, IonCard, IonCardSubtitle, IonCardTitle, IonCheckbox, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonLoading, IonRow, IonTitle } from "@ionic/react";
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
            }else if(props.datos.status=="PRE"){
              setEstado("PRESUPUESTADA")
              setVista("PRESUPUESTADA")
            }else if(props.datos.status=="ACE"){
              setEstado("ORDEN ACEPTADA")
              setVista("ACEPTADA")
            }else if(props.datos.status=="EVI"){
              setEstado("EN VIAJE")
              setVista("EN VIAJE")
            }else if(props.datos.status=="ENS"){
              setEstado("EN SITIO")
            }
        
      }, [])


      

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

      <Primero datos={props.datos} setVolver={props.setVolver} estado={estado} setEstado={setEstado} setVista={setVista} rechazarOrden={rechazarOrden} />
      )
  } else if (vista=="preaceptada") {
    return (
      <IonContent>
        <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
        </div>
        <Presupuestar setVista={setVista} setEstado={setEstado} ticket={props.datos.ticket} />
      </IonContent>
    )
  }else if(vista=="PRESUPUESTADA"){
    return (
      < Presupuestada datos={props.datos} estado={estado} setVolver={props.setVolver} setVista={setVista} rechazarOrden={rechazarOrden}  />
    )
  }else if(vista=="ACEPTADA"){
    return(
      < OrdenAceptada datos={props.datos} setVolver={props.setVolver} setVista={setVista} estado={estado} setEstado={setEstado} />
    )
  }else if(vista=="EN VIAJE"){
    return(
      < EnViaje datos={props.datos} setVolver={props.setVolver} setVista={setVista} estado={estado} setEstado={setEstado} />

    )
  }else if (vista=="datosClientes"){
    return (
      < VerDatosCliente ticket={props.datos.ticket} tipo={props.datos.tipo} latitud={props.datos.location_lat} longitud={props.datos.location_long} setVista={setVista}  />
    )
  }else if (vista=="chat") {
    return(
      <>
      <Chatear estado={estado} email_proveedor={props.emailProveedor} email_cliente={props.datos.email_cliente} setVista={setVista} setAlert={setShowAlertInconvenienteChat} />
        
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
  }
  else{
    return (
      <IonContent>
      </IonContent>
             
    );
  }
      
}

const Primero = (props:{datos:any, setVolver:any, estado:any, setEstado:any, 
 setVista:any, rechazarOrden:any})  =>{

  const [showAlertOrdenAceptada, setShowAlertOrdenAceptada] = useState(false)
  const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false)

  const aceptarOrden = ()=> {

    if (props.estado=="RECIBIDO"){
      axios.get(url+"orden/cambiarestado/"+props.datos.ticket+"/"+props.datos.tipo+"/"+"ABI", {timeout: 7000})
          .then((resp: { data: any; }) => {

            if(resp.data!="bad"){
              props.setEstado("ORDEN EN PROGRESO")
              setShowAlertOrdenAceptada(true)
            }
    

           })
    }
    
  }

  return ( 
    <IonContent>
        <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
        </div>
        <IonCard id="ionCard-explorerContainer-Proveedor">
          <img id="img-orden" src={props.datos.imagen_cliente}></img>
          <p>TIPO: {props.datos.tipo}</p>
          <p>STATUS: {props.estado}</p>
          <p>TICKET: {props.datos.ticket}</p>
          <IonButton  id="botonContratar" onClick={() => props.setVista("datosClientes")} >DATOS DE CLIENTE</IonButton>
        </IonCard>
        <IonCard id="ionCard-explorerContainer-Proveedor">
              <p>FECHA DE SOLICITUD:</p>
              <p>{props.datos.fecha_creacion}</p>
              <p>TÍTULO:</p>
              <p>{props.datos.titulo}</p>
              <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
              <p>{props.datos.descripcion}</p>
              <IonButton  id="botonContratar" onClick={() =>verUbicacion(props.datos.location_lat, props.datos.location_long) } >VER UBICACIÓN DEL CLIENTE</IonButton>
        </IonCard>
        <IonCard id="ionCard-explorerContainer-Proveedor">
              < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
        </IonCard>
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
              message={'Si está en condiciones de presupuestar el trabajo/servicio coloque precio'+"\n"+"Sino solicite más información"}
              buttons={[
                {
                  text: 'OK',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: blah => {
                    props.setVista("preaceptada");
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
              ]} />
      </IonContent>
  )
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


const Presupuestar = (props: {setVista:any,setEstado:any, ticket:any}) => {

  const [presupuestar, setPresupuestar]= useState(true)
  const precio=useRef ("0")
  const informacion= useRef("")

  const [showLoading, setShowLoading] =useState(false)

  const enviarPresupuesto = ()=>{
    if (precio.current!="0"){
      setShowLoading(true)
      var formDataToUpload = new FormData();
      formDataToUpload.append("precio", precio.current)
      formDataToUpload.append("ticket", props.ticket)
      formDataToUpload.append("estado", "PRE")
      formDataToUpload.append("tipoOrden","Orden general" )

      const axios = require('axios');
       axios({
        url:url+"orden/presupuesto/proveedor",
        method:'POST',
        headers: {"content-type": "multipart/form-data"},
        data:formDataToUpload
          }).then(function(res: any){
            setShowLoading(false)
            if(res.data!="bad"){
              props.setEstado("PRE")
              props.setVista("PRESUPUESTADA")
            }
    }).catch((error: any) =>{
      setShowLoading(false)
//              setVista(0)
        //Network error comes in
    });
    }

  }

  const masInformacion  = ()  =>{

    if (informacion.current!=""){
      var formDataToUpload = new FormData();
      formDataToUpload.append("masInfo", informacion.current)
      formDataToUpload.append("ticket", props.ticket)
      formDataToUpload.append("estado", "PRE")
      formDataToUpload.append("tipoOrden","Orden general" )

      const axios = require('axios');
      axios({
        url:url+"orden/masInfo/proveedor",
        method:'POST',
        headers: {"content-type": "multipart/form-data"},
        data:formDataToUpload
      }).then(function(res: any){

        if(res.data!="bad"){
          props.setEstado("PRE")
          props.setVista("PRESUPUESTADA")
        }
    }).catch((error: any) =>{
//              setVista(0)
        //Network error comes in
    });
    }

    
  }

  if (presupuestar){
    return (
      <><IonCardTitle>PRESUPUESTO</IonCardTitle>
      <IonCard id="ionCard-explorerContainer-Proveedor">

      <IonItem id="item-Orden">
        <IonLabel>SI</IonLabel>
        <IonCheckbox checked={presupuestar} onIonChange={e => setPresupuestar(e.detail.checked)} />
      </IonItem>

      <IonItem id="item-Orden">
        <IonLabel position="floating">INGRESE PRECIO ESTIMATIVO </IonLabel>
        <IonInput onIonInput={(e: any) => precio.current = (e.target.value)}></IonInput>
      </IonItem>
    </IonCard>
    <IonLoading
            cssClass='my-custom-class'
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            message={'Enviando respuesta...'}
            duration={7000}
          />

    <IonCol><IonButton shape="round" color="warning"  id="botonContratar" onClick={() => enviarPresupuesto()} >ENVIAR PRESUPUESTO</IonButton></IonCol>

    </>

  )
  }else{
    return(
      <>
      <IonCardTitle>PEDIR MÁS INFORMACIÓN</IonCardTitle>
      
      <IonCard id="ionCard-explorerContainer-Proveedor">
      <IonItem id="item-Orden">
        <IonLabel>SI</IonLabel>
        <IonCheckbox checked={presupuestar} onIonChange={e => setPresupuestar(e.detail.checked)} />
      </IonItem>
      
      <p>INDIQUE LA INFORMACIÓN QUE NECESITA DEL CLIENTE PARA PRESUPUESTAR</p>
      <IonItem id="item-Orden">
                <IonLabel position="floating">Pedido de información / comentarios</IonLabel>
                <IonInput onIonInput={(e: any) => informacion.current = (e.target.value)}></IonInput>
            </IonItem>

    </IonCard>
    
    <IonLoading
            cssClass='my-custom-class'
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            message={'Enviando respuesta...'}
            duration={7000}
          />

    <IonButton  color="warning"  id="botonContratar" onClick={() => masInformacion()}>RESPONDER AL CLIENTE</IonButton>
</>
    )
  }
 
  
}

const Presupuestada = (props:{datos:any, estado:any, setVolver:any, setVista:any, rechazarOrden:any})=> {

  const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false) 
  return (

    <IonContent>
        <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
        </div>
        <IonTitle>EN ESPERA DE RESPUESTA DEL CLIENTE</IonTitle>

        <IonCard id="ionCard-explorerContainer-Proveedor">
          <img id="img-orden" src={props.datos.imagen_cliente}></img>
          <p>TIPO: {props.datos.tipo}</p>
          <p>STATUS: {props.estado}</p>
          <p>TICKET: {props.datos.ticket}</p>
          <IonButton  id="botonContratar" onClick={() => props.setVista("datosClientes")} >DATOS DE CLIENTE</IonButton>
        </IonCard>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          <p>FECHA DE SOLICITUD:</p>
          <p>{props.datos.fecha_creacion}</p>
          <p>TÍTULO:</p>
          <p>{props.datos.titulo}</p>
          <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
          <p>{props.datos.descripcion}</p>
          <IonButton  id="botonContratar" onClick={() =>verUbicacion(props.datos.location_lat, props.datos.location_long) } >VER UBICACIÓN DEL CLIENTE</IonButton>
        </IonCard>

        <IonCard id="ionCard-explorerContainer-Proveedor">
          <p>PRESUPUESTO:</p>
          <p>{props.datos.presupuesto_inicial}</p>
          <p>INFORMACIÓN SOLICITADA AL CLIENTE:</p>
          <p>{props.datos.pedido_mas_información}</p>
        </IonCard>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
        </IonCard>
        <IonCol><IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton></IonCol>

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
            ]} />
        </IonContent>

  )
}

const OrdenAceptada = (props:{datos:any, setVolver:any, setVista:any, estado:any, setEstado:any})=>{

  const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false)
  const [showAlertEnViaje,setShowAlertEnViaje]= useState(false)

  const rechazarOrden = ()=> {

    if (props.estado=="ORDEN ACEPTADA"){

      axios.get(url+"orden/cambiarestado/"+props.datos.ticket+"/"+props.datos.tipo+"/"+"REX", {timeout: 7000})
      .then((resp: { data: any; }) => {
        if(resp.data!="bad"){
          props.setEstado("ORDEN RECHAZADA")
        }
       })
    }
  }
  const enviaje= ()=> {

    axios.get(url+"orden/cambiarestado/"+props.datos.ticket+"/"+props.datos.tipo+"/"+"EVI", {timeout: 7000})
    .then((resp: { data: any; }) => {
      if(resp.data!="bad"){
        props.setEstado("EN VIAJE")
      }
     })
  }

  

  if (props.datos.respuesta_cliente_pedido_mas_información!="" || props.datos.picture1_mas_información!=""|| props.datos.picture2_mas_información){
    return (
      <IonContent>
        <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
        </div>
        <IonTitle>RESPUESTA DEL CLIENTE</IonTitle>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          <img id="img-orden" src={props.datos.imagen_cliente}></img>
          <p>TIPO: {props.datos.tipo}</p>
          <p>STATUS: {props.estado}</p>
          <p>TICKET: {props.datos.ticket}</p>
          <IonButton  id="botonContratar" onClick={() => props.setVista("datosClientes")} >DATOS DE CLIENTE</IonButton>
        </IonCard>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          <p>FECHA DE SOLICITUD:</p>
          <p>{props.datos.fecha_creacion}</p>
          <p>TÍTULO:</p>
          <p>{props.datos.titulo}</p>
          <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
          <p>{props.datos.descripcion}</p>
          <IonButton  id="botonContratar" onClick={() =>verUbicacion(props.datos.location_lat, props.datos.location_long) } >VER UBICACIÓN DEL CLIENTE</IonButton>
        </IonCard>
  
        <div id="tituloCardPRoveedor">
          <strong>RESPUESTA DEL CLIENTE</strong>
        </div>
        <IonCard id="ionCard-explorerContainer-Proveedor">
          <p>RESPUESTA:</p>
          <p>{props.datos.respuesta_cliente_pedido_mas_información}</p>
          <p>INFORMACIÓN SOLICITADA AL CLIENTE:</p>
          <Imagenes picture1={props.datos.picture1_mas_información} picture2={props.datos.picture2_mas_información} />
        </IonCard>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
        </IonCard>

        <IonGrid>
        <IonRow>
        <IonCol><IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton></IonCol>   
        <IonCol><IonButton shape="round" color="warning"  id="botonContratar" onClick={() => setShowAlertEnViaje(true)} >EN VIAJE</IonButton></IonCol>   
        </IonRow>
        </IonGrid>
        <IonAlert
            isOpen={showAlertEnViaje}
            onDidDismiss={() => setShowAlertEnViaje(false)}
            cssClass='my-custom-class'
            header={'EN VIAJE'}
            subHeader={''}
            message={'¿Se está dirigiendo a la locación del cliente?'}
            buttons={[
              {
                text: 'SI',
                role: 'cancel',
                cssClass: 'secondary',
                handler: blah => {
                  enviaje();
                },  
               
              },
              {
                text: 'NO',
                role: 'cancel',
                cssClass: 'secondary',
                handler: blah => {
                  setShowAlertEnViaje(false);
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
    )

  }else{
    return(<IonContent>
      <div id="modalProveedor-flechaVolver">
          <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
      </div>
      <IonTitle>RESPUESTA DEL CLIENTE</IonTitle>

      <IonCard id="ionCard-explorerContainer-Proveedor">
        <img id="img-orden" src={props.datos.imagen_cliente}></img>
        <p>TIPO: {props.datos.tipo}</p>
        <p>STATUS: {props.estado}</p>
        <p>TICKET: {props.datos.ticket}</p>
        <IonButton  id="botonContratar" onClick={() => props.setVista("datosClientes")} >DATOS DE CLIENTE</IonButton>
      </IonCard>

      <IonCard id="ionCard-explorerContainer-Proveedor">
        <p>FECHA DE SOLICITUD:</p>
        <p>{props.datos.fecha_creacion}</p>
        <p>TÍTULO:</p>
        <p>{props.datos.titulo}</p>
        <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
        <p>{props.datos.descripcion}</p>
        <IonButton  id="botonContratar" onClick={() =>verUbicacion(props.datos.location_lat, props.datos.location_long) } >VER UBICACIÓN DEL CLIENTE</IonButton>
      </IonCard>

      <IonCard id="ionCard-explorerContainer-Proveedor">
        < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
      </IonCard>
      <IonGrid>
        <IonRow>
        <IonCol><IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton></IonCol>   
        <IonCol><IonButton shape="round" color="warning"  id="botonContratar" onClick={() => setShowAlertEnViaje(true)} >EN VIAJE</IonButton></IonCol>   
        </IonRow>
        </IonGrid>
        <IonAlert
            isOpen={showAlertEnViaje}
            onDidDismiss={() => setShowAlertEnViaje(false)}
            cssClass='my-custom-class'
            header={'EN VIAJE'}
            subHeader={''}
            message={'¿Se está dirigiendo a la locación del cliente?'}
            buttons={[
              {
                text: 'SI',
                role: 'cancel',
                cssClass: 'secondary',
                handler: blah => {
                  enviaje();
                },  
               
              },
              {
                text: 'NO',
                role: 'cancel',
                cssClass: 'secondary',
                handler: blah => {
                  setShowAlertEnViaje(false);
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
      
      </IonContent>)
  }
  
}

const EnViaje = (props:{datos:any, setVolver:any, setVista:any, estado:any, setEstado:any})=>{

  const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false)
  const [showAlertEnSitio,setShowAlertEnSitio]= useState(false)

  const rechazarOrden = ()=> {

    if (props.estado=="ORDEN ACEPTADA"){

      axios.get(url+"orden/cambiarestado/"+props.datos.ticket+"/"+props.datos.tipo+"/"+"REX", {timeout: 7000})
      .then((resp: { data: any; }) => {
        if(resp.data!="bad"){
          props.setEstado("ORDEN RECHAZADA")
        }
       })
    }
  }
  const enSitio= ()=> {

    axios.get(url+"orden/cambiarestado/"+props.datos.ticket+"/"+props.datos.tipo+"/"+"ENS", {timeout: 7000})
    .then((resp: { data: any; }) => {
      
      if(resp.data!="bad"){
        props.setEstado("EN SITIO")
      }
     })
  }

  

  if (props.datos.respuesta_cliente_pedido_mas_información!="" || props.datos.picture1_mas_información!=""|| props.datos.picture2_mas_información){
    return (
      <IonContent>
        <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
        </div>
        <h2>ACTUALMENTE EN VIAJE AL SITIO DEL CLIENTE</h2>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          <img id="img-orden" src={props.datos.imagen_cliente}></img>
          <p>TIPO: {props.datos.tipo}</p>
          <p>STATUS: {props.estado}</p>
          <p>TICKET: {props.datos.ticket}</p>
          <IonButton  id="botonContratar" onClick={() => props.setVista("datosClientes")} >DATOS DE CLIENTE</IonButton>
        </IonCard>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          <p>FECHA DE SOLICITUD:</p>
          <p>{props.datos.fecha_creacion}</p>
          <p>TÍTULO:</p>
          <p>{props.datos.titulo}</p>
          <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
          <p>{props.datos.descripcion}</p>
          <IonButton  id="botonContratar" onClick={() =>verUbicacion(props.datos.location_lat, props.datos.location_long) } >VER UBICACIÓN DEL CLIENTE</IonButton>
        </IonCard>
  
        <div id="tituloCardPRoveedor">
          <strong>RESPUESTA DEL CLIENTE</strong>
        </div>
        <IonCard id="ionCard-explorerContainer-Proveedor">
          <p>RESPUESTA:</p>
          <p>{props.datos.respuesta_cliente_pedido_mas_información}</p>
          <p>INFORMACIÓN SOLICITADA AL CLIENTE:</p>
          <Imagenes picture1={props.datos.picture1_mas_información} picture2={props.datos.picture2_mas_información} />
        </IonCard>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
        </IonCard>

        <IonGrid>
        <IonRow>
        <IonCol><IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton></IonCol>   
        <IonCol><IonButton shape="round" color="warning"  id="botonContratar" onClick={() => setShowAlertEnSitio(true)} >EN SITIO</IonButton></IonCol>   
        </IonRow>
        </IonGrid>
        <IonAlert
            isOpen={showAlertEnSitio}
            onDidDismiss={() => setShowAlertEnSitio(false)}
            cssClass='my-custom-class'
            header={'EN VIAJE'}
            subHeader={''}
            message={'¿Se está dirigiendo a la locación del cliente?'}
            buttons={[
              {
                text: 'SI',
                role: 'cancel',
                cssClass: 'secondary',
                handler: blah => {
                  enSitio();
                },  
               
              },
              {
                text: 'NO',
                role: 'cancel',
                cssClass: 'secondary',
                handler: blah => {
                  setShowAlertEnSitio(false);
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
    )

  }else{
    return(<IonContent>
      <div id="modalProveedor-flechaVolver">
          <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
      </div>
      <IonTitle>RESPUESTA DEL CLIENTE</IonTitle>

      <IonCard id="ionCard-explorerContainer-Proveedor">
        <img id="img-orden" src={props.datos.imagen_cliente}></img>
        <p>TIPO: {props.datos.tipo}</p>
        <p>STATUS: {props.estado}</p>
        <p>TICKET: {props.datos.ticket}</p>
        <IonButton  id="botonContratar" onClick={() => props.setVista("datosClientes")} >DATOS DE CLIENTE</IonButton>
      </IonCard>

      <IonCard id="ionCard-explorerContainer-Proveedor">
        <p>FECHA DE SOLICITUD:</p>
        <p>{props.datos.fecha_creacion}</p>
        <p>TÍTULO:</p>
        <p>{props.datos.titulo}</p>
        <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
        <p>{props.datos.descripcion}</p>
        <IonButton  id="botonContratar" onClick={() =>verUbicacion(props.datos.location_lat, props.datos.location_long) } >VER UBICACIÓN DEL CLIENTE</IonButton>
      </IonCard>

      <IonCard id="ionCard-explorerContainer-Proveedor">
        < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
      </IonCard>
      <IonGrid>
        <IonRow>
        <IonCol><IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton></IonCol>   
        <IonCol><IonButton shape="round" color="warning"  id="botonContratar" onClick={() => setShowAlertEnSitio(true)} >EN SITIO</IonButton></IonCol>   
        </IonRow>
        </IonGrid>
        <IonAlert
            isOpen={showAlertEnSitio}
            onDidDismiss={() => setShowAlertEnSitio(false)}
            cssClass='my-custom-class'
            header={'EN SITIO'}
            subHeader={''}
            message={'¿Ha llegado a la ubicación del cliente?'}
            buttons={[
              {
                text: 'SI',
                role: 'cancel',
                cssClass: 'secondary',
                handler: blah => {
                  enSitio();
                },  
               
              },
              {
                text: 'NO',
                role: 'cancel',
                cssClass: 'secondary',
                handler: blah => {
                  setShowAlertEnSitio(false);
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
      
      </IonContent>)
  }

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

export default ModalVerOrdenesProveedor

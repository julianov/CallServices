import { IonAlert, IonButton, IonCard, IonCardSubtitle, IonCardTitle, IonCheckbox, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonLoading, IonRow, IonTitle } from "@ionic/react";
import { arrowBack, chatbox, eye, location } from "ionicons/icons";
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

    const presupuestoValor = useRef("0")


    const precio = useRef ("")


    useEffect(() => {
            console.log("EL ESTADO ES: "+props.datos.status)
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
            }else if(props.datos.status=="ABI"){
              setEstado("RECIBIDO")
            }else if(props.datos.status=="PEI"){
              setEstado("PEDIDO INFORMACION")
              setVista("PEDIDO INFORMACION")
            } else if(props.datos.status=="PRE"){
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
              setVista("EN SITIO")
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
    
    <Presupuestar setVista={setVista} datos={props.datos} setEstado={setEstado} ticket={props.datos.ticket} setVolver={props.setVolver}  />
      
    )
  }else if(vista=="PRESUPUESTADA"){
    return (
      < Presupuestada datos={props.datos} estado={estado} setVolver={props.setVolver} setVista={setVista} rechazarOrden={rechazarOrden} />
    )
  }else if(vista=="PEDIDO INFORMACION"){
    return (
      < NuevaInfo datos={props.datos} estado={estado} setVista={setVista} setEstado={setEstado} setVolver={props.setVolver} rechazarOrden={rechazarOrden} />
    )
  }else if(vista=="ACEPTADA"){
    return(
      < OrdenAceptada datos={props.datos} setVolver={props.setVolver} setVista={setVista} estado={estado} setEstado={setEstado} />
    )
  }else if(vista=="EN VIAJE"){
    return(
      < EnViaje datos={props.datos} setVolver={props.setVolver} setVista={setVista} estado={estado} setEstado={setEstado} />
    )
  }else if(vista=="EN SITIO"){
    return(
      < EnSitio datos={props.datos} setVolver={props.setVolver} setVista={setVista} estado={estado} setEstado={setEstado} />
    )
  }else if (vista=="FINALIZAR"){
    return(
      < Finalizar datos={props.datos} setVolver={props.setVolver} setVista={setVista} estado={estado} setEstado={setEstado} />
    )
  } else if (vista=="datosClientes"){
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
  const [showAlertUbicacion,setShowAlertUbicacion]=useState(false)
  const aceptarOrden = ()=> {

    if (props.estado=="RECIBIDO"){
      axios.get(url+"orden/cambiarestado/"+props.datos.ticket+"/"+props.datos.tipo+"/"+"ABI", {timeout: 7000})
          .then((resp: { data: any; }) => {

            if(resp.data!="bad"){
              props.setEstado("ORDEN EN PROGRESO")
              setShowAlertOrdenAceptada(true)
              props.datos.status="ABI"
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
            <p>TIPO: {props.datos.tipo}</p>
            <p>STATUS: {props.estado}</p>
            <p>TICKET: {props.datos.ticket}</p>
          </div>
          <IonGrid>
            <IonRow>
              <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosClientes")}>
                <IonRow id="ionrow-homecliente">
                <IonIcon icon={eye} /> </IonRow>
                <IonRow id="ionrow-homecliente"><small>VER DATOS CLIENTE</small></IonRow>
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
          <IonGrid>
            <IonRow>
              <IonCol id="ioncol-homecliente"  onClick={() =>setShowAlertUbicacion(true) }   >
                <IonRow id="ionrow-homecliente">
                <IonIcon icon={location} /> </IonRow>
                <IonRow id="ionrow-homecliente"><small>VER UBICACIÓN CLIENTE</small></IonRow>
              </IonCol>
            </IonRow>
          </IonGrid>

        
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

            <IonAlert
              isOpen={showAlertUbicacion}
              onDidDismiss={() => setShowAlertUbicacion(false)}
              cssClass='my-custom-class'
              header={'UBICACIÓN DEL CLIENTE'}
              subHeader={''}
              message={'La orden debe ser aceptada para ver ubicación del cliente'}
              buttons={['OK']}
              />
    </div>
      </IonContent>
  )
}



const Presupuestar = (props: {setVista:any, datos:any,setEstado:any,setVolver:any, ticket:any}) => {

  const [presupuestar, setPresupuestar]= useState(true)
  const precio=useRef ("0")
  const informacion= useRef("")

  const [showLoading, setShowLoading] =useState(false)

  const enviarPresupuesto = ()=>{

    if (precio.current!="0"){
      setShowLoading(true)
      props.datos.presupuesto_inicial=precio.current
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
              props.datos.status="PRE"
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
      props.datos.pedido_mas_información=informacion.current
      formDataToUpload.append("masInfo", informacion.current)
      formDataToUpload.append("ticket", props.ticket)
      formDataToUpload.append("estado", "PEI")
      formDataToUpload.append("tipoOrden","Orden general" )

      const axios = require('axios');
      axios({
        url:url+"orden/masInfo/proveedor",
        method:'POST',
        headers: {"content-type": "multipart/form-data"},
        data:formDataToUpload
      }).then(function(res: any){

        if(res.data!="bad"){
          props.setEstado("PEI")
          props.setVista("PEDIDO INFORMACION")
          props.datos.status="PEI"
        }
    }).catch((error: any) =>{
//              setVista(0)
        //Network error comes in
    });
    }

    
  }

  if (presupuestar){
    
    return (
      <IonContent>
      <div id="ionContentModalOrdenes">

        <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
        </div>

        <div id="contenedorPrincipal">
        <div id="contenedorHijoCentrado">
        <IonCardTitle>PRESUPUESTO</IonCardTitle>
        </div></div>
      <IonCard id="ionCardModalCentro">

        <div id="contenedorPrincipal">
      <div id="contenedorHijoCentrado">

        <p>¿ESTÁ EN CONDICIONES DE PRESUPUESTAR EL TRABAJO?</p>
        <div id="contenederCentrarItem">
          <IonItem id="item-Orden">
            <IonLabel>SI</IonLabel>
            <IonCheckbox checked={presupuestar} onIonChange={e => setPresupuestar(e.detail.checked)} />
          </IonItem>
          </div>
          <p>INGRESE PRECIO ESTIMATIVO</p>
          <div id="contenederCentrarItem">
          <IonItem id="item-Orden">
            <IonLabel  position="floating">PRECIO</IonLabel>
            <IonInput type="number" onIonInput={(e: any) => precio.current = (e.target.value)}></IonInput>
          </IonItem>
          </div>
        </div>
        </div>
    </IonCard>

    <IonLoading
            cssClass='my-custom-class'
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            message={'Enviando respuesta...'}
            duration={7000}
          />

    <IonCol><IonButton shape="round" color="warning"  id="botonContratar" onClick={() => enviarPresupuesto()} >ENVIAR PRESUPUESTO</IonButton></IonCol>

    </div>
    </IonContent>
  )
  }else{
    return(
      <IonContent>
      <div id="ionContentModalOrdenes">

        <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
        </div>

        <div id="contenedorPrincipal">
          <div id="contenedorHijoCentrado">
          <IonCardTitle>PEDIR MÁS INFORMACIÓN</IonCardTitle>
        </div></div>
      
      <IonCard id="ionCardModalCentro">

      <div id="contenedorPrincipal">
      <div id="contenedorHijoCentrado">

        <p>¿ESTÁ EN CONDICIONES DE PRESUPUESTAR EL TRABAJO?</p>
        <div id="contenederCentrarItem">
          <IonItem id="item-Orden">
            <IonLabel>SI</IonLabel>
            <IonCheckbox checked={presupuestar} onIonChange={e => setPresupuestar(e.detail.checked)} />
          </IonItem>
          </div>
          <p>INDIQUE LA INFORMACIÓN QUE NECESITA DEL CLIENTE PARA PRESUPUESTAR</p>
          <div id="contenederCentrarItem">
          <IonItem id="item-Orden">
          <IonLabel position="floating">Pedido de información / comentarios</IonLabel>
            <IonInput onIonInput={(e: any) => informacion.current = (e.target.value)}></IonInput>          </IonItem>
          </div>
        </div>
        </div>
    </IonCard>



    <IonLoading
            cssClass='my-custom-class'
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            message={'Enviando respuesta...'}
            duration={7000}
          />

    <IonButton  color="warning"  id="botonContratar" onClick={() => masInformacion()}>RESPONDER AL CLIENTE</IonButton>
</div>
</IonContent>

    )
  }
 
  
}


const NuevaInfo = (props: {datos:any, estado:any, setVista:any,setEstado:any, setVolver:any, rechazarOrden:any}) =>{

  const precio=useRef ("0")

  const [showLoading, setShowLoading] =useState(false)
  const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false) 


  const enviarPresupuesto = ()=>{
    if (precio.current!="0"){
      setShowLoading(true)
      var formDataToUpload = new FormData();
      formDataToUpload.append("precio", precio.current)
      formDataToUpload.append("ticket", props.datos.ticket)
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
              props.datos.status="PRE"
            }
    }).catch((error: any) =>{
      setShowLoading(false)
//              setVista(0)
        //Network error comes in
    });
    }

  }


  if(props.datos.respuesta_cliente_pedido_mas_información!="0" || props.datos.picture1_mas_información!=""||props.datos.picture2_mas_información!=""){
    return ( 
      <IonContent>
      <div id="ionContentModalOrdenes">
          <div id="modalProveedor-flechaVolver">
              <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
          </div>
          <IonCard id="ionCard-explorerContainer-Proveedor">
            <img id="img-orden" src={props.datos.imagen_cliente}></img>
            <div id="divSentencias">
              <p>TIPO: {props.datos.tipo}</p>
              <p>STATUS: {props.estado}</p>
              <p>TICKET: {props.datos.ticket}</p>
            </div>
            <IonButton  id="botonContratar" onClick={() => props.setVista("datosClientes")} >DATOS DE CLIENTE</IonButton>
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

            <IonGrid>
              <IonRow>
                <IonCol id="ioncol-homecliente" onClick={() =>verUbicacion(props.datos.location_lat, props.datos.location_long) }>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={location} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER UBICACIÓN DEL CLIENTE</small></IonRow>
                </IonCol>
              </IonRow>
            </IonGrid>

          </IonCard>
          <IonCard id="ionCard-explorerContainer-Proveedor">
                < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
          </IonCard>
  
          <div id="tituloCardPRoveedor">
            <strong>RESPUESTA DEL CLIENTE</strong>
          </div>
          <IonCard id="ionCard-explorerContainer-Proveedor">
          <div id="divSentencias">
            <p>RESPUESTA:</p>
            <p>{props.datos.respuesta_cliente_pedido_mas_información}</p>
            <p>INFORMACIÓN SOLICITADA AL CLIENTE:</p>
            </div>
            <Imagenes picture1={props.datos.picture1_mas_información} picture2={props.datos.picture2_mas_información} />
          </IonCard>
    
          <IonCard id="ionCard-explorerContainer-Proveedor">
            < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
          </IonCard>
  
          <div id="tituloCardPRoveedor">
            <strong>PRESUPUESTO</strong>
          </div>
          <IonCard id="ionCard-explorerContainer-Proveedor">
            
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
          
  
          <IonGrid>
                <IonRow>
                  <IonCol><IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton></IonCol>
                  <IonCol><IonButton shape="round" color="warning"  id="botonContratar" onClick={() => enviarPresupuesto()} >ENVIAR PRESUPUESTO</IonButton></IonCol>
                </IonRow>
          </IonGrid>
          
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
      </div>
        </IonContent>
    )
  }else {
    return ( 
      <IonContent>
        <div id="ionContentModalOrdenes">
          <div id="modalProveedor-flechaVolver">
              <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
          </div>
          <div id="titulo">
          <h2>EN ESPERA DE LA RESPUESTA DEL CLIENTE</h2>
          </div>
          <IonCard id="ionCard-explorerContainer-Proveedor">
            <img id="img-orden" src={props.datos.imagen_cliente}></img>
            <div id="divSentencias">
              <p>TIPO: {props.datos.tipo}</p>
              <p>STATUS: {props.estado}</p>
              <p>TICKET: {props.datos.ticket}</p>
            </div>
            <IonGrid>
              <IonRow>
                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosClientes")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={eye} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER DATOS DEL CLIENTE</small></IonRow>
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
            <IonGrid>
              <IonRow>
                <IonCol id="ioncol-homecliente" onClick={() =>verUbicacion(props.datos.location_lat, props.datos.location_long) }>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={location} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER UBICACIÓN DEL CLIENTE</small></IonRow>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCard>

          <IonCard id="ionCard-explorerContainer-Proveedor">
                < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
          </IonCard>
    
          <div id="tituloCardPRoveedor">
            <strong>PRESUPUESTO</strong>
          </div>
          <IonCard id="ionCard-explorerContainer-Proveedor">
            
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
          
  
          <IonGrid>
                <IonRow>
                  <IonCol><IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton></IonCol>
                  <IonCol><IonButton shape="round" color="warning"  id="botonContratar" onClick={() => enviarPresupuesto()} >ENVIAR PRESUPUESTO</IonButton></IonCol>
                </IonRow>
          </IonGrid>
          
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
        </div>
        </IonContent>
    )
  }
  

}

const Presupuestada = (props:{datos:any, estado:any, setVolver:any, setVista:any, rechazarOrden:any})=> {

  const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false) 

  
  return (

    <IonContent>
      <div id="ionContentModalOrdenes">
        <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
        </div>
        <IonTitle>EN ESPERA DE RESPUESTA DEL CLIENTE</IonTitle>

        <IonCard id="ionCard-explorerContainer-Proveedor">
          <img id="img-orden" src={props.datos.imagen_cliente}></img>
          <div id="divSentencias">
            <p>TIPO: {props.datos.tipo}</p>
            <p>STATUS: {props.estado}</p>
            <p>TICKET: {props.datos.ticket}</p>
          </div>
          <IonGrid>
              <IonRow>
                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosClientes")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={eye} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER DATOS DEL CLIENTE</small></IonRow>
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

          <IonGrid>
              <IonRow>
                <IonCol id="ioncol-homecliente" onClick={() =>verUbicacion(props.datos.location_lat, props.datos.location_long) }>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={location} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER UBICACIÓN DEL CLIENTE</small></IonRow>
                </IonCol>
              </IonRow>
            </IonGrid>

        </IonCard>

        <IonCard id="ionCard-explorerContainer-Proveedor">
        <div id="divSentencias">
          <p>PRESUPUESTO:</p>
          <p>{props.datos.presupuesto_inicial}</p>
          <p>INFORMACIÓN SOLICITADA AL CLIENTE:</p>
          <p>{props.datos.pedido_mas_información}</p>
        </div>
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
      </div>
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
        props.setVista("EN VIAJE")
        props.datos.status="EVI"
      }
     })
  }

  if (props.datos.respuesta_cliente_pedido_mas_información!="" || props.datos.picture1_mas_información!=""|| props.datos.picture2_mas_información){
    return (
      <IonContent>
        <div id="ionContentModalOrdenes">
        <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
        </div>
        
        
        <div id="contenedorcentro">
          <IonTitle>CLIENTE HA ENVIADO INFORMACIÓN</IonTitle>
        </div>
        <IonCard id="ionCard-explorerContainer-Proveedor">
          <img id="img-orden" src={props.datos.imagen_cliente}></img>
          <div id="divSentencias">
            <p>TIPO: {props.datos.tipo}</p>
            <p>STATUS: {props.estado}</p>
            <p>TICKET: {props.datos.ticket}</p>
          </div>
          <IonGrid>
              <IonRow>
                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosClientes")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={eye} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER DATOS DEL CLIENT</small></IonRow>
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
        <IonGrid>
              <IonRow>
                <IonCol id="ioncol-homecliente" onClick={() =>verUbicacion(props.datos.location_lat, props.datos.location_long) }>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={location} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER UBICACIÓN DEL CLIENTE</small></IonRow>
                </IonCol>
              </IonRow>
            </IonGrid>
        </IonCard>
  
        <div id="contenedorcentro">
          <IonTitle>RESPUESTA DEL CLIENTE</IonTitle>
        </div>
        <IonCard id="ionCard-explorerContainer-Proveedor">
          <div id="divSentencias">
            <p>RESPUESTA:</p>
            <p>{props.datos.respuesta_cliente_pedido_mas_información}</p>
            <p>INFORMACIÓN SOLICITADA AL CLIENTE:</p>
          </div>
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
       </div>
        </IonContent>
    )

  }else{
    return(<IonContent>
      <div id="ionContentModalOrdenes">
      <div id="modalProveedor-flechaVolver">
          <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
      </div>
      <IonTitle>RESPUESTA DEL CLIENTE</IonTitle>

      <IonCard id="ionCard-explorerContainer-Proveedor">
        <img id="img-orden" src={props.datos.imagen_cliente}></img>
        <div id="divSentencias">
          <p>TIPO: {props.datos.tipo}</p>
          <p>STATUS: {props.estado}</p>
          <p>TICKET: {props.datos.ticket}</p>
        </div>
        <IonGrid>
              <IonRow>
                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosClientes")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={eye} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER DATOS DEL CLIENT</small></IonRow>
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
        <IonGrid>
              <IonRow>
                <IonCol id="ioncol-homecliente" onClick={() =>verUbicacion(props.datos.location_lat, props.datos.location_long) }>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={location} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER UBICACIÓN DEL CLIENTE</small></IonRow>
                </IonCol>
              </IonRow>
            </IonGrid>
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
</div>
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
        props.setVista("EN SITIO")
        props.datos.status="ENS"
      }
     })
  }

  

  if (props.datos.respuesta_cliente_pedido_mas_información!="" || props.datos.picture1_mas_información!=""|| props.datos.picture2_mas_información){
    return (
      <IonContent>
        <div id="ionContentModalOrdenes">
        <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
        </div>

        <div id="contenedorcentro">
          <IonTitle>ACTUALMENTE EN VIAJE AL SITIO DEL CLIENTE</IonTitle>
        </div>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          <img id="img-orden" src={props.datos.imagen_cliente}></img>
          <div id="divSentencias">
            <p>TIPO: {props.datos.tipo}</p>
            <p>STATUS: {props.estado}</p>
            <p>TICKET: {props.datos.ticket}</p>
          </div>
          <IonGrid>
              <IonRow>
                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosClientes")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={eye} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER DATOS DEL CLIENT</small></IonRow>
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
          <IonGrid>
              <IonRow>
                <IonCol id="ioncol-homecliente" onClick={() =>verUbicacion(props.datos.location_lat, props.datos.location_long) }>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={location} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER UBICACIÓN DEL CLIENTE</small></IonRow>
                </IonCol>
              </IonRow>
            </IonGrid>
        </IonCard>
  
        <div id="contenedorcentro">
          <IonTitle>RESPUESTA DEL CLIENTE</IonTitle>
        </div>
        <IonCard id="ionCard-explorerContainer-Proveedor">
        <div id="divSentencias">
          <p>RESPUESTA:</p>
          <p>{props.datos.respuesta_cliente_pedido_mas_información}</p>
          <p>INFORMACIÓN SOLICITADA AL CLIENTE:</p>
        </div>
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
            header={'EN SITIO'}
            subHeader={''}
            message={'¿Se encuentra en la dirección del cliente?'}
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
       </div>
        </IonContent>
    )

  }else{
    return(<IonContent>
    <div id="ionContentModalOrdenes">
      <div id="modalProveedor-flechaVolver">
          <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
      </div>
      <IonTitle>RESPUESTA DEL CLIENTE</IonTitle>

      <IonCard id="ionCard-explorerContainer-Proveedor">
        <img id="img-orden" src={props.datos.imagen_cliente}></img>
        <div id="divSentencias">
          <p>TIPO: {props.datos.tipo}</p>
          <p>STATUS: {props.estado}</p>
          <p>TICKET: {props.datos.ticket}</p>
        </div>
        <IonGrid>
              <IonRow>
                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosClientes")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={eye} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER DATOS DEL CLIENT</small></IonRow>
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
        <IonGrid>
              <IonRow>
                <IonCol id="ioncol-homecliente" onClick={() =>verUbicacion(props.datos.location_lat, props.datos.location_long) }>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={location} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER UBICACIÓN DEL CLIENTE</small></IonRow>
                </IonCol>
              </IonRow>
            </IonGrid>
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
   </div>   
      </IonContent>)
  }

}

const EnSitio  = (props:{datos:any, setVolver:any, setVista:any, estado:any, setEstado:any})=>{
  const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false)
  const [showAlertFinalizar,setShowAlertFinalizar]= useState(false)

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
  const finalizar= ()=> {

        props.setVista("FINALIZAR")
      
  }

  

  if (props.datos.respuesta_cliente_pedido_mas_información!="" || props.datos.picture1_mas_información!=""|| props.datos.picture2_mas_información){
    return (
      <IonContent>
        <div id="ionContentModalOrdenes">
        <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
        </div>
        
        <div id="contenedorcentro">
          <IonTitle>ORDEN EN EJECUCIÓN</IonTitle>
        </div>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          <img id="img-orden" src={props.datos.imagen_cliente}></img>
          <div id="divSentencias">
            <p>TIPO: {props.datos.tipo}</p>
            <p>STATUS: {props.estado}</p>
            <p>TICKET: {props.datos.ticket}</p>
          </div>
          <IonGrid>
              <IonRow>
                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosClientes")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={eye} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER DATOS DEL CLIENT</small></IonRow>
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
          <IonGrid>
              <IonRow>
                <IonCol id="ioncol-homecliente" onClick={() =>verUbicacion(props.datos.location_lat, props.datos.location_long) }>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={location} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER UBICACIÓN DEL CLIENTE</small></IonRow>
                </IonCol>
              </IonRow>
            </IonGrid>
        </IonCard>
  
        <div id="contenedorcentro">
          <IonTitle>RESPUESTA DEL CLIENTE</IonTitle>
        </div>
       
        <IonCard id="ionCard-explorerContainer-Proveedor">
          <div id="divSentencias">
            <p>RESPUESTA:</p>
            <p>{props.datos.respuesta_cliente_pedido_mas_información}</p>
            <p>INFORMACIÓN SOLICITADA AL CLIENTE:</p>
          </div>
          <Imagenes picture1={props.datos.picture1_mas_información} picture2={props.datos.picture2_mas_información} />
        </IonCard>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
        </IonCard>

        <IonGrid>
        <IonRow>
        <IonCol><IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton></IonCol>   
        <IonCol><IonButton shape="round" color="warning"  id="botonContratar" onClick={() => setShowAlertFinalizar(true)} >TRABAJO FINALIZADO</IonButton></IonCol>   
        </IonRow>
        </IonGrid>
        <IonAlert
            isOpen={showAlertFinalizar}
            onDidDismiss={() => setShowAlertFinalizar(false)}
            cssClass='my-custom-class'
            header={'FINALIZACIÓN DEL TRABAJO'}
            subHeader={''}
            message={'¿Ha finalizado el trabajo?'}
            buttons={[
              {
                text: 'SI',
                role: 'cancel',
                cssClass: 'secondary',
                handler: blah => {
                  finalizar();
                },  
               
              },
              {
                text: 'NO',
                role: 'cancel',
                cssClass: 'secondary',
                handler: blah => {
                  setShowAlertFinalizar(false);
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
    </div>
        </IonContent>
    )

  }else{
    return(<IonContent>
    <div id="ionContentModalOrdenes">
      <div id="modalProveedor-flechaVolver">
          <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
      </div>
      <div id="contenedorcentro">
          <IonTitle>ORDEN EN EJECUCIÓN</IonTitle>
        </div>
      <IonCard id="ionCard-explorerContainer-Proveedor">
        <img id="img-orden" src={props.datos.imagen_cliente}></img>
        <div id="divSentencias">
          <p>TIPO: {props.datos.tipo}</p>
          <p>STATUS: {props.estado}</p>
          <p>TICKET: {props.datos.ticket}</p>
        </div>
        <IonGrid>
              <IonRow>
                <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosClientes")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={eye} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER DATOS DEL CLIENT</small></IonRow>
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
        <IonGrid>
              <IonRow>
                <IonCol id="ioncol-homecliente" onClick={() =>verUbicacion(props.datos.location_lat, props.datos.location_long) }>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={location} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>VER UBICACIÓN DEL CLIENTE</small></IonRow>
                </IonCol>
              </IonRow>
            </IonGrid>
      </IonCard>

      <IonCard id="ionCard-explorerContainer-Proveedor">
        < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
      </IonCard>
      <IonGrid>
        <IonRow>
        <IonCol><IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton></IonCol>   
        <IonCol><IonButton shape="round" color="warning"  id="botonContratar" onClick={() => setShowAlertFinalizar(true)} >TRABAJO FINALIZADO</IonButton></IonCol>   
        </IonRow>
        </IonGrid>
        <IonAlert
            isOpen={showAlertFinalizar}
            onDidDismiss={() => setShowAlertFinalizar(false)}
            cssClass='my-custom-class'
            header={'FINALIZACIÓN DEL TRABAJO'}
            subHeader={''}
            message={'¿Ha finalizado el trabajo?'}
            buttons={[
              {
                text: 'SI',
                role: 'cancel',
                cssClass: 'secondary',
                handler: blah => {
                  finalizar();
                },  
               
              },
              {
                text: 'NO',
                role: 'cancel',
                cssClass: 'secondary',
                handler: blah => {
                  setShowAlertFinalizar(false);
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
     </div>
      </IonContent>)
  }

}

const Finalizar  = (props:{datos:any, setVolver:any, setVista:any, estado:any, setEstado:any})=>{

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
          url:url+"orden/finalizar/proveedor",
          method:'POST',
          headers: {"content-type": "multipart/form-data"},
          data:formDataToUpload
      }).then(function(res: any){
  
        console.log(res.data)
        if(res.data=="ok"){
            props.setVolver(false)
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
     <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => enviar()} >ENVIAR</IonButton>
   
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
      <div id="ionContentModalOrdenes">
      <div id="modalProveedor-flechaVolver">
        <IonIcon icon={arrowBack} onClick={() => props.setVista("primero")} slot="start" id="flecha-volver">  </IonIcon>
      </div>
      <IonCard id="ionCard-explorerContainer-Proveedor">
        <img id="img-orden" src={datosCliente.imagen}></img>
        <div id="divSentencias">
        <p>NOMBRE: {datosCliente.nombre}</p>
        <p>APELLIDO: {datosCliente.apellido}</p>
        <p>CALIFICACIÓN: {datosCliente.calificacion}</p>
        </div>
        <IonGrid>
            <IonRow>
            <IonCol id="ioncol-homecliente"  onClick={() => verUbicacion(props.latitud, props.longitud) }  >
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
  </div>
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

export const Calificacion = (props:{calificacion:any})=>{

  const [valor, setValor] = useState(0)
  const [primera, setPrimera] =useState <boolean> (false)
  const [segunda, setSegunda] =useState<boolean>(false)
  const [tercera, setTercera] =useState<boolean>(false)
  const [cuarta, setCuarta] =useState<boolean>(false)
  const [quinta, setQuinta] =useState<boolean>(false)

  useEffect(() => {

  if(valor==1){
    setPrimera(true)
    props.calificacion.current="1"
  }else if (valor==2){
    setPrimera(true)
    setSegunda(true)
    props.calificacion.current="2"
  }else if (valor==3){
    setPrimera(true)
    setSegunda(true)
    setTercera(true)
    props.calificacion.current="3"
  }else if (valor==4){
    setPrimera(true)
    setSegunda(true)
    setTercera(true)
    setCuarta(true)
    props.calificacion.current="4"
  }else if (valor==5){
    setPrimera(true)
    setSegunda(true)
    setTercera(true)
    setCuarta(true)
    setQuinta(true)
    props.calificacion.current="5"
  }
}, [valor])
  return (
    <IonGrid>
      <IonRow>
      
        <IonCol onClick={() => setValor (1)} > <Estrella buena={primera}></Estrella> </IonCol>
        <IonCol onClick={() => setValor (2)} > <Estrella buena={segunda}></Estrella> </IonCol>
        <IonCol onClick={() => setValor (3)} > <Estrella buena={tercera} /></IonCol>
        <IonCol onClick={() => setValor (4)} > <Estrella buena={cuarta}></Estrella> </IonCol>
        <IonCol onClick={() => setValor (5)} > <Estrella buena={quinta}></Estrella> </IonCol>
        
      </IonRow>
    </IonGrid>


);

}

const Estrella =(props:{buena:any}) =>{

  if (props.buena){
    return(
      <h2 id="godsStart">&#9733;</h2>
    )
  }else{
    return(
      <h2 id="badsStart">&#9733;</h2>
    )
  }
}

export default ModalVerOrdenesProveedor

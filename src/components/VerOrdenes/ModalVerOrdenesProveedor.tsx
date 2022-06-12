import { arrowBack, chatbox, eye, location } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { isConstructorDeclaration, isSetAccessorDeclaration } from "typescript";

import '../ModalGeneral/Modal.css';

import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import Https from "../../utilidades/HttpsURL";
import Chat from "../Chat/Chat";
import { IonAlert, IonButton, IonCard, IonCardSubtitle, IonCardTitle, IonCheckbox, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonLoading, IonRow, IonSegment, IonSegmentButton, IonTitle } from "@ionic/react";
import { getDB, setDB } from "../../utilidades/dataBase";
import { Redirect } from "react-router";

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



const ModalVerOrdenesProveedor = (props:{notifications:any,setNotifications:any,datos:any,emailProveedor:any,setVolver:any,setNuevasOrdenes:any, nuevasOrdenes:any})  =>{


    const [vista, setVista] = useState("primero")

    const [estado, setEstado] =useState("Enviada")

    const [showAlertInconvenienteChat, setShowAlertInconvenienteChat] = useState(false)
    const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false)

    const presupuestoValor = useRef("0")


    const precio = useRef ("")

    const desdeDondeEstoy=useRef("")
    const ticketeck = useRef <string>("")


    useEffect(() => {
      ticketeck.current= props.datos.ticket 

      console.log("el estatus es; "+props.datos.status)

            if (props.datos.status=="ENV"){
              setEstado("GENERADO POR CLIENTE")
              axios.get(url+"orden/cambiarestado/"+props.datos.ticket+"/"+props.datos.tipo+"/"+"REC", {timeout: 7000})
              .then((resp: { data: any; }) => {

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
            }else{

            }


            console.log("ENTONCES EL PROBLEMA ESTÁ EN LO QUE HAY EN NUEVAS ORDENES: "+props.nuevasOrdenes)
            getDB(ticketeck.current.toString( )).then(res => {
              if(res!=undefined || res!=null){
               //arreglo.push(res)
               //aca copia todo, el numero 1 del arreglo no es el rubro sino la primer letra del rubro y así.
                if(res!=props.datos.status || props.datos.status=="ENV"){
                 // setNuevoStatus(true)
                  setDB(ticketeck.current, props.datos.status)
        
                  console.log("veamos lo que hay al principio: "+props.nuevasOrdenes)
                  console.log("veamos lo que hay al principio JSON: "+JSON.stringify(props.nuevasOrdenes))
                  props.setNuevasOrdenes(props.nuevasOrdenes.filter((item:string) => item !== ticketeck.current));
                  console.log("veamos lo que hay al final: "+props.nuevasOrdenes)
                  console.log("veamos lo que hay al final JSON: "+JSON.stringify(props.nuevasOrdenes))
                }  
                }else{
                  setDB(ticketeck.current, props.datos.status)
                  //setNuevoStatus(false)
                }
            })
        
      }, [])


      const rechazarOrden = ()=> {
          axios.get(url+"orden/cambiarestado/"+props.datos.ticket+"/"+props.datos.tipo+"/"+"REX", {timeout: 7000})
          .then((resp: { data: any; }) => {

            if(resp.data!="bad"){
              setEstado("ORDEN RECHAZADA")
              setVista("ir a home")
              window.location.reload();

            }
    
           })
        

      }
   
  if(vista=="primero"){

    desdeDondeEstoy.current="primero"
    return (

      <Primero datos={props.datos} setVolver={props.setVolver} estado={estado} setEstado={setEstado} setVista={setVista} rechazarOrden={rechazarOrden} />
      )
  } else if (vista=="preaceptada") {
    desdeDondeEstoy.current="preaceptada"

    return (
    <Presupuestar setVista={setVista} datos={props.datos} setEstado={setEstado} ticket={props.datos.ticket} setVolver={props.setVolver}  />
      
    )
  }else if(vista=="PRESUPUESTADA"){
    desdeDondeEstoy.current="PRESUPUESTADA"

    
    return (
      < Presupuestada datos={props.datos} estado={estado} setVolver={props.setVolver} setVista={setVista} rechazarOrden={rechazarOrden} />
    )
  }else if(vista=="PEDIDO INFORMACION"){
    desdeDondeEstoy.current="PEDIDO INFORMACION"
    return (
      < NuevaInfo datos={props.datos} estado={estado} setVista={setVista} setEstado={setEstado} setVolver={props.setVolver} rechazarOrden={rechazarOrden} />
    )
  }else if(vista=="ACEPTADA"){
    desdeDondeEstoy.current="ACEPTADA"

    return(
      < OrdenAceptada datos={props.datos} setVolver={props.setVolver} setVista={setVista} estado={estado} setEstado={setEstado} />
    )
  }else if(vista=="EN VIAJE"){
    desdeDondeEstoy.current="EN VIAJE"

    return(
      < EnViaje datos={props.datos} setVolver={props.setVolver} setVista={setVista} estado={estado} setEstado={setEstado} />
    )
  }else if(vista=="EN SITIO"){
    desdeDondeEstoy.current="EN SITIO"

    return(
      < EnSitio datos={props.datos} setVolver={props.setVolver} setVista={setVista} estado={estado} setEstado={setEstado} />
    )
  }else if (vista=="FINALIZAR"){
    return(
      < Finalizar datos={props.datos} setVolver={props.setVolver} setVista={setVista} estado={estado} setEstado={setEstado} />
    )
  } else if (vista=="datosClientes"){
    return (
      < VerDatosCliente dondeEstoy={desdeDondeEstoy.current} ticket={props.datos.ticket} tipo={props.datos.tipo} latitud={props.datos.location_lat} longitud={props.datos.location_long} setVista={setVista}  />
    )
  }else if (vista=="chat") {
    console.log("LLEGO A CHAT")
    return(
      <>

      <Chat notifications={props.notifications} setNotifications={props.setNotifications} email={props.emailProveedor}  ticket={props.datos.ticket} setVolver={props.setVolver} setVista={setVista} desdeDondeEstoy={desdeDondeEstoy.current} />

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
                  setVista("primero");
                }
              }
            ]} /></>
        )
  }
  else{
    return (
      <><Redirect push={true} to="/home" />
      </> 
             
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

              <IonCol id="ioncol-homecliente"  onClick={() =>setShowAlertUbicacion(true) }   >
                <IonRow id="ionrow-homecliente">
                <IonIcon icon={location} /> </IonRow>
                <IonRow id="ionrow-homecliente"><small>VER UBICACIÓN CLIENTE</small></IonRow>
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
              mode='ios'
              message={'La orden debe ser aceptada para ver la ubicación del cliente'}
              buttons={['OK']}
              />
    </div>
      </IonContent>
  )
}



const Presupuestar = (props: {setVista:any, datos:any,setEstado:any,setVolver:any, ticket:any}) => {

  const [presupuestar, setPresupuestar]= useState("SI")

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
              props.setEstado("PRESUPUESTADA")
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
          props.setEstado("PEDIDO DE INFORMACION")
          props.setVista("PEDIDO INFORMACION")
          props.datos.status="PEI"
        }
    }).catch((error: any) =>{
//              setVista(0)
        //Network error comes in
    });
    }

    
  }

  if (presupuestar=="SI"){
    
    return (
        <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100vh",background:"#f3f2ef" }}>

        <div style={{display:"flex",flexDirection:"column", width:"100%",  height:"auto"}}>

            <div id="modalProveedor-flechaVolver">
                <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
            </div>
            <div style={{display:"flex", justifyContent:"center", alignItems:"center", marginTop:"36px"}}>
              <h1>PRESUPUESTO</h1>
            </div>
        </div>

        <div style={{display:"flex",flexDirection:"column", width:"100%",  height:"100%", justifyContent:"center",alignItems:"center" }}>

          <IonCard id="ionCardModalCentro">

            <div id="contenedorPrincipal">
            <div id="contenedorHijoCentrado">

            <p>¿ESTÁ EN CONDICIONES DE PRESUPUESTAR EL TRABAJO?</p>
            <div id="contenederCentrarItem">

              <IonSegment mode="ios" value={presupuestar} select-on-focus={true} onIonChange={e => setPresupuestar(  e.detail.value!)} >
                <IonSegmentButton value="SI">
                  <IonLabel>SI</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="NO">
                  <IonLabel>NO</IonLabel>
                </IonSegmentButton>
              </IonSegment>

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
        </div>



        <IonLoading
              cssClass='my-custom-class'
              isOpen={showLoading}
              onDidDismiss={() => setShowLoading(false)}
              message={'Enviando respuesta...'}
              duration={7000}
            />
          <div style={{display:"flex",flexDirection:"column", width:"100%",  height:"auto", justifyContent:"center", alignItems:"center", marginBottom:"32px"}}>

          <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => enviarPresupuesto()} >ENVIAR PRESUPUESTO</IonButton>            
        </div>
        </div>


  )
  }else{
    return(
      <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100vh",background:"#f3f2ef" }}>

      <div style={{display:"flex",flexDirection:"column", width:"100%",  height:"auto"}}>

          <div id="modalProveedor-flechaVolver">
              <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
          </div>
          <div style={{display:"flex", justifyContent:"center", alignItems:"center", marginTop:"36px"}}>
            <IonCardTitle>PEDIR MÁS INFORMACIÓN</IonCardTitle>
          </div>
      </div>
      
      <div style={{display:"flex",flexDirection:"column", width:"100%",  height:"100%", justifyContent:"center",alignItems:"center" }}>

      <IonCard id="ionCardModalCentro">
        <div id="contenedorPrincipal">
        <div id="contenedorHijoCentrado">

          <p style={{margin:"25px 10px 0px 10px"}}>¿ESTÁ EN CONDICIONES DE PRESUPUESTAR EL TRABAJO?</p>
          <div id="contenederCentrarItem">

            <IonSegment style={{width:"90%"}} mode="ios" value={presupuestar} select-on-focus={true} onIonChange={e => setPresupuestar(  e.detail.value!)} >
              <IonSegmentButton value="SI">
                <IonLabel>SI</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="NO">
                <IonLabel>NO</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            </div>
            <p style={{margin:"25px 10px 0px 10px"}}>INDIQUE LA INFORMACIÓN QUE NECESITA DEL CLIENTE PARA PRESUPUESTAR</p>
            <div id="contenederCentrarItem">
            <IonItem id="item-Orden">
            <IonLabel position="floating">Pedido de información / comentarios</IonLabel>
              <IonInput onIonInput={(e: any) => informacion.current = (e.target.value)}></IonInput>          </IonItem>
            </div>
          </div>
          </div>
    </IonCard>
    </div>



    <IonLoading
            cssClass='my-custom-class'
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            message={'Enviando respuesta...'}
            duration={7000}
          />
         <div style={{display:"flex",flexDirection:"column", width:"100%",  height:"auto", justifyContent:"center", alignItems:"center", marginBottom:"32px"}}>

        <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => masInformacion()}>RESPONDER AL CLIENTE</IonButton>
    </div>
</div>
    )
  }
 
  
}


const NuevaInfo = (props: {datos:any, estado:any, setVista:any,setEstado:any, setVolver:any, rechazarOrden:any}) =>{

  const precio=useRef ("0")

  const [showLoading, setShowLoading] =useState(false)
  const [showAlertRechazarOrden, setShowAlertRechazarOrden]= useState(false) 
  const [showAlertIngresarPresupuesto,setShowAlertIngresarPresupuesto]= useState(false) 

  const enviarPresupuesto = ()=>{
    if (precio.current!="0" ){
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
              props.setEstado("PRESUPUESTADA")
              props.setVista("PRESUPUESTADA")
              props.datos.status="PRE"
            }
    }).catch((error: any) =>{
      setShowLoading(false)
//              setVista(0)
        //Network error comes in
    });
    }else{
      setShowAlertIngresarPresupuesto(true)
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
             <IonGrid>
            <IonRow>
              <IonCol id="ioncol-homecliente" onClick={() => props.setVista("datosClientes")}>
                <IonRow id="ionrow-homecliente">
                <IonIcon icon={eye} /> </IonRow>
                <IonRow id="ionrow-homecliente"><small>VER DATOS CLIENTE</small></IonRow>
              </IonCol>

              <IonCol id="ioncol-homecliente"  onClick={() => verUbicacion(props.datos.latitud, props.datos.longitud) }  >
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
            <div id="divSentencias">
              <p>FECHA DE SOLICITUD:</p>
              <p>{props.datos.fecha_creacion}</p>
              <p>TÍTULO:</p>
              <p>{props.datos.titulo}</p>
              <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
              <p>{props.datos.descripcion}</p>
            </div>

         
          </IonCard>
          <IonCard id="ionCard-explorerContainer-Proveedor">
                < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
          </IonCard>
  
          <IonItemDivider />
          <div style={{display:"flex", flexDirection:"column", textAlign:"center", width:"100%", height:"auto"}}>
            <strong>RESPUESTA DEL CLIENTE</strong>
          </div>
          <IonCard id="ionCard-explorerContainer-Proveedor">
          <h1 style={{fontSize:"1em", color:"black", marginTop:"20px"}}>INFORMACIÓN SOLICITADA AL CLIENTE:</h1>
          <h2 style={{fontSize:"1em", color:"blue"}}>{props.datos.pedido_mas_información}</h2>
          <IonItemDivider />

            <h1 style={{fontSize:"1em", color:"black"}}>RESPUESTA:</h1>
            <h2 style={{fontSize:"1em", color:"blue"}}>{props.datos.respuesta_cliente_pedido_mas_información}</h2>
            
            <Imagenes picture1={props.datos.picture1_mas_información} picture2={props.datos.picture2_mas_información} />
          </IonCard>
    
          
          <IonItemDivider />
          <div style={{display:"flex", flexDirection:"column", textAlign:"center", width:"100%", height:"auto"}}>
            <strong>PRESUPUESTO</strong>
          </div>
          <IonCard id="ionCard-explorerContainer-Proveedor">
          <h1 style={{fontSize:"1em", color:"black", marginTop:"20px"}}>¿Está en condiciones de presupuestar?</h1>

            <IonItem style={{width:"90%",margin:"25px 0px 25px 0px"}}>
              <IonLabel position="floating">INGRESE PRECIO ESTIMATIVO </IonLabel>
              <IonInput onIonInput={(e: any) => precio.current = (e.target.value)}></IonInput>
            </IonItem>

            <h1 style={{fontSize:"1em", color:"black", marginTop:"20px"}}>En caso contrario puede chatear con el cliente</h1>
            <div style={{display:"flex", flexDirection:"column", justifyContent:"center",alignItems:"center", width:"auto", height:"auto", margin:"15px 0px 25px 0px"}} onClick={() => props.setVista("chat")}>
                  <IonRow id="ionrow-homecliente">
                  <IonIcon icon={chatbox} /> </IonRow>
                  <IonRow id="ionrow-homecliente"><small>CHAT CON CLIENTE</small></IonRow>
                </div>
          </IonCard>
      
      <IonLoading
              cssClass='my-custom-class'
              isOpen={showLoading}
              onDidDismiss={() => setShowLoading(false)}
              message={'Enviando respuesta...'}
              duration={7000}
            />
          
          <div id="botonCentral">
 <div id="botonCentralIzquierda">
          <IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton>
          </div>
            <div id="botonCentralDerecha"> 
          <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => enviarPresupuesto()} >ENVIAR PRESUPUESTO</IonButton>
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
                isOpen={showAlertIngresarPresupuesto}
                onDidDismiss={() => setShowAlertIngresarPresupuesto(false)}
                cssClass='my-custom-class'
                header={'INGRESE PRESUPUESTO'}
                subHeader={''}
                message={'Debe ingresar un presupuesto para continuar'}
                buttons={[
                  {
                    text: 'OK',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: blah => {
                      setShowAlertIngresarPresupuesto(false);
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
                <IonRow id="ionrow-homecliente"><small>VER DATOS CLIENTE</small></IonRow>
              </IonCol>

              <IonCol id="ioncol-homecliente"  onClick={() => verUbicacion(props.datos.latitud, props.datos.longitud) }  >
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
            <div id="divSentencias">
              <p>FECHA DE SOLICITUD:</p>
              <p>{props.datos.fecha_creacion}</p>
              <p>TÍTULO:</p>
              <p>{props.datos.titulo}</p>
              <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
              <p>{props.datos.descripcion}</p>
            </div>
          
          </IonCard>

          <IonCard id="ionCard-explorerContainer-Proveedor">
                < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
          </IonCard>

          <IonItemDivider/>

          <div style={{display:"flex", flexDirection:"column", textAlign:"center", width:"100%", height:"auto"}}>
            <h1 style={{fontSize:"1.2em"}}>PRESUPUESTO</h1>
          </div>
          <IonCard id="ionCard-explorerContainer-Proveedor">
              <h2 style={{fontSize:"1.1em"}}>Se ha pedido más información al cliente.</h2>
              <h2 style={{fontSize:"1.1em"}}>Si no desea esperar su respuesta puede enviar presupuesto estimativo.</h2>
              <h1 style={{fontSize:"1.2em", color:"black"}}>PRESUPUESTAR:</h1>

            <IonItem style={{width:"80%",margin:"0px 0px 20px 0px"}}>
             

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
          
          <div id="botonCentral">
 <div id="botonCentralIzquierda">
          <IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton>
          </div>
            <div id="botonCentralDerecha">  
          <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => enviarPresupuesto()} >ENVIAR PRESUPUESTO</IonButton>
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

  if (props.datos.pedido_mas_información!=""){
    return (

      <IonContent>
        <div id="ionContentModalOrdenes">
          <div id="modalProveedor-flechaVolver">
              <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
          </div>
          <div style={{display:"flex", width:"100%", height:"auto", textAlign:"center", justifyContent:"center"}}>

          <h1>PRESUPUESTO ENVIADO</h1>
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
                <IonRow id="ionrow-homecliente"><small>VER DATOS CLIENTE</small></IonRow>
              </IonCol>

              <IonCol id="ioncol-homecliente"  onClick={() => verUbicacion(props.datos.latitud, props.datos.longitud) }  >
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
            <div id="divSentencias">
              <p>FECHA DE SOLICITUD:</p>
              <p>{props.datos.fecha_creacion}</p>
              <p>TÍTULO:</p>
              <p>{props.datos.titulo}</p>
              <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
              <p>{props.datos.descripcion}</p>
            </div>
  
          
  
          </IonCard>

          <IonCard id="ionCard-explorerContainer-Proveedor">
          <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto", margin:"15px 0px 15px 0px"}} >
            < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
            </div>
          </IonCard>

          <IonItemDivider style={{margin:"15px 0px 15px 0px"}} />

          <div style={{display:"flex", flexDirection:"column", textAlign:"center", width:"100%", height:"auto"}}>
            <h1 style={{fontSize:"1.2em"}}>PRESUPUESTO</h1>
          </div>
          <IonCard id="ionCard-explorerContainer-Proveedor">
              <h1 style={{fontSize:"1.2em", color:"black"}}>PRESUPUESTO ENVIADO:</h1>
              <h2 style={{fontSize:"1.2em", color:"blue"}}>{props.datos.presupuesto_inicial}</h2>

          </IonCard>

          <div style={{display:"flex", flexDirection:"column", textAlign:"center", width:"100%", height:"auto"}}>
            <h1 style={{fontSize:"1.2em"}}>INFORMACIÓN CONSULTADA</h1>
          </div>
          <IonCard id="ionCard-explorerContainer-Proveedor">
          <h1 style={{fontSize:"1em", color:"black", marginTop:"20px"}}>INFORMACIÓN SOLICITADA AL CLIENTE:</h1>
          <h2 style={{fontSize:"1em", color:"blue"}}>{props.datos.pedido_mas_información}</h2>
          <IonItemDivider />

            <h1 style={{fontSize:"1em", color:"black"}}>RESPUESTA:</h1>
            <h2 style={{fontSize:"1em", color:"blue"}}>{props.datos.respuesta_cliente_pedido_mas_información}</h2>
            
            <Imagenes picture1={props.datos.picture1_mas_información} picture2={props.datos.picture2_mas_información} />
          </IonCard>
    
         
          <IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton>
  
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
  }else{

    return(
      <IonContent>
      <div id="ionContentModalOrdenes">
        <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setVolver(false)} slot="start" id="flecha-volver">  </IonIcon>
        </div>
        <div style={{display:"flex", width:"100%", height:"auto", textAlign:"center", justifyContent:"center"}}>

        <h1>PRESUPUESTO ENVIADO</h1>
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
                <IonRow id="ionrow-homecliente"><small>VER DATOS CLIENTE</small></IonRow>
              </IonCol>

              <IonCol id="ioncol-homecliente"  onClick={() => verUbicacion(props.datos.latitud, props.datos.longitud) }  >
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
          <div id="divSentencias">
            <p>FECHA DE SOLICITUD:</p>
            <p>{props.datos.fecha_creacion}</p>
            <p>TÍTULO:</p>
            <p>{props.datos.titulo}</p>
            <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
            <p>{props.datos.descripcion}</p>
          </div>

      
        </IonCard>

        <IonCard id="ionCard-explorerContainer-Proveedor">
        <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto", margin:"15px 0px 15px 0px"}} >
          < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
          </div>
        </IonCard>

        <IonItemDivider style={{margin:"15px 0px 15px 0px"}} />

        <div style={{display:"flex", flexDirection:"column", textAlign:"center", width:"100%", height:"auto"}}>
          <h1 style={{fontSize:"1.2em"}}>PRESUPUESTO</h1>
        </div>
        <IonCard id="ionCard-explorerContainer-Proveedor">
            <h1 style={{fontSize:"1.2em", color:"black"}}>PRESUPUESTO ENVIADO:</h1>
            <h2 style={{fontSize:"1.2em", color:"blue"}}>{props.datos.presupuesto_inicial}</h2>

        </IonCard>
       
        <IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton>

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
                <IonRow id="ionrow-homecliente"><small>VER DATOS CLIENTE</small></IonRow>
              </IonCol>

              <IonCol id="ioncol-homecliente"  onClick={() => verUbicacion(props.datos.latitud, props.datos.longitud) }  >
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
        <div id="divSentencias">
          <p>FECHA DE SOLICITUD:</p>
          <p>{props.datos.fecha_creacion}</p>
          <p>TÍTULO:</p>
          <p>{props.datos.titulo}</p>
          <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
          <p>{props.datos.descripcion}</p>
        </div>
       
        </IonCard>
  
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
        </IonCard>

        <IonItemDivider style={{margin:"15px 0px 15px 0px"}} />

          <div style={{display:"flex", flexDirection:"column", textAlign:"center", width:"100%", height:"auto"}}>
            <h1 style={{fontSize:"1.2em"}}>PRESUPUESTO</h1>
          </div>
          <IonCard id="ionCard-explorerContainer-Proveedor">
              <h1 style={{fontSize:"1.2em", color:"black"}}>PRESUPUESTO ENVIADO:</h1>
              <h2 style={{fontSize:"1.2em", color:"blue"}}>{props.datos.presupuesto_inicial}</h2>
          </IonCard>

          <div style={{display:"flex", flexDirection:"column", textAlign:"center", width:"100%", height:"auto"}}>
            <h1 style={{fontSize:"1.2em"}}>INFORMACIÓN CONSULTADA</h1>
          </div>
          <IonCard id="ionCard-explorerContainer-Proveedor">
          <h1 style={{fontSize:"1em", color:"black", marginTop:"20px"}}>INFORMACIÓN SOLICITADA AL CLIENTE:</h1>
          <h2 style={{fontSize:"1em", color:"blue"}}>{props.datos.pedido_mas_información}</h2>
          <IonItemDivider />

            <h1 style={{fontSize:"1em", color:"black"}}>RESPUESTA:</h1>
            <h2 style={{fontSize:"1em", color:"blue"}}>{props.datos.respuesta_cliente_pedido_mas_información}</h2>
            
            <Imagenes picture1={props.datos.picture1_mas_información} picture2={props.datos.picture2_mas_información} />
          </IonCard>

        <div id="botonCentral">
 <div id="botonCentralIzquierda">
            <IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton>
            </div>
            <div id="botonCentralDerecha"> 
            <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => setShowAlertEnViaje(true)} >EN VIAJE</IonButton> 
            </div>
          </div>
          <IonAlert
            isOpen={showAlertEnViaje}
            onDidDismiss={() => setShowAlertEnViaje(false)}
            cssClass='my-custom-class'
            header={'EN VIAJE'}
            subHeader={''}
            mode='ios'
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
          mode='ios'
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
                <IonRow id="ionrow-homecliente"><small>VER DATOS CLIENTE</small></IonRow>
              </IonCol>

              <IonCol id="ioncol-homecliente"  onClick={() => verUbicacion(props.datos.latitud, props.datos.longitud) }  >
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
        <div id="divSentencias">
          <p>FECHA DE SOLICITUD:</p>
          <p>{props.datos.fecha_creacion}</p>
          <p>TÍTULO:</p>
          <p>{props.datos.titulo}</p>
          <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
          <p>{props.datos.descripcion}</p>
        </div>
      
      </IonCard>

      <IonCard id="ionCard-explorerContainer-Proveedor">
        < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
      </IonCard>

      <div style={{display:"flex", flexDirection:"column", textAlign:"center", width:"100%", height:"auto"}}>
            <h1 style={{fontSize:"1.2em"}}>PRESUPUESTO</h1>
          </div>
          <IonCard id="ionCard-explorerContainer-Proveedor">
              <h1 style={{fontSize:"1.2em", color:"black"}}>PRESUPUESTO ENVIADO:</h1>
              <h2 style={{fontSize:"1.2em", color:"blue"}}>{props.datos.presupuesto_inicial}</h2>
          </IonCard>

      <div id="botonCentral">
 <div id="botonCentralIzquierda">
      <IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton> 
      </div>
            <div id="botonCentralDerecha">  
       <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => setShowAlertEnViaje(true)} >EN VIAJE</IonButton>
       </div>
          </div>
        <IonAlert
            isOpen={showAlertEnViaje}
            onDidDismiss={() => setShowAlertEnViaje(false)}
            cssClass='my-custom-class'
            header={'EN VIAJE'}
            subHeader={''}
            mode='ios'
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
          mode='ios'
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

  

  if (props.datos.respuesta_cliente_pedido_mas_información!="" || props.datos.picture1_mas_información!=""|| props.datos.picture2_mas_información!=""){
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
                <IonRow id="ionrow-homecliente"><small>VER DATOS CLIENTE</small></IonRow>
              </IonCol>

              <IonCol id="ioncol-homecliente"  onClick={() => verUbicacion(props.datos.latitud, props.datos.longitud) }  >
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
          <div id="divSentencias">
            <p>FECHA DE SOLICITUD:</p>
            <p>{props.datos.fecha_creacion}</p>
            <p>TÍTULO:</p>
            <p>{props.datos.titulo}</p>
            <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
            <p>{props.datos.descripcion}</p>
          </div>
        
        </IonCard>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
        </IonCard>

        <IonItemDivider style={{margin:"15px 0px 15px 0px"}} />

        <div style={{display:"flex", flexDirection:"column", textAlign:"center", width:"100%", height:"auto"}}>
          <h1 style={{fontSize:"1.2em"}}>PRESUPUESTO</h1>
        </div>
        <IonCard id="ionCard-explorerContainer-Proveedor">
            <h1 style={{fontSize:"1.2em", color:"black"}}>PRESUPUESTO ENVIADO:</h1>
            <h2 style={{fontSize:"1.2em", color:"blue"}}>{props.datos.presupuesto_inicial}</h2>
        </IonCard>

        <div style={{display:"flex", flexDirection:"column", textAlign:"center", width:"100%", height:"auto"}}>
          <h1 style={{fontSize:"1.2em"}}>INFORMACIÓN CONSULTADA</h1>
        </div>
        <IonCard id="ionCard-explorerContainer-Proveedor">
        <h1 style={{fontSize:"1em", color:"black", marginTop:"20px"}}>INFORMACIÓN SOLICITADA AL CLIENTE:</h1>
        <h2 style={{fontSize:"1em", color:"blue"}}>{props.datos.pedido_mas_información}</h2>
        <IonItemDivider />

          <h1 style={{fontSize:"1em", color:"black"}}>RESPUESTA:</h1>
          <h2 style={{fontSize:"1em", color:"blue"}}>{props.datos.respuesta_cliente_pedido_mas_información}</h2>
          
          <Imagenes picture1={props.datos.picture1_mas_información} picture2={props.datos.picture2_mas_información} />
        </IonCard>

        <div id="botonCentral">
 <div id="botonCentralIzquierda">
       <IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton>  
       </div>
            <div id="botonCentralDerecha"> 
    <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => setShowAlertEnSitio(true)} >EN SITIO</IonButton>
    </div>
          </div>

        <IonAlert
            isOpen={showAlertEnSitio}
            onDidDismiss={() => setShowAlertEnSitio(false)}
            cssClass='my-custom-class'
            header={'EN SITIO'}
            subHeader={''}
            mode='ios'
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
                <IonRow id="ionrow-homecliente"><small>VER DATOS CLIENTE</small></IonRow>
              </IonCol>

              <IonCol id="ioncol-homecliente"  onClick={() => verUbicacion(props.datos.latitud, props.datos.longitud) }  >
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
          <div id="divSentencias">
            <p>FECHA DE SOLICITUD:</p>
            <p>{props.datos.fecha_creacion}</p>
            <p>TÍTULO:</p>
            <p>{props.datos.titulo}</p>
            <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
            <p>{props.datos.descripcion}</p>
          </div>
          
        </IonCard>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
        </IonCard>

        <IonItemDivider style={{margin:"15px 0px 15px 0px"}} />

        <div style={{display:"flex", flexDirection:"column", textAlign:"center", width:"100%", height:"auto"}}>
          <h1 style={{fontSize:"1.2em"}}>PRESUPUESTO</h1>
        </div>
        <IonCard id="ionCard-explorerContainer-Proveedor">
            <h1 style={{fontSize:"1.2em", color:"black"}}>PRESUPUESTO ENVIADO:</h1>
            <h2 style={{fontSize:"1.2em", color:"blue"}}>{props.datos.presupuesto_inicial}</h2>
        </IonCard>
      
      <div id="botonCentral">
 <div id="botonCentralIzquierda">
       <IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton> 
       </div>
       <div id="botonCentralDerecha">  
       <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => setShowAlertEnSitio(true)} >EN SITIO</IonButton>
       </div>
          </div>

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
                <IonRow id="ionrow-homecliente"><small>VER DATOS CLIENTE</small></IonRow>
              </IonCol>

              <IonCol id="ioncol-homecliente"  onClick={() => verUbicacion(props.datos.latitud, props.datos.longitud) }  >
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
          <div id="divSentencias">
            <p>FECHA DE SOLICITUD:</p>
            <p>{props.datos.fecha_creacion}</p>
            <p>TÍTULO:</p>
            <p>{props.datos.titulo}</p>
            <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
            <p>{props.datos.descripcion}</p>
          </div>
         
        </IonCard>
  
        <IonCard id="ionCard-explorerContainer-Proveedor">
          < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
        </IonCard>

        <IonItemDivider style={{margin:"15px 0px 15px 0px"}} />

        <div style={{display:"flex", flexDirection:"column", textAlign:"center", width:"100%", height:"auto"}}>
          <h1 style={{fontSize:"1.2em"}}>PRESUPUESTO</h1>
        </div>
        <IonCard id="ionCard-explorerContainer-Proveedor">
            <h1 style={{fontSize:"1.2em", color:"black"}}>PRESUPUESTO ENVIADO:</h1>
            <h2 style={{fontSize:"1.2em", color:"blue"}}>{props.datos.presupuesto_inicial}</h2>
        </IonCard>

        <div style={{display:"flex", flexDirection:"column", textAlign:"center", width:"100%", height:"auto"}}>
          <h1 style={{fontSize:"1.2em"}}>INFORMACIÓN CONSULTADA</h1>
        </div>
        <IonCard id="ionCard-explorerContainer-Proveedor">
        <h1 style={{fontSize:"1em", color:"black", marginTop:"20px"}}>INFORMACIÓN SOLICITADA AL CLIENTE:</h1>
        <h2 style={{fontSize:"1em", color:"blue"}}>{props.datos.pedido_mas_información}</h2>
        <IonItemDivider />

          <h1 style={{fontSize:"1em", color:"black"}}>RESPUESTA:</h1>
          <h2 style={{fontSize:"1em", color:"blue"}}>{props.datos.respuesta_cliente_pedido_mas_información}</h2>
          
          <Imagenes picture1={props.datos.picture1_mas_información} picture2={props.datos.picture2_mas_información} />
        </IonCard>

        <div id="botonCentral">
 <div id="botonCentralIzquierda">
        <IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton>  
        </div>
            <div id="botonCentralDerecha">   
        <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => setShowAlertFinalizar(true)} >TRABAJO FINALIZADO</IonButton> 
        </div>
          </div>

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
                <IonRow id="ionrow-homecliente"><small>VER DATOS CLIENTE</small></IonRow>
              </IonCol>

              <IonCol id="ioncol-homecliente"  onClick={() => verUbicacion(props.datos.latitud, props.datos.longitud) }  >
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
        <div id="divSentencias">
          <p>FECHA DE SOLICITUD:</p>
          <p>{props.datos.fecha_creacion}</p>
          <p>TÍTULO:</p>
          <p>{props.datos.titulo}</p>
          <p>DESCRIPCIÓN DE LA SOLICITUD: </p>        
          <p>{props.datos.descripcion}</p>
        </div>
       
      </IonCard>

      <IonCard id="ionCard-explorerContainer-Proveedor">
          < Imagenes   picture1={props.datos.picture1} picture2={props.datos.picture2}   ></Imagenes>
        </IonCard>

        <IonItemDivider style={{margin:"15px 0px 15px 0px"}} />

        <div style={{display:"flex", flexDirection:"column", textAlign:"center", width:"100%", height:"auto"}}>
          <h1 style={{fontSize:"1.2em"}}>PRESUPUESTO</h1>
        </div>
        <IonCard id="ionCard-explorerContainer-Proveedor">
            <h1 style={{fontSize:"1.2em", color:"black"}}>PRESUPUESTO ENVIADO:</h1>
            <h2 style={{fontSize:"1.2em", color:"blue"}}>{props.datos.presupuesto_inicial}</h2>
        </IonCard>
      <div id="botonCentral">
 <div id="botonCentralIzquierda">
      <IonButton shape="round" color="danger"  id="botonContratar" onClick={() => setShowAlertRechazarOrden(true)} >RECHAZAR ORDEN</IonButton>
      </div>
            <div id="botonCentralDerecha">
        <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => setShowAlertFinalizar(true)} >TRABAJO FINALIZADO</IonButton>
        </div>
          </div>
          
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

const VerDatosCliente = (props:{dondeEstoy:string, ticket:any, tipo:any,latitud:any, longitud:any,setVista:any})  =>{

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


  if (props.dondeEstoy=="primero"){
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
    </IonCard>
    </div>
    </IonContent>
         
  );
  }else{
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
  
              </IonRow>
            </IonGrid>
  
    </IonCard>
    </div>
    </IonContent>
         
  );
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

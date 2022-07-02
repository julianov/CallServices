import { alert, arrowBack, arrowForwardCircle, chevronDown, closeCircle, pin } from 'ionicons/icons';
import React, { Component, useRef, useState } from 'react';
import './ExploreContainer.css';

import {Geoposition} from "@ionic-native/geolocation";
import { Geolocation } from '@capacitor/core/dist/esm/web/geolocation';
import { useEffect } from 'react';
import axios from 'axios';
import Https from '../../utilidades/HttpsURL';
import { Adsense } from '@ctrl/react-adsense';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import CompletarRubros from '../../pages/CompletarRubros/CompletarRubros';
import { ordenes } from '../../pages/Home/HomeProveedor';
import ModalVerOrdenesProveedor from '../VerOrdenes/ModalVerOrdenesProveedor';
import { IonButton, IonCard, IonCardHeader, IonCardSubtitle, IonCol, IonGrid, IonIcon, IonItemDivider, IonModal, IonRow, IonSlide, IonSlides, IonTitle } from '@ionic/react';
import { retornarIconoCategoria } from '../../utilidades/retornarIconoCategoria';
import { getDB, setDB } from '../../utilidades/dataBase';

const url=Https


const ExploreContainerProveedor  = (props:{ 
  notifications:any ,
  setNotifications:any,
  ordenes:any, 
  setMisOrdenes:any, 
  emailProveedor:any, 
  sinRubro:boolean, 
  setIsReg:any
  tipodeCliente:any
  setNuevasOrdenes:any
  nuevasOrdenes:any
  
 } ) => {

  
  const [hayOrdenes, setHayOrdenes]=useState(false)
  const [verOrden, setVerOrden] = useState( false );

  const [ticket, setTicket] = useState(0)

  const [sinRubro, setSinRubro] = useState(false)
  const [cargarRubro, setCargarRubro] = useState(false)


  useEffect(() => {
    if(props.sinRubro){
      setSinRubro(true)
    }
  }, [props.sinRubro]);

  useEffect(() => {
    if(props.ordenes.length > 0){
      setHayOrdenes(true)
    }
  }, [props.ordenes]);


  if(hayOrdenes){
    return (
      <>
        <div id="container-principal-ExplorerContainer-Cliente">
        
          <div style={{width:"90%", height:"auto", textAlign:"center"}}>
            <h1 style={{marginTop:"35px",fontWeight:"600", fontSize:"1.3em"}}> ORDENES DE TRABAJO ACTIVAS </h1>
          </div>
          <MisOrdenes misOrdenes={props.ordenes} setVerOrden={setVerOrden} setTicket={setTicket} nuevasOrdenes={props.nuevasOrdenes} setNuevasOrdenes={props.setNuevasOrdenes} />
          <IonItemDivider />

          <CampanaPublicidad></CampanaPublicidad>
          <Adsense
              client="ca-pub-3241473434204149"
              key="-6t+ed+2i-1n-4w"              
              slot="5931330098"
              style={{ width: 500, height: 300 }}
              format=""
          />
        </div>
        
        <IonModal animated={true} isOpen={verOrden} onDidDismiss={() => setVerOrden( false )}  >
          <ModalVerOrdenesProveedor
            notifications={props.notifications} 
            setNotifications={props.setNotifications}

            ticket={ticket}
            datosCompletos={props.ordenes}
            setDatosCompletos={props.setMisOrdenes}

            setVolver={setVerOrden}
            emailProveedor={props.emailProveedor}
            setNuevasOrdenes={props.setNuevasOrdenes}
            nuevasOrdenes={props.nuevasOrdenes}
          />  
        </IonModal>
      </>
    )
  }else{
    if(cargarRubro){
      return (
        <CompletarRubros setIsReg={props.setIsReg} clientType= {props.tipodeCliente} email={props.emailProveedor} />
      )
    }else{
        return (
          <div id="container-principal-ExplorerContainer-Cliente"> 
            <SinRubro sinrubro={sinRubro} setCargarRubro={setCargarRubro} />
            <Solicitudes /> 
            <CampanaPublicidad ></CampanaPublicidad>
        </div>
        )
      }
  }

    
    

}
  
const Solicitudes  = () => {

  return(
    <>
    <IonCard id="IonCardExplorerContainer">
      <IonCardHeader>
      <div id="contenedorCentrado">
        <h1 style={{fontWeight:"600"}}> NO POSEE SOLICITUDES DE TRABAJO ACTUALMENTE </h1 > 
      </div>
      </IonCardHeader>
    </IonCard>
    </>

  )
}


const MisOrdenes = (props:{ misOrdenes: Array <ordenes> , setVerOrden:any,setTicket:any, nuevasOrdenes:any, setNuevasOrdenes:any }) => {

  var i=0
  //if (props.proveedores!=[]){
    return (
      <IonCard style={{display:"flex", flexDirection:"column", color:"white", width:"90%", height:"auto", justifyContent:"center", alignItems:"center" }}>

      <div  style={{width:"100%", height:"auto"}}>
        <IonSlides pager={true} >

        {props.misOrdenes.map((a) => {
          i=i+1
          if (a.tipo=="Orden de emergencia"){
            return (
              <IonSlide>
                <CardVistaVariasOrdenesEmergencia key={i} posicion={i} rubro={a.rubro} tipo={a.tipo} status={a.status} fecha_creacion={a.fecha_creacion} ticket={a.ticket} 
                dia={a.dia} hora={a.hora} titulo={a.titulo} descripcion={a.descripcion} imagen={a.imagen_cliente} setVerOrden={props.setVerOrden} setTicket={props.setTicket} nuevasOrdenes={props.nuevasOrdenes} setNuevasOrdenes={props.setNuevasOrdenes}></CardVistaVariasOrdenesEmergencia>
               </IonSlide>
               )
          }else{
          return (
          <IonSlide>
            <CardVistaVariasOrdenes key={i} posicion={i} rubro={a.rubro} tipo={a.tipo} status={a.status} fecha_creacion={a.fecha_creacion} ticket={a.ticket} 
            dia={a.dia} hora={a.hora} titulo={a.titulo} descripcion={a.descripcion} imagen={a.imagen_cliente} setVerOrden={props.setVerOrden} setTicket={props.setTicket} nuevasOrdenes={props.nuevasOrdenes} setNuevasOrdenes={props.setNuevasOrdenes}></CardVistaVariasOrdenes>
           </IonSlide>
           )
           } 
        })
        }
        </IonSlides>
    </div>
    </IonCard>

  )

      
}


const CardVistaVariasOrdenes= (props:{posicion:any,rubro:string, tipo:string,status:string,fecha_creacion:string,ticket: string,
  dia: string,hora:string,titulo:string,descripcion:string, imagen:string, setVerOrden:any, setTicket:any, nuevasOrdenes:any, setNuevasOrdenes:any }) => {
        
    const [mensaje, setMensaje] = useState("")

    const [estado,setEstado]=useState("Enviada")

    const [imagen, setImagen] = useState("")
    const [nuevoStatus,setNuevoStatus]=useState(false)
    
    useEffect(() => {

    if (props.status=="ENV"){
      setEstado("PEDIDO DE TRABAJO")
    }else if(props.status=="REC"){
      setEstado("PEDIDO DE TRABAJO RECIBIDO")
    }else if(props.status=="PEI"){
      setEstado("MÁS INFORMACIÓN HA SIDO SOLICITADA AL CLIENTE")
      setMensaje("EN ESPERA DE LA RESPUESTA DEL CLIENTE")
    }else if(props.status=="RES"){
      setEstado("CONFECCIÓN DE PRESUPUESTO PENDIENTE")
      setMensaje("EL CLIENTE YA HA SUMINISTRADO LA INFORMACIÓN")
    }
    else if(props.status=="PRE"){
      setEstado("PEDIDO DE TRABAJO PRESUPUESTADO")
      setMensaje("EN ESPERA DE LA RESPUESTA DEL CLIENTE")
    } else if(props.status=="ACE"){
      setEstado("PEDIDO DE TRABAJO ACEPTADO")
      setMensaje("EL CLIENTE ACEPTÓ EL PRESUPUESTO")
    }else if(props.status=="EVI"){
      setEstado("EN VIAJE")
      setMensaje("DIRIGIRSE A LOCACIÓN DEL CLIENTE")
    }else if(props.status=="ENS"){
      setEstado("EN SITIO")
    }

  
    getDB(props.ticket+"proveedor").then(res => {
      console.log("RES: "+res)
      if(res!=undefined || res!=null){
        if(props.status=="ENV"){
          setNuevoStatus(true)
        }
        else if(res!=props.status){
          if(props.status!="PEI"&&props.status!="PRE"&&props.status!="EVI"&&props.status!="ENS"){
            setNuevoStatus(true)
          }else{
            setNuevoStatus(false)
          }
        }  
        }else{
          setNuevoStatus(true)
        }
    })

  if (props.nuevasOrdenes){
    console.log("PROPS NUEVAS ORDENES: "+props.nuevasOrdenes)
  }

  }, [props.status, props.nuevasOrdenes]);
 

  useEffect(() => {
    setImagen(retornarIconoCategoria(props.rubro)) 
  }, []); 

  if(nuevoStatus&&props.status!="PEI"){

    return (
      <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto", justifyContent:"center",alignItems:"center"}} onClick={()=> {props.setVerOrden(true); props.setTicket(props.ticket)}}>
        <div id="iconoDerecha">            
            <IonIcon icon={alert} id="iconoNuevaStatus" ></IonIcon>
          </div > 
        <IonGrid>
          <IonRow  id="row-busqueda">
            <IonCol   id="col-explorerContainerCliente">
              <img id="imgOrden" src={imagen}></img>
            </IonCol>
          </IonRow>
          <IonRow  id="row-busqueda">
            <IonCol   id="col-explorerContainerCliente">
              <IonCardSubtitle>TIPO: {props.tipo.toUpperCase( )}</IonCardSubtitle>
              <IonCardSubtitle>STATUS: {estado}</IonCardSubtitle>
              <IonCardSubtitle>TICKET: {props.ticket}</IonCardSubtitle>  
              <IonCardSubtitle style={{margin:"0px 0px 25px 0px"}}>{mensaje}</IonCardSubtitle>
            </IonCol>
          </IonRow>
        
        </IonGrid>
      </div>
    )

  }else{
    return (
      <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto", justifyContent:"center",alignItems:"center"}} onClick={()=> {props.setVerOrden(true); props.setTicket(props.ticket)}}>
        <IonGrid>
          <IonRow  id="row-busqueda">
            <IonCol   id="col-explorerContainerCliente">
              <img id="imgOrden" src={imagen}></img>
            </IonCol>
          </IonRow>
          <IonRow  id="row-busqueda">
            <IonCol   id="col-explorerContainerCliente">
              <IonCardSubtitle>TIPO: {props.tipo.toUpperCase( )}</IonCardSubtitle>
              <IonCardSubtitle>STATUS: {estado}</IonCardSubtitle>
              <IonCardSubtitle>TICKET: {props.ticket}</IonCardSubtitle>  
              <IonCardSubtitle style={{margin:"0px 0px 25px 0px"}}>{mensaje}</IonCardSubtitle>
            </IonCol>
          </IonRow>
        
        </IonGrid>
      </div>
    )
  }

}

const SinRubro = (props:{sinrubro:boolean, setCargarRubro:any}) => {
  if (props.sinrubro==true){

    return(
      <CardSinRubro setCargarRubro={props.setCargarRubro} ></CardSinRubro>
      
    )

  }else{
    return(<> </>
    )
  }

}


const CardSinRubro = (props:{ setCargarRubro:any}) => {
 
  const cargarRubro = () => {

   // window.location.reload();
 /*  window.location.reload();

        return (
            <><Redirect to="/CompletarRubros" />
            </> 
            
            )*/
            props.setCargarRubro(true)
  }

 

    return (
      <IonCard id="IonCardExplorerContainer">  
        <IonCardHeader> 
          <div id="contenedorCentrado">
            <img src={"./assets/simboloAlerta.png"} id="imagenSimboloAlerta" />
          </div>
        </IonCardHeader> 
        <IonTitle id="tituloNegro">NO POSEE RUBROS CARGADOS</IonTitle>
        <div id="contenedorCentrado">
          <p>Al no tener rubros cargados, no es visible para los clientes</p>
          <p>Cargue un rubro para comenzar</p>
          <IonButton color="warning" shape="round" onClick={()=> cargarRubro()}>CARGAR RUBRO</IonButton>
        </div>
      </IonCard>
)
 

}

const CardVistaVariasOrdenesEmergencia =  (props:{posicion:any,rubro:string, tipo:string,status:string,fecha_creacion:string,ticket: string,
  dia: string,hora:string,titulo:string,descripcion:string, imagen:string, setVerOrden:any, setTicket:any, nuevasOrdenes:any, setNuevasOrdenes:any }) => {
  return (
    <></>
  )
}

const CampanaPublicidad  = () => {

  return(
    <>
    <IonCard id="IonCardExplorerContainer">
      <IonCardHeader>
      <div id="contenedorCentrado">
      <img src={"./assets/CampañasDePublicidad.png"} id="imagenCampañaPublicidad" />
      </div>
      </IonCardHeader>
      <div id="contenedorCentrado">

      <strong id="textoCentrado">Cree campañas de publicidad para llegar a más clientes</strong>
      <IonButton color="warning">CREAR CAMPAÑA</IonButton>

      </div>

    </IonCard>
    </>

  )
}

export default ExploreContainerProveedor;

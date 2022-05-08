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


const getLocation = async () => {
  try {
    const position = await Geolocation.getCurrentPosition();

      const posicion=position.coords.latitude +"/"+ position.coords.longitude
      return posicion;

  } catch (e) {
    return 0;
  }
}

//let proveedores = new Array<ordenes>();


const ExploreContainerProveedor  = (props:{ ordenes:any, emailProveedor:any, sinRubro:boolean, 
  setIsReg:any
  tipodeCliente:any
  setNuevasOrdenes:any
  nuevasOrdenes:any
 } ) => {

  //const [proveedores, setProveedores]=useState()

  
  const [hayOrdenes, setHayOrdenes]=useState(false)
 // const [showModal2, setShowModal2] = useState({ isOpen: false });
  const [verOrden, setVerOrden] = useState( false );

  const [posicion, setPosicion] = useState(0)

  //const [arregloOrdenes, setArregloOrdenes] =  useState <ordenes []> ( [])
  const [sinRubro, setSinRubro] = useState(false)

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


  const [cargarRubro, setCargarRubro] = useState(false)

  console.log("EL PROPS NUEVAS ORDENES EN EXPLORER CONTAINER ES: "+props.nuevasOrdenes)

    if(cargarRubro){
      return (<CompletarRubros setIsReg={props.setIsReg} clientType= {props.tipodeCliente} email={props.emailProveedor} ></CompletarRubros>);
    }else{
      if(hayOrdenes){
        return (
          <><div id="container-principal-ExplorerContainer-Cliente">
           
           <div style={{width:"90%", height:"auto", textAlign:"center"}}>
              <h1 style={{marginTop:"35px",fontWeight:"600", fontSize:"1.3em"}}> ORDENES DE TRABAJO ACTIVAS </h1>
            </div>
            <Elements proveedores={props.ordenes} setVerOrden={setVerOrden} setPosicion={setPosicion} nuevasOrdenes={props.nuevasOrdenes} setNuevasOrdenes={props.setNuevasOrdenes} />
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
          
          <IonModal
        animated={true}
        isOpen={verOrden}
        onDidDismiss={() => setVerOrden( false )}
      >
        <ModalVerOrdenesProveedor
          datos={props.ordenes[posicion-1]}
          setVolver={setVerOrden}
          emailProveedor={props.emailProveedor}
          setNuevasOrdenes={props.setNuevasOrdenes}
        nuevasOrdenes={props.nuevasOrdenes}
          
        />  
      </IonModal>
      </>
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


const Elements = (props:{ proveedores: Array <ordenes> , setVerOrden:any,setPosicion:any, nuevasOrdenes:any, setNuevasOrdenes:any }) => {

  var i=0
  //if (props.proveedores!=[]){
    return (
      <IonCard style={{display:"flex", flexDirection:"column", color:"white", width:"90%", height:"auto", justifyContent:"center", alignItems:"center" }}>

      <div  style={{width:"100%", height:"auto"}}>
        <IonSlides pager={true} >

        {props.proveedores.map((a) => {
          i=i+1
          return (
          <IonSlide>
            <CardVistaVariasOrdenes key={i} posicion={i} rubro={a.rubro} tipo={a.tipo} status={a.status} fecha_creacion={a.fecha_creacion} ticket={a.ticket} 
            dia={a.dia} hora={a.hora} titulo={a.titulo} descripcion={a.descripcion} imagen={a.imagen_cliente} setVerOrden={props.setVerOrden} setPosicion={props.setPosicion} nuevasOrdenes={props.nuevasOrdenes} setNuevasOrdenes={props.setNuevasOrdenes}></CardVistaVariasOrdenes>
           </IonSlide>
           ) 
        })
        }
        </IonSlides>
    </div>
    </IonCard>

  )
  //}
      
}




const CardVistaVariasOrdenes= (props:{posicion:any,rubro:string, tipo:string,status:string,fecha_creacion:string,ticket: string,
  dia: string,hora:string,titulo:string,descripcion:string, imagen:string, setVerOrden:any, setPosicion:any, nuevasOrdenes:any, setNuevasOrdenes:any }) => {
        
    const [mensaje, setMensaje] = useState("")

    const [estado,setEstado]=useState("Enviada")

    const [imagen, setImagen] = useState("")
    const [nuevoStatus,setNuevoStatus]=useState(false)

    //const ticketeck = useRef <string>("")

    
    useEffect(() => {

    //  ticketeck.current= props.ticket 

    if (props.status=="ENV"){
      setEstado("PEDIDO DE TRABAJO")
    }else if(props.status=="REC"){
      setEstado("PEDIDO DE TRABAJO RECIBIDO")
    }else if(props.status=="ABI"){
      setEstado("PEDIDO DE TRABAJO ACEPTADO")
    }else if(props.status=="PEI"){
      setEstado("MÁS INFORMACIÓN HA SIDO SOLICITADA AL CLIENTE")
      setMensaje("EN ESPERA DE LA RESPUESTA DEL CLIENTE")
    }else if(props.status=="PRE"){
      setEstado("PEDIDO DE TRABAJO PRE ACEPTADO")
      setMensaje("EN ESPERA DE LA RESPUESTA DEL CLIENTE")
    } else if(props.status=="ACE"){
      setEstado("PEDIDO DE TRABAJO ACEPTADO")
      setMensaje("VER RESPUESTA DEL CLIENTE")
    }else if(props.status=="EVI"){
      setEstado("EN VIAJE")
    }else if(props.status=="ENS"){
      setEstado("EN SITIO")
    }

 /*   console.log("ENTONCES EL PROBLEMA ESTÁ EN LO QUE HAY EN NUEVAS ORDENES: "+props.nuevasOrdenes)*/
            getDB(props.ticket).then(res => {
              if(res!=undefined || res!=null){
                console.log("RES: "+res)
               //arreglo.push(res)
               //aca copia todo, el numero 1 del arreglo no es el rubro sino la primer letra del rubro y así.
                if(res!=props.status || res=="ENV" ){
                  setNuevoStatus(true)
              
                }  
                }else{
                  setNuevoStatus(true)
                }
            })

  }, [props.status]);
 

  useEffect(() => {

    setImagen(retornarIconoCategoria(props.rubro)) 
   
}, []); 

if(nuevoStatus&&props.status!="PEI"){

  return (
    <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto", justifyContent:"center",alignItems:"center"}} onClick={()=> {props.setVerOrden(true); props.setPosicion(props.posicion)}}>
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
    <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto", justifyContent:"center",alignItems:"center"}} onClick={()=> {props.setVerOrden(true); props.setPosicion(props.posicion)}}>
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
    return(
      <> </> 
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

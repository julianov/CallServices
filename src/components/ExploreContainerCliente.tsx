import { IonAlert, IonAvatar, IonBadge, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonItemDivider, IonLabel, IonList, IonModal, IonPage, IonRouterOutlet, IonRow, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from '@ionic/react';
import { arrowBack, calendar, chevronDown, closeCircle, ellipse, informationCircle, map, personCircle, pin, square, triangle } from 'ionicons/icons';
import React, { Component, useRef, useState } from 'react';
import './ExploreContainer.css';

import { Geolocation } from '@capacitor/core/dist/esm/web/geolocation';
import { useEffect } from 'react';
import Estrellas from '../utilidades/Estrellas';
import ResultadoBusqueda from '../utilidades/ResultadoBusqueda';
import { createStore, getDB, removeDB } from '../utilidades/dataBase';
import { datosGeneralesVariosProveedores, ordenesCliente, proveedorBuscado } from '../pages/HomeCliente';
import ModalVerCardProveedor from './ModalVerCardProveedor';
import { ordenes } from '../pages/HomeProveedor';
import ModalVerOrdenes from './ModalVerOrdenesProveedor';
import ModalVerOrdenesCliente from './ModalVerOrdenesCliente';

const getLocation = async () => {
  try {
      const position = await Geolocation.getCurrentPosition();
      const posicion=position.coords.latitude +"/"+ position.coords.longitude
      return posicion;

  } catch (e) {
    return 0;
  }
}
var ultimos: never[]=[]

let proveedores = new Array<ordenesCliente>();


const ExploreContainerCliente  = (props:{ordenes:any ,proveedores: Array<datosGeneralesVariosProveedores>, url:string, setShowCargandoProveedores:any, 
  setShowModal:any, setTipoDeVistaEnModal:any, emailCliente:String,
  buscar:any, busqueda_categorias:any, busquedaDatosProveedores:Array<proveedorBuscado>}) => {

  
  //const [proveedores, setProveedores]=useState()
  
  const [verEmail, setVerEmail]=useState("")
  const[item, setItem]=useState("")

  const [showModal2, setShowModal2] = useState({ isOpen: false });

  const [hayOrdenes, setHayOrdenes]=useState(false)
  const [verOrden, setVerOrden] = useState( false );

  const [posicion, setPosicion] = useState(0)


  useEffect(() => {

    for (let i=0; i<props.ordenes.length;i++){     

        proveedores.push({ tipo:props.ordenes[i].tipo,
        status:props.ordenes[i].status,
        fecha_creacion:props.ordenes[i].fecha_creacion,
        ticket:props.ordenes[i].ticket,
        dia:props.ordenes[i].dia,
        hora:props.ordenes[i].hora,
        titulo:props.ordenes[i].titulo,
        descripcion:props.ordenes[i].descripcion,
        email_proveedor:props.ordenes[i].email_proveedor,
        imagen_proveedor:props.ordenes[i].imagen_proveedor,
        location_lat:props.ordenes[i].location_lat,
        location_long:props.ordenes[i].location_long,
        picture1:props.ordenes[i].picture1,
        picture2:props.ordenes[i].picture2,
      })

    }

    if(props.ordenes.length > 0){
      setHayOrdenes(true)
    }
   

  }, [props.ordenes]);


  if (props.busqueda_categorias.length == 0 && props.buscar=="" ){
    if (verEmail=="" && item =="" ){
      return (
        <>
        <div id="container-principal-ExplorerContainer-Cliente">   
          <Tabs setShowModal={props.setShowModal} setTipoDeVistaEnModal={props.setTipoDeVistaEnModal} ></Tabs>
          <MisOrdenes hayOrdenes={hayOrdenes} misOrdenes={proveedores}  setVerOrden={setVerOrden} setPosicion={setPosicion}></MisOrdenes>
          <h1 id="explorerContainerCliente-titulo">PROVEEDORES DE SERVICIOS EN LA ZONA </h1>             
          <Elements  proveedores={props.proveedores!} setVerEmail={setVerEmail} setItem={setItem} setShowModal2={setShowModal2} />
        </div>


        <IonModal
      animated={true}
      isOpen={verOrden}
      onDidDismiss={() => setVerOrden( false )}
    >
      <ModalVerOrdenesCliente 
        datos={proveedores[posicion-1]}
        setVolver={setVerOrden}
        emailCliente={props.emailCliente}
        
      />  
    </IonModal>
            </>
        );

    }
    else{
      return (
        <><div id="container-principal-ExplorerContainer-Cliente">
          <VerProveedorParticular url={props.url} emailCliente={props.emailCliente} email={verEmail} setVerEmail={setVerEmail} setShowModal2={setShowModal2} showModal2={showModal2} item={item} setItem={setItem} setShowCargandoProveedores={props.setShowCargandoProveedores} />
        </div>
      </>
      )}
  }else{

    createStore("UltimosProveedores")

    getDB("UltimosProveedores").then(res => {
      if(res!=null){
        ultimos= JSON.parse(res)
      }
    })
    return (
      <div id="container-principal-ExplorerContainer-Cliente">   
        <ResultadoBusqueda emailCliente={props.emailCliente} arreglo_categorias={props.busqueda_categorias} arreglo_ultimos={ultimos} busquedaDatosProveedores={props.busquedaDatosProveedores} ></ResultadoBusqueda>
      </div>
    )
  }
  
}



const Elements = (props:{ proveedores: Array<datosGeneralesVariosProveedores> , setVerEmail:any, setItem:any,setShowModal2:any }) => {

  var i=0
  //if (props.proveedores!=[]){
    return (
      <div id="elementos">
        {props.proveedores.map((a) => {
          i=i+1
          //item, imagen personal, distancia, calificación, email, nombre, apellido, tipo
          return (<CardVistaVariosProveedores key={i} setShowModal2={props.setShowModal2} item={a.item} personalImg={a.imagenPersonal} distancia={a.distancia} calificacion={a.calificacion} email={a.email} nombre={a.nombre} apellido={a.apellido} tipo={a.tipo} setVerEmail={props.setVerEmail} setItem={props.setItem} ></CardVistaVariosProveedores> ) 
        })
        }
    </div>
  )
  //}
      
}

          //item, imagen, distancia, calificación, email, nombre, apellido,

const CardVistaVariosProveedores= (props:{item:any, personalImg:any ,distancia: any, calificacion:any, 
  email:any, nombre: any, apellido:any, tipo:any, setVerEmail:any, setItem:any, setShowModal2:any }) => {
    
    //console.log(props.email + " - "+ props.item)

    const verProveedor = ()=> {
      console.log(props.email + " - "+ props.item)
      //if(props.email=="" && props.item==""){
        props.setVerEmail(props.email)
        props.setShowModal2({ isOpen: true })
        props.setItem(props.item)

     // }
    }

    const surname = useRef("")
    if (props.tipo=="2"){
    surname.current=props.apellido.toUpperCase()  
    }else{
      surname.current=""
    } 
    
    return (
    <IonCard id="ionCard-explorerContainer-Cliente">
      <IonGrid>
      <IonRow  id="row-busqueda">
        <IonCol size="auto"  id="col-explorerContainerCliente"><img id="img-explorerContainerCliente" src={props.personalImg}></img></IonCol>
        <IonCol size="auto" id="col-explorerContainerCliente">
          <IonCardTitle id="explorerContainerClienteTitulo">{props.nombre.toUpperCase() +" "+ surname.current}</IonCardTitle>
          <IonCardSubtitle>Rubro: {props.item}</IonCardSubtitle>
          <IonCardSubtitle>{props.tipo}</IonCardSubtitle>
          <Estrellas calificacion={props.calificacion }></Estrellas>
        </IonCol>
      </IonRow>
      <IonRow><IonCol  id="col-explorerContainerCliente"><IonCardSubtitle>DISTANCIA AL PROVEEDOR DE SERVICIO: {Number.parseFloat(props.distancia).toFixed(2)} km </IonCardSubtitle></IonCol></IonRow>
      
      </IonGrid>
        
      <IonItemDivider></IonItemDivider>
      <IonGrid>
        <IonRow>
          <IonCol id="ioncol-homecliente">
            <IonRow id="ionrow-homecliente"><img src={"./assets/icon/seleccionar.png"} className="imagen-boton-principal"/></IonRow>
            <IonRow id="ionrow-homecliente"><small>SOLICITAR</small></IonRow>
          </IonCol>
          <IonCol id="ioncol-homecliente">
            <IonRow id="ionrow-homecliente"><img src={"./assets/icon/mensaje.png"} className="imagen-boton-principal"/></IonRow>
            <IonRow id="ionrow-homecliente"><small>RESEÑAS</small></IonRow>
          </IonCol>
          <IonCol id="ioncol-homecliente" onClick={()=>{ verProveedor()} } >
            <IonRow id="ionrow-homecliente"><img src={"./assets/icon/ver.png"} className="imagen-boton-principal"/></IonRow>
            <IonRow id="ionrow-homecliente"><small>VER</small></IonRow>
          </IonCol>
        </IonRow>
    </IonGrid>

    </IonCard>
       
  );
}

const VerProveedorParticular = (  props:{url:string, emailCliente:String, email:any, setVerEmail:any, item:any, setItem:any, 
  setShowCargandoProveedores:any, setShowModal2:any, showModal2:any} ) =>{

  let aux: any[] = []
  
  //const proveedor=useRef()

  const [caracteres,setCaracteres]=useState([])
  const [imagenes,setImagenes]=useState([])

  const [locacionBloqueada, setAlertLocation]=useState(false)

  const [retVal, setRetVal] = useState(null);



  useEffect(() => {

    const ubicacion = getLocation();

    ubicacion.then((value)=>{
    
    if (value!=0){

      const posicion=value
    props.setShowCargandoProveedores(true)
    const axios = require('axios');

    axios.get(props.url+"home/cliente/pedirdatos/"+props.email+"/"+props.item+"/"+"caracteres"+"/"+posicion).then((resp: { data: any; }) => {
      if (resp.data!="bad" && caracteres.length==0){
        setCaracteres(resp.data)
        props.setShowCargandoProveedores(false)
        
      }else{
        props.setShowCargandoProveedores(false)
      }
      })
      axios.get(props.url+"home/cliente/pedirdatos/"+props.email+"/"+props.item+"/"+"imagenes"+"/"+posicion).then((resp: { data: any; }) => {
        if (resp.data!="bad"&& imagenes.length==0){
          setImagenes(resp.data)
        }
    })

    }else{
      setAlertLocation(true)
    }
    
    })

  }, []);

    if(locacionBloqueada){

    
      return(<>

        <IonAlert isOpen={locacionBloqueada} onDidDismiss={() => setAlertLocation(false)} cssClass='my-custom-class'
            header={'UBICACIÓN DE DISPOSITIVO'}
            subHeader={''}
            message={'Debe activar la ubicación de su dispositivo'}
            buttons={[
              {
                text: 'OK',
                role: 'cancel',
                cssClass: 'secondary',
                handler: blah => {
                  props.setVerEmail("");
                  props.setItem("")
                }
              }
            
            ]}  /></>)

    }else{

      return (
        <div id="volver-contenedor-ExplorerContainer">

        <IonModal
        animated={true}
        isOpen={props.showModal2.isOpen}
        onDidDismiss={() => props.setShowModal2({ isOpen: false })}
      >
        <ModalVerCardProveedor 
           caracteres={caracteres}
           imagenes={imagenes} 
           email={props.email}
           emailCliente={props.emailCliente}
           proveedorEmail={props.email}
           setVerEmail={props.setVerEmail} 
           setItem={props.setItem}

          
        />  
      </IonModal>
      </div>


      )
    } 

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MisOrdenes = (props:{ misOrdenes: Array <ordenesCliente> , hayOrdenes:any, setVerOrden:any,setPosicion:any }) => {

  var i=0
  //if (props.proveedores!=[]){
    if (props.hayOrdenes){
      return (
        <>
        <h1>SERVICIOS EN CURSO</h1>
        <div>
          {props.misOrdenes.map((a) => {
            i = i + 1;
            return (<CardVistaVariasOrdenes key={i} posicion={i} tipo={a.tipo} status={a.status} fecha_creacion={a.fecha_creacion} ticket={a.ticket}
              dia={a.dia} hora={a.hora} titulo={a.titulo} descripcion={a.descripcion} imagen={a.imagen_proveedor} setVerOrden={props.setVerOrden} setPosicion={props.setPosicion}
            ></CardVistaVariasOrdenes>);
          })}
        </div></>
    )
    }else{
      return(
        <></>
      )
    }
    
  //}
      
}

const CardVistaVariasOrdenes= (props:{posicion:any,tipo:string,status:string,fecha_creacion:string,ticket: string,
  dia: string,hora:string,titulo:string,descripcion:string, imagen:string, setVerOrden:any, setPosicion:any }) => {
        
    var estado="Enviada"
    if (props.status=="ENV"){
      estado="PEDIDO DE TRABAJO ENVIADO"
    }else if(props.status=="REC"){
      estado="PEDIDO DE TRABAJO RECIBIDO"
    }else if(props.status=="ACE"){
      estado="PEDIDO DE TRABAJO ACEPTADO"
    }else if(props.status=="EVI"){
      estado="EN VIAJE"
    }else if(props.status=="ENS"){
      estado="EN SITIO"
    }

 
    return (
    <IonCard id="ionCard-explorerContainer-Proveedor" onClick={()=> {props.setVerOrden(true); props.setPosicion(props.posicion)}}>
      <IonGrid>
      <IonRow  id="row-busqueda">
        <IonCol size="auto"  id="col-explorerContainerCliente"><img id="img-explorerContainerCliente" src={props.imagen}></img></IonCol>
        <IonCol size="auto" id="col-explorerContainerCliente">
          <p>TIPO: {props.tipo.toUpperCase( )}</p>
          <p>STATUS: {estado}</p>
          <p>TICKET: {props.ticket}</p>
        </IonCol>
      </IonRow>
      
      </IonGrid>
        
  
    </IonCard>
       
  );
}

export const Categorias: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div id="columna3">

      <IonModal isOpen={showModal} cssClass='my-custom-class' animated={true} backdropDismiss={true}>
      <IonIcon icon={closeCircle} onClick={() => setShowModal(false)}></IonIcon>
        <div id="contenedor-central" >
        <IonList>
          <IonItem>
            <IonLabel>Pokémon Yellow</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Mega Man X</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>The Legend of Zelda</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Pac-Man</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Super Mario World</IonLabel>
          </IonItem>
        </IonList>
        </div>
        <IonButton onClick={() => setShowModal(false)}>Registrarse</IonButton>
      </IonModal>
      <IonChip onClick={() => setShowModal(true)}  >
        <IonIcon icon={chevronDown}/>
        <IonLabel>Categorias</IonLabel>
      </IonChip>
      </div>


  );
};


const Tabs= (props:{setShowModal:any,setTipoDeVistaEnModal:any  }) => {
  return(
  <IonCard id="IonCardTabs">
  <IonGrid id="ExplorerContainerCliente-Tabs">
  <IonRow>

    <IonCol id="ioncol-homecliente" onClick={() => {  props.setShowModal({ isOpen: true});  props.setTipoDeVistaEnModal("categorias")}}>
      <IonRow id="ionrow-homecliente"><small>CATEGORÍAS</small></IonRow>
      <IonRow id="ionrow-homecliente"><img src={"./assets/icon/servicio.png"} className="imagen-boton-principal"/></IonRow>
    </IonCol>

    <IonCol id="ioncol-homecliente" onClick={() => {  props.setShowModal({ isOpen: true});  props.setTipoDeVistaEnModal("emergencias")}}>
      <IonRow id="ionrow-homecliente"><small>EMERGENCIAS</small></IonRow>
      <IonRow id="ionrow-homecliente"><img src={"./assets/icon/sirena.png"} className="imagen-boton-principal"/></IonRow>
    </IonCol>

    <IonCol id="ioncol-homecliente" onClick={() => {  props.setShowModal({ isOpen: true});  props.setTipoDeVistaEnModal("programar")}}>
      <IonRow id="ionrow-homecliente"><small className="textoIconos">MIS ORDENES</small></IonRow>
      <IonRow id="ionrow-homecliente"><img src={"./assets/icon/time.png"} className="imagen-boton-principal"/></IonRow>
    </IonCol>
  
  </IonRow>
  </IonGrid >
  </IonCard> 
  )

/*  return(
    <>
    
    <IonReactRouter>

    <IonTabs>

        <IonRouterOutlet>
     
         
        </IonRouterOutlet>

        <IonTabBar slot="top">

          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon icon={triangle} />
            <IonLabel>CATEGORÍAS</IonLabel>
          </IonTabButton>

          <IonTabButton tab="tab2" href="/tab2">
            <img className="imagen-boton-principal" src={"./assets/icon/sirena.png"} />
            <IonLabel>EMERGENCIAS</IonLabel>
          </IonTabButton>

          <IonTabButton tab="tab3" href="/">
          <img className="imagen-boton-principal" src={"./assets/icon/time.png"} />
            <IonLabel>PROGRAMAR</IonLabel>
          </IonTabButton>
       
        </IonTabBar>
      </IonTabs>
      </IonReactRouter>
      </>
  )*/
}
  
export default ExploreContainerCliente;

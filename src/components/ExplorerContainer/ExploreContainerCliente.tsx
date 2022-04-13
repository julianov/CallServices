import { alert, chevronDown, closeCircle, trendingUpOutline } from 'ionicons/icons';
import React, { useMemo, useRef, useState } from 'react';

import './ExploreContainer.css';

import { Geolocation } from '@capacitor/core/dist/esm/web/geolocation';
import { useEffect } from 'react';
import axios from 'axios';
import { type } from 'os';

import {Adsense} from '@ctrl/react-adsense';
import { datosGeneralesVariosProveedores, ordenesCliente, proveedorBuscado } from '../../pages/Home/HomeCliente';
import { datosOrden } from '../../utilidades/CardProveedor';
import { getDB, setDB } from '../../utilidades/dataBase';
import ModalVerOrdenesCliente from '../VerOrdenes/ModalVerOrdenesCliente';
import Estrellas from '../Estrellas/Estrellas';
import ModalVerCardProveedor from '../CardProveedor/ModalVerCardProveedor';
import ResultadoBusqueda, { categoriaBuscada } from '../ResultadoBusqueda/ResultadoBusqueda';
import Resenas from '../Reseñas/Resenas';
import { IonAlert, IonButton, IonCard, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonGrid, IonIcon, IonItem, IonItemDivider, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonModal, IonRow, IonSlide, IonSlides } from '@ionic/react';
import { retornarIconoCategoria } from '../../utilidades/retornarIconoCategoria';
import OrdenSimple from '../../pages/PedirOrdenes/PedirOrden';

const getLocation = async () => {
  try {
      const position = await Geolocation.getCurrentPosition();
      const posicion=position.coords.latitude +"/"+ position.coords.longitude
      return posicion;

  } catch (e) {
    return 0;
  }
}
//var ultimos: never[]=[]

//let proveedores = new Array<ordenesCliente>();



const ExploreContainerCliente  = (props:{ordenes:any ,proveedores: Array<datosGeneralesVariosProveedores>, url:string, setShowCargandoProveedores:any, 
  setShowModal:any, setTipoDeVistaEnModal:any, emailCliente:String,
  buscar:any, busqueda_categorias:any, busquedaDatosProveedores:Array<proveedorBuscado>}) => {

  
  //const [proveedores, setProveedores]=useState()

  
  const [verEmail, setVerEmail]=useState("")
  const[item, setItem]=useState("")

  const [arregloOrdenesCliente, setArregloOrdenesCliente] =  useState <ordenesCliente []> ( [])

  const [hayOrdenes, setHayOrdenes]=useState(false)
  const [verOrden, setVerOrden] = useState( false );

  const [posicion, setPosicion] = useState(0)
  const [locacion, setLocacion] = useState("")


  const [verProveedor,setVerProveedor]= useState(false);
  const [pediOrden, setPediOrden] = useState(false);
  const [verReseña, setVerReseña] = useState(false);

  const tiipo = useRef("")

  const [ultimos, setUltimos] =  useState <categoriaBuscada []> ( [])


  const [datosDeOrdenes,setDatosDeOrdenes]=useState<datosOrden>(
    {
      clienteEmail:props.emailCliente,
      nombre:"",
      proveedorEmail:"",
      tipo:"",
      last_name:"",
      picture:"",
      items:"",
      qualification:0,
      dias_proveedor:"",
       }
  )



  useEffect(() => {

    for (let i=0; i<props.ordenes.length;i++){     

      setArregloOrdenesCliente([...arregloOrdenesCliente,{ 
        rubro:props.ordenes[i].rubro,
        tipo:props.ordenes[i].tipo,
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
        presupuesto:props.ordenes[i].presupuesto,
        pedido_mas_información:props.ordenes[i].pedido_mas_información,
        respuesta_cliente_pedido_mas_información:props.ordenes[i].respuesta_cliente_pedido_mas_información,
        picture1_mas_información:props.ordenes[i].picture1_mas_información,
        picture2_mas_información:props.ordenes[i].picture2_mas_información
      }])
    }

    if(props.ordenes.length > 0){
      setHayOrdenes(true)
    }
   
    const ubicacion = getLocation();
    ubicacion.then((value)=>{
      if (value!=0){
        setLocacion(value)
      }
    })

    if(pediOrden){
      axios.get(props.url+"home/cliente/pedirdatos/"+verEmail+"/"+item+"/"+"caracteres"+"/"+locacion).then((resp: { data: any; }) => {
        console.log("es aqui:"+resp.data)
        if (resp.data!="bad"){
          
         setDatosDeOrdenes( 
            {
              clienteEmail:props.emailCliente,
              nombre:resp.data.name+" "+resp.data.last_name,
              proveedorEmail:verEmail,
              tipo:resp.data.tipo,
              last_name:resp.data.last_name,
              picture:resp.data.picture,
              items:resp.data.items,
              qualification:resp.data.qualification,
              dias_proveedor:resp.data.days_of_works
            })
          }
        })
    }

  

  }, [props.ordenes, pediOrden]);

  
  useEffect(() => {


    getDB("UltimosProveedores").then(res => {
      if(res!=null){
        setUltimos(res.map((d: { item: any; tipo: any; nombre: any; apellido: any; imagen: any; calificacion: any; email: any; }) => ({
          item:d.item,
          tipo:d.tipo,
          nombre:d.nombre,
          apellido:d.apellido,
          imagen:d.imagen,
          calificacion:d.calificacion,
          email:d.email
           }))
         );       
       
      }
    })

  }, [ props.busqueda_categorias]);

  if (props.busqueda_categorias.length == 0 && props.buscar=="" ){
      if (verEmail=="" && item =="" ){
        return (
          <>
          <div id="container-principal-ExplorerContainer-Cliente">  
            <Tabs setShowModal={props.setShowModal} setTipoDeVistaEnModal={props.setTipoDeVistaEnModal} ></Tabs>
            <MisOrdenes hayOrdenes={hayOrdenes} misOrdenes={arregloOrdenesCliente}  setVerOrden={setVerOrden} setPosicion={setPosicion}></MisOrdenes>
            <IonItemDivider />

            <h1 style={{fontWeight:"600", fontSize:"1.5em", marginTop:"5px"}}>PROVEEDORES DE SERVICIOS</h1>    
            <h1 style={{fontWeight:"600", fontSize:"1.5em", marginTop:"0px"}}>EN LA ZONA</h1>          
            <ProveedoresEnZona  proveedores={props.proveedores!} setVerEmail={setVerEmail} setItem={setItem} 
             setPediOrden={setPediOrden}  setVerReseña={setVerReseña}  setVerProveedor={setVerProveedor}
             tiipo={tiipo} />
          </div>
  
  
          <IonModal
            animated={true}
            isOpen={verOrden}
            onDidDismiss={() => setVerOrden( false )}
            >
            <ModalVerOrdenesCliente 
              datos={arregloOrdenesCliente[posicion-1]}
              setVolver={setVerOrden}
              emailCliente={props.emailCliente}
            />  
        </IonModal>
              </>
          );
  
      }
      else{

        if (verReseña){
          return (
            <IonModal
              animated={true}
              isOpen={verReseña}
              onDidDismiss={() =>setVerReseña(false )} >
              <Resenas
                tipo={tiipo.current}
                email_a_ver_reseñas={verEmail}
                setVolver={setVerReseña} />
          </IonModal>
          )
    
        }else if(pediOrden){

          return (
    
            <IonModal
              animated={true}
              isOpen={pediOrden}
              onDidDismiss={() => setPediOrden( false )}>
              <OrdenSimple
                data={datosDeOrdenes} 
                clienteEmail={props.emailCliente} 
                proveedorVaALocacion={true}
                setVolver={setPediOrden} />
          </IonModal>
    
    
          
          )
    
        }else if (verProveedor){
          return (
            <><div id="container-principal-ExplorerContainer-Cliente">
              <VerProveedorParticular url={props.url} emailCliente={props.emailCliente} email={verEmail} setVerEmail={setVerEmail} verProveedor={verProveedor} setVerProveedor={setVerProveedor} item={item} setItem={setItem} setShowCargandoProveedores={props.setShowCargandoProveedores}/>
            </div>
          </>
          )
        }
        else{
          setVerEmail("") 
           setItem ("") 
           return(<></>)
        }
        
      
      
      }

    
    }else{

   
    return (
      <div id="container-principal-ExplorerContainer-Cliente">   
        <ResultadoBusqueda emailCliente={props.emailCliente} arreglo_categorias={props.busqueda_categorias} arreglo_ultimos={ultimos} busquedaDatosProveedores={props.busquedaDatosProveedores} ></ResultadoBusqueda>
      </div>
    )
  }
  
}



const ProveedoresEnZona = (props:{ proveedores: Array<datosGeneralesVariosProveedores> , setVerEmail:any, 
  setItem:any,setPediOrden:any,  setVerReseña:any, setVerProveedor:any,tiipo:any}) => {

  var i=0
  //if (props.proveedores!=[]){

    return (
      <div id="elementos">
        {(props.proveedores || []).map((a) => {
          i=i+1
          //item, imagen personal, distancia, calificación, email, nombre, apellido, tipo
          return (<CardVistaVariosProveedores key={i} item={a.item} personalImg={a.imagenPersonal} distancia={a.distancia} calificacion={a.calificacion} email={a.email} nombre={a.nombre} apellido={a.apellido} tipo={a.tipo} setVerEmail={props.setVerEmail} setItem={props.setItem} 
            setPediOrden={props.setPediOrden}  setVerReseña={props.setVerReseña} setVerProveedor={props.setVerProveedor} 
            tiipo={props.tiipo} ></CardVistaVariosProveedores> ) 
        })
        }
    </div>
  )
  //}
      
}


          //item, imagen, distancia, calificación, email, nombre, apellido,

const CardVistaVariosProveedores= (props:{item:any, personalImg:any ,distancia: any, calificacion:any, 
  email:any, nombre: any, apellido:any, tipo:any, setVerEmail:any, setItem:any,
  setPediOrden:any,  setVerReseña:any, setVerProveedor:any, tiipo:any }) => {
    

    const [imagen, setImagen] = useState (props.personalImg)

    const verProveedor = ()=> {
      //if(props.email=="" && props.item==""){
        props.setVerEmail(props.email)
        props.setVerProveedor(true)
        props.setItem(props.item)

     // }
    }

    const orden = ()=> {

      props.setVerEmail(props.email)
      props.setItem(props.item)
      props.setPediOrden(true)
      
    }

    const verReseñas = ()=> {
      props.setVerEmail(props.email)
      props.setItem(props.item)
      props.tiipo.current=props.tipo
      props.setVerReseña(true)

    }

    const surname = useRef("")
    if (props.tipo=="2"){
    surname.current=props.apellido.toUpperCase()  
    }else{
      surname.current=""
    } 

    useEffect(() => {
      if (props.personalImg==""|| props.personalImg==null || props.personalImg==undefined){
        setImagen ("./assets/icon/nuevoUsuario.png") 
      }else{
        setImagen(props.personalImg)
      }
    }, [props.personalImg]);
    
    return (
    <IonCard id="ionCard-explorerContainer-Cliente">
      <IonGrid>
      <IonRow  id="row-busqueda">
        <IonCol size="auto"  id="col-explorerContainerCliente"><img id="img-explorerContainerCliente" src={imagen}></img></IonCol>
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
          <IonCol id="ioncol-homecliente" onClick={()=>{orden()} }>
            <IonRow id="ionrow-homecliente"><img src={"./assets/icon/seleccionar.png"} className="imagen-boton-principal"/></IonRow>
            <IonRow id="ionrow-homecliente"><small>SOLICITAR</small></IonRow>
          </IonCol>
          <IonCol id="ioncol-homecliente" onClick={()=>{ verReseñas()} }>
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
  setShowCargandoProveedores:any, verProveedor:any, setVerProveedor:any} ) =>{

  const [caracteres,setCaracteres]=useState([])
  const [imagenes,setImagenes]=useState([])
  const [locacionBloqueada, setAlertLocation]=useState(false)

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
      return(
      <>
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
            
            ]}  />
            </>
      )
    }else{
      return (
        <div id="volver-contenedor-ExplorerContainer">
          <IonModal
            animated={true}
            isOpen={props.verProveedor}
            onDidDismiss={() => props.setVerProveedor( false )}
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
        <h1 style={{fontWeight:"600", fontSize:"1.5em"}}>SERVICIOS EN CURSO</h1>
        <div>
        <IonSlides >
          {props.misOrdenes.map((a) => {
            i = i + 1;
            return (
              <IonSlide>
                <CardVistaVariasOrdenes key={i} posicion={i} rubro={a.rubro} tipo={a.tipo} status={a.status} fecha_creacion={a.fecha_creacion} ticket={a.ticket}
                  dia={a.dia} hora={a.hora} titulo={a.titulo} descripcion={a.descripcion} imagen={a.imagen_proveedor} setVerOrden={props.setVerOrden} setPosicion={props.setPosicion}
                  presupuesto={a.presupuesto} masInfo={a.pedido_mas_información} masInfoEnviada={a.respuesta_cliente_pedido_mas_información}></CardVistaVariasOrdenes>
            </IonSlide>);
          })}
        </IonSlides>
        </div></>
    )
    }else{
      return(
        <></>
      )
    }
    
  //}
      
}

const CardVistaVariasOrdenes= (props:{rubro:any, posicion:any,tipo:string,status:string,fecha_creacion:string,ticket: string,
  dia: string,hora:string,titulo:string,descripcion:string, imagen:string, setVerOrden:any, setPosicion:any, presupuesto:any, masInfo:any, masInfoEnviada:string}) => {
        
    const [estado,setEstado]=useState("Enviada")

    const [mensaje1, setMensaje1] = useState("")
    const [mensaje2, setMensaje2] = useState("")

   // createStore("ordenesActivas")

    const ticketeck = useRef <string>("")
    const [nuevoStatus,setNuevoStatus]=useState(false)

    const [imagenes,setImagen]=useState ("")

    useEffect(() => {

      setImagen(retornarIconoCategoria(props.rubro)) 
     
 }, [props.ticket]); 

    useEffect(() => {

      ticketeck.current= props.ticket 

    if (props.status=="ENV"){
      setEstado("PEDIDO DE TRABAJO ENVIADO")
    }else if(props.status=="REC"){
      setEstado("PEDIDO DE TRABAJO RECIBIDO")
    }else if(props.status=="ABI"){
      setEstado("PEDIDO DE TRABAJO RECIBIDO")
    }else if(props.status=="PEI"){


      if(props.masInfoEnviada!="" && props.masInfoEnviada!=undefined){
        setEstado("MÁS INFORMACIÓN ENVIADA")
        setMensaje1("En espera de respuesta del proveedor")
      }else{
        setEstado("SOLILCITUD DE MÁS INFORMACIÓN")
        setMensaje1("EL PROVEEDOR SOLICITA MÁS INFORMACIÓN")
        setMensaje2("Ingrese para aceptarlo o rechazarlo")
      }

    }else if(props.status=="PRE"){
      setEstado("TRABAJO PRESUPUESTADO")
      setMensaje1("EL PROVEEDOR HA ENVIADO COTIZACIÓN")
      setMensaje2("Ingrese responder")
    } else if(props.status=="ACE"){
      setEstado("PEDIDO DE TRABAJO ACEPTADO")
    }else if(props.status=="EVI"){
      setEstado("EN VIAJE")
      setMensaje1("EL PROVEEDOR ESTÁ EN CAMINO!")
    }else if(props.status=="ENS"){
      setEstado("EN SITIO")
    }else if(props.status=="RED"){
      setEstado("ORDEN DE TRABAJO FINALIZADA")
      setMensaje1("CALIFIQUE AL PROVEEDOR DEL SERVICIO")
    }

    getDB(ticketeck.current.toString( )).then(res => {
      if(res!=undefined || res!=null){
       //arreglo.push(res)
       //aca copia todo, el numero 1 del arreglo no es el rubro sino la primer letra del rubro y así.
        if(res!=props.status){
          setNuevoStatus(true)
          setDB(ticketeck.current, props.status)

        }  
        
      }else{
        setDB(ticketeck.current, props.status)
        setNuevoStatus(false)
      }

    })

  }, [props.status])


    if(nuevoStatus){
      return (
        <IonCard id="ionCard-explorerContainer-Cliente" onClick={()=> {props.setVerOrden(true); props.setPosicion(props.posicion)}}>

        <div id="iconoDerecha">            
          <IonIcon icon={alert} id="iconoNuevaStatus" ></IonIcon>
        </div > 
          <IonGrid>
            <IonRow  id="row-busqueda">
              <IonCol   id="col-explorerContainerCliente">
                <img id="imgOrden" src={imagenes}></img>
              </IonCol>
            </IonRow>
            <IonRow  id="row-busqueda">
              <IonCol   id="col-explorerContainerCliente">
                <IonCardSubtitle>TIPO: {props.tipo.toUpperCase( )}</IonCardSubtitle>
                <IonCardSubtitle>STATUS: {estado}</IonCardSubtitle>
                <IonCardSubtitle>TICKET: {props.ticket}</IonCardSubtitle>  
              </IonCol>
            </IonRow>
            <IonRow  id="row-busqueda">
              <IonCol   id="col-explorerContainerCliente">
                <IonCardSubtitle>{mensaje1}</IonCardSubtitle>
                <IonCardSubtitle>{mensaje2}</IonCardSubtitle>
              </IonCol>
            </IonRow> 
          </IonGrid>
        </IonCard>
      )    
    }else{
      return (
        <IonCard id="ionCard-explorerContainer-Cliente" onClick={()=> {props.setVerOrden(true); props.setPosicion(props.posicion)}}>

          <IonGrid>
            <IonRow  id="row-busqueda">
              <IonCol   id="col-explorerContainerCliente">
                <img id="imgOrden" src={imagenes}></img>
              </IonCol>
            </IonRow>
            <IonRow  id="row-busqueda">
              <IonCol   id="col-explorerContainerCliente">
                <IonCardSubtitle>TIPO: {props.tipo.toUpperCase( )}</IonCardSubtitle>
                <IonCardSubtitle>STATUS: {estado}</IonCardSubtitle>
                <IonCardSubtitle>TICKET: {props.ticket}</IonCardSubtitle>  
              </IonCol>
            </IonRow>
            <IonRow  id="row-busqueda">
              <IonCol   id="col-explorerContainerCliente">
                <IonCardSubtitle>{mensaje1}</IonCardSubtitle>
                <IonCardSubtitle>{mensaje2}</IonCardSubtitle>
              </IonCol>
            </IonRow> 
          </IonGrid>
        </IonCard>
      )    
    }
      
}

export const Categorias: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div id="columna3">

      <IonModal isOpen={showModal} 
       animated={true} backdropDismiss={true}>
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

}



  
export default ExploreContainerCliente;

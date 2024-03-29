import { alert, arrowBack, arrowForward, chevronDown, closeCircle, trendingUpOutline } from 'ionicons/icons';
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
import ModalVerOrdenesCliente from '../VerOrdenes/VerOrdenesCliente/ModalVerOrdenesCliente';
import Estrellas from '../Estrellas/Estrellas';
import ModalVerCardProveedor from '../CardProveedor/ModalVerCardProveedor';
import ResultadoBusqueda, { categoriaBuscada } from '../ResultadoBusqueda/ResultadoBusqueda';
import Resenas from '../Reseñas/Resenas';
import { IonAlert, IonButton, IonCard, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonItemDivider, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonModal, IonRow, IonSlide, IonSlides } from '@ionic/react';
import { retornarIconoCategoria } from '../../utilidades/retornarIconoCategoria';
import OrdenSimple from '../../pages/PedirOrdenes/PedirOrden';
import VerOrdenesCliente from '../../pages/VerOrdenes';

const getLocation = async () => {
  try {
      const position = await Geolocation.getCurrentPosition();
      const posicion=position.coords.latitude +"/"+ position.coords.longitude
      return posicion;

  } catch (e) {
    return 0;
  }
}


const ExploreContainerCliente  = (props:{notifications:any, setNotifications:any ,ordenes:any,  setOrdenes:any, proveedores: Array<datosGeneralesVariosProveedores>, url:string, setShowCargandoProveedores:any, 
  setShowModal:any, setTipoDeVistaEnModal:any, emailCliente:String,
  buscar:any, busqueda_categorias:any, busquedaDatosProveedores:Array<proveedorBuscado>, nuevasOrdenes:any, setNuevasOrdenes:any,
  ticket:any, setTicket:any, verOrden:any, setVerOrden:any, setCategoriaAVer:any}) => {

  const [recargarOrden, setRecargarOrden] = useState(false)
  
  const [verEmail, setVerEmail]=useState("")
  const[item, setItem]=useState("")

  const [hayOrdenes, setHayOrdenes]=useState(false)
  
  const [locacion, setLocacion] = useState("")

  const [verProveedor,setVerProveedor]= useState(false);
  const [pediOrden, setPediOrden] = useState(false);
  const [verReseña, setVerReseña] = useState(false);

  const tiipo = useRef("")
  const [tipo, setTipo] = useState("")

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
      
        return (
          <>
          <div id="container-principal-ExplorerContainer-Cliente">  
            <Tabs setShowModal={props.setShowModal} setTipoDeVistaEnModal={props.setTipoDeVistaEnModal} ></Tabs>
            
            <MisOrdenes hayOrdenes={hayOrdenes} misOrdenes={props.ordenes} setTicket={props.setTicket} setVerOrden={props.setVerOrden} recargarOrden={props.verOrden} setTipo={setTipo} setShowModal={props.setShowModal} setTipoDeVistaEnModal={props.setTipoDeVistaEnModal}></MisOrdenes>

            <CategoriasUtiles setShowModal={props.setShowModal} setTipoDeVistaEnModal={props.setTipoDeVistaEnModal} setCategoriaAVer={props.setCategoriaAVer} />

            <IonItemDivider />

            <h1 style={{fontWeight:"600", fontSize:"1.5em", marginTop:"5px"}}>PROVEEDORES DE SERVICIOS</h1>    
            <h1 style={{fontWeight:"600", fontSize:"1.5em", marginTop:"0px"}}>EN LA ZONA</h1>          
            <ProveedoresEnZona  proveedores={props.proveedores!} setVerEmail={setVerEmail} setItem={setItem} 
             setPediOrden={setPediOrden}  setVerReseña={setVerReseña}  setVerProveedor={setVerProveedor}
             tiipo={tiipo} />
          </div>
  
  
          <IonModal
            animated={true}
            isOpen={props.verOrden}
            onDidDismiss={() => props.setVerOrden( false )}>

            <ModalVerOrdenesCliente 
              notifications={props.notifications} 
              setNotifications={props.setNotifications}
              
              ticket={props.ticket}
              datosCompletos={props.ordenes}
              setDatosCompletos={props.setOrdenes}

              setVolver={props.setVerOrden}
              emailCliente={props.emailCliente} 
              nuevasOrdenes={props.nuevasOrdenes}
              setNuevasOrdenes={props.setNuevasOrdenes}
              tipo={tipo}
              />  
        </IonModal>

        <IonModal
            animated={true}
            isOpen={verReseña}
            onDidDismiss={() =>setVerReseña(false )} >
            <Resenas
              tipo={tiipo.current}
              email_a_ver_reseñas={verEmail}
              setVolver={setVerReseña} />
        </IonModal>

        <IonModal
            animated={true}
            isOpen={pediOrden}
            onDidDismiss={() => setPediOrden( false )}>
            <OrdenSimple
            ordenes={props.ordenes}
              data={datosDeOrdenes} 
              clienteEmail={props.emailCliente} 
              proveedorVaALocacion={true}
              setVolver={setPediOrden} />
        </IonModal>

        <IonModal
          animated={true}
          isOpen={verProveedor}
          onDidDismiss={() => setVerProveedor( false )}>
          <ModalVerCardProveedor 
              ordenes={props.ordenes}
              email={verEmail}
              emailCliente={props.emailCliente}
              proveedorEmail={verEmail}
              setVerEmail={setVerEmail}
              setItem={setItem}
              setVerProveedor={setVerProveedor} 
              url={props.url} 
              setShowCargandoProveedores={props.setShowCargandoProveedores} 
              item={item}/>  
        </IonModal>
     </>
 );
  
    }else{
      return (
        <div id="container-principal-ExplorerContainer-Cliente">   
          <ResultadoBusqueda  ordenes={props.ordenes} emailCliente={props.emailCliente} arreglo_categorias={props.busqueda_categorias} arreglo_ultimos={ultimos} busquedaDatosProveedores={props.busquedaDatosProveedores} ></ResultadoBusqueda>
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MisOrdenes = (props:{ misOrdenes: Array <ordenesCliente> , setTicket:any, hayOrdenes:any, setVerOrden:any, recargarOrden:any, setTipo:any, setShowModal:any, setTipoDeVistaEnModal:any }) => {

  var i=0
  //if (props.proveedores!=[]){

    if (props.hayOrdenes){

      return (
        <>
        <IonCard style={{display:"flex", flexDirection:"column", color:"white", width:"90%", height:"auto", justifyContent:"center", alignItems:"center" }}>

        <h1 style={{fontWeight:"600", fontSize:"1.5em", color:"black"}}>SERVICIOS EN CURSO</h1>
        <div style={{display:"flex", flexDirection:"row", width:"100%", height:"auto"}} >
        <IonSlides pager={true} >
          {props.misOrdenes.map((a) => {
            i = i + 1;
            if (a.tipo=="Orden de emergencia"){
              return (
              
                <IonSlide>
                  <CardVistaVariasOrdenesEmergencia key={i} setTicket={props.setTicket} posicion={i} rubro={a.rubro} tipo={a.tipo} status={a.status} fecha_creacion={a.fecha_creacion} ticket={a.ticket}
                    dia={a.dia} hora={a.hora} titulo={a.titulo} descripcion={a.descripcion} imagen={a.imagen_proveedor} setVerOrden={props.setVerOrden} 
                    presupuesto={a.presupuesto} masInfo={a.pedido_mas_información} masInfoEnviada={a.respuesta_cliente_pedido_mas_información} recargarOrden={props.recargarOrden} setTipo={props.setTipo}></CardVistaVariasOrdenesEmergencia>
                </IonSlide>
                            
              );
            }else{

            
            return (
              
              <IonSlide>
                <CardVistaVariasOrdenes key={i} setTicket={props.setTicket} posicion={i} rubro={a.rubro} tipo={a.tipo} status={a.status} fecha_creacion={a.fecha_creacion} ticket={a.ticket}
                  dia={a.dia} hora={a.hora} titulo={a.titulo} descripcion={a.descripcion} imagen={a.imagen_proveedor} setVerOrden={props.setVerOrden} 
                  presupuesto={a.presupuesto} masInfo={a.pedido_mas_información} masInfoEnviada={a.respuesta_cliente_pedido_mas_información} recargarOrden={props.recargarOrden} setTipo={props.setTipo}></CardVistaVariasOrdenes>
              </IonSlide>
                          
            );
          }
          })}
        </IonSlides>

        </div>
        <VerTodas cantidad={props.misOrdenes.length} setShowModal={props.setShowModal} setTipoDeVistaEnModal={props.setTipoDeVistaEnModal} />

        </IonCard>
      </>
    )
    }else{
      return(
        <></>
      )
    }
    
  //}
      
}

const CardVistaVariasOrdenes = (props:{setTicket:any, rubro:any, posicion:any,tipo:string,status:string,fecha_creacion:string,ticket: string,
  dia: string,hora:string,titulo:string,descripcion:string, imagen:string, setVerOrden:any, presupuesto:any, masInfo:any, masInfoEnviada:string, recargarOrden:any, setTipo:any}) => {
        

    const [estado,setEstado]=useState("Enviada")

    const [mensaje1, setMensaje1] = useState("")
    //const [mensaje2, setMensaje2] = useState("")

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
        setEstado("SOLICITUD DE TRABAJO ENVIADO")
      }
      else if(props.status=="REC"){
        setEstado("ORDEN RECIBIDA POR PROVEEDOR")

      }else if(props.status=="PEI"){
        setEstado("SOLILCITUD DE MÁS INFORMACIÓN")
        setMensaje1("EL PROVEEDOR SOLICITA MÁS INFORMACIÓN")

      }else if(props.status=="RES"){
        setEstado("INFORMACIÓN ADICIONAL ENVIADA")
        setMensaje1("EN ESPERA DE PRESUPUESTO")

      }else if(props.status=="PRE"){
        setEstado("PRESUPUESTADA")
        setMensaje1("EL PROVEEDOR HA ENVIADO COTIZACIÓN")

      }else if(props.status=="ACE"){
        setEstado("PRESUPUESTO ACEPTADO")
        setMensaje1("EN ESPERA DEL PROVEEDOR")

      }else if(props.status=="EVI"){
        setEstado("PROVEEDOR EN VIAJE")
        setMensaje1("EL PROVEEDOR ESTÁ EN CAMINO!")

      }else if(props.status=="ENS"){
        setEstado("PROVEEDOR EN SITIO")

      }else if(props.status=="RED"){
        setEstado("REALIZADA")
        setMensaje1("CALIFIQUE AL PROVEEDOR DEL SERVICIO")

      }else if (props.status=="REX"){
        setEstado("RECHAZADA")

      }else if (props.status=="CAN"){
        setEstado("CANCELADA")

      }

    getDB(ticketeck.current.toString( )+"cliente").then(res => {
      if(res!=undefined || res!=null){
        if(res!=props.status){
          setNuevoStatus(true)
        }  
        }else{
          setNuevoStatus(false)
        }
    })
    

  }, [props.status, props.recargarOrden])


    if(nuevoStatus){
      return (
        <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100%", justifyContent:"center",alignItems:"center"}} onClick={()=> {props.setVerOrden(true); props.setTicket(props.ticket); props.setTipo(props.tipo)}}>

        <div id="iconoDerecha">            
          <IonIcon icon={alert} id="iconoNuevaStatus" ></IonIcon>
        </div > 
          <IonGrid>
            <IonRow id="row-busqueda">
              <IonCol id="col-explorerContainerCliente">
                <img id="imgOrden" src={imagenes}></img>
              </IonCol>
            </IonRow>
            <IonRow  id="row-busqueda">
              <IonCol   id="col-explorerContainerCliente">
                <h2 style={{margin:"0px 0px 5px 0px", color:"black", fontSize:"0.75em"}}>{estado}</h2>
                <h2 style={{margin:"0px 0px 5px 0px", color:"black", fontSize:"0.75em"}}>{mensaje1}</h2>
                <h2 style={{margin:"0px 0px 20px 0px", color:"black", fontSize:"0.75em"}}>TICKET: {props.ticket}</h2>  
              </IonCol>
            </IonRow>
            
          </IonGrid>
        </div>
      )    
    }else{
      return (
        <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100%", justifyContent:"center",alignItems:"center"}} onClick={()=> {props.setVerOrden(true); props.setTicket(props.ticket); props.setTipo(props.tipo)}}>

          <IonGrid>
            <IonRow  id="row-busqueda">
              <IonCol   id="col-explorerContainerCliente">
                <img id="imgOrden" src={imagenes}></img>
              </IonCol>
            </IonRow>
            <IonRow  id="row-busqueda">
              <IonCol   id="col-explorerContainerCliente">
                <h2 style={{margin:"0px 0px 5px 0px", color:"black", fontSize:"0.75em"}}>{estado}</h2>
                <h2 style={{margin:"0px 0px 5px 0px", color:"black", fontSize:"0.75em"}}>{mensaje1}</h2>
                <h2 style={{margin:"0px 0px 20px 0px", color:"black", fontSize:"0.75em"}}>TICKET: {props.ticket}</h2>  
              </IonCol>
            </IonRow>
            
          </IonGrid>
        </div>
      )    
    }
      
}

const CardVistaVariasOrdenesEmergencia  = (props:{setTicket:any, rubro:any, posicion:any,tipo:string,status:string,fecha_creacion:string,ticket: string,
  dia: string,hora:string,titulo:string,descripcion:string, imagen:string, setVerOrden:any, presupuesto:any, masInfo:any, masInfoEnviada:string, recargarOrden:any, setTipo:any}) => {

    const [estado,setEstado]=useState("Enviada")
    const [nuevoStatus,setNuevoStatus]=useState(false)
    const [mensaje1, setMensaje] = useState("")

    const [imagen, setImagen] = useState("")

    useEffect(() => {

      setImagen(retornarIconoCategoria(props.rubro)) 
     
 }, [props.ticket]); 

    useEffect(() => {


      if (props.status=="ENV"){
        setEstado("PEDIDO DE TRABAJO")
        setMensaje("SOLICITUD CON EMERGENCIA")
      }else if(props.status=="ACE"){
        setEstado("PROVEEDOR SELECCIONADO")
      }else if(props.status=="EVI"){
        setEstado("PROVEEDOR EN VIAJE A SU SITIO")
        setMensaje("ESPERE AL PROVEEDOR EN SU LOCACIÓN")
      }else if(props.status=="ENS"){
        setEstado("PROVEEDOR EN SITIO")
        
      } 
      
      
      getDB(props.ticket+"cliente").then(res => {
        if(res!=undefined || res!=null){
          if(res!=props.status && props.status!="ENV"){
            setNuevoStatus(true)
          }  
          }else{
            setNuevoStatus(false)
          }
      })
      

  
    }, [props.status, props.recargarOrden]);

    useEffect(() => {
      setImagen(retornarIconoCategoria(props.rubro)) 
    }, []); 


    if(nuevoStatus){
      return (
        <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100%", justifyContent:"center",alignItems:"center"}} onClick={()=> {props.setVerOrden(true); props.setTicket(props.ticket); props.setTipo(props.tipo)}}>

        <div id="iconoDerecha">            
          <IonIcon icon={alert} id="iconoNuevaStatus" ></IonIcon>
        </div > 
          <IonGrid>
            <IonRow id="row-busqueda">
              <IonCol id="col-explorerContainerCliente">
                <img id="imgOrden" src={imagen}></img>
              </IonCol>
            </IonRow>
            <IonRow  id="row-busqueda">
              <IonCol   id="col-explorerContainerCliente">
                <h2 style={{margin:"0px 0px 5px 0px", color:"black", fontSize:"0.75em"}}>{estado}</h2>
                <h2 style={{margin:"0px 0px 5px 0px", color:"black", fontSize:"0.75em"}}>{mensaje1}</h2>
                <h2 style={{margin:"0px 0px 20px 0px", color:"black", fontSize:"0.75em"}}>TICKET: {props.ticket}</h2>  
              </IonCol>
            </IonRow>
            
          </IonGrid>
        </div>
      )    
    }else{
      return (
        <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100%", justifyContent:"center",alignItems:"center"}} onClick={()=> {props.setVerOrden(true); props.setTicket(props.ticket); props.setTipo(props.tipo)}}>

          <IonGrid>
            <IonRow  id="row-busqueda">
              <IonCol   id="col-explorerContainerCliente">
                <img id="imgOrden" src={imagen}></img>
              </IonCol>
            </IonRow>
            <IonRow  id="row-busqueda">
              <IonCol   id="col-explorerContainerCliente">
                <h2 style={{margin:"0px 0px 5px 0px", color:"black", fontSize:"0.75em"}}>{estado}</h2>
                <h2 style={{margin:"0px 0px 5px 0px", color:"black", fontSize:"0.75em"}}>{mensaje1}</h2>
                <h2 style={{margin:"0px 0px 20px 0px", color:"black", fontSize:"0.75em"}}>TICKET: {props.ticket}</h2>  
              </IonCol>
            </IonRow>
            
          </IonGrid>
        </div>
      )    
    }


  }
  

const Tabs= (props:{setShowModal:any,setTipoDeVistaEnModal:any }) => {
  return(
  
  <IonGrid >
  <IonRow>

    
    <IonCol id="ioncol-homecliente" onClick={() => {  props.setShowModal({ isOpen: true});  props.setTipoDeVistaEnModal("categorias")}}>
    <IonCard id="IonCardTabs">
      
      <img src={"./assets/icon/servicio-en-espera.png"} style={{width:"50px", height:"50px"}} />
      <h1 style={{fontWeight:"600", fontSize:"1em", color:"black"}}>CATEGORÍAS</h1>

      </IonCard>     
    </IonCol>

    <IonCol id="ioncol-homecliente" onClick={() => {  props.setShowModal({ isOpen: true});  props.setTipoDeVistaEnModal("emergencias")}}>
    <IonCard id="IonCardTabs">
      <img src={"./assets/icon/sirena.png"} style={{width:"50px", height:"50px"}} />
      <h1 style={{fontWeight:"600", fontSize:"1em", color:"black"}}>EMERGENCIAS</h1>

      </IonCard> 
    </IonCol>

    <IonCol id="ioncol-homecliente" onClick={() => {  props.setShowModal({ isOpen: true});  props.setTipoDeVistaEnModal("programar")}}>
    <IonCard id="IonCardTabs">
      
      <img src={"./assets/icon/tiket.png"} style={{width:"50px", height:"50px"}} />
      <h1 style={{fontWeight:"600", fontSize:"1em", color:"black"}}>MIS ORDENES</h1>

      </IonCard> 
    </IonCol>
  
  </IonRow>
  </IonGrid>
  
  )

}


const VerTodas = (props:{cantidad:number, setShowModal:any, setTipoDeVistaEnModal:any}) =>{
  if(props.cantidad>1){
    return(<p onClick={() => {  props.setShowModal({ isOpen: true});  props.setTipoDeVistaEnModal("programar")}}>VER TODAS</p> )
  }else{
    return(<></>)
  }
}

const CategoriasUtiles = (props:{setShowModal:any,setTipoDeVistaEnModal:any, setCategoriaAVer:any }) =>{


  return (
    <IonCard  style={{display:"flex", flexDirection:"column", width:"90%", height:"auto"}}>
      <div style={{display:"flex", flexDirection:"column",width:"100%", alignItems:"center", textAlign:"center"}}>
        
      <strong style={{margin:"15px 0px 15px 10px"}}>CATEGORÍAS MAS DEMANDADAS</strong>
      </div>
      <IonItemDivider />
      <IonGrid>
        <IonRow>
          <IonCol style={{display:"flex", flexDirection:"column"}} onClick={() => {  props.setShowModal({ isOpen: true});  props.setCategoriaAVer("CERRAJERÍA"); props.setTipoDeVistaEnModal("categoríaEspecial")}} >
            <img style={{width:"32px", height:"32px"}} src={ retornarIconoCategoria("CERRAJERÍA")}></img>
            <p style={{fontWeight:"bold"}}>CERRAJERÍA</p>
          </IonCol>
          <IonCol style={{display:"flex", flexDirection:"column"}} onClick={() => {  props.setShowModal({ isOpen: true});  props.setCategoriaAVer("ELECTRICIDAD"); props.setTipoDeVistaEnModal("categoríaEspecial")}}>
            <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("ELECTRICIDAD")}></img>                
            <p style={{fontWeight:"bold"}}>ELECTRICIDAD</p>
          </IonCol> 
          <IonCol style={{display:"flex", flexDirection:"column"}} onClick={() => {  props.setShowModal({ isOpen: true});  props.setCategoriaAVer("FLETE"); props.setTipoDeVistaEnModal("categoríaEspecial")}}>
            <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("FLETE")}></img>
            <p style={{fontWeight:"bold"}}>FLETE</p>
          </IonCol>   
        </IonRow>
        <IonRow>
          <IonCol style={{display:"flex", flexDirection:"column"}} onClick={() => {  props.setShowModal({ isOpen: true});  props.setCategoriaAVer("GASISTA"); props.setTipoDeVistaEnModal("categoríaEspecial")}}>
            <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("GASISTA")}></img>
            <p style={{fontWeight:"bold"}}>GASISTA</p>
          </IonCol>
          <IonCol style={{display:"flex", flexDirection:"column"}} onClick={() => {  props.setShowModal({ isOpen: true});  props.setCategoriaAVer("MECÁNICA"); props.setTipoDeVistaEnModal("categoríaEspecial")}}>
            <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("MECÁNICA")}></img>
            <p style={{fontWeight:"bold"}}>MECÁNICA</p>
          </IonCol> 
          <IonCol style={{display:"flex", flexDirection:"column"}} onClick={() => {  props.setShowModal({ isOpen: true});  props.setCategoriaAVer("REFRIGERACIÓN"); props.setTipoDeVistaEnModal("categoríaEspecial")}}>
            <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("REFRIGERACIÓN")}></img>
            <p style={{fontWeight:"bold"}}>REFRIGERACIÓN</p>
          </IonCol>   
        </IonRow>
        <IonRow>
        <IonItemDivider />

          <IonCol style={{display:"flex", flexDirection:"column"}} onClick={() => {  props.setShowModal({ isOpen: true});  props.setTipoDeVistaEnModal("categorias")}}>
            <p style={{fontWeight:"bold"}}>VER TODAS</p>
          </IonCol>   
        </IonRow>
      </IonGrid>

    </IonCard>

  )
}


  
export default ExploreContainerCliente;

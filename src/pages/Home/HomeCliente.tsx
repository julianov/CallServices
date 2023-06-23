import { IonAlert, IonAvatar, IonButton, IonButtons, IonCard, IonChip, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonItemDivider, IonItemOptions, IonItemSliding, IonLabel, IonList, IonLoading, IonMenuButton, IonModal, IonPage, IonPopover, IonRow, IonSearchbar, IonTitle, IonToolbar} from '@ionic/react';
import React, { Component, useContext, useEffect, useMemo, useRef, useState } from 'react';
import './Home.css';
import axios from 'axios';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';



import { chatbox, chatbubble, notifications,notificationsOff } from 'ionicons/icons';
import Https from '../../utilidades/HttpsURL';
import { getDB, setDB } from '../../utilidades/dataBase';
import ModalCliente from '../../components/ModalGeneral/ModalCliente';
import ExploreContainerCliente from '../../components/ExplorerContainer/ExploreContainerCliente';
import Chat from '../../components/Chat/Chat';
import { present } from '@ionic/core/dist/types/utils/overlays';
import { UserContext } from '../../Contexts/UserContext';


const url=Https

let posicion: string | number;


const getLocation = async () => {
  
  try {
      Geolocation.watchPosition()
      const position = await Geolocation.getCurrentPosition();
      posicion=position.coords.latitude +"/"+ position.coords.longitude
      return posicion;

  } catch (e) {
    return 0;
  }
}

export interface datosGeneralesVariosProveedores {
  email:string
  nombre:string
  apellido:string
  imagenPersonal: string
  item: string
  tipo:string
  distancia:string
  calificacion:string
}

export interface proveedorBuscado{
  item:string
  tipo:string
  nombre:string
  apellido:string
  imagen:string
  calificacion:string
  email:string
}

export interface ordenesCliente  {
  rubro:string
  tipo:string
  status:string
  fecha_creacion:string
  ticket: string
  dia: string
  hora:string
  titulo:string
  descripcion:string
  email_proveedor:string
  imagen_proveedor:string
  location_lat:any
  location_long:any
  picture1:string
  picture2:string
  presupuesto:string
  pedido_mas_información:string
  respuesta_cliente_pedido_mas_información:string
  picture1_mas_información:string
  picture2_mas_información:string
}

export interface newMessage{
  de:string
  ticket:string
}

const HomeCliente = (props:{setIsReg:any}) => {

  const  {user,setUser}  = useContext(UserContext)
  
  const axios = require('axios');

  const [categorias, setCategorias] = useState ([])

  const [proveedorBuscadoHook, setProveedorBuscadoHook] =  useState < proveedorBuscado []> ( [])
 
  const [buscar, setBuscar]=useState("")
  
  const [showModal, setShowModal] = useState({ isOpen: false });
  const [tipoDeVistaEnModal, setTipoDeVistaEnModal] = useState("datosUsuario");

  const completarInfoPersonal = useRef (false)

  const [showAlertUbicación, setShowAlertUbicación] = useState(false)
  const [showInicializando,setShowInicializando]=useState(false)
  const [showCargandoProveedores,setShowCargandoProveedores]=useState(false)

  const primeraVezProveedores = useRef()

  const [proveedoresEnZona, setProveedoresEnZona] = useState <datosGeneralesVariosProveedores []> ( [])
  
  const [misOrdenes, setMisOrdenes] = useState <ordenesCliente []>([]);

  const [notifications, setNotifications] =  useState < newMessage []> ( [])
  
  const [popoverState, setShowPopover] = useState({ showPopover: false, event: undefined });

  const [nuevasOrdenes, setNuevasOrdenes] = useState<string []>([]);

  const [ticket_para_ver_orden, setTicket] = useState(0)
  const [verOrden, setVerOrden] = useState( false );

  const [categoriaAVer, setCategoriaAVer] = useState("")


  //Carga proveedores en zona desde base de datos

  useEffect(() => {

    if(proveedoresEnZona.length > 0 ){
      setDB("proveedores", (proveedoresEnZona))
    }

  }, [proveedoresEnZona]);


  useEffect(() => {

    if(misOrdenes.length > 0  ){
      setDB("ordenes", (misOrdenes))
    }

  }, [misOrdenes]);


//General useEffect
  useEffect(() => {
    
    setShowCargandoProveedores(true)

    getDB("proveedores").then(res => {
      if( res!= null ){
        if (res.length > 0){
          setShowCargandoProveedores(false)   
          setProveedoresEnZona(res)
        }
      }
    })

    getDB("ordenes").then(res => {
      if( res!= null ){
        if (res.length > 0){
          console.log(res)
          setMisOrdenes(res)
        }
      }
    })
      
    
    const ubicacion = getLocation();
    ubicacion.then((value)=>{
      if (value==0){
        setShowCargandoProveedores(false)
        setShowAlertUbicación(true)
      }

      axios.get(url+"home/cliente/"+value).then((resp: { data: any; }) => {

        if (resp.data!="bad"){
          setProveedoresEnZona(resp.data.map((d: { email: any; nombre: any; apellido: any; certificado: any; item: any; tipo: any; distancia: any; calificacion: any; }) => ({
            email:d.email,
            nombre:d.nombre,
            apellido:d.apellido,
            imagenPersonal: d.certificado,
            item: d.item,
            tipo:d.tipo,
            distancia:d.distancia,
            calificacion:d.calificacion
            })));
          setShowCargandoProveedores(false)
        }else{
          if (primeraVezProveedores.current==undefined || primeraVezProveedores ){
            setShowCargandoProveedores(false)
          }
        }
      });  
    });
  }, []);

  useEffect(() => {
    if (misOrdenes.length !=0 || misOrdenes!=undefined ){
      for (let i=0; i<misOrdenes.length; i++){
        getDB(misOrdenes[i].ticket!+"cliente").then(res => {
          if(res!=undefined || res!=null){
            if(res!=misOrdenes[i].status){
              if(misOrdenes[i].status!="ENV" && misOrdenes[i].status!="RES"&&misOrdenes[i].status!="ACE"){
                setNuevasOrdenes([...nuevasOrdenes , (misOrdenes[i].ticket+"%%%"+misOrdenes[i].status)])
              }
              }else{
                
              }
            }else{}
          })
      }
    }
  
}, [misOrdenes]);


  useEffect(() => {

    if(user!.email!="")
    {
      axios.get(url+"orden/misordenes/"+"cliente/"+user!.email).then((resp: { data: any; }) => {
        if (resp.data!="bad"){

          setMisOrdenes(    
              resp.data.map((d: { rubro:any; tipo: any; status: any; fecha_creacion: any; ticket: any; dia: any; time: any; titulo: any; descripcion: any; email_proveedor: any; presupuesto: any; imagen_proveedor: any; lacation_lat: any; location_long: any; picture1: any; picture2: any; pedidoMasInformacion: any; respuesta_cliente_pedido_mas_información: any; picture1_mas_información: any; picutre2_mas_información: any; }) => ({
                rubro:d.rubro, 
                tipo:d.tipo,
                status:d.status,
                fecha_creacion:d.fecha_creacion,
                ticket:d.ticket,
                dia:d.dia,
                hora:d.time,
                titulo:d.titulo,
                descripcion:d.descripcion,
                email_proveedor:d.email_proveedor,
                presupuesto:d.presupuesto,
                imagen_proveedor:d.imagen_proveedor,
                location_lat:d.lacation_lat,
                location_long:d.location_long,
                picture1:d.picture1,
                picture2:d.picture2,
                pedido_mas_información:d.pedidoMasInformacion,
                respuesta_cliente_pedido_mas_información:d.respuesta_cliente_pedido_mas_información,
                picture1_mas_información:d.picture1_mas_información,
                picture2_mas_información:d.picutre2_mas_información
              })))      
        }else{
          
        }
    });

 }

  }, [user!.email]);

  useEffect(() => {
    if(user!.email!="" && popoverState){
      axios.get(url+"chatsinleer/"+user!.email).then((resp: { data: any; }) => {
        if (resp.data!="bad"){
          setNotifications(resp.data.map((d: { de: any; ticket: any; }) => ({
            de:d.de,
            ticket:d.ticket,
            })));
        }
  
      })
    }
  }, [user!.email, popoverState]);

  const [imagen, setImagen] = useState (user!.foto)

  useEffect(() => {
    if (user!.foto==""|| user!.foto==null || user!.foto==undefined){
      setImagen ("./assets/icon/nuevoUsuario.png") 
    }else{
      setImagen(user!.foto)
    }
  }, [user!.foto]);


  const [mostrarChat,setMostrarChat] = useState(false)
  const ticket = useRef ("")

  if (mostrarChat){
    
    return(
      <IonContent>
        <Chat email={user!.email} ticket={ticket.current} setVolver={null} setVista={setMostrarChat} desdeDondeEstoy={false} notifications={notifications} setNotifications={setNotifications} /> 

      </IonContent>

    )

  }else{
    return (
      
      <IonPage >

        <IonPopover 
          event={popoverState.event}
          isOpen={popoverState.showPopover}
          dismissOnSelect={true}
        >
                  
          <IonContent>
            <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center" ,width:"100%", height:"100%"}} >
              <NuevasOrdenesAviso nuevasOrdenes={nuevasOrdenes} setVerOrden={setVerOrden} setTicket={setTicket}   />
              <ListaDeMensajes setShowPopover={setShowPopover} otra={notifications} setMostrarChat={setMostrarChat} ticket={ticket} />
            </div>
          </IonContent>
        </IonPopover>

        <IonHeader>
            <IonGrid>
              <IonRow id="header">
                <IonCol id="columna" size="1.5"><IonButtons ><IonMenuButton /> </IonButtons></IonCol>
                <IonCol id="columna2" ><Busqueda categorias={categorias} setCategorias={setCategorias} setProveedorBuscadoHook={setProveedorBuscadoHook} setBuscar={setBuscar} /></IonCol>
                <IonCol id="columna3" size="1.5" onClick={(e: any) => {  setShowPopover({ showPopover: true, event: e })}}>
                  <CardCampanaNotificacion nuevasOrdenes={nuevasOrdenes} notify={notifications} setMostrarChat={setMostrarChat}></CardCampanaNotificacion>
                </IonCol>
                <IonCol id="columna3" size="1.5"> 
                    <img src={imagen} id="foto-usuario" onClick={() => {  setShowModal({ isOpen: true});  setTipoDeVistaEnModal("datosUsuario")}}/>
                 </IonCol>
              </IonRow>
            </IonGrid>
        </IonHeader>

        
        <IonContent >
          <div id="ionContentHome">
            <IonLoading
              cssClass='my-custom-class'
              isOpen={showInicializando}
              onDidDismiss={() => setShowInicializando(false)}
              message={'Inicializando...'}
              duration={5000}/>

            <IonLoading
              cssClass='my-custom-class'
              isOpen={showCargandoProveedores}
              onDidDismiss={() => setShowCargandoProveedores(false)}
              message={'Cargando proveedores...'}
              duration={5000}/>

            <IonModal
              animated={true}
              isOpen={showModal.isOpen}
              onDidDismiss={() => setShowModal({ isOpen: false })}
              >
              <ModalCliente 
                ordenes={misOrdenes}
                setIsReg={props.setIsReg}
                tipoVista={tipoDeVistaEnModal}
                categoriaAVer={categoriaAVer}
                completarInfoPersonal={completarInfoPersonal.current}
                onClose={(value: React.SetStateAction<null>) => {
                setShowModal({ isOpen: false });
                }} />  
            </IonModal>
          
            <ExploreContainerCliente 
              notifications={notifications}
              setNotifications={setNotifications}
              setShowCargandoProveedores={setShowCargandoProveedores}

              ordenes={misOrdenes}
              setOrdenes={setMisOrdenes}

              ticket={ticket_para_ver_orden}
              setTicket={setTicket}
              verOrden={verOrden}
              setVerOrden={setVerOrden}

              proveedores={proveedoresEnZona}
              emailCliente={user!.email}
              url={url}
              buscar={buscar}
              busqueda_categorias={categorias}
              busquedaDatosProveedores={proveedorBuscadoHook}
              setShowModal={setShowModal}
              setTipoDeVistaEnModal={setTipoDeVistaEnModal}
              nuevasOrdenes={nuevasOrdenes}
              setNuevasOrdenes={setNuevasOrdenes} 
              setCategoriaAVer={setCategoriaAVer}              
              />

            <IonAlert 
              isOpen={showAlertUbicación} 
              onDidDismiss={() => setShowAlertUbicación(false)} 
              cssClass='my-custom-class'
              header={'HABILITAR ACCESO A UBICACIÓN'}
              animated={true}
              subHeader={''}
              message={'Debe habilitar el acceso a la ubicación en el dispositivo'}
              buttons={['ENTENDIDO']}/>      
          </div>

          
      
        </IonContent>
      </IonPage>
  );
  }
    
}



export const ListaDeMensajes = ( props:{setShowPopover:any, otra:any, setMostrarChat:any, ticket:any}) =>{
  var i=0
  if(props.otra.length >0 ){
    return(
      <>
            <div id="contenedorNotificaciones">  

        <img src={"./assets/sinmensajes.png"} id="idIconoMensajes"></img>

      {props.otra.map((a: { de: string; ticket: string; }) => {
        i=i+1
        return (
          <IonCardNotificaciones setShowPopover={props.setShowPopover} key={i} de={a.de} ticket={a.ticket} setMostrarChat={props.setMostrarChat} ticket_={props.ticket}></IonCardNotificaciones> 
          ) 
      })
     }   </div>  </>
     )
  }else{
    return(
      <div id="contenedorNotificaciones">  
        
        <img src={"./assets/sinmensajes.png"} id="idIconoMensajes"></img>
        <IonTitle>SIN MENSAJES</IonTitle> 

      </div>
     )
  }

}

export const CardCampanaNotificacion = (props:{nuevasOrdenes:any, notify:any, setMostrarChat:any}) => {
 
  if (props.notify.length>0 || props.nuevasOrdenes.length>0){
    return (
      <div>  
        <span className="dot"></span>

    <IonIcon icon={notifications}  id="iconoHomeCampana">  </IonIcon>
    </div>
)
  }else{
    return <IonIcon icon={notificationsOff}  id="iconoHomeCampana">  </IonIcon>
  }

}

export const IonCardNotificaciones = (props:{setShowPopover:any, de:string, ticket:string, setMostrarChat:any, ticket_:any}) => {

  props.ticket_.current=props.ticket
  return(
    <IonCard id="ionCard-CardProveedor" onClick={(e: any)=> {props.setMostrarChat(true); props.setShowPopover(  {showPopover:false, event: e} )} }>
      <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", width:"100%", height:"auto"}}>
        <IonItem lines="none">MENSAJE DE: {props.de}</IonItem>
        <IonItem lines="none">ORDEN TICKET Nº: {props.ticket}</IonItem>
        <p id="p-ionpover">INGRESE A LA ORDEN PARA VER EL CHAT</p>
      </div>
    </IonCard>
  )
}


//el ticket es tipo string y debe ser number

const NuevasOrdenesAviso = (props: {nuevasOrdenes:string [], setVerOrden:any, setTicket:any})=>{

  if (props.nuevasOrdenes.length !== 0){
    return(
      <div id="elementos">
        {(props.nuevasOrdenes || []).map((a) => {
          let estado="";

          if(a.split("%%%")[1]=="PRE"){
            estado="ORDEN PRESUPUESTADA"
            return (  
              <IonCard id="ionCard-CardProveedor" onClick={ () =>{props.setVerOrden(true);props.setTicket(Number(a.split("%%%")[0]))}} >
                <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", width:"100%", height:"auto"}}>
                  <h1 style={{fontSize:"1em"}}>ORDEN DE SERVICIO</h1>
                  <IonItemDivider />
                  <h3 style={{fontSize:"0.8em"}}>TICKET Nº:{a.split("%%%")[0]} </h3>
                  <h3 style={{fontSize:"0.8em"}}>{estado}</h3>
                </div>
            </IonCard> 
            ) 
          }else if(a.split("%%%")[1]=="PEI"){
            estado="SOLICITUD DE MÁS INFORMACIÓN"
            return (  
              <IonCard id="ionCard-CardProveedor" onClick={ () =>{props.setVerOrden(true);props.setTicket(Number(a.split("%%%")[0]))}} >
                <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", width:"100%", height:"auto"}}>
                  <h1 style={{fontSize:"1em"}}>ORDEN DE SERVICIO</h1>
                  <IonItemDivider />
                  <h3 style={{fontSize:"0.8em"}}>TICKET Nº:{a.split("%%%")[0]} </h3>
                  <h3 style={{fontSize:"0.8em"}}>{estado}</h3>
                </div>
            </IonCard> 
            ) 
          }else if(a.split("%%%")[1]=="EVI"){
            estado="PROVEEDOR EN VIAJE"
            return (  
              <IonCard id="ionCard-CardProveedor" onClick={ () =>{props.setVerOrden(true);props.setTicket(Number(a.split("%%%")[0]))}} >
                <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", width:"100%", height:"auto"}}>
                  <h1 style={{fontSize:"1em"}}>ORDEN DE SERVICIO</h1>
                  <IonItemDivider />
                  <h3 style={{fontSize:"0.8em"}}>TICKET Nº:{a.split("%%%")[0]} </h3>
                  <h3 style={{fontSize:"0.8em"}}>{estado}</h3>
                </div>
            </IonCard> 
            ) 
          }else if(a.split("%%%")[1]=="ENS"){
            estado="PROVEEDOR HA LLEGADO!"
            return (  
              <IonCard id="ionCard-CardProveedor" onClick={ () =>{props.setVerOrden(true);props.setTicket(Number(a.split("%%%")[0]))}} >
                <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", width:"100%", height:"auto"}}>
                  <h1 style={{fontSize:"1em"}}>ORDEN DE SERVICIO</h1>
                  <IonItemDivider />
                  <h3 style={{fontSize:"0.8em"}}>TICKET Nº:{a.split("%%%")[0]} </h3>
                  <h3 style={{fontSize:"0.8em"}}>{estado}</h3>
                </div>
            </IonCard> 
            ) 
          } else{
            return (  
              
              <IonCard id="ionCard-CardProveedor" onClick={ () =>{props.setVerOrden(true);props.setTicket(Number(a.split("%%%")[0]))}} >
                <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", width:"100%", height:"auto"}}>
                  <h1 style={{fontSize:"1em"}}>ORDEN DE SERVICIO</h1>
                  <IonItemDivider />
                  <h3 style={{fontSize:"0.8em"}}>TICKET Nº:{a.split("%%%")[0]} </h3>
                </div>
            </IonCard> 
            ) 
          }
          
        })
        }
    </div>
    
    )
  }else{
    return(
      <>
        
      </>
    )
  }

}


const Busqueda = (props:{categorias:any, setCategorias:any, setBuscar:any, setProveedorBuscadoHook:any}) =>{
  
  let textoBarra= "Búsqueda" 

  const palabraBuscar= useRef("")

  const Buscar = (value:any) =>{
    if(value == "Enter"){
      axios.get(url+"search/palabras/"+palabraBuscar.current).then((resp: { data: any; }) => {

        if (resp.data!="bad"){
          
          props.setProveedorBuscadoHook(resp.data.map((d: { item: any; tipo: any; nombre: any; apellido: any; imagen: any; calificacion: any; email: any; }) => ({
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

    }
    
  }
  const Palabras= (value:string) =>{

    palabraBuscar.current=value
    props.setBuscar(value)
      
    var arreglo_categorias=["CARPINTERIA","CERRAJERIA","CONSTRUCCIÓN","CONTADURÍA","ELECTRICIDAD","ELECTRONICA","ESTÉTICA","FLETE","FUMIGACIÓN","GASISTA","HERRERIA","INFORMATICA","JARDINERÍA","MECANICA","MODA","PASEADOR DE MASCOTAS","PINTOR","PLOMERIA","REFRIGERACION","REMOLQUES - GRÚAS","TELEFONIA CELULAR","TEXTIL"]

    //Agregar subcategorías, por ejemplo en moda:  Estética 
   //Depilación
   //Pedicura
  // Manicuría
   //Maquillaje
   //Peluquería 
  // Masajes
    
    if(value.length==0){
      props.setCategorias([])
      palabraBuscar.current=""
     // proveedorBuscado=[]
      props.setProveedorBuscadoHook([])

    }else{
      for (var j=0; j < value.length;j++) {
        var mostrar=[]
  
        for (var i=0; i < arreglo_categorias.length;i++){
          if (arreglo_categorias[i].charAt(j).toLowerCase() ==value.charAt(j).toLowerCase() ){
            mostrar.push(arreglo_categorias[i])          
          }
        }
        //props.setCategorias([])
        arreglo_categorias=mostrar
        props.setCategorias(mostrar)
        }
    }
	}

    return(
    <>
      <IonGrid>
        <IonRow>
          <IonSearchbar placeholder={textoBarra} onKeyPress={e=> Buscar(e.key)} onIonChange={e => {Palabras(e.detail.value!)}} id="barra_busqueda" ></IonSearchbar>
        </IonRow>
      </IonGrid>
        </>
    )
       
    
  };


  
  
  export default HomeCliente

function showPopover(showPopover: any, arg1: boolean) {
  throw new Error('Function not implemented.');
}

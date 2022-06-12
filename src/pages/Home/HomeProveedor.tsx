import { Icon } from 'ionicons/dist/types/components/icon/icon';
import React, { Component, useContext, useEffect, useRef, useState } from 'react';
import './Home.css';
import {person, home , closeCircle, chevronDown, arrowBack, receipt, help, chatbubble, notificationsOff} from 'ionicons/icons';
import axios from 'axios';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

import { Plugins } from '@capacitor/core';
import { Redirect } from 'react-router';
import { CardCampanaNotificacion, ListaDeMensajes, newMessage } from './HomeCliente';
import Https from '../../utilidades/HttpsURL';
import { UserContext } from '../../Contexts/UserContext';
import ExploreContainerProveedor from '../../components/ExplorerContainer/ExploreContainerProveedor';
import ModalProveedor from '../../components/ModalGeneral/ModalProveedor';
import Chat from '../../components/Chat/Chat';
import { IonAlert, IonAvatar, IonButton, IonButtons, IonCard, IonCardHeader, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonItemOptions, IonItemSliding, IonLabel, IonList, IonLoading, IonMenuButton, IonModal, IonPage, IonPopover, IonRow, IonSearchbar, IonTitle, IonToolbar} from '@ionic/react';
import { getDB } from '../../utilidades/dataBase';


let posicion: string | number;

//const url='http://127.0.0.1:8000/';
//const url="https://callservicesvps.online:443/"

const url = Https 

const getLocation = async () => {
  try {
      const position = await Geolocation.getCurrentPosition();
      posicion=position.coords.latitude +"/"+ position.coords.longitude      
      return posicion;

  } catch (e) {
    return 0;
  }
}


export interface ordenes  {
    rubro:string
    tipo:string
    status:string
    fecha_creacion:string
    ticket: string
    dia: string
    hora:string
    titulo:string
    descripcion:string
    email_cliente:string
    imagen_cliente:string
    location_lat:any
    location_long:any
    picture1:string
    picture2:string
    presupuesto_inicial:any
    pedido_mas_información:string
    respuesta_cliente_pedido_mas_información:string
    picture1_mas_información:string
    picture2_mas_información:string

    }


const HomeProveedor = (props:{setIsReg:any, 
 setNombre:any, setApellido:any, setFoto:any,
 }) => {

  
  const {user,setUser} = useContext(UserContext)

  
  const [showModal, setShowModal] = useState({ isOpen: false });
  const [retVal, setRetVal] = useState(null);
  const [tipoDeVistaEnModal, setTipoDeVistaEnModal] = useState("datosUsuario");

  //const [personalInfo,setPersonalInfo]=useState(false);
  
  const [completarInfoPersonal, setCompletarInfoPersonal]=useState(false); //comprobación de que el usuario debe cargar la información personal

  //const user=useRef("");
  const clientType=useRef("");
  //const foto=useRef("");
  

  const [showInicializando,setShowInicializando]=useState(false)

  const [showAlertUbicación, setShowAlertUbicación] = useState(false)
  const [showAlertServidor, setShowAlertServidor]= useState(false)

  const[sinRubro,setSinRubro] = useState(false)

  getLocation()

  const [misOrdenes, setMisOrdenes] = useState <ordenes []>( [])

  const axios = require('axios');

  const [popoverState, setShowPopover] = useState({ showPopover: false, event: undefined });
  const [notifications, setNotifications] =  useState < newMessage []> ( [])
  const [mostrarChat,setMostrarChat] = useState(false)
  const ticket = useRef ("")


  const [imagen, setImagen] = useState (user!.foto)
  const [nuevasOrdenes, setNuevasOrdenes] = useState<string []>([]);

  useEffect(() => {
    if (user!.foto==""|| user!.foto==null || user!.foto==undefined){
      setImagen ("./assets/icon/nuevoUsuario.png") 
    }else{
      setImagen(user!.foto)
    }
  }, [user!.foto]);

  useEffect(() => {
    if(user!.email!=""){
      const ubicacion = getLocation();
      ubicacion.then((value)=>{
      if (value==0){
        setShowAlertUbicación(true)
      }else{
        axios.get(url+"proveedor/ubicacion/"+user!.email+"/"+value).then((resp: { data: any; }) => {
          if (resp.data=="bad"){
            setShowAlertServidor(true)
          }else if(resp.data=="sin rubro"){
           setSinRubro(true)
          }else{

          }
        });  
      }
    })
    axios.get(url+"orden/misordenes/"+"proveedor/"+user!.email).then((resp: { data: any; }) => {
      if (resp.data!="bad"){
         //setMisOrdenes(resp.data) 
        setMisOrdenes(resp.data.map((d: { rubro:any; tipo: any; status: any; fecha_creacion: any; ticket: any; dia: any; time: any; titulo: any; descripcion: any; email_cliente: any; imagen_cliente: any; location_lat: any; location_long: any; picture1: any; picture2: any; presupuesto: any; pedidoMasInformacion: any; respuesta_cliente_pedido_mas_información: any; picture1_mas_información: any; picture2_mas_información: any; }) => ({
          rubro:d.rubro,
          tipo:d.tipo,
          status:d.status,
          fecha_creacion:d.fecha_creacion,
          ticket:d.ticket,
          dia:d.dia,
          hora:d.time,
          titulo:d.titulo,
          descripcion:d.descripcion,
          email_cliente:d.email_cliente,
          imagen_cliente:d.imagen_cliente,
          location_lat:d.location_lat,
          location_long:d.location_long,
          picture1:d.picture1,
          picture2:d.picture2,
          presupuesto_inicial:d.presupuesto,
          pedido_mas_información:d.pedidoMasInformacion,
          respuesta_cliente_pedido_mas_información:d.respuesta_cliente_pedido_mas_información,
          picture1_mas_información:d.picture1_mas_información,
          picture2_mas_información:d.picture2_mas_información,
          }))
        );           
      }
    })
    axios.get(url+"chatsinleer/"+user!.email).then((resp: { data: any; }) => {
      if (resp.data!="bad"){
        setNotifications(resp.data.map((d: { de: any; ticket: any; }) => ({
          de:d.de,
          ticket:d.ticket,
          })));
      }
  
    })
  }
  }, [user!.email]);


  useEffect(() => {

    if (misOrdenes.length !=0 || misOrdenes!=undefined || misOrdenes!=[]){

      for (let i=0; i<misOrdenes.length; i++){
        console.log(" mis ordenes: "+misOrdenes[i].status)
        if(misOrdenes[i].status=="ENV"){
          setNuevasOrdenes([...nuevasOrdenes , (misOrdenes[i].ticket)])

        }
        getDB(misOrdenes[i].ticket!).then(res => {
          if(res!=undefined || res!=null ){
           //arreglo.push(res)
           //aca copia todo, el numero 1 del arreglo no es el rubro sino la primer letra del rubro y así.
            if(res!=misOrdenes[i].status ){
              console.log(" mis ordenes: "+misOrdenes[i].status)
              setNuevasOrdenes([...nuevasOrdenes , (misOrdenes[i].ticket)])
              }
          }
        })
      }
    }else{
    }
  
}, [misOrdenes]);

  if (mostrarChat){
    return(
      <IonContent>
        <Chat email={user!.email}  ticket={ticket.current} setVolver={null} setVista={setMostrarChat} desdeDondeEstoy={false} notifications={notifications} setNotifications={setNotifications} /> 

      </IonContent>

    )

  }else{
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow id="header">
              <IonCol id="columna" size="1.5">
                <IonButtons ><IonMenuButton /> </IonButtons>
              </IonCol>
              <IonCol id="columna2" ></IonCol>
              <IonCol id="columna3" size="1.5" onClick={(e: any) => { e.persist(); setShowPopover({ showPopover: true, event: e })}}>
                  <CardCampanaNotificacion notify={notifications} setMostrarChat={setMostrarChat} nuevasOrdenes={nuevasOrdenes}></CardCampanaNotificacion>
                </IonCol>
              <IonCol id="columna3" size="2"> 
                <img src={imagen} id="foto-usuario" onClick={() => {  setShowModal({ isOpen: true});  setTipoDeVistaEnModal("datosUsuario")}}/>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
        
      <IonContent >
        <div id="ionContentHome">
          <IonLoading
            cssClass='my-custom-class'
            isOpen={showInicializando}
            onDidDismiss={() => setShowInicializando(false)}
            message={'Inicializando...'}
            duration={5000}/>

          <IonModal
            animated={true}
            isOpen={showModal.isOpen}
            onDidDismiss={() => setShowModal({ isOpen: false })}>
            <ModalProveedor 
              setIsReg={props.setIsReg}
              tipoVista={tipoDeVistaEnModal}
              completarInfoPersonal={completarInfoPersonal}
              onClose={(value: React.SetStateAction<null>) => {
              setShowModal({ isOpen: false });
              value ? setRetVal(value) : setRetVal(null);
              }} />  
          </IonModal>

          <ExploreContainerProveedor  
          notifications={notifications} setNotifications={setNotifications}
            ordenes={misOrdenes}
            setNuevasOrdenes={setNuevasOrdenes}
            emailProveedor={user!.email}
            sinRubro={sinRubro}
            setIsReg={props.setIsReg}
            tipodeCliente={user!.tipoCliente} 
            nuevasOrdenes={nuevasOrdenes}         
          />
         
          <IonAlert 
            isOpen={showAlertUbicación} 
            onDidDismiss={() => setShowAlertUbicación(false)} 
            mode="ios"
            cssClass='my-custom-class'
            header={'Habilitar acceso ubicación'}
            subHeader={''}
            message={'Debe habilitar el acceso a la ubicación en el dispositivo'}
            buttons={['OK']}/>

      <IonPopover 
        event={popoverState.event}
        isOpen={popoverState.showPopover}
        dismissOnSelect={true}
        >
          
        <IonContent>
          <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center" ,width:"100%", height:"100%"}} >
            <NuevasOrdenesAviso nuevasOrdenes={nuevasOrdenes}   />
            <ListaDeMensajes setShowPopover={setShowPopover} otra={notifications} setMostrarChat={setMostrarChat} ticket={ticket} />
          </div>

        </IonContent>
      </IonPopover>
            

            <IonAlert 
            isOpen={showAlertServidor} 
            onDidDismiss={() => setShowAlertServidor(false)} 
            mode="ios"
            cssClass='my-custom-class'
            header={'PROBLEMAS DE CONECTIVIDAD'}
            subHeader={''}
            message={'Corrobore su conexión a internet o intente nuevamente más tarde'}
            buttons={['OK']}/>

        </div>
      </IonContent>
    </IonPage>
  ); 
}
}



const NuevasOrdenesAviso = (props: {nuevasOrdenes:string []})=>{

 if (props.nuevasOrdenes!=[]){
   return(
     <div id="elementos">
       {(props.nuevasOrdenes || []).map((a) => {
         //item, imagen personal, distancia, calificación, email, nombre, apellido, tipo
         return (  
           <IonCard id="ionCard-CardProveedor" >
             <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", width:"100%", height:"auto"}}>
               <IonItem lines="none">ORDEN DE SERVICIO</IonItem>
               <IonItem lines="none">TICKET Nº: {a}</IonItem>
             </div>
         </IonCard> 
         ) 
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

/*

class Busqueda extends Component{

  Buscar = () =>{
    var input=(document.getElementById("busqueda") as HTMLTextAreaElement).value;
  
    if(input==="hola"){
      console.log("hola");
    }
  }
   render(){
    return(<IonSearchbar type="text" placeholder="¿Qué servicios buscas?" onIonInput={this.Buscar} id="busqueda"></IonSearchbar>);
       }
    
  };
*/


  export default HomeProveedor;

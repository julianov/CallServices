import { IonAlert, IonAvatar, IonButton, IonButtons, IonCard, IonCardHeader, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonItemOptions, IonItemSliding, IonLabel, IonList, IonLoading, IonMenuButton, IonModal, IonPage, IonPopover, IonRow, IonSearchbar, IonTitle, IonToolbar} from '@ionic/react';
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import React, { Component, useEffect, useRef, useState } from 'react';
import ExploreContainer from '../components/ExploreContainerCliente';
import './Home.css';
import {person, home , closeCircle, chevronDown, arrowBack, receipt, help, chatbubble, notificationsOff} from 'ionicons/icons';
import Registro from './Registro';
import axios from 'axios';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

import { Plugins } from '@capacitor/core';
import { getItem , clear, setItem, removeItem} from '../utilidades/Storage';
import { Redirect } from 'react-router';
import ModalProveedor from '../components/ModalProveedor';
import ExploreContainerProveedor from '../components/ExploreContainerProveedor';
import Https from '../utilidades/HttpsURL';
import { CardCampanaNotificacion, ListaDeMensajes, newMessage } from './HomeCliente';
import Chat from '../utilidades/Chat';


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
  email:any, tipodeCliente:any, foto:any, setFoto:any, 
  nombre:any, apellido:any, calificacion:any, setNombre:any, setApellido:any, 
  rubro1:any, rubro2:any, setRubro1:any, setRubro2:any}) => {

  
  const [showModal, setShowModal] = useState({ isOpen: false });
  const [retVal, setRetVal] = useState(null);
  const [tipoDeVistaEnModal, setTipoDeVistaEnModal] = useState("datosUsuario");

  //const [personalInfo,setPersonalInfo]=useState(false);
  
  const [completarInfoPersonal, setCompletarInfoPersonal]=useState(false); //comprobación de que el usuario debe cargar la información personal

  //const user=useRef("");
  const clientType=useRef("");
  //const foto=useRef("");
  
  const [imagen, setImagen] = useState (props.foto)

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

  useEffect(() => {

    const ubicacion = getLocation();
      ubicacion.then((value)=>{
      
      if (value==0){

        setShowAlertUbicación(true)
        console.log("veamos que tenemos en el value de la ubicación: "+value)


      }else{
        axios.get(url+"proveedor/ubicacion/"+props.email+"/"+value).then((resp: { data: any; }) => {

          if (resp.data=="bad"){

            setShowAlertServidor(true)

          }else if(resp.data=="sin rubro"){
           // aca hay que mostrar el cartel que no tiene rubros cargados
           setSinRubro(true)

          }else{
            
            
            
          }
        });  
      }
    })

        axios.get(url+"orden/misordenes/"+"proveedor/"+props.email).then((resp: { data: any; }) => {
          if (resp.data!="bad"){
            //setMisOrdenes(resp.data) 
            setMisOrdenes(resp.data.map((d: { tipo: any; status: any; fecha_creacion: any; ticket: any; dia: any; time: any; titulo: any; descripcion: any; email_cliente: any; imagen_cliente: any; location_lat: any; location_long: any; picture1: any; picture2: any; presupuesto: any; pedidoMasInformacion: any; respuesta_cliente_pedido_mas_información: any; picture1_mas_información: any; picture2_mas_información: any; }) => ({
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

        if (props.foto==""|| props.foto==null || props.foto==undefined){
          setImagen ("./assets/icon/nuevoUsuario.png") 
        }else{
          setImagen(props.foto)
        }
   
        axios.get(url+"chatsinleer/"+props.email).then((resp: { data: any; }) => {
          if (resp.data!="bad"){
            setNotifications(resp.data.map((d: { de: any; ticket: any; }) => ({
              de:d.de,
              ticket:d.ticket,
              })));
          }
    
        })

  }, []);

  if (mostrarChat){
    return(
      <IonContent>
        <Chat email={props.email}  ticket={ticket.current} setVolver={null} setVista={setMostrarChat} desdeDondeEstoy={false} /> 

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
                  <CardCampanaNotificacion notify={notifications} setMostrarChat={setMostrarChat}></CardCampanaNotificacion>
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
              email={props.email}
              tipoVista={tipoDeVistaEnModal}
              fotoPersonal={props.foto}
              nombre={props.nombre}
              apellido={props.apellido}
              setFoto={props.setFoto}
              setNombre={props.setNombre}
              setApellido={props.setApellido}
              calificacion={props.calificacion}
              rubro1={props.rubro1}
              rubro2={props.rubro2}
              setRubro1={props.setRubro1}
              setRubro2={props.setRubro2} 
              tipoProveedor={props.tipodeCliente}
              completarInfoPersonal={completarInfoPersonal}
              onClose={(value: React.SetStateAction<null>) => {
              setShowModal({ isOpen: false });
              value ? setRetVal(value) : setRetVal(null);
              }} />  
          </IonModal>

          <ExploreContainerProveedor  ordenes={misOrdenes} 
          emailProveedor={props.email}  
          sinRubro={sinRubro}
          
          setIsReg={props.setIsReg} 
          tipodeCliente={props.tipodeCliente}  
          rubro1={props.rubro1} 
          rubro2={props.rubro2} 
          setRubro1={props.setRubro1} 
          setRubro2={props.setRubro2}
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
        onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
      >
          
        <IonContent><ListaDeMensajes otra={notifications} setMostrarChat={setMostrarChat} ticket={ticket} /></IonContent>
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

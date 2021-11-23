import { IonAvatar, IonButton, IonButtons, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonItemOptions, IonItemSliding, IonLabel, IonList, IonLoading, IonMenuButton, IonModal, IonPage, IonRow, IonSearchbar, IonTitle, IonToolbar} from '@ionic/react';
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import React, { Component, useEffect, useRef, useState } from 'react';
import ExploreContainer from '../components/ExploreContainerCliente';
import './Home.css';
import {person, home , closeCircle, chevronDown, arrowBack, receipt, help, chatbubble} from 'ionicons/icons';
import Registro from './Registro';
import axios from 'axios';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

import { Plugins } from '@capacitor/core';
import { getItem , clear, setItem, removeItem} from '../utilidades/Storage';
import { Redirect } from 'react-router';
import ModalProveedor from '../components/ModalProveedor';
import ExploreContainerProveedor from '../components/ExploreContainerProveedor';
import Https from '../utilidades/HttpsURL';


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


const HomeProveedor = (props:{setIsReg:any, 
  email:any, tipodeCliente:any, foto:any, setFoto:any, 
  nombre:any, apellido:any, calificacion:any, setNombre:any, setApellido:any, 
  rubro1:any, rubro2:any, setRubro1:any, setRubro2:any}) => {

    console.log("nombre en modal: "+props.nombre)
    console.log("apellido en modal: "+props.apellido)
  
    const [showModal, setShowModal] = useState({ isOpen: false });
  const [retVal, setRetVal] = useState(null);
  const [tipoDeVistaEnModal, setTipoDeVistaEnModal] = useState("datosUsuario");

  //const [personalInfo,setPersonalInfo]=useState(false);
  
  const [completarInfoPersonal, setCompletarInfoPersonal]=useState(false); //comprobación de que el usuario debe cargar la información personal

  //const user=useRef("");
  const clientType=useRef("");
  //const foto=useRef("");
  
  //const [primeraVez, setprimeraVez]=useState(true)

  const [showInicializando,setShowInicializando]=useState(false)


  const axios = require('axios');


  useEffect(() => {
      const ubicacion = getLocation();
        ubicacion.then((value)=>{
          axios.get(url+"home/"+value).then((resp: { data: any; }) => {
          });  
        
        }); 
   
  }, []);


  /////////////////////////funcion pedir info personal ///////////////////

   
 

  //////////////fin de función pedir información personal. 

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonGrid>
              <IonRow id="header">
                <IonCol id="columna" size="1.5"><IonButtons ><IonMenuButton /> </IonButtons></IonCol>
                <IonCol id="columna2" ><Busqueda /></IonCol>
                <IonCol id="columna3" size="2"> 
                    <img src={props.foto} id="foto-usuario" onClick={() => {  setShowModal({ isOpen: true});  setTipoDeVistaEnModal("datosUsuario")}}/>
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
                    duration={5000}
                />

        <IonModal
            animated={true}
            isOpen={showModal.isOpen}
            onDidDismiss={() => setShowModal({ isOpen: false })}
          >
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
              }} 
            />  
          </IonModal>

          
          <ExploreContainerProveedor  url={url} />
         


          </div>
        </IonContent>
      </IonPage>
  );


  
}





class Busqueda extends Component{

  Buscar = () =>{
    var input=(document.getElementById("busqueda") as HTMLTextAreaElement).value;
  
    if(input==="hola"){
      console.log("hola perri");
    }
  }
   render(){
    return(<IonSearchbar type="text" placeholder="¿Qué servicios buscas?" onIonInput={this.Buscar} id="busqueda"></IonSearchbar>);
       }
    
  };

  export default HomeProveedor;

import { IonAvatar, IonButton, IonButtons, IonChip, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonItemOptions, IonItemSliding, IonLabel, IonList, IonLoading, IonMenuButton, IonModal, IonPage, IonPopover, IonRow, IonSearchbar, IonTitle, IonToolbar} from '@ionic/react';
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import ExploreContainer from '../components/ExploreContainerCliente';
import './Home.css';
import {person, home , closeCircle, chevronDown, arrowBack, receipt, help, chatbubble} from 'ionicons/icons';
import Registro from './Registro';
import axios from 'axios';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

import { Plugins } from '@capacitor/core';
import { getItem , clear, setItem, removeItem} from '../utilidades/Storage';
import { Redirect } from 'react-router';
import ModalCliente from '../components/ModalCliente';
import { createEmitAndSemanticDiagnosticsBuilderProgram } from 'typescript';
import ExploreContainerCliente from '../components/ExploreContainerCliente';
import Https from '../utilidades/HttpsURL';

import { Database } from '@ionic/storage';
import { clearDB, createStore, getDB, removeDB, setDB } from '../utilidades/dataBase';


const url=Https

let posicion: string | number;

const getLocation = async () => {
  try {
      const position = await Geolocation.getCurrentPosition();
      posicion=position.coords.latitude +"/"+ position.coords.longitude
      return posicion;

  } catch (e) {
    return 0;
  }
}

//let arreglo=new Array();

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
      }

  let proveedores = new Array<datosGeneralesVariosProveedores>();

  let proveedorBuscado = new Array<proveedorBuscado>();


const HomeCliente = (props:{setIsReg:any,  
  email:any, foto:any, clientType:any, 
  nombre:any, apellido:any, calificacion:any, setFoto:any, setNombre:any, setApellido:any, }) => {

  const [categorias, setCategorias] = useState ([])
  const [proveedorBuscadoHook,setProveedorBuscadoHook]= useState ([])
  const [buscar, setBuscar]=useState("")
  
  const [showModal, setShowModal] = useState({ isOpen: false });
  const [tipoDeVistaEnModal, setTipoDeVistaEnModal] = useState("datosUsuario");

  const completarInfoPersonal = useRef (false)

  const [showInicializando,setShowInicializando]=useState(false)

  const [showCargandoProveedores,setShowCargandoProveedores]=useState(false)

  const primeraVezProveedores = useRef()

  const [reload,setRealad]=useState(false)

  const [misOrdenes, setMisOrdenes] = useState <ordenesCliente>(
    {
      tipo:"",
      status:"",
      fecha_creacion:"",
      ticket: "",
      dia: "",
      hora:"",
      titulo:"",
      descripcion:"",
      email_proveedor:"",
      imagen_proveedor:"",
      location_lat:"",
      location_long:"",
      picture1:"",
      picture2:"",
      }
);

  const axios = require('axios');

  createStore("listaProveedores")


  useEffect(() => {

        setShowCargandoProveedores(true)

        getDB("proveedores").then(res => {
          if(res!=undefined || res!=null){
           //arreglo.push(res)
           //aca copia todo, el numero 1 del arreglo no es el rubro sino la primer letra del rubro y así.
            proveedores=JSON.parse(res)    
            setShowCargandoProveedores(false)
          }

        })
        
        const ubicacion = getLocation();
        ubicacion.then((value)=>{
          
          console.log(value)
          axios.get(url+"home/cliente/"+value).then((resp: { data: any; }) => {

            
            if (resp.data!="bad"){

              proveedores= []

              for (let i=0; i<resp.data.length;i++){               
                proveedores.push({email: resp.data[i].email, nombre: resp.data[i].nombre , apellido: resp.data[i].apellido , imagenPersonal: resp.data[i].certificado, item: resp.data[i].item , tipo: resp.data[i].tipo, distancia:resp.data[i].distancia, calificacion:resp.data[i].calificacion})
              }

              setDB("proveedores", JSON.stringify(proveedores))
              setShowCargandoProveedores(false)
              
            }else{
              if (primeraVezProveedores.current==undefined || primeraVezProveedores ){
                setShowCargandoProveedores(false)
              }
    
            }
            
          });  
        
        });

        axios.get(url+"orden/misordenes/"+"cliente/"+props.email).then((resp: { data: any; }) => {
          if (resp.data!="bad"){
            setMisOrdenes(resp.data)            
          }

        })
   
   
  }, []);

    return (
      <IonPage >
        <IonHeader>
          <IonToolbar>
            <IonGrid>
              <IonRow id="header">
                <IonCol id="columna" size="1.5"><IonButtons ><IonMenuButton /> </IonButtons></IonCol>
                <IonCol id="columna2" ><Busqueda categorias={categorias} setCategorias={setCategorias} setProveedorBuscadoHook={setProveedorBuscadoHook} setBuscar={setBuscar} /></IonCol>
                <IonCol id="columna3" size="1.5"> 
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

          <IonLoading
                    cssClass='my-custom-class'
                    isOpen={showCargandoProveedores}
                    onDidDismiss={() => setShowCargandoProveedores(false)}
                    message={'Cargando proveedores...'}
                    duration={5000}
                />

        <IonModal
            animated={true}
            isOpen={showModal.isOpen}
            onDidDismiss={() => setShowModal({ isOpen: false })}
          >
            <ModalCliente 
               setIsReg={props.setIsReg}
               email={props.email}
               tipoVista={tipoDeVistaEnModal}

               fotoPersonal={props.foto}
               nombre={props.nombre}
               apellido={props.apellido}
               calificacion={props.calificacion}
               
               setFoto={props.setFoto}
               setNombre={props.setNombre}
               setApellido={props.setApellido}

               completarInfoPersonal={completarInfoPersonal.current}
               
               onClose={(value: React.SetStateAction<null>) => {
                setShowModal({ isOpen: false });
               // value ? setRetVal(value) : setRetVal(null);
              }} 
            />  
          </IonModal>
          
         
          <ExploreContainerCliente setShowCargandoProveedores={setShowCargandoProveedores} 
          ordenes={misOrdenes}
          proveedores={proveedores}
          emailCliente={props.email}
          url={url} 
          buscar={buscar}
          busqueda_categorias={categorias}
          busquedaDatosProveedores={proveedorBuscadoHook}
          setShowModal={setShowModal}
          setTipoDeVistaEnModal={setTipoDeVistaEnModal } />

          </div>
        </IonContent>
      </IonPage>
  );
}

//var arreglo_buscado=new Array()

const Busqueda = (props:{categorias:any, setCategorias:any, setBuscar:any, setProveedorBuscadoHook:any}) =>{
  
  let textoBarra= "Búsqueda" 

  const palabraBuscar= useRef("")

  const Buscar = (value:any) =>{
    if(value == "Enter"){
      axios.get(url+"search/palabras/"+palabraBuscar.current).then((resp: { data: any; }) => {

        console.log(resp.data)
        if (resp.data!="bad"){
          
          proveedorBuscado= []         
          for (let i=0; i<resp.data.length;i++){
            proveedorBuscado.push({item:resp.data[i].item,tipo:resp.data[i].tipo,nombre:resp.data[i].nombre,apellido:resp.data[i].apellido,imagen:resp.data[i].imagen,calificacion:resp.data[i].calificacion,email:resp.data[i].email})
          }

          props.setProveedorBuscadoHook(proveedorBuscado)
        }
      })

    }
    
  }
  const Palabras= (value:string) =>{

    palabraBuscar.current=value
    props.setBuscar(value)
      
    var arreglo_categorias=["CARPINTERIA","CERRAJERIA","CONSTRUCCIÓN","ELECTRICIDAD","ELECTRONICA","FLETE","GASISTA","HERRERIA","INFORMATICA",
    "JARDINERÍA","MECANICA","PLOMERIA","REFRIGERACION","REMOLQUES - GRÚAS","TELEFONIA CELULAR"]

    
    if(value.length==0){
      props.setCategorias([])
      palabraBuscar.current=""
      proveedorBuscado=[]
      props.setProveedorBuscadoHook(proveedorBuscado)

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



import { IonAlert, IonAvatar, IonButton, IonButtons, IonChip, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonItemOptions, IonItemSliding, IonLabel, IonList, IonLoading, IonMenuButton, IonModal, IonPage, IonPopover, IonRow, IonSearchbar, IonTitle, IonToolbar} from '@ionic/react';
import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import './Home.css';
import axios from 'axios';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';


import ModalCliente from '../components/ModalCliente';
import ExploreContainerCliente from '../components/ExploreContainerCliente';
import Https from '../utilidades/HttpsURL';

import { clearDB, createStore, getDB, removeDB, setDB } from '../utilidades/dataBase';


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
      presupuesto_inicial:any
      pedido_mas_información:string
      respuesta_cliente_pedido_mas_información:string
      picture1_mas_información:string
      picture2_mas_información:string
      }

  //let proveedores = new Array<datosGeneralesVariosProveedores>();

 // let proveedorBuscado = new Array<proveedorBuscado>();


const HomeCliente = (props:{setIsReg:any,  
  email:any, foto:any, clientType:any, 
  nombre:any, apellido:any, calificacion:any, setFoto:any, setNombre:any, setApellido:any, }) => {

  const axios = require('axios');

  const [categorias, setCategorias] = useState ([])
  //const [proveedorBuscadoHook,setProveedorBuscadoHook]= useState ([])
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


  //createStore("listaProveedores")

  useEffect(() => {

    if(proveedoresEnZona.length > 0){
      setDB("proveedores", (proveedoresEnZona))
    }

  }, [proveedoresEnZona]);

  useEffect(() => {

    setShowCargandoProveedores(true)

    getDB("proveedores").then(res => {
      if( res!= null ){
        if (res.length > 0){
        setShowCargandoProveedores(false)   
        setProveedoresEnZona(res)}
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
            }))
          );
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
        setMisOrdenes(    
            resp.data.map((d: { tipo: any; status: any; fecha_creacion: any; ticket: any; dia: any; hora: any; titulo: any; descripcion: any; email_proveedor: any; imagen_proveedor: any; lacation_lat: any; location_long: any; picture1: any; picture2: any; presupuesto_inicial: any; pedido_mas_información: any; respuesta_cliente_pedido_mas_información: any; picture1_mas_información: any; picutre2_mas_información: any; }) => ({
              tipo:d.tipo,
              status:d.status,
              fecha_creacion:d.fecha_creacion,
              ticket:d.ticket,
              dia:d.dia,
              hora:d.hora,
              titulo:d.titulo,
              descripcion:d.descripcion,
              email_proveedor:d.email_proveedor,
              imagen_proveedor:d.imagen_proveedor,
              location_lat:d.lacation_lat,
              location_long:d.location_long,
              picture1:d.picture1,
              picture2:d.picture2,
              presupuesto_inicial:d.presupuesto_inicial,
              pedido_mas_información:d.pedido_mas_información,
              respuesta_cliente_pedido_mas_información:d.respuesta_cliente_pedido_mas_información,
              picture1_mas_información:d.picture1_mas_información,
              picture2_mas_información:d.picutre2_mas_información
            }))  
        )      
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
              onDidDismiss={() => setShowModal({ isOpen: false })}>
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
                }} />  
            </IonModal>
          
            <ExploreContainerCliente setShowCargandoProveedores={setShowCargandoProveedores} 
              ordenes={misOrdenes}
              proveedores={proveedoresEnZona}
              emailCliente={props.email}
              url={url} 
              buscar={buscar}
              busqueda_categorias={categorias}
              busquedaDatosProveedores={proveedorBuscadoHook}
              setShowModal={setShowModal}
              setTipoDeVistaEnModal={setTipoDeVistaEnModal } />

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


const Busqueda = (props:{categorias:any, setCategorias:any, setBuscar:any, setProveedorBuscadoHook:any}) =>{
  
  let textoBarra= "Búsqueda" 

  const palabraBuscar= useRef("")

  const Buscar = (value:any) =>{
    if(value == "Enter"){
      axios.get(url+"search/palabras/"+palabraBuscar.current).then((resp: { data: any; }) => {

        if (resp.data!="bad"){
          
          /*proveedorBuscado= []         
          for (let i=0; i<resp.data.length;i++){
            proveedorBuscado.push({item:resp.data[i].item,tipo:resp.data[i].tipo,nombre:resp.data[i].nombre,apellido:resp.data[i].apellido,imagen:resp.data[i].imagen,calificacion:resp.data[i].calificacion,email:resp.data[i].email})
          }

          props.setProveedorBuscadoHook(proveedorBuscado)

*/
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
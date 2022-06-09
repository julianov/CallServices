import { arrowBack } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { parentPort } from "worker_threads";
import CardProveedor from "../../utilidades/CardProveedor";
import { IonAlert, IonContent, IonIcon } from "@ionic/react";
import { getLocation } from "../../pages/PedirOrdenes/PedirOrden";
import { ordenesCliente } from "../../pages/Home/HomeCliente";


 const ModalVerCardProveedor = (props:{ordenes:any, url:string, setShowCargandoProveedores:any, setVerProveedor:any,emailCliente:String, email:any, proveedorEmail:string, setVerEmail:any, setItem:any, item:any})  =>{

  const [caracteres,setCaracteres]=useState([])
  const [imagenes,setImagenes]=useState([])
  const [locacionBloqueada, setAlertLocation]=useState(false)
  

  const volver = () => {
      props.setVerProveedor(false) 
  }
    
    //ordenes son las ordenes que hay que checkear si ya hay una orden con el proveedor. Esta data viene del home

    useEffect(() => {

      if(props.email!="" && props.item!="") {
            
        const ubicacion = getLocation();
        ubicacion.then((value)=>{
         
          if (value!=""){
    
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
        
        })}
      
      
  
    }, [props.email, props.item]);

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

    
        return(
          <IonContent>
            <div id="completo">
              <IonIcon icon={arrowBack} onClick={() => volver()} slot="start" id="flecha-volver">  </IonIcon>
    
              <div id="contenedor-central">
    
              <CardProveedor ordenes={props.ordenes} data={caracteres} imagenes={imagenes} emailCliente={props.emailCliente}  proveedorEmail={props.proveedorEmail} ></CardProveedor>
              </div> 
              </div> 
            </IonContent>
          )
      
  
    }
  } 



export default ModalVerCardProveedor;


import { IonActionSheet, IonAlert, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonDatetime, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonLoading, IonPage, IonRange, IonRow, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import { arrowBack, person, receipt, help, chatbubble, close, trash, camera, construct } from "ionicons/icons";
import React, { useEffect, useState } from "react";

import { useRef } from "react";


import './ResultadoBusqueda.css';
import axios from "axios";
import Estrellas from "./Estrellas";

import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import CardProveedor from "./CardProveedor";
import { removeItem } from "./Storage";
import Https from "../utilidades/HttpsURL";


var arreglo_resultado_busqueda=new Array()

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

//const url='http://127.0.0.1:8000/search/';
//const url="https://callservicesvps.online:443/search/"


//const url2="http://127.0.0.1:8000/"
//const url2="https://callservicesvps.online:443/"

const url=Https+"search/"
const url2=Https


const ResultadoBusqueda =  (props:{arreglo_ultimos:any, emailCliente:any, arreglo_categorias:any, busquedaDatosProveedores:any})=> {

    var ultimos=props.arreglo_ultimos
    console.log(ultimos)
    if (props.arreglo_ultimos.length>4){
        ultimos.length=4 //solamente muestro las últimas 4 busquedas recientes
    }


    const [showLoading, setShowLoading]=useState(false)

    const deDondeProviene=useRef("nada")


    //const proveedor=useRef()
    const [caracteres,setCaracteres]=useState()
    const [imagenes,setImagenes]=useState()
    const email=useRef("")

    const [lista, setLista] = useState("nada")

    const BuscarSeleccion =(valor:any)=>{

        //lo que podemos buscar son proveedores de servicios, categorias y locaciones
        setShowLoading(true)
        const axios = require('axios');
        axios.get(url+valor).then((resp: { data: any; }) => {
            if (resp.data!="bad"){
                arreglo_resultado_busqueda=[]
                if(resp.data.length!=0){
                    for (var i=0 ; i<resp.data.length;i++){
                        var aux=[]
                        aux.push(resp.data[i].item )
                        aux.push(resp.data[i].tipo )
                        aux.push(resp.data[i].nombre)
                        aux.push(resp.data[i].apellido)
                        aux.push(resp.data[i].imagen)
                        aux.push(resp.data[i].calificacion)
                        aux.push(resp.data[i].email)
                        arreglo_resultado_busqueda.push(aux)
                    }
                    setLista("proveedores")
                }
                
            }else{
                setShowLoading(false)
                setLista("sin-resultado")
                //show error
            }
        })
    }

    const BuscarProveedor =(valor:any)=>{
        
        setShowLoading(true)
        const axios = require('axios');
        const ubicacion = getLocation();

        //console.log("a ver que se busca:"+valor)
        ubicacion.then((value)=>{
            axios.get(url2+"home/cliente/pedirdatos/"+valor+"/"+"caracteres"+"/"+value, {timeout: 5000}).then((resp: { data: any; }) => {
                
                if (resp.data!="bad"){
                    setCaracteres(resp.data)
                    email.current=valor.split("/")[0]
                    setLista("proveedor-seleccionado")
                    axios.get(url2+"home/cliente/pedirdatos/"+valor+"/"+"imagenes"+"/"+value, {timeout: 5000}).then((resp: { data: any; }) => {
                        if(resp.data!="bad"){
                            setImagenes(resp.data)
                        }
                        
                    })


                }else{
                    for (var i=0; i <ultimos.length; i++){
                        if(ultimos[i][0]==email.current){
                            ultimos.splice(i)
                        }
                        setLista("nada")
                    }
                }
                email.current=valor.split("/")[0]    
            }).catch((err: any) => {

                for (var i=0;i<ultimos.length;i++){
                    if (ultimos[i][0]==email.current){
                        ultimos.splice(i)
                    }
                }
                
                setLista("nada")
            })
        })    

    }

    if(lista=="proveedores"){
        //setShowLoading(false)
        var i=0
        deDondeProviene.current="proveedores"
        return (
            <div id="contenedorCentral-busqueda">
                <IonIcon icon={arrowBack} onClick={() => setLista("nada")} id="volver-busqueda">  </IonIcon>
                <IonTitle id="titulo-busqueda">RESULTADO DE BUSQUEDA</IonTitle>
                <IonCard>
                {arreglo_resultado_busqueda.map((a) => {
                    i=i+1
                    return (
                        <IonItem key={i} id="item-busqueda" onClick={() => BuscarProveedor(a[6]+"/"+a[0])}>
                            <IonGrid>
                                <IonRow id="row-busqueda"><IonTitle id="titulo-busqueda">{a[2].toUpperCase()+" "+a[3].toUpperCase()}</IonTitle></IonRow>
                                <IonRow id="row-busqueda"><img id="imagen-busqueda" src= {a[4]}></img></IonRow>
                                <IonRow id="row-busqueda"><p id="descripción-busqueda">RUBRO: {a[0]}</p></IonRow>
                                <IonRow id="row-busqueda"><p id="descripción-busqueda">{a[1]}</p></IonRow>
                                <Estrellas  calificacion={a[5]}   ></Estrellas> 

                            </IonGrid>
                        </IonItem>
                    );
                })}
                </IonCard>
                <IonLoading
                    cssClass='my-custom-class'
                    isOpen={showLoading}
                    onDidDismiss={() => setShowLoading(false)}
                    message={'Cargado datos...'}
                    duration={5000}
                />

                </div>
            )
    

    }else if(lista=="proveedor-seleccionado"){

        return(
            <>

            <div id="volver-contenedor-ExplorerContainer">
            <IonIcon icon={arrowBack} onClick={() => setLista(deDondeProviene.current)} id="volver-busqueda"> </IonIcon>
          </div> 

                <div id="contenedorCentral-busqueda">
                    <CardProveedor data={caracteres} imagenes={imagenes} emailCliente={email.current} proveedorEmail={email.current} ></CardProveedor>
                </div></>)

    }else if(lista=="sin-resultado"){
        return(<div id="contenedorCentral-busqueda">
            <IonIcon icon={arrowBack} onClick={() => setLista("nada")} id="volver-busqueda">  </IonIcon>
            <IonTitle id="titulo-busqueda">BÚSQUEDA SIN RESULTADO</IonTitle>
            </div >)
    }else{
        deDondeProviene.current="nada"
        if (ultimos.length!=0){
            var i=0
            return (
                <div id="contenedorCentral-busqueda">
                    <IonTitle id="titulo-busqueda">BÚSQUEDAS RECIENTES</IonTitle>
                    <IonCard>
                    {ultimos.map((a: any[]) => {
                        i=i+1
                        if (a[1]!=null && a[2]!=null ){

                            return (
                                <IonItem id="item-busqueda" onClick={() => BuscarProveedor(a[0]+"/"+a[6])}>
                                <IonGrid>
                                    <IonRow id="row-busqueda">
                                        <IonCol size="auto" id="col-img"><img id="imagen-busqueda" src= {a[4]}></img></IonCol>
                                        <IonCol size="auto" id="col-busqueda">
                                            <IonTitle id="titulo-busqueda">{a[1].toUpperCase()+" "+a[2].toUpperCase()}</IonTitle>
                                            <p id="descripción-busqueda">RUBRO: {a[6]}</p>
                                            <p id="descripción-busqueda">{a[3]}</p>
                                            <Estrellas  calificacion={a[5]}   ></Estrellas>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow > 
                                    </IonRow>
                                </IonGrid>
                            </IonItem>
                            );

                        }
                        
                    })}
                </IonCard>
                < ProveedoresBuscardo busquedaDatosProveedores={props.busquedaDatosProveedores}  BuscarProveedor={BuscarProveedor}  ></ProveedoresBuscardo>
                <Categorias arreglo_categorias={props.arreglo_categorias} busquedaDatosProveedores={props.busquedaDatosProveedores} BuscarSeleccion={BuscarSeleccion} />
                <IonLoading
                    cssClass='my-custom-class'
                    isOpen={showLoading}
                    onDidDismiss={() => setShowLoading(false)}
                    message={'Cargado datos...'}
                    duration={5000}
                />
            </div>
                )
        }else{
            return (
                <div id="contenedorCentral-busqueda">  
                    <ProveedoresBuscardo busquedaDatosProveedores={props.busquedaDatosProveedores}  BuscarProveedor={BuscarProveedor}  ></ProveedoresBuscardo>
                    <Categorias arreglo_categorias={props.arreglo_categorias} busquedaDatosProveedores={props.busquedaDatosProveedores} BuscarSeleccion={BuscarSeleccion} />
                </div>
                )
        }

    }
   
    
}

const Categorias =  (props:{arreglo_categorias:any, busquedaDatosProveedores:any, BuscarSeleccion:any})=> {

    var categorias_propuesta=["CARPINTERIA","CERRAJERIA","ELECTRICIDAD","ELECTRONICA","FLETE","GASISTA","HERRERIA","INFORMATICA",
    "MECANICA","PLOMERIA","REFRIGERACION","TELEFONIA CELULAR"]

    if (props.arreglo_categorias.length>0){
        var i=0
        return (
            <>    
                <IonTitle id="titulo-busqueda">CATEGORIAS</IonTitle>
                <IonCard>
                    {props.arreglo_categorias.map((a: string) => {
                        i=i+1
                        return (
                            <IonItem key={i} id="item-busqueda" onClick={() => props.BuscarSeleccion("categoria/"+a)}>
                                <IonGrid>
                                    <IonRow id="row-busqueda"><IonTitle id="titulo-busqueda">{a}</IonTitle></IonRow>
                                    <IonRow id="row-busqueda"><p id="descripción-busqueda">CATEGORÍA</p></IonRow>
                                </IonGrid>
                            </IonItem>
                        );
                    })}
                </IonCard></>
            )
    } else if(props.arreglo_categorias.length==0 && props.busquedaDatosProveedores.length==0){
        var i=0
        return (
            <>    
                <IonTitle id="titulo-busqueda">NO HAY COINCIDENCIAS</IonTitle>
                <IonTitle id="titulo-busqueda">Algunas Recomendaciones en categorías</IonTitle>
                <IonCard>
                    {categorias_propuesta.map((a: string) => {
                        i=i+1
                        return (
                            <IonItem key={i} id="item-busqueda" onClick={() => props.BuscarSeleccion("categoria/"+a)}>
                                <IonGrid>
                                    <IonRow id="row-busqueda"><IonTitle id="titulo-busqueda">{a}</IonTitle></IonRow>
                                    <IonRow id="row-busqueda"><p id="descripción-busqueda">CATEGORÍA</p></IonRow>
                                </IonGrid>
                            </IonItem>
                        );
                    })}
                </IonCard></>
            )

    }else{
        return(<></>)
    }
}


const ProveedoresBuscardo =  (props:{busquedaDatosProveedores:any, BuscarProveedor:any})=> {
    if (props.busquedaDatosProveedores.length>0){
        return (
            <>    
                <IonTitle id="titulo-busqueda">RESULTADO DE BÚSQUEDA</IonTitle>
                
                <IonCard>
                {props.busquedaDatosProveedores.map((a: any[]) => {
                    return (
                        <IonItem id="item-busqueda" onClick={() => props.BuscarProveedor(a[6]+"/"+a[0])}>
                            <IonGrid>
                                <IonRow id="row-busqueda">
                                    <IonCol><img id="imagen-busqueda" src= {a[4]}></img></IonCol>
                                    <IonCol id="col-busqueda">
                                        <IonTitle id="titulo-busqueda">{a[2].toUpperCase()+" "+a[3].toUpperCase()}</IonTitle>
                                        <p id="descripción-busqueda">RUBRO: {a[0]}</p>
                                        <p id="descripción-busqueda">{a[1]}</p>
                                    </IonCol>
                                </IonRow>
                                <IonRow > 
                                <IonCol> <Estrellas  calificacion={a[5]}   ></Estrellas></IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonItem>
                    );
                })}
                </IonCard>
                </>
            )
}else{
    return(<></>)
}


}


export default ResultadoBusqueda
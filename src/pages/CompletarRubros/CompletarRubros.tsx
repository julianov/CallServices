
import { Geolocation } from "@capacitor/core";
import { base64FromPath } from "@ionic/react-hooks/filesystem/utils";
import { setServers } from "dns";
import { arrowBack, camera, trash,close, volumeLowSharp, imageOutline, terminalOutline } from "ionicons/icons";
import { debugPort } from "process";
import React, { useEffect, useRef, useState } from "react";
import { Redirect } from "react-router";
import { isNumber } from "util";
import { b64toBlob } from "../../utilidades/b64toBlob";
import Https from "../../utilidades/HttpsURL";
import { getItem, removeItem, setItem } from "../../utilidades/Storage";
import { Photo, usePhotoGallery } from "../../hooks/usePhotoGallery";

import "./CompletarRubros.css";

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonAlert, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonDatetime, IonGrid, IonInput, IonItem, IonLabel, IonList, IonLoading, IonRow, IonSelect, IonSelectOption, IonIcon, IonFabButton, IonImg, IonActionSheet, IonRange, IonTextarea, IonItemSliding, IonSegment, IonSegmentButton, IonItemDivider, IonPopover } from "@ionic/react";
import { itemRubro } from "../../Interfaces/interfaces";
import { useRubroContext1, useRubroContext2 } from "../../Contexts/RubroContext";
import { retornarIconoCategoria } from "../../utilidades/retornarIconoCategoria";

/*
CompletarItems
    |
    |->Lista
    |    |->CardView
    |->SetITem
*/

const url=Https+"completarinfo/"
























let posicion: string | number;

let rubro_a_cargar: string;

let arreglo=new Array();

const getLocation = async () => {
    try {
        const position = await Geolocation.getCurrentPosition();
        posicion=position.coords.latitude +"/"+ position.coords.longitude
        return posicion;
  
    } catch (e) {
      return 0;
    }
  }

  const CompletarRubros = (props:{setIsReg:any,email:any, clientType:any}) => {


    // const [ver,setVer]=useState("*")
 
   // const [arregloRubro, setArregloRubros] =  useState <rubro []> ( [])
   const {rubrosItem1,setItemRubro1} = useRubroContext1 () 
   const {rubrosItem2,setItemRubro2} = useRubroContext2 () 
    
 
     const [vista,setVista]=useState(0)
 
     //de vista 1
     const [tituloRubros, setTituloRubros]=useState("")
     const [tituloAVer, setTituloAVer]=useState("")
 
 
     //Elementos a enviar
 
     //const [rubro, setRubro] = useState<string>("");
     const rubro=useRef<string>("")
 
     const [radius, setRadius] = useState(30);
    // const radius=useRef(0)
 
     const hace_orden_emergencia=useRef("no")
     const pais = useRef("")
     const provincia = useRef("")
     const ciudad = useRef("")
     const domicilio_calle=useRef("")
     const domicilio_numeración=useRef <number>()
 
     const [posicion, setPosicion]= useState<string>("");
 
     const dias = useRef <string>("")
     const horaInicio = useRef<string>('06:00');
     const horaFin = useRef<string>('15:00')
     const descripcion = useRef <string>("")
 
     //const [certificacion, setCertificacion] = useState<String>(); //en formato base64
     const certificacion = useRef <Blob>()
     const foto1= useRef <Blob>()
     const foto2= useRef <Blob>()
     const foto3= useRef <Blob>()
    
     const certificacionMostrar= useRef ("")
     const foto1Mostrar= useRef ("")
     const foto2Mostrar= useRef ("")
     const foto3Mostrar= useRef ("")
 
     //Fin de elementos a enviar
 
     const [showAlertCompletarCampos, setShowAlertCompletarCampos]=useState(false)
     const [showAlertAgregarCertificacion,setShowAlertAgregarCertificacion]=useState(false)
     const [showAlertIngreseFoto,setShowAlertIngreseFoto]=useState(false)
 
     const [showLoading,setShowLoading]=useState(false)
 
   //  const [reload,setReload] = useState(false)
 
 
 
     useEffect(() => {
         if(vista==0){
             //setRubro("");
             rubro.current=""
             setRadius (30);
             dias.current=""
             //setDias("");
             horaInicio.current= '06:00'
             //setHoraInicio('06:00');
             horaFin.current='15:00'
             //setHoraFin('15:00');
             descripcion.current=""
             //setDescripcion("");
 
             hace_orden_emergencia.current="no"
             pais.current=("")
             provincia.current=("")
             ciudad.current=("")
             domicilio_calle.current=("")
             domicilio_numeración.current=(0)
 
             // setCertificacion(undefined); //en formato base64
             certificacion.current=undefined
             foto1.current=undefined
             foto2.current=undefined
             foto3.current=undefined
 
             certificacionMostrar.current=""
             foto1Mostrar.current=""
             foto2Mostrar.current=""
             foto3Mostrar.current=""
         }
         //setReload(false)
     }, [vista]);
     
 
  const enviarInformacion =async ()=>{
        
             rubro_a_cargar=rubro.current
 
             var formDataToUpload = new FormData();
             formDataToUpload.append("tipo", String(props.clientType))
             formDataToUpload.append("email", props.email);
 
             formDataToUpload.append("item", rubro.current);
             arreglo.push(rubro.current)
             formDataToUpload.append("radius", String(radius));
             arreglo.push(String(radius))
             formDataToUpload.append("posicion", posicion);
             //arreglo.push(posicion)
 
             formDataToUpload.append("description", descripcion.current);
             arreglo.push(descripcion.current)
 
             //Lo siguiente corresponde a la calificación
             arreglo.push(String(0))
 
             formDataToUpload.append("days_of_works", dias.current);
             arreglo.push(dias.current)
             formDataToUpload.append("hour_init", horaInicio.current);
             arreglo.push(horaInicio.current)
             formDataToUpload.append("hour_end", horaFin.current);
             arreglo.push(horaFin.current)
 
             if(certificacion.current!=null || certificacion.current!=undefined){
                 formDataToUpload.append("certificate", certificacion.current);
                 arreglo.push(certificacionMostrar.current)
             }
 
             if(foto1.current!=null || foto1.current!=undefined){
                 formDataToUpload.append("picture1",  foto1.current);
                 arreglo.push(foto1Mostrar.current)
             }
 
             if(foto2.current!=null || foto2.current!=undefined){
                 formDataToUpload.append("picture2", foto2.current);
                 arreglo.push(foto2Mostrar.current)
             }
 
             if(foto3.current!=null || foto3.current!=undefined){
                 formDataToUpload.append("picture3", foto3.current);
                 arreglo.push(foto3Mostrar.current)
             }
 
             formDataToUpload.append("pais", pais.current);
             formDataToUpload.append("provincia",provincia.current)
             formDataToUpload.append("ciudad", ciudad.current);
             formDataToUpload.append("calle", domicilio_calle.current);
             arreglo.push(pais.current)
             arreglo.push(provincia.current)
             arreglo.push(ciudad.current)
             arreglo.push(domicilio_calle.current)
             formDataToUpload.append("calle-numeracion", String(domicilio_numeración.current));
             arreglo.push(domicilio_numeración.current) 
 
             formDataToUpload.append("ordenEmergencia", hace_orden_emergencia.current);
             arreglo.push(hace_orden_emergencia.current)
 
             
             const axios = require('axios');
             axios({
                 url:url+"subirrubro",
                 method:'POST',
                 headers: {"content-type": "multipart/form-data"},
                 data:formDataToUpload
             }).then(function(res: any){
 
                 if(res.data=="rubro cargado"){
                   
                     getItem("rubro1").then(res2 => {
                         console.log("ENTONCES VEAMOS QUE HAY EN RUBRO 1: "+res2)
                         if (res2=="" || res2==null ){
 
                             // rubro radius posicion descripcion dias horainicio horafin certificacion foto1 foto2 foto3
 
                           setItem("rubro1", rubro_a_cargar).then(() =>{    
                             setItem("infoRubro1", JSON.stringify( { 
                                rubro:rubro.current,
                                radius:String(radius),
                                description:descripcion.current,
                                calificacion:0,
                                hace_orden_emergencia:hace_orden_emergencia.current,
                                days_of_works:dias.current,
                                hour_init:horaInicio.current,
                                hour_end:horaFin.current,
                                certificate:certificacionMostrar.current,
                                picture1:foto1Mostrar.current,
                                picture2:foto2Mostrar.current,
                                picture3:foto3Mostrar.current,
                                pais:pais.current,
                                provincia:provincia.current,
                                ciudad:ciudad.current,
                                calle:domicilio_calle.current,
                                numeracion:String(domicilio_numeración.current),
                            })).then(() =>{ 
                                setItemRubro1!(
                                    { 
                                    rubro:rubro.current,
                                    radius:String(radius),
                                    description:descripcion.current,
                                    calificacion:0,
                                    hace_orden_emergencia:hace_orden_emergencia.current,
                                    days_of_works:dias.current,
                                    hour_init:horaInicio.current,
                                    hour_end:horaFin.current,
                                    certificate:certificacionMostrar.current,
                                    picture1:foto1Mostrar.current,
                                    picture2:foto2Mostrar.current,
                                    picture3:foto3Mostrar.current,
                                    pais:pais.current,
                                    provincia:provincia.current,
                                    ciudad:ciudad.current,
                                    calle:domicilio_calle.current,
                                    numeracion:String(domicilio_numeración.current),
                                })
                             setShowLoading(false);
                             setVista(0)
                             arreglo = []
                             //setReload(true)
                             })
                         })
                         }
                         else{
                           setItem("rubro2", rubro_a_cargar).then(() =>{   
                             setItem("infoRubro2", JSON.stringify( { 
                                rubro:rubro.current,
                                radius:String(radius),
                                description:descripcion.current,
                                calificacion:0,
                                hace_orden_emergencia:hace_orden_emergencia.current,
                                days_of_works:dias.current,
                                hour_init:horaInicio.current,
                                hour_end:horaFin.current,
                                certificate:certificacionMostrar.current,
                                picture1:foto1Mostrar.current,
                                picture2:foto2Mostrar.current,
                                picture3:foto3Mostrar.current,
                                pais:pais.current,
                                provincia:provincia.current,
                                ciudad:ciudad.current,
                                calle:domicilio_calle.current,
                                numeracion:String(domicilio_numeración.current),
                            })).then(() =>{
                                setItemRubro2!(
                                    { 
                                    rubro:rubro.current,
                                    radius:String(radius),
                                    description:descripcion.current,
                                    calificacion:0,
                                    hace_orden_emergencia:hace_orden_emergencia.current,
                                    days_of_works:dias.current,
                                    hour_init:horaInicio.current,
                                    hour_end:horaFin.current,
                                    certificate:certificacionMostrar.current,
                                    picture1:foto1Mostrar.current,
                                    picture2:foto2Mostrar.current,
                                    picture3:foto3Mostrar.current,
                                    pais:pais.current,
                                    provincia:provincia.current,
                                    ciudad:ciudad.current,
                                    calle:domicilio_calle.current,
                                    numeracion:String(domicilio_numeración.current),
                                })
                             setShowLoading(false);
                             setVista(0)
                             arreglo = []
                         })
                         })
                         }
                       })
 
                     setItem("rubroLoaded", true).then(() =>{
                         
                        
                     }
                     );
                 }else{
 
                 }
                 //recarga la vista ejecutando el useEffect
 
 
                 if(res=="ha cargado la cantidad maxima de items"){
                     setVista(0)
                 }
                 else{
                     setVista(0)
                 }
             }).catch((error: any) =>{
                 setVista(0)
                 //Network error comes in
             });   
       }
 
     const volver= ()=>{
         if(vista > 0){
             setVista(0)
         }
     }
 
     if(vista==0){
         //Vista 0 son los rubros cargados
         return(
             <IonPage>
            
               <IonContent fullscreen>
                 <Vista1 setIsReg={props.setIsReg} setVista={setVista} volver={volver} email={props.email} clientType={props.clientType} setTituloRubros={setTituloRubros} tituloRubros={tituloRubros} setTituloAVer={setTituloAVer} ></Vista1>
               </IonContent>
             </IonPage>
           );
     }
     if(vista==1){
         //muestra informacion del rubro cargado
         return(
            
               <IonContent >
 
                   
                 <div id="CardItemCompletarRubro">
                 
 
                 <CardItem volver={volver} setVista={setVista} clientType={props.clientType} email={props.email} ver={tituloAVer} />
                 </div>
               </IonContent>
           );
     }
     if(vista==2){
         //seleccion de tipo de rubro, hora y dias
     return(
              
        <IonContent fullscreen>
 
            <IonAlert
                 isOpen={showAlertCompletarCampos}
                 onDidDismiss={() => setShowAlertCompletarCampos(false)}
                 cssClass='my-custom-class'
                 header={'Completar campos'}
                 subHeader={''}
                 message={'Debe completar todos los campos para continuar'}
                 buttons={['OK']}
                 />
 
            < AgregarTipoRubro setVista={setVista} rubro={rubro} dias={dias} horaInicio={horaInicio} horaFin={horaFin} setShowAlertCompletarCampos={setShowAlertCompletarCampos} />
 
 
        </IonContent>
             
           );
     }
 
     if (vista==3){
         //descripcion del rubro
             return(
             <IonPage>
               
               <IonContent fullscreen>
 
                       <IonAlert
                 isOpen={showAlertCompletarCampos}
                 onDidDismiss={() => setShowAlertCompletarCampos(false)}
                 cssClass='my-custom-class'
                 header={'Completar campos'}
                 subHeader={''}
                 message={'Debe completar todos los campos para continuar'}
                 buttons={['OK']}
                 />
 
                 < AgregarDescripcion setVista={setVista} descripcion={descripcion} setShowAlertCompletarCampos={setShowAlertCompletarCampos} />
 
               </IonContent>
             </IonPage>
           );
     }
     if(vista==4){
         //radio de trabajo
         return(
            <div id="contenedorPrincipalCompletarRubroLocacion">

                       <IonAlert
                 isOpen={showAlertCompletarCampos}
                 onDidDismiss={() => setShowAlertCompletarCampos(false)}
                 cssClass='my-custom-class'
                 header={'Completar campos'}
                 subHeader={''}
                 message={'Debe completar todos los campos para continuar'}
                 buttons={['OK']}
                 />
 
                 < AgregarRadio setVista={setVista} radio={radius} setRadio={setRadius} 
                 setPosicion={setPosicion} 
                 rubro={rubro.current}
                 ordenesEmergencia={hace_orden_emergencia} 
                 pais={pais} provincia={provincia} ciudad={ciudad} domicilio_calle={domicilio_calle} domicilio_numeracion={domicilio_numeración} />
 
               </div>
           );
     }
     
     if(vista==6){

        //agregar certificado
                     return(
             <IonPage>
              
               <IonContent fullscreen>
 
                       <IonAlert
                 isOpen={showAlertAgregarCertificacion}
                 onDidDismiss={() => setShowAlertAgregarCertificacion(false)}
                 cssClass='my-custom-class'
                 header={'Ingrese certificacion'}
                 subHeader={''}
                 message={'Debe agregar una certificación para continuar'}
                 buttons={['OK']}
                 />
 
                 < AgregarCertificado setVista={setVista} certificacion={certificacion} 
                 certificacionMostrar={certificacionMostrar} setShowAlertAgregarCertificacion={setShowAlertAgregarCertificacion}
                 setShowLoading={setShowLoading} enviarInformacion={enviarInformacion} />
 
               </IonContent>
             </IonPage>
           );
     }
 
     if(vista==5){
 //agregar imagenes de referencia
         return(
             
              
               <IonContent fullscreen>
 
             <IonAlert
                 isOpen={showAlertIngreseFoto}
                 onDidDismiss={() => setShowAlertIngreseFoto(false)}
                 cssClass='my-custom-class'
                 header={'Ingrese foto'}
                 subHeader={''}
                 message={'Debe agregar ingresar al menos una foto para continuar'}
                 buttons={['OK']}
                 />
 
                 <IonLoading
                     cssClass='my-custom-class'
                     isOpen={showLoading}
                     onDidDismiss={() => setShowLoading(false)}
                     message={'Cargando datos...'}
                     duration={15000}
                 />
 
                 <AgregarImagenes setVista={setVista}
                     foto1={foto1}  foto2={foto2}  foto3={foto3} 
                     foto1Mostrar={foto1Mostrar} foto2Mostrar={foto2Mostrar} foto3Mostrar={foto3Mostrar}
                     setShowAlertIngreseFoto={setShowAlertIngreseFoto}  />
 
               </IonContent>
             
           );
     } 
 
     else{
         return(
             <IonPage>
             <IonHeader>
               <IonToolbar>
               <IonGrid>
                   <IonRow>
                   <IonCol id="columna2" ><IonTitle>RUBRO CARGADO</IonTitle></IonCol>
                   </IonRow>
               </IonGrid>
               </IonToolbar>
             </IonHeader>
             <IonContent fullscreen>
 
             </IonContent>
           </IonPage>
             
            
         );
     }
 
   };
 
   ///////////////////////////////////////////////////////////////////////////
   //////////////////////////////////////////////////////////////////////////
 
   // vista=0
 
 
 
   const Vista1 =(props:{ setIsReg:any,setVista:any, volver:any, email:any, clientType:any, setTituloRubros:any, tituloRubros:any, setTituloAVer:any } ) => {
 
     const [tieneCargado, setTieneCargado]=useState (false)
 
     const [error, setError] = useState(false)
 
     const {rubrosItem1,setItemRubro1} = useRubroContext1 () 
     const {rubrosItem2,setItemRubro2} = useRubroContext2 ()  
 
     useEffect(() =>{
         
 
         if((rubrosItem1?.rubro!="" && rubrosItem1?.rubro!=undefined) ||(rubrosItem2?.rubro!="" && rubrosItem2?.rubro!=undefined)  ){
 
             setTieneCargado(true)
          
 
         }else{
             const axios = require('axios');
             axios.get(url+"rubros/"+"pedir/"+props.clientType+"/"+props.email)
             .then((res: { data: any; }) => {
               const resquest = res.data;
               if(resquest!="No usuario registrado"){
                 if(resquest=="No hay rubros cargados"){
                     setTieneCargado(false)
                 }else{
     
                     /* Por aquí agregar */
                     
                     setTieneCargado(true)
                     props.setTituloRubros(resquest.split("-"));
                 }
     
               }
             }).catch((err: any) => {
                 // what now?
                 setError(true)
         
             })
         }
         
 
     }, []);
 
 
 
     if (!error){
         if(tieneCargado){
             return (
                 <Lista setIsReg={props.setIsReg} setVista={props.setVista}  clientType={props.clientType} email={props.email} setTituloAVer={props.setTituloAVer} ></Lista>
                 );
     
         }else{
              return (
                 <div id="contenedorCompletarRubro">
                 <header id="headerRegistro">
                 <a href={"/"} id="flechaIngresar">
                         <IonIcon onClick={()=> props.volver() } icon={arrowBack}  id="flecha-volver-completar-rubro">  </IonIcon>
                 </a>
                   <IonTitle id="register-title">MIS RUBROS</IonTitle>
                 </header>
           
                 <div style={{display:"flex", flexDirection:"column", width:"95%", height:"auto", justifyContent:"center", alignItems:"center"}}>
                     <div className="caja">
                     <img src={"./assets/icon/simboloAlerta.png"} style={{width:"32px", height:"32px"}} />  

                         <strong style={{margin:"15px 0 0 0 "}} >NO POSEE RUBROS CARGADOS</strong>
                         <p style={{fontSize:"0.9em"}}>Cargue un Rubro para poder recibir pedidos de clientes</p>
                     </div>
                 </div>
           
                 <footer id="footerCompletarRubro">
                     <IonButton id="botonCompletarRubros" shape="round" onClick={() => {props.setVista(2)}}>AGREGAR RUBRO</IonButton>
                 </footer>
               </div> 
     
     
                 );
         }
     }else{
 
         return (
             <div id="contenedorCompletarRubro">
             <header id="headerRegistro">
             <a href={"/"} id="flechaIngresar">
                     <IonIcon onClick={()=> props.volver() } icon={arrowBack}  id="flecha-volver-completar-rubro">  </IonIcon>
             </a>
               <IonTitle id="register-title">RUBROS</IonTitle>
             </header>
       
             <div style={{display:"flex", flexDirection:"column", width:"95%", height:"auto", justifyContent:"center", alignItems:"center"}}>
                 <div className="caja">
                     <strong>ERROR DE CONECTIVIDAD</strong>
                     <p>Asegúrese de tener conectividad de red o intente más tarde</p>
                 </div>
             </div>
       
             <footer id="footerCompletarRubro">
             </footer>
           </div> 
 
 
             );
 
     }
    
   
 }


 const Rubritos = (props:{setTituloAVer:any, setVista:any}) =>{

    const verRubro=( titulo:any) => {
        props.setTituloAVer(titulo)
        props.setVista(1)
    }

    const {rubrosItem1,setItemRubro1} = useRubroContext1 () 
    const {rubrosItem2,setItemRubro2} = useRubroContext2 () 

    if ((rubrosItem1!.rubro!="" && rubrosItem1!.rubro!=undefined) && (rubrosItem2!.rubro!="" && rubrosItem2!.rubro!=undefined)){
        return (
            <>
                <IonItem style={{width:"80%"}}  onClick={() => (verRubro(rubrosItem1!.rubro))}>
                    <strong> {rubrosItem1!.rubro} </strong>
                    <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria(rubrosItem1!.rubro)}></img>
                </IonItem>
                <IonItem style={{width:"80%"}}  onClick={() => (verRubro(rubrosItem2!.rubro))}>
                    <strong> {rubrosItem2!.rubro} </strong>
                    <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria(rubrosItem2!.rubro)}></img>
                </IonItem>
            </>
        )
    }else if((rubrosItem1!.rubro=="" || rubrosItem1!.rubro==undefined) && (rubrosItem2!.rubro!="" && rubrosItem2!.rubro!=undefined)){ 
       
        return (
            <>
            <IonItem style={{width:"80%"}} onClick={() => (verRubro(rubrosItem2!.rubro))}>
                <strong> {rubrosItem2!.rubro} </strong>
                <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria(rubrosItem2!.rubro)}></img>
            </IonItem>
            < div style={{display:"flex", width:"100%", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center"}}>
                    <p style={{fontSize:"0.9em", marginTop:"45px"}}> AGREGAR OTRO RUBRO</p>
                    <IonButton color="warning" shape="round" style={{width:"40px", height:"40px",}} onClick={() => { props.setVista(2)} }><p style={{fontSize:"1.4em", color:"black", fontWeight:"bold"}}>+</p></IonButton>
            </div>
</>
        )
    }else if((rubrosItem1!.rubro!="" && rubrosItem1!.rubro!=undefined) && (rubrosItem2!.rubro=="" || rubrosItem2!.rubro==undefined)){ 
        return (
            <>
                <IonItem style={{width:"80%"}}  onClick={() => (verRubro(rubrosItem1!.rubro))}>
                    <strong> {rubrosItem1!.rubro} </strong>
                    <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria(rubrosItem1!.rubro)}></img>
                </IonItem>
                < div style={{display:"flex", width:"100%", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center"}}>
                    <p style={{fontSize:"0.9em", marginTop:"45px"}}> AGREGAR OTRO RUBRO</p>
                    <IonButton color="warning" shape="round" style={{width:"40px", height:"40px",}} onClick={() => { props.setVista(2)} }><p style={{fontSize:"1.4em", color:"black", fontWeight:"bold"}}>+</p></IonButton>
                </div>
            </>
        )
    }else{
        return (
            <>
                <h1>NO POSEE RUBROS CARGADOS</h1>
                <IonButton shape="round" id="boton-inicialBR" onClick={() => { props.setVista(2)} }>AGREGAR RUBRO</IonButton>

            </>
        )
    }

 }
 
 
 const Lista = (props:{ setIsReg:any,setTituloAVer:any, setVista:any, clientType:any, email:any }) =>{
 
     const [datosListos,setDatosListos]=useState(false);
 
     const [termino,setTermino]=useState(false)
 
     const {rubrosItem1,setItemRubro1} = useRubroContext1 () 
     const {rubrosItem2,setItemRubro2} = useRubroContext2 ()  

     var cantidad=0;
     if(rubrosItem1?.rubro!=""){
         cantidad++
     }
     if(rubrosItem2?.rubro!=""){
        cantidad++
    }
     
     if (termino){
        
         props.setIsReg(true) 
         window.location.reload();
 
         return (
             <><Redirect push={true} to="/home" />
             </> 
             )
 
     }
     
             return(
                 <div id="contenedorCompletarRubro">
                     <div style={{display:"flex",flexDirection:"column", width:"100%",  height:"auto", marginTop:"50px", textAlign:"center"}}>
                         <h1 style={{fontSize:"1.3em", color:"black", fontWeight:"bold"}}>RUBROS CARGADOS</h1>
                     </div>
                     <IonItemDivider />

       
                     <div style={{display:"flex",flexDirection:"column", width:"100%",  height:"100%", justifyContent:"center",alignItems:"center" }}>
                     
                     <Rubritos setTituloAVer={props.setTituloAVer} setVista={props.setVista}></Rubritos>

                     </div>
       
                     <div style={{display:"flex",flexDirection:"column", width:"100%",  height:"auto", justifyContent:"center", alignItems:"center", marginBottom:"32px"}}>
                     
                        <IonButton shape="round" id="boton-inicialBR" onClick={()=> setTermino(true) } >FINALIZAR CARGA DE RUBROS</IonButton>
                     
                     </div>
           </div> 
 
 
 
             );
         
        
     }
 
 
   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
 //vista=1

 
 const CardItem= (props:{volver:any, setVista:any, clientType:any, email:any, ver:any}) => {
 
    // const [rubros, setRubros]=useState <any>();
     //const [datosListos,setDatosListos]=useState(false);
   //  const [showCargando, setShowCargando]=useState(true)
     const [showRubroEliminado, setShowRubroEliminado]=useState(false)
 
     const {rubrosItem1,setItemRubro1} = useRubroContext1 () 
   const {rubrosItem2,setItemRubro2} = useRubroContext2 ()
   
   
     const [item, setItem]= useState("")
     const radius = useRef("80")
     const description = useRef("")
     const calificacion= useRef(0)
 
     const pais= useRef("")
     const provincia= useRef("")
     const ciudad= useRef("")
     const calle= useRef("")
     const numeracion= useRef("")
 
     const days_of_works = useRef("")
     const hour_init = useRef("")
     const hour_end = useRef("")
     const certificate = useRef("")
     const picture1 = useRef("")
     const picture2 = useRef("")
     const picture3 = useRef("")
 
     useEffect(() => {   
 
        if (rubrosItem1?.rubro==props.ver){
            setItem(rubrosItem1!.rubro)
            radius.current=rubrosItem1!.radius
            description.current=rubrosItem1!.description
            calificacion.current=rubrosItem1!.calificacion
            pais.current=rubrosItem1!.pais
            provincia.current=rubrosItem1!.provincia
            ciudad.current=rubrosItem1!.ciudad
            calle.current=rubrosItem1!.calle
            numeracion.current=rubrosItem1!.numeracion
            days_of_works.current=rubrosItem1!.days_of_works
            hour_init.current=rubrosItem1!.hour_init
            hour_end.current=rubrosItem1!.hour_end
            certificate.current=rubrosItem1!.certificate
            picture1.current=rubrosItem1!.picture1
            picture2.current=rubrosItem1!.picture2
            picture3.current=rubrosItem1!.picture3
         }else{

            setItem(rubrosItem2!.rubro)
            radius.current=rubrosItem2!.radius
            description.current=rubrosItem2!.description
            calificacion.current=rubrosItem2!.calificacion
            pais.current=rubrosItem2!.pais
            provincia.current=rubrosItem2!.provincia
            ciudad.current=rubrosItem2!.ciudad
            calle.current=rubrosItem2!.calle
            numeracion.current=rubrosItem2!.numeracion
            days_of_works.current=rubrosItem2!.days_of_works
            hour_init.current=rubrosItem2!.hour_init
            hour_end.current=rubrosItem2!.hour_end
            certificate.current=rubrosItem2!.certificate
            picture1.current=rubrosItem2!.picture1
            picture2.current=rubrosItem2!.picture2
            picture3.current=rubrosItem2!.picture3

         }
 
       
 
     }, []);
 
     const eliminarRubro = ()=>{
         const axios = require('axios');
 
         var formDataToUpload = new FormData();
         formDataToUpload.append("email", props.email);
         formDataToUpload.append("tipo", props.clientType);
         formDataToUpload.append("item", item);
 
         axios({
             url:url+"eliminarRubro",
             method:'POST',
             headers: {"content-type": "multipart/form-data"},
             data:formDataToUpload
         }).then(function(res: any){
 
             if(res!=null){
                 if (res.data=="rubro elimnado"){
 
                     //Aca tengo que eliminar el setItem
                     getItem("rubro2").then(res => {
                        if (res!=null && res!= undefined && res!="" && res==item){
                            removeItem("rubro2")
                            removeItem("infoRubro2")
                            //props.setRubro(null)
                            setItemRubro2!({
                              rubro:"",
                              radius:"",
                              description:"",
                              hace_orden_emergencia:"",
                              calificacion:0,
                              pais:"",
                              provincia:"",
                              ciudad:"",
                              calle:"",
                              numeracion:"",
                              days_of_works:"",
                              hour_init:"",
                              hour_end:"",
                              certificate:"",
                              picture1:"",
                              picture2:"",
                              picture3:"",
                             })
                             props.setVista(0)
                            setShowRubroEliminado(true)
                         }
                        else{
                          getItem("rubro1").then(res => {
                            if (res!=null && res!= undefined && res!="" && res==item){
                              removeItem("rubro1")
                              removeItem("infoRubro1")
                              setItemRubro1!({
                                rubro:"",
                                radius:"",
                                description:"",
                                hace_orden_emergencia:"",
                                calificacion:0,
                                pais:"",
                                provincia:"",
                                ciudad:"",
                                calle:"",
                                numeracion:"",
                                days_of_works:"",
                                hour_init:"",
                                hour_end:"",
                                certificate:"",
                                picture1:"",
                                picture2:"",
                                picture3:"",
                              })
                              props.setVista(0)
                              setShowRubroEliminado(true)
                            }
                          })
                        }
                     })
 
                     
 
                 }else if(res.data=="no ha sido posible eliminar el rubro"){
                     props.setVista(0)
                 }else{
                     props.setVista(0)
                 }
             }
 
         }).catch((error: any) =>{
             //Network error comes in
         });   
 
     }
 
     return (
       <>
         <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto", justifyContent:"center", background:"#f3f2ef"}}>
         
            <IonIcon onClick={()=> props.volver() } icon={arrowBack}  id="flecha-volver-completar-rubro">  </IonIcon>
        
     <IonCard id="ionCardCompletarRubros">
             <IonCardHeader>
                 <IonCardTitle>{item}</IonCardTitle>
                 <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria(item)}></img>
             </IonCardHeader>
             <strong>Descripción:</strong>
             <IonCardContent>{description.current}</IonCardContent>
         </IonCard>
 
         <IonCard id="ionCardCompletarRubros">

            <div style={{display:"flex", flexDirection:"column",textAlign:"left",alignItems:"left",width:"100%", height:"auto", paddingLeft:"15px"}}>
                <h2 style={{textAlign:"left", fontSize:"1em", color:"black", margin:"15px 0 10px 0"}} >DATOS DE LOCACIÓN CARGADOS</h2>    
                <IonItemDivider style={{margin:"0px 0 10px 0"}}/>
            </div>
            
            <IonItemDivider />
             <IonItem className="item">País: {pais.current}</IonItem>
             <IonItem className="item">Provincia/Departamento/Estado: {provincia.current}</IonItem>
             <IonItem className="item">Ciudad: {ciudad.current}</IonItem>
             <IonItem className="item">Dirección: {calle.current} {numeracion.current}</IonItem>
 
         </IonCard>
 
         <IonCard id="ionCardCompletarRubros">
             <div style={{display:"flex", flexDirection:"column",textAlign:"left",alignItems:"left",width:"100%", height:"auto", paddingLeft:"15px"}}>
                <h2 style={{textAlign:"left", fontSize:"1em", color:"black", margin:"15px 0 10px 0"}} >DATOS DE JORNADA LABORAL CARGADOS</h2>    
                <IonItemDivider style={{margin:"0px 0 10px 0"}}/>
            </div>

             <IonItem className="item">Días de trabajo: {days_of_works.current}</IonItem>
             <IonItem className="item">Horario de inicio: {hour_init.current}</IonItem>
             <IonItem className="item">Horario de finalización: {hour_end.current}</IonItem>
         </IonCard>
 
         <IonCard id="ionCardCompletarRubros">
            <div style={{display:"flex", flexDirection:"column",textAlign:"left",alignItems:"left",width:"100%", height:"auto", paddingLeft:"15px"}}>
                <h2 style={{textAlign:"left", fontSize:"1em", color:"black", margin:"15px 0 10px 0"}} >CERTIFICADO CARGADO</h2>    
                <IonItemDivider style={{margin:"0px 0 10px 0"}}/>
            </div>
 
             <div id="imagenesCompletarRubro">
 
                 <img id="imagenCompletarRubro" src={certificate.current}></img>
             </div>
         </IonCard>
 
         <IonCard id="ionCardCompletarRubros">
            <div style={{display:"flex", flexDirection:"column",textAlign:"left",alignItems:"left",width:"100%", height:"auto", paddingLeft:"15px"}}>
                <h2 style={{textAlign:"left", fontSize:"1em", color:"black", margin:"15px 0 10px 0"}} >IMÁGENES DE REFERENCIA CARGADAS</h2>    
                <IonItemDivider style={{margin:"0px 0 10px 0"}}/>
            </div>
             
             <div id="imagenesCompletarRubro">
             
                 <img id="imagenCompletarRubro" src={picture1.current}></img>
                 <img id="imagenCompletarRubro" src={picture2.current}></img>
                 <img id="imagenCompletarRubro" src={picture3.current}></img>
             
             </div>
         </IonCard>
             <div>
                 <IonGrid>
                     <IonRow>
                        
                         <IonCol className="columna">
                             <IonButton shape="round" onClick={() => { eliminarRubro(); } }>ELIMINAR RUBRO</IonButton>
                         </IonCol>
                     </IonRow>
                 </IonGrid>
             </div>
             </div>
 
             <IonAlert
                   isOpen={showRubroEliminado}
                   onDidDismiss={() => setShowRubroEliminado(false)}
                   cssClass='my-custom-class'
                   header={'Rubro eliminado'}
                   subHeader={''}
                   message={'El Rubro ha sido eliminado'}
                   buttons={['OK']} />
 
                   </> 
 
     );
 
     
   }
 
     ////////////////////////////////////////////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////
 
     //vista=2
 
     const DiasdeTrabajo =(props:{dias:any})=> {
 
         let dia: string[] = ['', '', '', '', '', '', ''];
     
             
         const [lunes, setLunes]= useState (false)
         const [martes, setMartes]= useState (false)
         const [miercoles, setMiercoles]= useState (false)
         const [jueves, setJueves]= useState (false)
         const [viernes, setViernes]= useState (false)
         const [sabado, setSabado]= useState (false)
         const [domingo, setDomingo]= useState (false)
     
         if(lunes){dia[0]='Lunes'}else{dia[0]=''}
         if(martes){dia[1]='Martes'}else{dia[1]=''}
         if(miercoles){dia[2]='Miercoles'}else{dia[2]=''}
         if(jueves){dia[3]='Jueves'}else{dia[3]=''}
         if(viernes){dia[4]='Viernes'}else{dia[4]=''}
         if(sabado){dia[5]='Sabado'}else{dia[5]=''}
         if(domingo){dia[6]='Domingo'}else{dia[6]=''}
     
         if (lunes || martes || miercoles || jueves ||  viernes || sabado || domingo ){
             props.dias.current=dia[0]+" "+dia[1]+" "+dia[2]+" "+dia[3]+" "+dia[4]+" "+dia[5]+" "+dia[6]
         }
         return (
                 <div style={{display:"flex", flexDirection:"row", width:"100%", justifyContent:"center", height:"auto"}}>
                   <div style={{display:"flex", flexDirection:"row", width:"100%", height:"auto"}}> <BotonDia dia={"LU"} setDia={setLunes} ></BotonDia></div>
                   <div style={{display:"flex", flexDirection:"row", width:"100%", height:"auto"}}> <BotonDia dia={"MA"} setDia={setMartes} ></BotonDia></div>
                   <div style={{display:"flex", flexDirection:"row", width:"100%", height:"auto"}}> <BotonDia dia={"MI"} setDia={setMiercoles} ></BotonDia></div>
                   <div style={{display:"flex", flexDirection:"row", width:"100%", height:"auto"}}> <BotonDia dia={"JU"} setDia={setJueves} ></BotonDia></div>
                   <div style={{display:"flex", flexDirection:"row", width:"100%", height:"auto"}}> <BotonDia dia={"VI"} setDia={setViernes} ></BotonDia></div>
                   <div style={{display:"flex", flexDirection:"row", width:"100%", height:"auto"}}> <BotonDia dia={"SA"} setDia={setSabado} ></BotonDia></div>
                   <div style={{display:"flex", flexDirection:"row", width:"100%", height:"auto"}}>  <BotonDia dia={"DO"} setDia={setDomingo} ></BotonDia></div>
                 </div>
     
     
             );
     }
     
     
    export const BotonDia=  (props:{dia:any, setDia:any})=> {
     
         const [selecionado, setSeleccionado] =useState(false)
     
         if (selecionado){
             props.setDia(true)
         }else{
             props.setDia(false)
         }
         
         return (
             selecionado ? <IonButton style={{margin:"1px 1px 1px 1px"}} color="primary" shape="round" onClick={() => setSeleccionado(false)} id="diaSelecionado">{props.dia}</IonButton> : <IonButton style={{margin:"1px 1px 1px 1px"}} color="white" shape="round" id="diaNoSelecionado" onClick={() => setSeleccionado(true)}>{props.dia}</IonButton>
     
         )
     }
 
 const AgregarTipoRubro =  (props:{setVista:any, rubro:any, dias:any,horaInicio:any, horaFin:any , setShowAlertCompletarCampos:any })=> {
 
     const [seleccionDeRubro, setSeleccionDeRubro]=useState("vistaCompleta")
     const [rubroSeleccionado, setRubroSeleccionado] = useState("SELECIONE TIPO DE RUBRO")
 
     const volver= ()=>{
        props.setVista(0)
     }
 
     const siguiente =()=> {
         
         if(props.rubro.current!="" && props.dias.current!="" ){
             props.setVista(3)
         }
         else{
             props.setShowAlertCompletarCampos(true)
         }
     }
 
     useEffect(() => {
 
        
     }, []);
 
     if(seleccionDeRubro=="vistaCompleta"){
     return (
         <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100%", background:"#f3f2ef"}}>
             
             <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto",alignItems:"center", textAlign:"center", marginTop:"25px"}}>
                <h1 style={{fontSize:"1.5em", color:"black"}}>DATOS PRINCIPALES</h1>
             </div>
             <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", width:"100%", height:"auto"}}>
                 
             <IonCard id="ionCardCompletarRubros">
                <div style={{display:"flex", flexDirection:"column",textAlign:"left",alignItems:"left",width:"100%", height:"auto", paddingLeft:"15px"}}>
                    <h2 style={{textAlign:"left", fontSize:"1em", color:"black", margin:"15px 0 10px 0"}} >CLASE DE RUBRO</h2>    
                    <IonItemDivider style={{margin:"0px 0 10px 0"}}/>
                </div>
                <IonItem onClick={() => setSeleccionDeRubro("listaDeRubros")}>
                    <IonLabel id="label">{rubroSeleccionado} </IonLabel>
                </IonItem>
            </IonCard>
 
            <IonCard id="ionCardCompletarRubros">
                <div style={{display:"flex", flexDirection:"column",textAlign:"left",alignItems:"left",width:"100%", height:"auto", paddingLeft:"15px"}}>
                    <h2 style={{textAlign:"left", fontSize:"1em", color:"black", margin:"15px 0 10px 0"}} >DATOS DE JORNADA LABORAL</h2>    
                    <IonItemDivider style={{margin:"0px 0 10px 0"}}/>
                </div>
                <strong style={{margin:"15px 0px 15px 0px"}}>SELECIONE LOS DIAS DE TRABAJO</strong>
                    <DiasdeTrabajo dias={props.dias}></DiasdeTrabajo>
           
                    <IonItemDivider style={{marginTop:"35px"}} />

                <strong style={{margin:"15px 0px 15px 0px"}}>SELECIONE EL HORARIO DE TRABAJO</strong>
                <IonItem>
                    <IonLabel id="label">HORA DE INICIO DE TRABAJO DIARIO</IonLabel>
                    <IonDatetime locale="es-ES" presentation="time" value={props.horaInicio.current} onIonChange={e => props.horaInicio.current = (e.detail.value!)}></IonDatetime>
                </IonItem>
                <IonItem>
                    <IonLabel id="label">HORA DE FINALIZACIÓN DE TRABAJO DIARIO</IonLabel>
                    <IonDatetime locale="es-ES" presentation="time" value={props.horaFin.current} onIonChange={e => props.horaFin.current = (e.detail.value!)}></IonDatetime>
                 </IonItem>
                                 
                </IonCard >

                 </div>
                 <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", width:"100%", height:"auto", background:"#f3f2ef"}}>


                 <div style={{display:"flex", flexDirection:"row", width:"100%", height:"auto",alignItems:"center", marginBottom:"35px"}}>
                 
                                 <IonButton  shape="round" onClick={() => { volver(); } }>ATRAS</IonButton>
                            
                                 <IonButton color="warning" shape="round" onClick={() => { siguiente(); } }>SIGUIENTE</IonButton>
                                 
                 </div>
             </div>
             </div>
         )}
     else{
         return(
             <div id="contenedor_central_rubros">
             <IonTitle>LISTA DE RUBROS</IonTitle>
 
             <IonCard id="ionCard-CardProveedor">
 
             <IonList>
                 <IonItemSliding>
                 <IonItem onClick={()=> {props.rubro.current="CARPINTERÍA";setRubroSeleccionado("RUBRO SELECCIONADO: CARPINTERIA") ;setSeleccionDeRubro("vistaCompleta")}}>
                    <IonLabel id="laberCompletarRubrosRubros">CARPINTERÍA</IonLabel>
		            <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("CARPINTERÍA")}></img>
                 </IonItem>
                 <IonItem onClick={()=> {props.rubro.current="CERRAJERÍA";setRubroSeleccionado("RUBRO SELECCIONADO: CERRAJERÍA"); setSeleccionDeRubro("vistaCompleta")}}>
                    <IonLabel id="laberCompletarRubrosRubros">CERRAJERÍA</IonLabel>
                    <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("CERRAJERÍA")}></img>
		          </IonItem>
                 <IonItem onClick={()=> {props.rubro.current="CONSTRUCCIÓN";setRubroSeleccionado("RUBRO SELECCIONADO: CONSTRUCCIÓN"); setSeleccionDeRubro("vistaCompleta")}}>
                 <IonLabel id="laberCompletarRubrosRubros">CONSTRUCCIÓN</IonLabel>
		         <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("CONSTRUCCIÓN")}></img>
                 </IonItem>
                 <IonItem onClick={()=> {props.rubro.current="CONTADURÍA";setRubroSeleccionado("RUBRO SELECCIONADO: CONTADURÍA"); setSeleccionDeRubro("vistaCompleta")}}>
                 <IonLabel id="laberCompletarRubrosRubros">CONTADURÍA</IonLabel>
		         <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("CONTADURÍA")}></img>
                 </IonItem>
                 <IonItem onClick={()=> {props.rubro.current="ELECTRICIDAD";setRubroSeleccionado("RUBRO SELECCIONADO: ELECTRICIDAD"); setSeleccionDeRubro("vistaCompleta")}}>
                 <IonLabel id="laberCompletarRubrosRubros">ELECTRICIDAD</IonLabel>
                 <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("ELECTRICIDAD")}></img>
                 </IonItem>
                 <IonItem onClick={()=> {props.rubro.current="ELECTRÓNICA";setRubroSeleccionado("RUBRO SELECCIONADO: ELECTRÓNICA"); setSeleccionDeRubro("vistaCompleta")}}>
                 <IonLabel id="laberCompletarRubrosRubros">ELECTRÓNICA</IonLabel>
                 <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("ELECTRÓNICA")}></img>
                 </IonItem>
                 <IonItem onClick={()=> {props.rubro.current="ESTÉTICA";setRubroSeleccionado("RUBRO SELECCIONADO: ESTÉTICA"); setSeleccionDeRubro("vistaCompleta")}}>
                 <IonLabel id="laberCompletarRubrosRubros">ESTÉTICA</IonLabel>
                 <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("ESTÉTICA")}></img>
                 </IonItem>
                 <IonItem onClick={()=> {props.rubro.current="FLETE";setRubroSeleccionado("RUBRO SELECCIONADO: FLETE"); setSeleccionDeRubro("vistaCompleta")}}>
                 <IonLabel id="laberCompletarRubrosRubros">FLETE</IonLabel>
                 <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("FLETE")}></img>
                 </IonItem>
                 <IonItem onClick={()=> {props.rubro.current="FUMIGACIÓN";setRubroSeleccionado("RUBRO SELECCIONADO: FUMIGACIÓN"); setSeleccionDeRubro("vistaCompleta")}}>
                 <IonLabel id="laberCompletarRubrosRubros">FUMIGACIÓN</IonLabel>
                 <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("FUMIGACIÓN")}></img>
                 </IonItem>
                 <IonItem onClick={()=> {props.rubro.current="GASISTA";setRubroSeleccionado("RUBRO SELECCIONADO: GASISTA");setSeleccionDeRubro("vistaCompleta")}}>
                 <IonLabel id="laberCompletarRubrosRubros">GASISTA</IonLabel>
                 <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("GASISTA")}></img>
                 </IonItem>
                 <IonItem onClick={()=> {props.rubro.current="HERRERÍA";setRubroSeleccionado("RUBRO SELECCIONADO: HERRERIA"); setSeleccionDeRubro("vistaCompleta")}}>
                 <IonLabel id="laberCompletarRubrosRubros">HERRERÍA</IonLabel>
                 <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("HERRERIA")}></img>
                 </IonItem>
                 <IonItem onClick={()=> {props.rubro.current="INFORMÁTICA";setRubroSeleccionado("RUBRO SELECCIONADO: INFORMATICA"); setSeleccionDeRubro("vistaCompleta")}}>
                 <IonLabel id="laberCompletarRubrosRubros">INFORMÁTICA</IonLabel>
                 <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("INFORMÁTICA")}></img>
                 </IonItem>
                 <IonItem onClick={()=> {props.rubro.current="JARDINERÍA";setRubroSeleccionado("RUBRO SELECCIONADO: JARDINERÍA"); setSeleccionDeRubro("vistaCompleta")}}>
                 <IonLabel id="laberCompletarRubrosRubros">JARDINERÍA</IonLabel>
                 <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("JARDINERÍA")}></img>
                 </IonItem>
                 <IonItem onClick={()=> {props.rubro.current="MECÁNICA";setRubroSeleccionado("RUBRO SELECCIONADO: MECANICA");setSeleccionDeRubro("vistaCompleta")}}>
                 <IonLabel id="laberCompletarRubrosRubros">MECÁNICA</IonLabel>
                 <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("MECÁNICA")}></img>
                 </IonItem>
                 <IonItem onClick={()=> {props.rubro.current="MODA";setRubroSeleccionado("RUBRO SELECCIONADO: MODA");setSeleccionDeRubro("vistaCompleta")}}>
                 <IonLabel id="laberCompletarRubrosRubros">MODA</IonLabel>
                 <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("MODA")}></img>
                 </IonItem>
                 <IonItem onClick={()=> {props.rubro.current="PASEADOR DE MASCOTAS";setRubroSeleccionado("RUBRO SELECCIONADO: PASEADOR DE MASCOTAS"); setSeleccionDeRubro("vistaCompleta")}}>
                 <IonLabel id="laberCompletarRubrosRubros">PASEADOR DE MASCOTAS</IonLabel>
                 <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("PASEADOR DE MASCOTAS")}></img>
                 </IonItem>
                 <IonItem onClick={()=> {props.rubro.current="PINTOR";setRubroSeleccionado("RUBRO SELECCIONADO: PINTOR"); setSeleccionDeRubro("vistaCompleta")}}>
                 <IonLabel id="laberCompletarRubrosRubros">PINTOR</IonLabel>
                 <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("PINTOR")}></img>
                 </IonItem>
                 <IonItem onClick={()=> {props.rubro.current="PLOMERÍA";setRubroSeleccionado("RUBRO SELECCIONADO: PLOMERIA"); setSeleccionDeRubro("vistaCompleta")}}>
                 <IonLabel id="laberCompletarRubrosRubros">PLOMERÍA</IonLabel>
                 <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("PLOMERÍA")}></img>
                 </IonItem>
                 <IonItem onClick={()=> {props.rubro.current="REFRIGERACIÓN";setRubroSeleccionado("RUBRO SELECCIONADO: REFRIGERACION"); setSeleccionDeRubro("vistaCompleta")}}>
                 <IonLabel id="laberCompletarRubrosRubros">REFRIGERACIÓN</IonLabel>
                 <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("REFRIGERACION")}></img>
                 </IonItem>
                 <IonItem onClick={()=> {props.rubro.current="REMOLQUES - GRÚAS";setRubroSeleccionado("RUBRO SELECCIONADO: REMOLQUES - GRÚAS"); setSeleccionDeRubro("vistaCompleta")}}>
                 <IonLabel id="laberCompletarRubrosRubros">REMOLQUES - GRÚAS</IonLabel>
                 <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("REMOLQUES - GRÚAS")}></img>
                 </IonItem>
                 <IonItem onClick={()=> {props.rubro.current="TELEFONÍA CELULAR";setRubroSeleccionado("RUBRO SELECCIONADO: TELEFONIA CELULAR"); setSeleccionDeRubro("vistaCompleta")}}>
                 <IonLabel id="laberCompletarRubrosRubros">TELEFONÍA CELULAR</IonLabel>
                 <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("TELEFONÍA CELULAR")}></img>
                 </IonItem>
                 <IonItem onClick={()=> {props.rubro.current="TEXTIL";setRubroSeleccionado("RUBRO SELECCIONADO: TEXTIL"); setSeleccionDeRubro("vistaCompleta")}}>
                 <IonLabel id="laberCompletarRubrosRubros">TEXTIL</IonLabel>
                 <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria("TEXTIL")}></img>
                 </IonItem>
 
                 </IonItemSliding>
             </IonList>
             </IonCard>
 
             </div>
         )
     }
 }
 
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
 //vista=3
 
 const AgregarDescripcion  =(props:{setVista: any, descripcion: any, setShowAlertCompletarCampos: any }) =>{
 
     const volver =()=>{
         props.setVista(2)
     }
     const siguiente = () =>{
         if (props.descripcion.current!= "" ){
             props.setVista(4)
         }else{
             props.setShowAlertCompletarCampos(true)
         }
 
     }
 
     return (
        <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100vh", background:"#f3f2ef"}}>
             

        <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", width:"100%", height:"100%"}}>
            
                 
        <IonCard id="ionCardCompletarRubros">
            <div style={{display:"flex", flexDirection:"column",textAlign:"left",alignItems:"left",width:"100%", height:"auto", paddingLeft:"15px"}}>
                <h2 style={{textAlign:"left", fontSize:"1em", color:"black", margin:"15px 0 10px 0"}} >DESCRIBA SU TRABAJO</h2>    
                <IonItemDivider style={{margin:"0px 0 10px 0"}}/>
            </div>
            <div style={{display:"flex", flexDirection:"column",textAlign:"left",alignItems:"left",width:"100%", height:"auto", paddingLeft:"15px 0 20px 0"}}>
                <p style={{fontSize:"1em", marginTop:"15px", marginLeft:"15px", color:"black"}}>Una buena descripción de su trabajo sirve como una guía de referencia para los futuros clientes</p>
            </div>
        
                     <IonItem id="item-completarRubro-descripcion">
                         <IonTextarea id="textArea" autoGrow={true} maxlength={450} placeholder="Ingrese descripción de su trabajo" onIonInput={(e: any) => props.descripcion.current=(e.target.value)}></IonTextarea>
                     </IonItem>
        </IonCard>

                  
        </div>
            
     
            <div style={{display:"flex", flexDirection:"row", width:"100%", height:"auto",alignItems:"center", marginBottom:"35px"}}>
                       
                <IonButton shape="round" onClick={() => { volver(); } }>VOLVER</IonButton>  
                <IonButton color="warning" shape="round" onClick={() => { siguiente(); } }>SIGUIENTE</IonButton>
                              
            </div>
            
         </div> 
     );
 }
 
 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
 //vista=4 
 
 
 const AgregarRadio = (props:{setVista: any, rubro:any, ordenesEmergencia:any, radio:any, setRadio:any, setPosicion:any,
  pais:any, provincia:any,ciudad:any,domicilio_calle:any,domicilio_numeracion:any}) =>{
 
     const volver =()=>{
         props.setVista(3)
     }
     const siguiente = () =>{
             props.setVista(5)   
     }
 
     const ubicacion = getLocation();
     ubicacion.then((value)=>{
         props.setPosicion(value)
     });
 
     const [domicilio, setDomicilio] = useState("voyadomicilio");
 
 
     return(
            
        <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto", justifyContent:"center", textAlign:"center", background:"#f3f2ef"}}>
            
            <h1>DATOS GENERALES DEL RUBRO</h1>

            <IonCard id="ionCardCompletarRubros">
            <div style={{display:"flex", flexDirection:"column",textAlign:"left",alignItems:"left",width:"100%", height:"auto", paddingLeft:"15px"}}>
                <h2 style={{textAlign:"left", fontSize:"1em", color:"black", margin:"15px 0 10px 0"}} >DATOS DE DOMICILIO</h2>    
                <IonItemDivider style={{margin:"0px 0 10px 0"}}/>
            </div>

                 <IonItem id="item-rubro-domicilio">
                     <IonLabel position="floating">País</IonLabel>
                     <IonInput autocomplete="country" onIonInput={(e: any) => props.pais.current = (e.target.value)}></IonInput>
                 </IonItem>

                 <IonItem id="item-rubro-domicilio">
                     <IonLabel position="floating">Provincia / Departamento</IonLabel>
                     <IonInput onIonInput={(e: any) => props.provincia.current = (e.target.value)}></IonInput>
                 </IonItem>

                 <IonItem id="item-rubro-domicilio">
                     <IonLabel position="floating">Ciudad</IonLabel>
                     <IonInput onIonInput={(e: any) => props.ciudad.current = (e.target.value)}></IonInput>
                 </IonItem>

                             <IonItem id="item-rubro-domicilio">
                                 <IonLabel position="floating">Calle</IonLabel>
                                 <IonInput onIonInput={(e: any) => props.domicilio_calle.current = (e.target.value)}></IonInput>
                             </IonItem>
                         
                             <IonItem id="item-rubro-domicilio">
                                 <IonLabel position="floating">Numeración</IonLabel>
                                 <IonInput onIonInput={(e: any) => props.domicilio_numeracion.current = (e.target.value)}></IonInput>
                             </IonItem>
                    
             </IonCard>
 
             <IonCard id="ionCardCompletarRubros">
             <div style={{display:"flex", flexDirection:"column",textAlign:"left",alignItems:"left",width:"100%", height:"auto", paddingLeft:"15px"}}>
                <h2 style={{textAlign:"left", fontSize:"1em", color:"black", margin:"15px 0 10px 0"}} >VISITA A CLIENTES</h2>    
                <IonItemDivider style={{margin:"0px 0 10px 0"}}/>
            </div>

                <div style={{display:"flex", flexDirection:"column",textAlign:"left",alignItems:"left",width:"100%", height:"auto", paddingLeft:"15px 15px 30px 0"}}>

                     <p style={{fontSize:"1em", marginTop:"15px", marginLeft:"15px", marginBottom:"35px", color:"black"}}>Ingrese si va a la locación de clientes.
                     En caso de que no se desplace a locación de clientes no seleccione la casilla de verificación y presion siguiente</p>
                 </div>
                 <IonItem>
                     <IonGrid>
                         <IonRow>
                             <IonCol>
                                 <IonLabel ion-list-lines="none">¿Va a locación o domicilio de clientes?</IonLabel>
                             </IonCol>
                             <IonCol>
                                 <IonSegment mode="ios" value={domicilio} select-on-focus={true} onIonChange={e => setDomicilio(e.detail.value!)}>
                                     <IonSegmentButton value="voyadomicilio">
                                         <IonLabel>SI</IonLabel>
                                     </IonSegmentButton>
                                     <IonSegmentButton value="NOvoyadomicilio">
                                         <IonLabel>NO</IonLabel>
                                     </IonSegmentButton>
                                 </IonSegment>
 
                             </IonCol>
                         </IonRow>
                     </IonGrid>
                 </IonItem>
                 <Range domicilio={domicilio} radius={props.radio} setRadio={props.setRadio} />
             </IonCard>
                   
             <OrdenesEmergencia rubro={props.rubro} ordenEmergencia={props.ordenesEmergencia}></OrdenesEmergencia>
        
             <div style={{display:"flex", flexDirection:"row", width:"100%", height:"auto",alignItems:"center", marginBottom:"35px"}}>
 
                <IonButton shape="round" onClick={() => { volver(); } }>VOLVER</IonButton>          
                <IonButton color="warning" shape="round" onClick={() => { siguiente(); } }>SIGUIENTE</IonButton>
                     
            </div>
        </div>
 
     )
 }
 
 const Range = (props:{domicilio:string, radius:any, setRadio:any})=>{
     if(props.domicilio=="voyadomicilio"){
         return(
             <div>
             <IonGrid>
             <IonRow><IonCol><IonLabel> El radio de trabajo es un estimativo de cuanto se desplazaría para ir a las locaciones de los clientes </IonLabel></IonCol></IonRow> 
             <IonRow><IonCol><IonRange pin={true} value={props.radius} onIonChange={e => props.setRadio(e.detail.value as number)} /> </IonCol></IonRow>
 
             <IonRow><IonCol><IonLabel>Radio de trabajo: {props.radius} Km</IonLabel></IonCol></IonRow>
             </IonGrid>
             </div>
         );
     }
     else{
         return(<strong></strong>);
     }
 
 }
 
 
 
 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
 const TomarFotografia = (props: {imagen:any, setFilepath:any}) => {
 
 
     const { deletePhoto, photos, takePhoto } = usePhotoGallery();
     const [photoToDelete, setPhotoToDelete] = useState(false);
     const [presioneParaBorrar,setPresioneParaBorrar]=useState("")
     
     const [fotoTomada, setFotoTomada]=useState(false)
 
     const onClickPhotoData=()=>{
         //props.setFilepath(photo.webviewPath)
         setPhotoToDelete(true)
     }
 
     useEffect(() => {
 
             if (props.imagen.current!="" && props.imagen.current!=undefined && props.imagen.current!=null){
                 setFotoTomada(true)
             }
             
     }, []);
     
     const tomarFoto =()=>{
         takePhoto().then(async res => {
             if(res!=null){
                // props.setImagen(res[0].webviewPath!)
                 const base64Data = await base64FromPath(res[0].webviewPath!);
                 //props.imagen.current=res[0].webviewPath!
                 props.imagen.current= base64Data
 
                 var block = base64Data!.split(";");
                 var contentType = block[0].split(":")[1];
                 var realData = block[1].split(",")[1];
                 var blob = b64toBlob(realData, contentType,1);
                 props.setFilepath.current=( blob!)
 
                 
                 setFotoTomada(true)
                 setPresioneParaBorrar("Presione la imagen para eliminarla")            
             }
         })
     }
     
     if(fotoTomada){
         return(
             <><IonGrid>
                 <IonRow>
                     <IonCol>
                         <strong>Seleccionar foto de galería o tomar fotografia</strong>
                     </IonCol>
                 </IonRow>
             
                 <IonRow>
                     <IonCol>
                      <IonImg id="foto" onClick={() => onClickPhotoData()} src={props.imagen.current} />
                     </IonCol>
                 </IonRow>
     
                 <IonRow>
                     <IonCol>
                         <p> {presioneParaBorrar} </p>
                     </IonCol>
                 </IonRow>
             </IonGrid>
     
                 <IonActionSheet
                     isOpen={photoToDelete}
                     buttons={[{
                         text: 'Eliminar',
                         role: 'destructive',
                         icon: trash,
                         handler: () => {
                             if (photoToDelete) {
                                 props.setFilepath.current=(null)
                                 props.imagen.current=""
                                 setFotoTomada(false)
                                 setPresioneParaBorrar("")
 
                             }
                         }
                     }, {
                         text: 'Cancelar',
                         icon: close,
                         role: 'cancel'
                     }]}
                     onDidDismiss={() => setPhotoToDelete(false)} 
                     />
                 </>
         );
     }else{
         return(
             <>
             <IonGrid>
                 <IonRow>
                     <IonCol>
                         <strong>Seleccionar foto de galería o tomar fotografia</strong>
                     </IonCol>
                 </IonRow>
                 <IonRow>
                     <IonCol>
                         <IonFabButton onClick={() => tomarFoto()}>
                             <IonIcon icon={camera}></IonIcon>
                         </IonFabButton>
                     </IonCol>
                 </IonRow>
     
                 <IonRow>
                     <IonCol>
                         <p> {presioneParaBorrar} </p>
                     </IonCol>
                 </IonRow>
             </IonGrid>
     
                 <IonActionSheet
                     isOpen={photoToDelete}
                     buttons={[{
                         text: 'Eliminar',
                         role: 'destructive',
                         icon: trash,
                         handler: () => {
                             if (photoToDelete) {
                                 props.setFilepath(null)
                             }
                         }
                     }, {
                         text: 'Cancelar',
                         icon: close,
                         role: 'cancel'
                     }]}
                     onDidDismiss={() => setPhotoToDelete(false)} 
                     />
                 </>
         );
     }
     
 }  
 
 
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
 //vista=5
 
 const AgregarCertificado = (props:{setVista: any, certificacion: any, certificacionMostrar: any, 
     setShowAlertAgregarCertificacion: any, setShowLoading:any, enviarInformacion:any }) =>{
 
     const volver =()=>{
         props.setVista(5)
     }
     const siguiente = () =>{
         props.setShowLoading(true)
         props.enviarInformacion() 
         
     }
                 
    return(
        <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto", justifyContent:"center", background:"#f3f2ef"}}>
             
             <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto",alignItems:"center", textAlign:"center", marginTop:"25px"}}>
                <h1 >TITULACIÓN O CERTIFICACIÓN DE SU TRABAJO</h1>
            </div> 

            <IonCard style={{margin:"15px, 0px 15px 0px",display:"flex", flexDirection:"column", justifyContent:"center", with:"100%", height:"100%"}}>
            <div style={{display:"flex", flexDirection:"column",textAlign:"left",alignItems:"left",width:"100%", height:"auto", paddingLeft:"15px"}}>
                <h2 style={{textAlign:"left", fontSize:"1em", color:"black", margin:"15px 0 10px 0"}} >CERTIFICACIÓN</h2>    
                <IonItemDivider style={{margin:"0px 0 10px 0"}}/>
            </div>   
            <div style={{display:"flex", flexDirection:"column",textAlign:"left",alignItems:"left",width:"100%", height:"auto", margin:"5px 0 35px 15px"}}>
                <p style={{fontSize:"1em", color:"black"}}>Foto o captura de certificación o título habilitante para el trabajo.
                Demuestre a sus clientes los conocimientos en la materia.
                </p>
            </div>
                   
                    <TomarFotografia imagen={props.certificacionMostrar} setFilepath={props.certificacion} ></TomarFotografia>
                </IonCard>

           <div style={{display:"flex", flexDirection:"row", width:"100%", height:"auto",alignItems:"center", marginBottom:"35px"}}>
                   
                <IonButton shape="round" onClick={() => { volver(); } }>VOLVER</IonButton>
                                
                <IonButton color="warning" shape="round" onClick={() => { siguiente(); } }>FINALIZAR</IonButton>
 
            </div> 
        </div>
   
    )
 }
 
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
 //vista=6
 
 const AgregarImagenes = (props:{setVista: any,
                     foto1: any, foto2: any, foto3: any,
                     foto1Mostrar: any, foto2Mostrar: any, foto3Mostrar: any,
                     setShowAlertIngreseFoto: any}) =>{
                        
                         const volver =()=>{
                             props.setVista(4)
                         }
                         const siguiente = ()=>{
                             if (props.foto1.current!= null || props.foto2.current!= null || props.foto3.current!= null   ){
                                 props.setVista(6) 
                             }else{
                                 props.setShowAlertIngreseFoto(true)
                             }  
                         }
                             
                     return(
                        
                        <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto", justifyContent:"center", background:"#f3f2ef"}}>
                        
                    
                            <IonCard style={{margin:"15px, 0px 15px 0px",display:"flex", flexDirection:"column", justifyContent:"center", with:"100%", height:"100%"}}>
                           
                            <div style={{display:"flex", flexDirection:"column", textAlign:"left",alignItems:"left", justifyContent:"left",width:"100%", height:"auto", marginLeft:"15px"}}>
                                <h2 style={{textAlign:"left", fontSize:"1em", color:"black", margin:"15px 0 10px 0"}} >INGRESE IMÁGENES DE SU TRABAJO</h2>    
                                <IonItemDivider style={{margin:"0px 0 10px 0"}}/>
                            </div>
                            <div style={{display:"flex", flexDirection:"column",textAlign:"left",alignItems:"left",width:"100%", height:"auto", margin:"1px 0 35px 15px"}}>
                                <p style={{fontSize:"1em", color:"black"}}>Dichas imágenes o fotos serán mostradas a sus clientes.
                                Ingrese fotos o capturas que destaquen su trabajo.
                                </p>
                            </div>
                             
                                                       
                                             <TomarFotografia imagen={props.foto1Mostrar} setFilepath={props.foto1} />
                                   
                                         <TomarFotografia imagen={props.foto2Mostrar} setFilepath={props.foto2} />
 
                                         <TomarFotografia imagen={props.foto3Mostrar} setFilepath={props.foto3} />
 
                             </IonCard >
                             <div style={{display:"flex", flexDirection:"row", width:"100%", height:"auto",alignItems:"center", marginBottom:"35px"}}>
                                <IonButton shape="round" onClick={() => { volver(); } }>VOLVER</IonButton>
                                <IonButton color="warning" shape="round" onClick={() => { siguiente(); } }>SIGUIENTE</IonButton>
                             </div>
                        </div>

                     )
                 }
 
 
 const OrdenesEmergencia = (props:{rubro:any, ordenEmergencia:any}) => {
 
 
 
     if (props.rubro=="PLOMERIA" || props.rubro=="GASISTA" || props.rubro=="CERRAJERÍA" || props.rubro=="ELECTRICIDAD" || props.rubro=="FLETE" || props.rubro=="MECANICA" || props.rubro=="REMOLQUES - GRÚAS" ){
         return( 
             
            <IonCard id="ionCardCompletarRubros">     

                <div style={{display:"flex", flexDirection:"row",textAlign:"left",alignItems:"left",width:"100%", height:"auto", paddingLeft:"15px"}}>
                <img src={"./assets/icon/sirena.png"} style={{width:"32px", height:"32px"}} />

                <h2 style={{textAlign:"left", fontSize:"1em", color:"black", margin:"15px 0 10px 20px"}} >ÓRDENES DE EMERGENCIA</h2>    
                <IonItemDivider style={{margin:"0px 0 10px 0"}}/>
            </div>
             <div>
                 <p>Aceptar órdenes de emergencia implica tener la disponibilidad para asistir a los domicilios de los clientes cuando lo requieran</p>
                 <p>Deberá atender las ordenes de emergencia de manera prioritaria</p>
 
             </div><IonItem>
                     <IonGrid>
                         <IonRow>
                             <IonCol>
                                 <IonLabel ion-list-lines="none">¿Realiza órdenes de emergencia?</IonLabel>
                             </IonCol>
                             <IonCol>
                                 <IonSegment mode="ios" value={props.ordenEmergencia.current} select-on-focus={true} onIonChange={e => props.ordenEmergencia.current = (e.detail.value!)}>
                                     <IonSegmentButton value="si">
                                         <IonLabel>SI</IonLabel>
                                     </IonSegmentButton>
                                     <IonSegmentButton value="no">
                                         <IonLabel>NO</IonLabel>
                                     </IonSegmentButton>
                                 </IonSegment>
 
                             </IonCol>
                         </IonRow>
                     </IonGrid>
                 </IonItem></IonCard>
         
         )
     }else{
         return(
             <></>
         )
     }
     
 }
 
 export default CompletarRubros;
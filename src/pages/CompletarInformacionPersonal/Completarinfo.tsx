import React, { useEffect, useRef, useState } from 'react';
import { camera, trash, close, pin, closeCircle, text } from 'ionicons/icons';

import './Completarinfo.css';
import { Redirect, Route, useParams } from 'react-router-dom';
import { request } from 'https';
import Compressor from 'compressorjs';
import { base64FromPath } from '@ionic/react-hooks/filesystem';
import Https from '../../utilidades/HttpsURL';
import CompletarRubros from '../CompletarRubros/CompletarRubros';
import { Photo, usePhotoGallery } from '../../hooks/usePhotoGallery';
import { b64toBlob } from '../../utilidades/b64toBlob';
import { setItem } from '../../utilidades/Storage';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg, IonActionSheet, IonInput, IonItem, IonLabel, IonButton, IonItemDivider, IonRange, IonAlert, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonList, IonSelect, IonSelectOption, IonDatetime, IonLoading, IonTextarea, IonCheckbox } from '@ionic/react';


/*
CompletarInformacion
| 
|->  CompletarInformacionPersonal
*/

/*
Compressorjs
npm install compressorjs
*/

//const url='http://127.0.0.1:8000/completarinfo/';
//const url="https://callservicesvps.online:443/completarinfo/"

const url= Https+"completarinfo/"

const Completarinfo = (props:{setIsReg:any,email:any, tipoCliente:any,setNombre:any,setApellido:any, setFoto:any, 
rubro1:any, rubro2:any, setRubro1:any, setRubro2:any}) => {

  return (
    <IonPage>
     
      <IonContent fullscreen id="main-container">

      <div id="ionContentCompletarInfo">

        <CompletarInformacion setIsReg={props.setIsReg} tipoCliente={props.tipoCliente} 
        email={props.email}
        setNombre={props.setNombre} setApellido={props.setApellido} setFoto={props.setFoto} 
        rubro1={props.rubro1} rubro2={props.rubro2} setRubro1={props.setRubro1} setRubro2={props.setRubro2} ></CompletarInformacion>

      </div>

      </IonContent>
    </IonPage>
  );
};

const CompletarInformacion =  (props:{setIsReg:any,tipoCliente:any,
   email:any ,setNombre:any,setApellido:any, setFoto:any
 , rubro1:any, rubro2:any, setRubro1:any, setRubro2:any } ) => {
    
    const [provedores,setProveedores]=useState(0)

  /*  const [clientType,setClientType]=useState(0);
    const [email,setEmail]=useState<String>();
*/
    //const [email,setEmail]=useState<String>();
    
    //const [renderizar, setRenderizar]=useState(false)

   // const { deletePhoto, photos, takePhoto } = usePhotoGallery();

   // const[path,setPath]=useState<String>()

    if(provedores==0){
            return(<CompletarInformacionPersonal  setIsReg={props.setIsReg} tipoCliente={props.tipoCliente} setNombre={props.setNombre} setApellido={props.setApellido} setFoto={props.setFoto} tipoProveedor={provedores} setTipoProveedor={setProveedores} clientType={props.tipoCliente} email={props.email}></CompletarInformacionPersonal>);
        }else{
            
            return (<CompletarRubros setIsReg={props.setIsReg} clientType= {props.tipoCliente} email={props.email} 
             ></CompletarRubros>);
        }
   
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const CompletarInformacionPersonal = (props: { setIsReg:any, tipoCliente:any, tipoProveedor: any; setTipoProveedor: any; setNombre:any,setApellido:any,setFoto:any,clientType:any ; email:any}) =>{

    const {tipoProveedor, setTipoProveedor} = props.tipoProveedor;
    const { deletePhoto, photos, takePhoto } = usePhotoGallery();
    const [photoToDelete, setPhotoToDelete] = useState<Photo>();

    const [filepath2,setFilepath] = useState<String>();

    const [nombre,setNombre]=useState<string>();
    const [apellido,setApellido]=useState<string>();
    const [descripcion,setDescripcion]=useState<string>();
    const [showAlertNombre, setShowAlertNombre] = useState(false);
    const [showAlertApellido, setShowAlertApellido] = useState(false);
    const [showAlertFoto,setShowAlertFoto]= useState(false);
    const [showAlertNombreEmpresa, setShowAlertNombreEmpresa] = useState(false);
    const [showAlertDescripcion, setShowAlertDescripcion] = useState(false);

    const imagen_a_enviar = useRef <Blob >()

    const [showLoading, setShowLoading] = useState(false);

    const [listo, setListo]=useState(false);

    const [presioneParaBorrar,setPresioneParaBorrar]=useState("")

    const [done,setDone]=useState(false)


    useEffect(() => {


    }, []);


    const onClickPhotoData=(photo:any)=>{
        setFilepath(photo.webviewPath)
        setPhotoToDelete(photo)
        setPresioneParaBorrar("")

    }

    const tomarFoto =()=>{
        takePhoto().then(async res => {

            if(res!=null){

                const base64Data = await base64FromPath(res[0].webviewPath!);
                setFilepath(base64Data)
                setPresioneParaBorrar("Presione la imagen para eliminar o modificar")
                
                var block = base64Data!.split(";");
                var contentType = block[0].split(":")[1];
                var realData = block[1].split(",")[1];
                imagen_a_enviar.current = b64toBlob(realData, contentType,1);    
            }
        }
            )
        //esperar a que termine takePhoto
    }

    

    if(listo){
        props.setIsReg(true) 
        //props.setCliente(props.clientType=="1"?true:false)
        return (
            <>
            <Redirect push={true} to="/" />
            </> 
                )
    }

    if(done){
        props.setIsReg(false) 
      }


    const enviarInformacion =async ()=>{

        if(props.tipoCliente=="1"){

             if(props.email!="-" && props.email!=null && nombre!=null && apellido!=null && imagen_a_enviar.current!=null){
                 
                setShowLoading(true);
                 
                 var formDataToUpload = new FormData();
                 formDataToUpload.append("tipo", String(props.clientType))
                 formDataToUpload.append("email", props.email);
                 formDataToUpload.append("nombre", nombre);
                 formDataToUpload.append("apellido", apellido);
                 formDataToUpload.append("image", imagen_a_enviar.current!);
 
                 const axios = require('axios');
                 axios({
                     url:url+"completar",
                     method:'POST',
                     headers: {"content-type": "multipart/form-data"},
                     data:formDataToUpload
                 }).then(function(res: any){
                    setShowLoading(false);
                    if(res.data=="todo ok"){
                        setItem("personalInfoCompleted", true);
                        setItem("nombre", nombre)
                        setItem("apellido", apellido)
                        setItem("fotoPersonal",filepath2)
                        setListo(true);
                        props.setNombre(nombre)
                        props.setApellido(apellido)
                      //  props.setFoto(filepath2)

                    }else{
                        setItem("personalInfoCompleted", false);

                    }
                 }).catch((error: any) =>{
                     setItem("personalInfoCompleted", false);
                     //Network error comes in
                 });       
             }else{
                if(nombre==null ){
                    setShowAlertNombre(true)
                }
                else if (apellido==null){
                    setShowAlertApellido(true)
                }
                else if(filepath2==null || filepath2==undefined || filepath2==""){
                    setShowAlertFoto(true)
                } 

            }
             
         }
         else if(props.tipoCliente=="2"){

             if(props.email!="-" && props.email!=null && nombre!=null && apellido!=null && imagen_a_enviar.current!=null){
                 setShowLoading(true)
                                  
                 var formDataToUpload = new FormData();
                 formDataToUpload.append("tipo", String(props.clientType))
                 formDataToUpload.append("email", props.email);
                 formDataToUpload.append("nombre", nombre);
                 formDataToUpload.append("apellido", apellido);
                 formDataToUpload.append("image", imagen_a_enviar.current!);
                // formDataToUpload.append("descripcion", descripcion);
 
                 const axios = require('axios');
                 axios({
                     url:url+"completar",
                     method:'POST',
                     headers: {"content-type": "multipart/form-data"},
                     data:formDataToUpload
                 }).then(function(res: any){
                    setShowLoading(false) 
                    if(res.data=="todo ok"){
                        setItem("personalInfoCompleted", true);
                        setItem("nombre", nombre)
                        setItem("apellido", apellido)
                        setItem("fotoPersonal",filepath2)
                        props.setNombre(nombre)
                        props.setApellido(apellido)
                       // props.setFoto(filepath2)

                        props.setTipoProveedor(1)

                    }else{
                        setItem("personalInfoCompleted", false);
                    }
                 }).catch((error: any) =>{
                     setItem("personalInfoCompleted", false);
                     //Network error comes in
                 });       
             }else{
                if(nombre==null){
                    setShowAlertNombre(true)
                }
                else if(apellido==null){      
                    setShowAlertApellido(true)
                }
                else if(filepath2==null || filepath2==undefined || filepath2==""){
                    setShowAlertFoto(true)
                } 

                 
                }            
         }
 
         if(props.tipoCliente=="3"){
             if(props.email!="-" && props.email!=null && nombre!=null && descripcion!=null && imagen_a_enviar.current!=null){
                 setShowLoading(true)
                 
                 var formDataToUpload = new FormData();
                 formDataToUpload.append("tipo", String(props.clientType))
                 formDataToUpload.append("email", props.email);
                 formDataToUpload.append("nombre", nombre);
                 formDataToUpload.append("descripcion", descripcion);
                 formDataToUpload.append("image", imagen_a_enviar.current!);
 
                // formDataToUpload.append("descripcion", descripcion);
 
                 const axios = require('axios');
                 axios({
                     url:url+"completar",
                     method:'POST',
                     headers: {"content-type": "multipart/form-data"},
                     data:formDataToUpload
                 }).then(function(res: any){
                     setShowLoading(false);
                    
                    if(res.data=="todo ok"){
                        setItem("personalInfoCompleted", true);
                        setItem("nombre", nombre)
                        setItem("descripcion", descripcion)
                        setItem("fotoPersonal",filepath2)
                        props.setNombre(nombre)
                        props.setApellido(apellido)
                       // props.setFoto(filepath2)
                        props.setTipoProveedor(2)
                    }else{
                        setItem("personalInfoCompleted", false);
                    }
                 }).catch((error: any) =>{
                     setItem("personalInfoCompleted", false);
                     //Network error comes in
                 });       
             }else{
                if(nombre==null || nombre==""){
                    setShowAlertNombreEmpresa(true)
                 }
                 else if(descripcion==null || descripcion==""){
                     setShowAlertDescripcion(true)
                 }
                else if(filepath2==null || filepath2==undefined || filepath2==""){
                    setShowAlertFoto(true)
                } 

                }                        
         }  
     }

    if(props.tipoCliente=="1"){

        return (
                <><IonLoading
                cssClass='my-custom-class'
                isOpen={showLoading}
                onDidDismiss={() => setShowLoading(false)}
                message={'Cargando datos...'}
                duration={15000} />
                <IonAlert
                mode='ios'
                    isOpen={showAlertNombre}
                    onDidDismiss={() => setShowAlertNombre(false)}
                    cssClass='my-custom-class'
                    header={'Complete el campo Nombre'}
                    subHeader={''}
                    message={'Ingrese su nombre personal'}
                    buttons={['OK']} />
                <IonAlert
                    mode='ios'
                    isOpen={showAlertApellido}
                    onDidDismiss={() => setShowAlertApellido(false)}
                    cssClass='my-custom-class'
                    header={'Complete el campo Apellido'}
                    subHeader={''}
                    message={'Ingrese su apellido personal'}
                    buttons={['OK']} />
                    <IonAlert
                    mode='ios'
                    isOpen={showAlertFoto}
                    onDidDismiss={() => setShowAlertFoto(false)}
                    cssClass='my-custom-class'
                    header={'Debe agregar foto'}
                    subHeader={''}
                    message={'Agregue foto personal para continuar'}
                    buttons={['OK']} />
                    
                    <div id="personalInfo_header">
                 
                    <IonTitle id="completarInfo-title">INFORMACIÓN PERSONAL</IonTitle>
                       
                    </div>
                <div id="personalInfo_contenedor_central">

                    <IonGrid>
                        <IonRow>
                            <IonCol>
                                <IonItem id="item-completarInfo">
                                    <IonLabel position="floating">Nombre  </IonLabel>
                                    <IonInput autocomplete="name" onIonInput={(e: any) => setNombre(e.target.value)}></IonInput>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonItem id="item-completarInfo">
                                    <IonLabel position="floating">Apellido</IonLabel>
                                    <IonInput autocomplete="family-name" onIonInput={(e: any) => setApellido(e.target.value)}></IonInput>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow></IonRow>
                        <IonRow>
                            <IonCol>
                                <TomarFotografia setFilepath={imagen_a_enviar} setFoto={props.setFoto} ></TomarFotografia>
                            </IonCol></IonRow>

                        <IonRow>
                            <IonCol>
                                {photos.map((photo, index) => (
                                    <IonCol size="6" key={index}>
                                        <IonImg onClick={() => onClickPhotoData(photo)} src={photo.webviewPath} />
                                    </IonCol>
                                ))}
                            </IonCol>
                        </IonRow>
                        <IonRow></IonRow><IonRow></IonRow>
                        <IonRow>
                            <IonCol>
                                <IonButton shape="round" id="boton-completarInfo" onClick={() => enviarInformacion()}>CONTINUAR</IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>

                    <IonActionSheet
                        isOpen={!!photoToDelete}
                        buttons={[{
                            text: 'Eliminar',
                            role: 'destructive',
                            icon: trash,
                            handler: () => {
                                if (photoToDelete) {
                                    deletePhoto(photoToDelete);
                                    setPhotoToDelete(undefined);
                                }
                            }
                        }, {
                            text: 'Cancelar',
                            icon: close,
                            role: 'cancel'
                        }]}
                        onDidDismiss={() => setPhotoToDelete(undefined)} />
                </div>
               
            
            </>
        );
    }
    else if(props.tipoCliente=="2"){
        return (
            
                 <><IonAlert
                mode='ios'
                isOpen={showAlertNombre}
                onDidDismiss={() => setShowAlertNombre(false)}
                cssClass='my-custom-class'
                header={'Complete el campo Nombre'}
                subHeader={''}
                message={'Ingrese su nombre personal'}
                buttons={['OK']} />
                <IonAlert
                    mode='ios'
                    isOpen={showAlertApellido}
                    onDidDismiss={() => setShowAlertApellido(false)}
                    cssClass='my-custom-class'
                    header={'Complete el campo Apellido'}
                    subHeader={''}
                    message={'Ingrese su apellido personal'}
                    buttons={['OK']} />
                <IonAlert
                    mode='ios'
                    isOpen={showAlertFoto}
                    onDidDismiss={() => setShowAlertFoto(false)}
                    cssClass='my-custom-class'
                    header={'Debe agregar foto'}
                    subHeader={''}
                    message={'Agregue foto personal para continuar'}
                    buttons={['OK']} />
                
                <IonTitle id="tituloCompletarInfo" >INFORMACIÓN PERSONAL</IonTitle>

                <div id="personalInfo_contenedor_central">
                    <IonGrid>
                        <IonRow>
                            <IonCol>
                                <IonItem id="item-completarInfo">
                                    <IonLabel position="floating">Nombre </IonLabel>
                                    <IonInput autocomplete="name" onIonInput={(e: any) => setNombre(e.target.value)}></IonInput>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonItem id="item-completarInfo">
                                    <IonLabel position="floating">Apellido</IonLabel>
                                    <IonInput autocomplete="family-name" onIonInput={(e: any) => setApellido(e.target.value)}></IonInput>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow></IonRow>
                        <IonRow>
                            <IonCol>
                                <TomarFotografia setFilepath={imagen_a_enviar} setFoto={props.setFoto} ></TomarFotografia>
                            </IonCol></IonRow>

                        <IonRow>
                            <IonCol>
                                {photos.map((photo, index) => (
                                    <IonCol size="6" key={index}>
                                        <IonImg onClick={() => onClickPhotoData(photo)} src={photo.webviewPath} />
                                    </IonCol>
                                ))}
                            </IonCol>
                        </IonRow>
                        <IonRow></IonRow><IonRow></IonRow>
                        <IonRow>
                            <IonCol>
                                <IonButton shape="round" id="boton-completarInfo" onClick={() => enviarInformacion()}>CONTINUAR</IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>

                    <IonActionSheet
                        isOpen={!!photoToDelete}
                        buttons={[{
                            text: 'Eliminar',
                            role: 'destructive',
                            icon: trash,
                            handler: () => {
                                if (photoToDelete) {
                                    deletePhoto(photoToDelete);
                                    setPhotoToDelete(undefined);
                                }
                            }
                        }, {
                            text: 'Cancelar',
                            icon: close,
                            role: 'cancel'
                        }]}
                        onDidDismiss={() => setPhotoToDelete(undefined)} />
                </div>
               
            </>
        );
        
    }
    else if (props.tipoCliente=="3"){

        return (
                
                <><IonAlert
                mode='ios'
                isOpen={showAlertNombreEmpresa}
                onDidDismiss={() => setShowAlertNombreEmpresa(false)}
                cssClass='my-custom-class'
                header={'Complete el campo Nombre de empresa'}
                subHeader={''}
                message={'Ingrese nombre oficial de la emrpesa'}
                buttons={['OK']} />
                <IonAlert
                    mode='ios'
                    isOpen={showAlertDescripcion}
                    onDidDismiss={() => setShowAlertDescripcion(false)}
                    cssClass='my-custom-class'
                    header={'Complete la descripción de la empresa'}
                    subHeader={''}
                    message={'Ingrese una descripción o presentación de la empresa'}
                    buttons={['OK']} />
                <IonAlert
                    mode='ios'
                    isOpen={showAlertFoto}
                    onDidDismiss={() => setShowAlertFoto(false)}
                    cssClass='my-custom-class'
                    header={'Debe agregar foto'}
                    subHeader={''}
                    message={'Agregue foto o logo de empresa'}
                    buttons={['OK']} />
                    
            <div id="personalInfo_header">
                    <IonGrid id="completarInfo-iongrid">
                        <IonRow><IonCol>
                            <IonTitle id="completarInfo-title">INFORMACIÓN PERSONAL</IonTitle>
                        </IonCol></IonRow>
                    </IonGrid>
            </div>
            <div id="personalInfo_contenedor_central">
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonItem id="item-completarInfo">
                                <IonLabel position="floating">Nombre de empresa</IonLabel>
                                <IonInput onIonInput={(e: any) => setNombre(e.target.value)}></IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonItem id="item-completarInfo">
                                <IonLabel position="floating">Descripción</IonLabel>
                                <IonTextarea placeholder="Breve descripción" onIonInput={(e: any) => setDescripcion(e.target.value!)}></IonTextarea>
                            </IonItem>

                        </IonCol>
                    </IonRow>
                    <IonRow></IonRow>
                    <IonRow>
                            <IonCol>
                                <TomarFotografia setFilepath={imagen_a_enviar} setFoto={props.setFoto} ></TomarFotografia>
                            </IonCol></IonRow>

                        <IonRow>
                            <IonCol>
                                {photos.map((photo, index) => (
                                    <IonCol size="6" key={index}>
                                        <IonImg onClick={() => onClickPhotoData(photo)} src={photo.webviewPath} />
                                    </IonCol>
                                ))}
                            </IonCol>
                        </IonRow>
                        <IonRow></IonRow><IonRow></IonRow>
                        <IonRow>
                            <IonCol>
                                <IonButton shape="round" id="boton-completarInfo" onClick={() => enviarInformacion()}>CONTINUAR</IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>

                    <IonActionSheet
                        isOpen={!!photoToDelete}
                        buttons={[{
                            text: 'Eliminar',
                            role: 'destructive',
                            icon: trash,
                            handler: () => {
                                if (photoToDelete) {
                                    deletePhoto(photoToDelete);
                                    setPhotoToDelete(undefined);
                                }
                            }
                        }, {
                            text: 'Cancelar',
                            icon: close,
                            role: 'cancel'
                        }]}
                        onDidDismiss={() => setPhotoToDelete(undefined)} />
                </div>
               

            </>
        );
        
    }
    else{
        return (<div className="contenedor_central" />
        );

    }
  }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
const TomarFotografia = (props: {setFilepath:any, setFoto:any}) => {


    const { deletePhoto, photos, takePhoto } = usePhotoGallery();
    const [photoToDelete, setPhotoToDelete] = useState(false);
    const [presioneParaBorrar,setPresioneParaBorrar]=useState("")
    
    const [fotoTomada, setFotoTomada]=useState(false)

    const imagen = useRef<string>()

    const onClickPhotoData=()=>{
        //props.setFilepath(photo.webviewPath)
        setPhotoToDelete(true)
    }

    useEffect(() => {

            if (imagen.current!="" && imagen.current!=undefined && imagen.current!=null){
                setFotoTomada(true)
            }
            
    }, []);
    
    const tomarFoto =()=>{
        takePhoto().then(async res => {
            if(res!=null){
               // props.setImagen(res[0].webviewPath!)
                const base64Data = await base64FromPath(res[0].webviewPath!);
                //props.imagen.current=res[0].webviewPath!
                imagen.current= base64Data
                props.setFoto(base64Data)

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
                     <IonImg id="foto" onClick={() => onClickPhotoData()} src={imagen.current} />
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
                                imagen.current=""
                                props.setFoto("")
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


export default Completarinfo;
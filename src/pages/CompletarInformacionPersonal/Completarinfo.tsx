import React, { useContext, useEffect, useRef, useState } from 'react';
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
import { getItem, setItem } from '../../utilidades/Storage';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg, IonActionSheet, IonInput, IonItem, IonLabel, IonButton, IonItemDivider, IonRange, IonAlert, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonList, IonSelect, IonSelectOption, IonDatetime, IonLoading, IonTextarea, IonCheckbox, useIonRouter } from '@ionic/react';
import { usuario } from '../../Interfaces/interfaces';
import { UserContext } from '../../Contexts/UserContext';



const url= Https+"completarinfo/"

const Completarinfo = (props:{setIsReg:any}) => {

 
  return (
    <IonPage>
     
      <IonContent fullscreen id="main-container">

      <div id="ionContentCompletarInfo">

        <CompletarInformacion setIsReg={props.setIsReg} ></CompletarInformacion>

      </div>

      </IonContent>
    </IonPage>
  );
};

const CompletarInformacion =  (props:{setIsReg:any } ) => {
    
    const [provedores,setProveedores]=useState(0)


    if(provedores==0){
            return(
            <CompletarInformacionPersonal  setIsReg={props.setIsReg}  tipoProveedor={provedores} setTipoProveedor={setProveedores}/>
            );
        }else{
            return (<CompletarRubros setIsReg={props.setIsReg} />
            );
        }
   
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const CompletarInformacionPersonal = (props: { setIsReg:any, tipoProveedor: any; setTipoProveedor: any}) =>{

    const {tipoProveedor, setTipoProveedor} = props.tipoProveedor;
    const { deletePhoto, photos, takePhoto } = usePhotoGallery();
    const [photoToDelete, setPhotoToDelete] = useState<Photo>();

    const [filepath2,setFilepath] = useState("");

    const [nombre,setNombre]=useState<string>();
    const [apellido,setApellido]=useState<string>();
    const [descripcion,setDescripcion]=useState<string>();
    const [showAlertNombre, setShowAlertNombre] = useState(false);
    const [showAlertApellido, setShowAlertApellido] = useState(false);
    const [showAlertFoto,setShowAlertFoto]= useState(false);
    const [showAlertNombreEmpresa, setShowAlertNombreEmpresa] = useState(false);
    const [showAlertDescripcion, setShowAlertDescripcion] = useState(false);

    const imagen_a_enviar = useRef <Blob >()
    const fotoAguardar = useRef("")

    const [showLoading, setShowLoading] = useState(false);

    const [listo, setListo]=useState(false);

    const [presioneParaBorrar,setPresioneParaBorrar]=useState("")

    const [done,setDone]=useState(false)

    const [showAlertBadUser, setShowAlertBadUser] = useState(false)

    const  {user,setUser}  = useContext(UserContext)
    const emailRef = useRef("");
    const [clientTypeRef, setclientTypeRef ]=useState("")

    useEffect(() => {
        (async () => {
          if (user === undefined || !user || user.email === "" || user.tipoCliente === "") {

            const email = await getItem("email");
            const clientType = await getItem("clientType");
            emailRef.current = email;
            setclientTypeRef(clientType);
          } else {
            emailRef.current = user.email;
            setclientTypeRef(user.tipoCliente);
          }
        })();
      }, []);


    const badUserCredentials = () => {

        setShowAlertBadUser(false)
        router.push("/", "forward", "push");

    }


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

    
    const router = useIonRouter();

    if(listo){
        props.setIsReg(true) 

     //   aca lo que tengo que hacer es lo sigui9etne, si el tipo no es proveedor va a home y sino va a completar rubro
        if (clientTypeRef=="1"){
            router.push("/", "forward", "push");
        }else{
            router.push("/CompletarRubros", "forward", "push");

        }
        

    }

    if(done){
        props.setIsReg(false) 
      }


    const enviarInformacion =async ()=>{

        if(clientTypeRef!="3"){

             if(nombre!=null && apellido!=null && imagen_a_enviar.current!=null){
                 
                setShowLoading(true);
                 
                 var formDataToUpload = new FormData();
                 console.log("datos: "+user!.email+" - "+nombre+" - "+apellido)
                 formDataToUpload.append("tipo", String(clientTypeRef))
                 formDataToUpload.append("email", emailRef.current);
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
                        setItem("fotoPersonal",fotoAguardar.current)
                        setItem("calificacion",0)

                        setUser!( (previous) => ({...previous, foto:fotoAguardar.current }))
                        setUser!( (previous) => ({...previous, nombre: nombre}))
                        setUser!( (previous) => ({...previous, apellido:apellido}))
                        setUser!( (previous) => ({...previous, calificacion: 0}))

                        setListo(true);
                        if (clientTypeRef=="2"){
                            props.setTipoProveedor(1)

                        }

                    }else{
                        setItem("personalInfoCompleted", false);
                        setShowAlertBadUser(true)

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
         else{
             if( nombre!=null && descripcion!=null && imagen_a_enviar.current!=null){
                 setShowLoading(true)
                 
                 var formDataToUpload = new FormData();
                 formDataToUpload.append("tipo", String(clientTypeRef))
                 formDataToUpload.append("email", emailRef.current);
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
                        setItem("apellido", apellido)
                        setItem("fotoPersonal",fotoAguardar.current)
                        setItem("calificacion",0)

                        setUser!( (previous) => ({...previous, foto:fotoAguardar.current }))
                        setUser!( (previous) => ({...previous, nombre: nombre}))
                        setUser!( (previous) => ({...previous, apellido:descripcion}))
                        setUser!( (previous) => ({...previous, calificacion: 0}))

                        props.setTipoProveedor(2)
                    }else{
                        setItem("personalInfoCompleted", false);
                        setShowAlertBadUser(true)

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

     console.log("el client type es: "+clientTypeRef )

    if(clientTypeRef =="1" || clientTypeRef =="2"){

        return (
                <><IonLoading
                cssClass='my-custom-class'
                isOpen={showLoading}
                onDidDismiss={() => setShowLoading(false)}
                message={'Cargando datos...'}
                duration={15000} />
                  <IonAlert
                  isOpen={showAlertBadUser}
                  onDidDismiss={() => badUserCredentials()}
                  cssClass='my-custom-class'
                  header={'Credenciales incorrectas'}
                  subHeader={''}
                  mode="ios"
                  message={'Credenciales de usuario incorrectas'}
                  buttons={['OK']}
                  />

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
                    
                    <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto", background:"#f3f2ef"}}>

                    <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto", textAlign:"center", justifyContent:"center", alignItems:"center"}}>
                 
                    <h1 style={{fontSize:"1.2em", color:"black", marginTop:"25px"}}>INFORMACIÓN PERSONAL</h1>
                    <img src={"./assets/icon/completarpersonalinfo.png"} style={{width:"64px", height:"64px"}} />  
                    </div>
                <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100%", justifyContent:"center", alignItems:"center"}}>
                <IonItemDivider />
                  
                                <IonItem id="item-completarInfo">
                                    <IonLabel position="floating">Nombre</IonLabel>
                                    <IonInput autocomplete="name" onIonInput={(e: any) => setNombre(e.target.value)}></IonInput>
                                </IonItem>
                         
                                <IonItem id="item-completarInfo">
                                    <IonLabel position="floating">Apellido</IonLabel>
                                    <IonInput autocomplete="family-name" onIonInput={(e: any) => setApellido(e.target.value)}></IonInput>
                                </IonItem>
                          
                                <TomarFotografia setFilepath={imagen_a_enviar} imagen={fotoAguardar} ></TomarFotografia>
                          
                                {photos.map((photo, index) => (
                                    <IonCol size="6" key={index}>
                                        <IonImg onClick={() => onClickPhotoData(photo)} src={photo.webviewPath} />
                                    </IonCol>
                                ))}
                          
                                <IonButton shape="round" style={{width:"90%", margin:"25px 0px 25px 0px"}} onClick={() => enviarInformacion()}>CONTINUAR</IonButton>   
                </div>
            </div>
            </>
        );
    }
    else{

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
                  isOpen={showAlertBadUser}
                  onDidDismiss={() => badUserCredentials()}
                  cssClass='my-custom-class'
                  header={'Credenciales incorrectas'}
                  subHeader={''}
                  mode="ios"
                  message={'Credenciales de usuario incorrectas'}
                  buttons={['OK']}
                  />
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
                    
                    <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto", background:"#f3f2ef"}}>

                        <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto", textAlign:"center", justifyContent:"center", alignItems:"center"}}>

                        <h1 style={{fontSize:"1.2em", color:"black", marginTop:"25px"}}>INFORMACIÓN PERSONAL</h1>
                        <img src={"./assets/icon/completarpersonalinfo.png"} style={{width:"64px", height:"64px"}} />  
                        </div>
                        <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100%", justifyContent:"center", alignItems:"center"}}>
                        <IonItemDivider />

                        <IonItem id="item-completarInfo">
                            <IonLabel position="floating">Nombre de empresa  </IonLabel>
                            <IonInput autocomplete="name" onIonInput={(e: any) => setNombre(e.target.value)}></IonInput>
                        </IonItem>
                
                        <IonItem id="item-completarInfo">
                            <IonLabel position="floating">Descripción</IonLabel>
                            <IonInput autocomplete="family-name" onIonInput={(e: any) => setDescripcion(e.target.value)}></IonInput>
                        </IonItem>
                
                        <TomarFotografia setFilepath={imagen_a_enviar} imagen={fotoAguardar} ></TomarFotografia>

                        {photos.map((photo, index) => (
                            <IonCol size="6" key={index}>
                                <IonImg onClick={() => onClickPhotoData(photo)} src={photo.webviewPath} />
                            </IonCol>
                        ))}
                
                        <IonButton shape="round" style={{width:"90%", margin:"25px 0px 25px 0px"}} onClick={() => enviarInformacion()}>CONTINUAR</IonButton>   
</div>
</div>
               

            </>
        );
        
    }
  }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 

  const TomarFotografia = (props: {setFilepath:any, imagen:any}) => {
 
 
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
          <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "auto", marginTop: "30px", justifyContent:"center", alignItems:"center", textAlign:"center" }}>
              <strong>Seleccionar foto de galería o tomar fotografia</strong>
              <IonImg id="foto" onClick={() => onClickPhotoData()} src={props.imagen.current} />
              <p> {presioneParaBorrar} </p>
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
            </div>
        );
    }else{
        return(
          <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "auto", marginTop: "30px", justifyContent:"center", alignItems:"center", textAlign:"center" }}>
            <strong>Seleccionar foto de galería o tomar fotografia</strong>      
            <IonFabButton onClick={() => tomarFoto()}>
              <IonIcon icon={camera}></IonIcon>
            </IonFabButton>
            <p> {presioneParaBorrar} </p>
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
          </div>
        );
    }
    
}  

export default Completarinfo;
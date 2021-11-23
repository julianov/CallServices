import { IonActionSheet, IonAlert, IonButton, IonCol, IonContent, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonLoading, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import { arrowBack, person, close,receipt, help, chatbubble, camera, trash } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { getItem, removeItem, setItem } from "../utilidades/Storage";

import './Modal.css';
import axios from "axios";
import { usePhotoGallery } from "../hooks/usePhotoGallery";
import { b64toBlob } from "../utilidades/b64toBlob";
import { base64FromPath } from "@ionic/react-hooks/filesystem";
import { useRef } from "react";
import Completarinfo from "../pages/Completarinfo";
import Estrellas from "../utilidades/Estrellas";
import Https from "../utilidades/HttpsURL";

const url=Https

const ModalCliente: React.FC<{setIsReg:any, onClose: any; tipoVista: string; 
  email:any; completarInfoPersonal:boolean, fotoPersonal:any
  nombre:any, apellido:any, calificacion:any, setFoto:any, setNombre:any,setApellido:any}> 
  = ({setIsReg, onClose, tipoVista, email, calificacion, completarInfoPersonal, fotoPersonal,
    nombre, apellido, setFoto, setNombre,setApellido }) => {
                   
  
    if(tipoVista=="datosUsuario"){
      return (
        <>
          <DatosUsuario  setIsReg={setIsReg} email={email} completarInfoPersonal={completarInfoPersonal}
          fotoPersonal={fotoPersonal} onClose={onClose} 
          nombre={nombre} apellido={apellido} calificacion={calificacion} setFoto={setFoto} setNombre={setNombre} setApellido={setApellido} />

         
        </>
        );
      
    }

    ////////////////////////////////////////////////////////////////////
    //////////////////// Fin de tipo de vista = 0 //////////////////////
    /////////////////// Modal de Cliente ///////////////////////////////
    
    if(tipoVista=="emergencias"){
      return (
        <>
        <IonHeader>
          <IonToolbar>
          <IonIcon icon={arrowBack} onClick={() => onClose(null)} slot="start" id="flecha-volver">  </IonIcon>
  
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div id="contenedor-central">
            <strong>Emergencias</strong>
          </div>
        </IonContent>
      </>
      );
    }
    if(tipoVista=="categorias"){
      return (
        <>
        <IonHeader>
          <IonToolbar>
          <IonIcon icon={arrowBack} onClick={() => onClose(null)} slot="start" id="flecha-volver">  </IonIcon>
  
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div id="contenedor-central">
            <strong>Categorías</strong>
          </div>
        </IonContent>
      </>
      );
    }
    else{
      return (
        <>
        <IonHeader>
          <IonToolbar>
          <IonIcon icon={arrowBack} onClick={() => onClose(null)} slot="start" id="flecha-volver">  </IonIcon>
  
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div id="contenedor-central">
            <strong>Programados</strong>
          </div>
        </IonContent>
      </>
      );
    }
   
  };
  

  /////////////////////////// Fin del modal principal ////////////////////////////

  const TomarFotografia = (props: {imagen:any, setFilepath:any}) => {


    const { deletePhoto, photos, takePhoto } = usePhotoGallery();
    const [photoToDelete, setPhotoToDelete] = useState(false);
    const [presioneParaBorrar,setPresioneParaBorrar]=useState("")
    
    const [fotoTomada, setFotoTomada]=useState(false)

    const onClickPhotoData=()=>{
        //props.setFilepath(photo.webviewPath)
        setPhotoToDelete(true)
    }
    
    const tomarFoto =()=>{
        takePhoto().then(async res => {
            if(res!=null){
               // props.setImagen(res[0].webviewPath!)
                const base64Data = await base64FromPath(res[0].webviewPath!);
                props.setFilepath( base64Data)
                
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
                        <IonFabButton onClick={() => tomarFoto()}>
                            <IonIcon icon={camera}></IonIcon>
                        </IonFabButton>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                     <IonImg id="foto" onClick={() => onClickPhotoData()} src={props.imagen} />
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
                                setFotoTomada(false)
                                setPresioneParaBorrar("")

                            }
                        }
                    }, {
                        text: 'Cancelar',
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
                        role: 'cancel'
                    }]}
                    onDidDismiss={() => setPhotoToDelete(false)} 
                    />
                </>
        );
    }
    
}  

const DatosUsuario = (props:{setIsReg:any,email:string, completarInfoPersonal:any, fotoPersonal:any, onClose:any 
  nombre:any, apellido:any, calificacion:any, setFoto:any, setNombre:any, setApellido:any}) =>{

  const [done,setDone]=useState(false)
  const [agrandarImagen,setAgrandarImagen]=useState(false)
  const [datosPersonales,seDatosPersonales]=useState(false)
 

  const closeSesion = () =>{
  
    removeItem("isRegistered")
    removeItem("clientType")
    removeItem("fotoPersonal")
    removeItem("personalInfoCompleted")
    removeItem("primevaCargaProveedores")
    removeItem("proveedores")
    removeItem("nombre")
    removeItem("apellido")
    removeItem("calificacion")

  
    //setDone(true)
    props.setIsReg(false)
    window.location.reload();

  }

        return(
          <DatosPersonales completarInfoPersonal={props.completarInfoPersonal} closeSesion={closeSesion} datosPersonales={datosPersonales} setDatosPersonales={seDatosPersonales} onClose={props.onClose} 
          email={props.email} foto={props.fotoPersonal} 
          nombre={props.nombre} apellido={props.apellido} calificacion={props.calificacion} setFoto={props.setFoto} setNombre={props.setNombre} setApellido={props.setApellido} ></DatosPersonales>
        )
  


}


const DatosPersonales = (props:{closeSesion:any; completarInfoPersonal:any; datosPersonales:any; setDatosPersonales:any, onClose:any, 
  email:any, foto:any, nombre:any, apellido:any, calificacion:any, setFoto:any, setNombre:any, setApellido:any}) => {

  const [showAlertDatosPersonales, setShowAlertDatosPersonales]=useState(false)

  useEffect(() => {
    if (props.nombre==null || props.apellido==null){
    //  aca tengo que buscar los nombres en lo guardado che sino pedirlo al servidor
      props.setNombre("Debe ingresar nombre")
      props.setApellido("Debe ingresar apellido")
    }
  },[])
  

  if(props.completarInfoPersonal){
    return(
      <>
      <IonHeader>
        <IonToolbar>
        <div className="header">
        <IonIcon icon={close} onClick={() => props.onClose(null)} slot="start" id="flecha-cerrar">  </IonIcon>
        <IonTitle>CallServices</IonTitle></div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <div id="contenedor-izquierda">
        <button  onClick={() => { props.closeSesion () } } className="cerrarsesion" >CERRAR SESIÓN</button>
          </div>
        <div id="contenedor-central">
        
        <IonTitle>PERFIL</IonTitle>
        <strong>Debe completar su información personal </strong>
        
        <IonGrid id="ModalGrid">
        <IonList>
  

          <IonRow><IonCol className="col"><IonItem id="item-modal" button href={"/Completarinfo"}  >
            <IonLabel>Completar Información personal</IonLabel>
            <IonIcon className="iconosModal" icon={person} ></IonIcon>
          </IonItem></IonCol></IonRow>

          <IonRow><IonCol className="col"><IonItem id="item-modal" button onClick={() => { }}>
            <IonLabel>Preguntas</IonLabel>
            <IonIcon className="iconosModal" icon={help} ></IonIcon>
          </IonItem></IonCol></IonRow>

          <IonRow><IonCol className="col"><IonItem id="item-modal" button onClick={() => { }}>
            <IonLabel>Soporte</IonLabel>
            <IonIcon className="iconosModal" icon={chatbubble} ></IonIcon>
          </IonItem></IonCol></IonRow>
          </IonList>  

          </IonGrid>
        

          </div>
      </IonContent>
    </>
    );
    }else{

    

  if (props.datosPersonales){
    return (
      <>
    
      <IonContent>
 
        <div id="contenedor-central-Modal">
        
        <MostrarDatosPersonales setShowAlertDatosPersonales={setShowAlertDatosPersonales} setDatosPersonales={props.setDatosPersonales} onClose={props.onClose} 
        email={props.email} foto={props.foto} 
        nombre={props.nombre} apellido={props.apellido} calificacion={props.calificacion} setFoto={props.setFoto} 
        setNombre={props.setNombre} setApellido={props.setApellido}></MostrarDatosPersonales>
        
        </div>

        <IonLoading  isOpen={showAlertDatosPersonales}   onDidDismiss={() => setShowAlertDatosPersonales(false)}
          cssClass='my-custom-class'
          message={'Esperando respuesta del servidor...'}
          duration={10000}
        />

      </IonContent>
    </>
    );
  }else{
    return (
      <>
      <IonContent>
        
      <div className="header">
        <IonIcon icon={close} onClick={() => props.onClose(null)} slot="right" id="flecha-cerrar">  </IonIcon>
      </div>
        
        <div id="contenedor-central">

        <IonGrid>
        <IonRow><IonCol>
          <img onClick={() => props.setDatosPersonales(true)} src={props.foto} id="foto-usuario-grande"/>
          </IonCol></IonRow>

        <IonList>
     
         <IonRow><IonCol className="col"> <IonItem id="item-modal" button onClick={() => { props.setDatosPersonales(true)}}>
            <IonLabel>DATOS PERSONALES</IonLabel>
            <IonIcon className="iconosModal" icon={person} ></IonIcon>
          </IonItem></IonCol></IonRow>

          <IonRow><IonCol className="col"><IonItem id="item-modal" button onClick={() => { }}>
            <IonLabel>MIS TICKETS</IonLabel>
            <IonIcon className="iconosModal" icon={receipt} ></IonIcon>
          </IonItem></IonCol></IonRow>

          <IonRow><IonCol className="col"><IonItem id="item-modal" button onClick={() => { }}>
            <IonLabel>PREGUNTAS</IonLabel>
            <IonIcon className="iconosModal" icon={help} ></IonIcon>
          </IonItem></IonCol></IonRow>

          <IonRow><IonCol className="col"><IonItem id="item-modal" button onClick={() => { }}>
            <IonLabel>SOPORTE</IonLabel>
            <IonIcon className="iconosModal" icon={chatbubble} ></IonIcon>
          </IonItem></IonCol></IonRow>

          <IonRow><IonCol className="col">
                    <button  onClick={() => { props.closeSesion () } } className="cerrarsesion" >CERRAR SESIÓN</button>
                    </IonCol></IonRow>
        </IonList>  
        </IonGrid>
        </div>
      </IonContent>
    </>
    );
  }
}
}


  const MostrarDatosPersonales = (props:{ setDatosPersonales:any, setShowAlertDatosPersonales:any, onClose:any, 
    email:any, foto:any,nombre:any, apellido:any, calificacion:any, setFoto:any, setNombre:any, setApellido:any}) => {

    const nombre = useRef(props.nombre)
    const apellido = useRef(props.apellido)
    const calificacion = useRef(props.calificacion)  

    const [fotoAEnviar, setFoto]=useState<String>(props.foto)
    const [listoCarga, setListoCarga]=useState(false)

    const [cambiar,setCambiar] =useState("nada")

    const [pedirDatos, setPedirDatos]= useState(false)
    //Si es cero se muestra, si es 1 se cambia la foto, si es 2 el nombre y si es 3 el apellido
    
    const [alertCambioFoto, setShowAlertCambioFoto] = useState(false)

    useEffect(() => {
    }, []);

    const cambiarElemento = (tipo:string) => {
      console.log(tipo)
      if(tipo=="foto"){
        console.log("llego a foto")
          setCambiar("foto")
      }
      else if (tipo=="nombre"){
        setCambiar("nombre")
      }else{
        setCambiar("apellido")
      }
    }

    const enviar = (tipo:string) => {

        var formDataToUpload = new FormData();
        formDataToUpload.append("tipo", "1")
        formDataToUpload.append("email", props.email)
        formDataToUpload.append("nombre", nombre.current)
        formDataToUpload.append("apellido", apellido.current);
        formDataToUpload.append("calificacion", calificacion.current);

        var block = fotoAEnviar!.split(";");
        var contentType = block[0].split(":")[1];
        var realData = block[1].split(",")[1];
        var blob = b64toBlob(realData, contentType,1);
        formDataToUpload.append("image", blob);
        const axios = require('axios');
        axios({
            url:url+"cambiarInfoPersonal",
            method:'POST',
            headers: {"content-type": "multipart/form-data"},
            data:formDataToUpload
        }).then(function(res: any){
          console.log("respondio el servidor: "+res.data)
           if(res.data=="ok"){
               //return(<Redirect to="/home" />);
               if (cambiar=="foto"){
                setShowAlertCambioFoto(true)
               }
               
               setItem("nombre", nombre.current)
               setItem("apellido", apellido.current) 
               setItem("fotoPersonal",fotoAEnviar)
              
               props.setNombre(nombre.current)
               props.setFoto(fotoAEnviar)
               props.setApellido(apellido.current)
               setCambiar("nada")
            }
        }).catch((error: any) =>{
            console.log(error)
            
            //Network error comes in
        });  
        setCambiar("nada")    
    }

    if(listoCarga || !pedirDatos){
      if(cambiar=="nada"){
        return (
          <>
           <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setDatosPersonales(false)} slot="start" id="flecha-volver">  </IonIcon>
            <IonIcon icon={close} onClick={() => props.onClose(null)} slot="end" id="flecha-cerrar">  </IonIcon>
            </div>

            <div className="header">
            </div>

          
            <div id="contenedor-central">
            <h1>PRESIONE UN ELEMENTO PARA MODIFICAR</h1>

            <IonGrid>
            <IonRow>
              <IonCol>
                <IonItem lines="none" id="itemFoto"  onClick={()=> cambiarElemento("foto") }>
                  <img  src={props.foto} id="foto-usuario-grande"/>
                </IonItem>
              </IonCol>
            </IonRow><IonRow><IonCol></IonCol></IonRow>
            <IonRow>
            <IonCol><IonItem id="item-modal-datos" onClick={()=> cambiarElemento("nombre") } >
            <strong >NOMBRE: {props.nombre} </strong>
            </IonItem></IonCol>
            </IonRow>
            <IonRow>
            <IonCol><IonItem id="item-modal-datos" onClick={()=> cambiarElemento("apellido") }>
            <strong >APELLIDO: {props.apellido} </strong>
            </IonItem></IonCol>
            </IonRow>

            <IonRow><IonCol></IonCol></IonRow>
            <IonRow><IonCol></IonCol></IonRow>

            <IonRow>
              <IonCol> 
                <strong >CALIFICACIÓN COMO USUARIO:  </strong>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <Estrellas  calificacion={calificacion.current}   ></Estrellas> 
              </IonCol>
            </IonRow>

            <IonRow><IonCol></IonCol></IonRow>

            </IonGrid>
            </div>

              <IonAlert
                isOpen={alertCambioFoto}
                onDidDismiss={() => setShowAlertCambioFoto(false)}
                cssClass='my-custom-class'
                header={'Cambio de foto personal'}
                subHeader={''}
                message={'Verá reflejado el cambio al cerrar y abrir sesión'}
                buttons={['OK']}
                />
          
        </>
    
        );
      }
      else if(cambiar=="foto"){

        return (
          <>
        <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => setCambiar("nada")} slot="start" id="flecha-volver">  </IonIcon>
            </div>
            <div className="header">
            <IonTitle>Ingrese Nueva foto personal</IonTitle>
            </div>
            
         
            <div id="contenedor-central">

            <TomarFotografia imagen={fotoAEnviar} setFilepath={setFoto} />

            <IonButton shape="round" onClick={()=> enviar("foto") } >Cambiar</IonButton>

            </div>
        </>
    
        );

      }
      else if(cambiar=="nombre"){

        return (
          <>
          <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => setCambiar("nada")} slot="start" id="flecha-volver">  </IonIcon>
            </div>
            <div className="header">
            <IonTitle>Ingrese Nuevo Nombre</IonTitle>
            </div>

            <div id="contenedor-central">

            <IonGrid>
            <IonRow><IonCol><IonItem id="item-modal-datosCambio">
              <IonLabel position="floating">Nombre</IonLabel>
              <IonInput onIonInput={(e: any) => nombre.current=(e.target.value)}></IonInput>
            </IonItem></IonCol></IonRow>
            <IonRow><IonCol><IonButton shape="round" onClick={()=> enviar("nombre") } >Cambiar</IonButton></IonCol></IonRow>
            </IonGrid>

            </div>
        </>
    
        );

      }else{

        return (
          <>
         <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => setCambiar("nada")} slot="start" id="flecha-volver">  </IonIcon>
            </div>
            <div className="header">
            <IonTitle>Ingrese Apellido</IonTitle>
            </div>

            <div id="contenedor-central">
            
            <IonGrid>
            <IonRow><IonCol><IonItem id="item-modal-datosCambio">
              <IonLabel position="floating">Apellido</IonLabel>
              <IonInput onIonInput={(e: any) => apellido.current=(e.target.value)}></IonInput>
            </IonItem></IonCol></IonRow>
            <IonRow><IonCol><IonButton shape="round" onClick={()=> enviar("apellido") } >Cambiar</IonButton> </IonCol></IonRow>
            </IonGrid>

            </div>
        </>
        );

      }
      

    }else{
      return( <> </>)

    }
    
  }


  
  export default ModalCliente;

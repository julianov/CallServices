import { IonActionSheet, IonAlert, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonDatetime, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonLoading, IonRange, IonRow, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import { arrowBack, person, receipt, help, chatbubble, close, trash, camera, construct } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { getItem, removeItem, setItem } from "../utilidades/Storage";

import './Modal.css';
import axios from "axios";
import { b64toBlob } from "../utilidades/b64toBlob";
import { base64FromPath } from "@ionic/react-hooks/filesystem";
import { usePhotoGallery } from "../hooks/usePhotoGallery";
import CompletarRubros from "../pages/CompletarRubros";
import { useRef } from "react";
import { convertTypeAcquisitionFromJson, isPropertySignature } from "typescript";
import Estrellas from "../utilidades/Estrellas";
import Https from "../utilidades/HttpsURL";

//const url='http://127.0.0.1:8000/';
//const url="https://callservicesvps.online:443/"

const url= Https

//const url2='http://127.0.0.1:8000/completarinfo/';
//const url2="https://callservicesvps.online:443/completarinfo/"

const url2 = Https+"completarinfo/"




const ModalProveedor: React.FC<{setIsReg:any,  onClose: any; tipoVista:any; 
  email:any; tipoProveedor:any; completarInfoPersonal:boolean, fotoPersonal:any,
  nombre:any, apellido:any, calificacion:any, setFoto:any, setNombre:any,setApellido:any, 
  rubro1:any, setRubro1:any, rubro2:any, setRubro2:any,
}> = ({setIsReg, onClose, tipoVista, email, tipoProveedor, completarInfoPersonal, 
  fotoPersonal, nombre, apellido, calificacion, setFoto, setNombre,setApellido,
rubro1, setRubro1, rubro2, setRubro2 }) => {
 

 if(tipoVista==="datosUsuario"){
  return (
    < >
      <DatosUsuario setIsReg={setIsReg}
      email={email} tipoProveedor={tipoProveedor} completarInfoPersonal={completarInfoPersonal}
      fotoPersonal={fotoPersonal} onClose={onClose}
      nombre={nombre} apellido={apellido} calificacion={calificacion} setFoto={setFoto} setNombre={setNombre} setApellido={setApellido}
      rubro1={rubro1} rubro2={rubro2} setRubro1={setRubro1} setRubro2={setRubro2}
      />
    </>
    );
}    
if(tipoVista==="emergencias"){
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
if(tipoVista==="categorias"){
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

const DatosUsuario = (props:{setIsReg:any, 
  email:any,tipoProveedor:string, completarInfoPersonal:any, fotoPersonal:any, onClose:any,
  nombre:any, apellido:any, calificacion:any, setFoto:any, setNombre:any, setApellido:any,
  rubro1:any, setRubro1:any, rubro2:any, setRubro2:any }) =>{

  const [agrandarImagen,setAgrandarImagen]=useState(false)
  const [datosPersonales,seDatosPersonales]=useState(false)

  const closeSesion = () =>{

    removeItem("isRegistered")
    removeItem("rubro1")
    removeItem("rubro2")
    removeItem("infoRubro1")
    removeItem("infoRubro2")
    removeItem("rubroLoaded")
    removeItem("clientType")
    removeItem("fotoPersonal")
    removeItem("personalInfoCompleted")
    removeItem("nombre")
    removeItem("apellido")
    removeItem("calificacion")

    props.setIsReg(false)

    window.location.href="/"
    window.location.reload();    
  }
    return(
      <DatosPersonales setIsReg={props.setIsReg}
      completarInfoPersonal={props.completarInfoPersonal} closeSesion={closeSesion} datosPersonales={datosPersonales} setDatosPersonales={seDatosPersonales} onClose={props.onClose} 
      email={props.email} tipoProveedor={props.tipoProveedor} foto={props.fotoPersonal} 
      nombre={props.nombre} apellido={props.apellido} calificacion={props.calificacion} setFoto={props.setFoto} setNombre={props.setNombre} setApellido={props.setApellido} 
      rubro1={props.rubro1} rubro2={props.rubro2} setRubro1={props.setRubro1} setRubro2={props.setRubro2} ></DatosPersonales>
    )
  
}


const DatosPersonales =(props:{setIsReg:any, completarInfoPersonal:any; closeSesion:any;  datosPersonales:any;  setDatosPersonales:any, onClose:any, 
  email:any, tipoProveedor:any, foto:any, nombre:any, apellido:any, calificacion:any, setFoto:any, setNombre:any, setApellido:any,
  rubro1:any, rubro2:any, setRubro1:any, setRubro2:any}) => {

  const [showAlertDatosPersonales, setShowAlertDatosPersonales]=useState(false)
  const [rubros,setRubros]=useState(false) //igual a true para mostrar rubros

  if(props.completarInfoPersonal){

    return(
      <>
     
      <IonContent>
      <div className="header">
        <IonIcon icon={close} onClick={() => props.onClose(null)} slot="right" id="flecha-cerrar">  </IonIcon>
      </div>

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
                email={props.email} tipoProveedor={props.tipoProveedor} foto={props.foto} 
                nombre={props.nombre} apellido={props.apellido} calificacion={props.calificacion} setFoto={props.setFoto} 
                setNombre={props.setNombre} setApellido={props.setApellido}
                ></MostrarDatosPersonales>
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
            if(rubros){
              return (
                <>
                
                <IonContent >
                <MisRubros onClose={props.onClose} setIsReg={props.setIsReg} setRubros={setRubros} email={props.email} tipoProveedor={props.tipoProveedor}  
                rubro1={props.rubro1} rubro2={props.rubro2} setRubro1={props.setRubro1} setRubro2={props.setRubro2}
                ></MisRubros>
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
                  <IonRow><IonCol> <img onClick={() =>props.setDatosPersonales(true)} src={props.foto} id="foto-usuario-grande"/></IonCol></IonRow>
  
                  <IonList>
                  <IonRow><IonCol className="col"><IonItem id="item-modal" button onClick={() => { props.setDatosPersonales(true)}}>
                      <IonLabel>DATOS PERSONALES</IonLabel>
                      <IonIcon className="iconosModal" icon={person} ></IonIcon>
                    </IonItem></IonCol></IonRow>

                    <IonRow><IonCol className="col"><IonItem id="item-modal" button onClick={() => { setRubros(true)}}>
                      <IonLabel>MIS RUBROS</IonLabel>
                      <IonIcon className="iconosModal" icon={construct} ></IonIcon>
                    </IonItem></IonCol></IonRow>
    
                    <IonRow><IonCol className="col"><IonItem  id="item-modal" button onClick={() => { }}>
                      <IonLabel>MIS TICKETS</IonLabel>
                      <IonIcon className="iconosModal" icon={receipt} ></IonIcon>
                    </IonItem></IonCol></IonRow>
        
                    <IonRow><IonCol className="col"> <IonItem id="item-modal" button onClick={() => { }}>
                      <IonLabel >PREGUNTAS</IonLabel>
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

}

const MostrarDatosPersonales = (props:{setDatosPersonales:any, setShowAlertDatosPersonales:any, onClose:any, 
  email:any, tipoProveedor:any, foto:any,nombre:any, apellido:any, calificacion:any, setFoto:any, setNombre:any, setApellido:any}) => {

  const nombre = useRef(props.nombre)
  const apellido = useRef(props.apellido)
  const descripcion = useRef(props.apellido)

  const [fotoAEnviar, setFoto]=useState<String>(props.foto)
 //const [calificacion, setCalificacion]= useState("")
  const [listoCarga, setListoCarga]=useState(false)

  const [cambiar,setCambiar] =useState("nada")
  //Si es cero se muestra, si es 1 se cambia la foto, si es 2 el nombre y si es 3 el apellido
  
  const [pedirDatos, setPedirDatos]=useState(0)

  const [alertCambioFoto, setShowAlertCambioFoto] = useState(false)

  const cambiarElemento = (tipo:string) => {
    if(props.tipoProveedor=="2"){
      if(tipo=="foto"){
          setCambiar("foto")
      }
      else if (tipo=="nombre"){
        setCambiar("nombre")
      }else{
        setCambiar("apellido")
      }
    }else{
      if(tipo=="foto"){
          setCambiar("foto")
      }
      else if (tipo=="nombre"){
        setCambiar("nombre")
      }else{
        setCambiar("apellido")
      }
    }
   
  }


  const enviar = (tipo:string) => {

    if(props.tipoProveedor=="2"){
      var formDataToUpload = new FormData();
      formDataToUpload.append("tipo", "2")
      formDataToUpload.append("email", props.email)
      formDataToUpload.append("nombre", nombre.current)
      formDataToUpload.append("apellido", apellido.current);
    //  formDataToUpload.append("calificacion", calificacion);

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
         if(res.data=="ok"){
             //return(<Redirect to="/home" />);
             if (cambiar=="foto"){
              setShowAlertCambioFoto(true)
             }
             setCambiar("nada")
             setItem("nombre", nombre.current)
             setItem("apellido", apellido.current)
             setItem("fotoPersonal",fotoAEnviar)

             props.setNombre(nombre.current)
             props.setApellido(apellido.current)
             props.setFoto(fotoAEnviar)
          }
      }).catch((error: any) =>{
          setCambiar("nada")
          //Network error comes in
      });  
      

    }else{

      var formDataToUpload = new FormData();
      formDataToUpload.append("tipo", "3")
      formDataToUpload.append("email", props.email)
      formDataToUpload.append("nombre", nombre.current)
      formDataToUpload.append("descripcion", descripcion.current);
     // formDataToUpload.append("calificacion", calificacion);

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
         if(res.data=="ok"){
          if (cambiar=="foto"){
            setShowAlertCambioFoto(true)
           }
           setCambiar("nada")
             setItem("nombre", nombre.current)
             setItem("descripcion", descripcion.current)
             setItem("fotoPersonal",fotoAEnviar)

             props.setNombre(nombre.current)
             props.setApellido(descripcion.current)
             props.setFoto(fotoAEnviar)
          }
      }).catch((error: any) =>{
          setCambiar("nada")
          //Network error comes in
      });  

    }
      

    
  
  }
  if(listoCarga || !pedirDatos){
    ///////////////////////////////////////
    /////Si el proveedor es independiente 
    ///////////////////////////////////////
    if (props.tipoProveedor=="2"){
      if(cambiar=="nada"){
        return (
          <>
            <div id="modalProveedor-flechaVolver">

            <IonIcon icon={arrowBack} onClick={() => props.setDatosPersonales(false)} slot="start" id="flecha-volver">  </IonIcon>
            <IonIcon icon={close} onClick={() => props.onClose(null)} slot="end" id="flecha-cerrar">  </IonIcon>
            </div>
          
            <div className="header">
            <IonTitle>PRESIONE UN ELMENTO PARA MODIFICAR</IonTitle>
            </div>
           
          
            <div id="contenedor-central">

            <IonGrid>
            <IonRow><IonCol ><IonItem lines="none" id="itemFoto" onClick={()=> cambiarElemento("foto") }>
            <img  src={props.foto} id="foto-usuario-grande"/>
            </IonItem></IonCol></IonRow>
            <IonRow><IonCol></IonCol></IonRow>
            
            <IonRow><IonCol><IonItem id="item-modal-datos" onClick={()=> cambiarElemento("nombre") } >
            <strong >NOMBRE: {nombre.current} </strong>
            </IonItem></IonCol></IonRow>
            <IonRow><IonCol><IonItem id="item-modal-datos" onClick={()=> cambiarElemento("apellido") }>
            <strong >APELLIDO: {apellido.current} </strong>
            </IonItem></IonCol></IonRow>
            <IonRow><IonCol> <Estrellas  calificacion={props.calificacion}   ></Estrellas>  </IonCol></IonRow>
           
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
            <div id="contenedor-central">
            <IonTitle>INGRESE NUEVA FOTO PERSONAL</IonTitle>

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
            <IonTitle>INGRESE NOMBRE</IonTitle>
            </div>
     
            <div id="contenedor-central">
              
            <IonItem id="item-modal-datosCambio">
              <IonLabel position="floating">Nombre</IonLabel>
              <IonInput onIonInput={(e: any) => nombre.current=(e.target.value)}></IonInput>
            </IonItem>
            <IonButton shape="round" onClick={()=> enviar("nombre") } >Cambiar</IonButton>

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
            <IonTitle>INGRESE APELLIDO</IonTitle>
            </div>

            <div id="contenedor-central">
            <IonItem id="item-modal-datosCambio">
              <IonLabel position="floating">Apellido</IonLabel>
              <IonInput onIonInput={(e: any) => apellido.current=(e.target.value)}></IonInput>
            </IonItem>
            <IonButton shape="round" onClick={()=> enviar("apellido") } >Cambiar</IonButton>

            </div>
        </>
    
        );

      }

    ///////////////////////////////////////
    /////Si el proveedor es una empresa 
    ///////////////////////////////////////
      
    }else{
      if(cambiar=="nada"){
        return (
          <>
          <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setDatosPersonales(false)} slot="start" id="flecha-volver">  </IonIcon>
          </div>
         
            <div className="header">
            <IonTitle>PRESIONE UN ELEMENTO PARA MODIFICAR</IonTitle>
            </div>
          
            <div id="contenedor-central">

            <IonGrid>
            <IonRow><IonCol >
            <IonItem lines="none" onClick={()=> cambiarElemento("foto") }>
            <img  src={props.foto} id="foto-usuario-grande"/>
            </IonItem></IonCol></IonRow><IonRow><IonCol></IonCol></IonRow>

            <IonRow><IonCol ><IonItem id="item-modal-datos" onClick={()=> cambiarElemento("nombre") } >
            <strong >NOMBRE: {nombre.current} </strong>
            </IonItem></IonCol></IonRow>

            <IonRow><IonCol><IonItem id="item-modal-datos" onClick={()=> cambiarElemento("descripción") }>
            <strong >DESCRIPCIÓN: {descripcion.current} </strong>
            </IonItem></IonCol></IonRow>

            <IonRow><IonCol> <Estrellas  calificacion={props.calificacion}   ></Estrellas>  </IonCol></IonRow>

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
            <IonTitle>INGRESE NUEVA FOTO</IonTitle>
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
            <IonTitle>INGRESE NOMBRE DE EMPRESA</IonTitle>
            </div>

            <div id="contenedor-central">
            <IonItem id="item-modal-datosCambio">
              <IonLabel position="floating">Nombre</IonLabel>
              <IonInput onIonInput={(e: any) => nombre.current=(e.target.value)}></IonInput>
            </IonItem>
            <IonButton shape="round" onClick={()=> enviar("nombre") } >Cambiar</IonButton>

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
            <IonTitle>INGRESE NUEVA DESCRIPCIÓN</IonTitle>
            </div>

            <div id="contenedor-central">

            <IonItem id="item-modal-datosCambio">
              <IonLabel position="floating">Descripción de empresa</IonLabel>
              <IonInput onIonInput={(e: any) => descripcion.current=(e.target.value)}></IonInput>
            </IonItem>
            <IonButton shape="round" onClick={()=> enviar("descripción") } >Cambiar</IonButton>
            </div>
        </>
        );
    }
  }      ///////////////////////////////////////
  /////TERMINA el proveedor es una empresa 
  ///////////////////////////////////////

  }
  
  //TERMINA EL LISTO CARGA
  else{
    return( <> </>)
  }
}

const MisRubros = (props:{setIsReg:any, setRubros:any, email:any, tipoProveedor:any,
  rubro1:any, rubro2:any, setRubro1:any, setRubro2:any, onClose:any}) => {

  const[ hayRubros, setHayRubros]=useState("comprobar")
  const[ verRubro, setVerRubro]=useState("")

  const tituloRubros= useRef()

  const [agregarOtroRubro, setAgregarOtroRubro] = useState(false)

  const[showCargandoRubros, setShowCargandoRubros]= useState(false)


  const verRubros = (rubro:any)=> {
    setVerRubro(rubro)
  }

  if (agregarOtroRubro){

    return(<CompletarRubros  email={props.email} clientType={props.tipoProveedor} setIsReg={props.setIsReg} 
       rubro1={props.rubro1} rubro2={props.rubro2} setRubro1={props.setRubro1} setRubro2={props.setRubro2} />);

  }else{
    if (verRubro==""){
      if((props.rubro1!=""&& props.rubro1!=null )&& (props.rubro2=="" || props.rubro2==null )){
        return(
            
            <div id="centro"><div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setRubros(false)} slot="start" id="flecha-volver">  </IonIcon>
            <IonIcon icon={close} onClick={() => props.onClose(null)} slot="end" id="flecha-cerrar">  </IonIcon>
          </div><div id="contenedorPrincipal">

              <div id="contenedorHijoCentrado">


                <IonTitle>MIS RUBROS CARGADOS</IonTitle>


                <div id="contenederCentrarItemModal">
                  <IonItem id="item-modalRubro" onClick={() => (verRubros(props.rubro1))}>
                    <strong> {JSON.parse(props.rubro1)[0]} </strong>
                  </IonItem>
                </div>
                <IonButton id="botonAgregarRubro" shape="round" onClick={() => setAgregarOtroRubro(true)}> AGREGAR OTRO RUBRO  </IonButton>

              </div>
            </div></div>
          
     );
      }
      else if((props.rubro1!=""&&props.rubro1!=null )&& (props.rubro2!="" && props.rubro2!=null )){
        return(
          <>
           <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setRubros(false)} slot="start" id="flecha-volver">  </IonIcon>
            <IonIcon icon={close} onClick={() => props.onClose(null)} slot="end" id="flecha-cerrar">  </IonIcon>
          </div> 
          <IonTitle>MIS RUBROS CARGADOS</IonTitle>  
          <IonGrid>
          <IonRow><IonCol><IonItem id="item-modalRubro" onClick={()=> verRubros(props.rubro1) }>
          <strong> {JSON.parse(props.rubro1)[0]} </strong>
          </IonItem></IonCol></IonRow><IonRow><IonCol></IonCol></IonRow>
          <IonRow><IonCol><IonItem id="item-modalRubro" onClick={()=> verRubros(props.rubro2) } >
          <strong >{JSON.parse(props.rubro2)[0]} </strong>
          </IonItem></IonCol></IonRow>
          <IonRow>
          </IonRow>
          </IonGrid>
      </>);
      }else{
        return (
          <>
          <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => props.setRubros(false)} slot="start" id="flecha-volver">  </IonIcon>
            <IonIcon icon={close} onClick={() => props.onClose(null)} slot="end" id="flecha-cerrar">  </IonIcon>
          </div>
          <IonGrid>
            <IonRow><div className="caja">
              <strong>NO POSEE RUBROS CARGADOS</strong>
              <p>Cargue un Rubro para poder recibir pedidos de clientes</p>
            </div></IonRow>
            <IonRow><IonCol><IonButton shape="round" onClick={() => { setAgregarOtroRubro(true); } }>AGREGAR RUBRO</IonButton></IonCol></IonRow>
          </IonGrid>
            <IonLoading
              cssClass='my-custom-class'
              isOpen={showCargandoRubros }
              onDidDismiss={() => setShowCargandoRubros(false)}
              message={'Buscando rubros...'}
              duration={5000} /></>
      );
      }
     
    }else{
      if(verRubro==props.rubro1){
        return(
          < div id="contenedorModalProveedor">
          <div id="modalProveedor-flechaVolver">
          <IonIcon icon={arrowBack} onClick={() => setVerRubro("")} slot="start" id="flecha-volver">  </IonIcon>
          </div>
          <CardItemVerRubro pedir={setHayRubros} rubro={verRubro} setRubro={props.setRubro1} email={props.email} clientType={props.tipoProveedor} volver={setVerRubro} />
      </div>);
      }else{
        return(
          <div id="contenedorModalProveedor">  
          <div id="modalProveedor-flechaVolver">   
          <IonIcon icon={arrowBack} onClick={() => setVerRubro("")} slot="start" id="flecha-volver">  </IonIcon>
          </div> 
          <CardItemVerRubro pedir={setHayRubros} rubro={verRubro} setRubro={props.setRubro2} email={props.email} clientType={props.tipoProveedor} volver={setVerRubro} />
      </div>);
      }
      
    }
  }
  

}


const CardItemVerRubro= (props:{ pedir:any,rubro:any, setRubro:any, clientType:any, email:any, volver:any}) => {


  const [datosListos,setDatosListos]=useState(false);
  const [showCargando, setShowCargando]=useState(true)
  const [showRubroEliminado, setShowRubroEliminado]=useState(false)

  const [modificarRubro,setModificarRubro]=useState("")


  const [item,setItem] = useState()
  const radius = useRef()
  const description = useRef()
  const calificacion= useRef()

  const pais= useRef()
  const provincia= useRef()
  const ciudad= useRef()
  const calle= useRef()
  const numeracion= useRef()

  const days_of_works = useRef()
  const hour_init = useRef()
  const hour_end = useRef()
  const certificate = useRef()
  const picture1 = useRef()
  const picture2 = useRef()
  const picture3 = useRef()

  const siesRubro1oRubro2 = useRef("")

  useEffect(() => {
    setItem(JSON.parse(props.rubro)[0])
    radius.current=JSON.parse(props.rubro)[1]
    description.current=JSON.parse(props.rubro)[2]
    calificacion.current=JSON.parse(props.rubro)[3]
    pais.current=JSON.parse(props.rubro)[4]
    provincia.current=JSON.parse(props.rubro)[5]
    ciudad.current=JSON.parse(props.rubro)[6]
    calle.current=JSON.parse(props.rubro)[7]
    numeracion.current=JSON.parse(props.rubro)[8]
    days_of_works.current=JSON.parse(props.rubro)[9]
    hour_init.current=JSON.parse(props.rubro)[10]
    hour_end.current=JSON.parse(props.rubro)[11]
    certificate.current=JSON.parse(props.rubro)[12]
    picture1.current=JSON.parse(props.rubro)[13]
    picture2.current=JSON.parse(props.rubro)[14]
    picture3.current=JSON.parse(props.rubro)[15]   

  }, [modificarRubro]);

  const volver = ()=>{
    props.volver("")
  }

  ////////////////////// Comienzo de eliminar rubro ///////////////////////////////////

  const eliminarRubro = ()=>{
      const axios = require('axios');

      var formDataToUpload = new FormData();
      formDataToUpload.append("email", props.email);
      formDataToUpload.append("tipo", props.clientType);
      formDataToUpload.append("item", item!);

      axios({
          url:url2+"eliminarRubro",
          method:'POST',
          headers: {"content-type": "multipart/form-data"},
          data:formDataToUpload
      }).then(function(res: any){
          if(res!=null){
              if (res.data=="rubro elimnado"){
                  //Aca tengo que eliminar el setItem
                  getItem("rubro2").then(res => {
                      if (res!=null || res!= undefined || res!=""){
                          removeItem("rubro2")
                          removeItem("infoRubro2")
                          props.setRubro(null)
                      }
                      else{
                        removeItem("rubro1")
                        removeItem("infoRubro1")
                        props.setRubro(null)
                      }
                    })
                  
                  setShowRubroEliminado(true)
                  props.pedir("pedir")
                  props.volver("")
              }else if(res.data=="no ha sido posible eliminar el rubro"){
                  props.volver("")
              }else{
                  props.volver("")
              }
          }
      }).catch((error: any) =>{
          //Network error comes in
      });   

  }
////////////////////// Fin de eliminar rubro ///////////////////////////////////

if(modificarRubro==""){
  
    return (
      <>
      <div id="cardItemModalProveedor">

      <IonCard id="ionCard-CardProveedor">
            <IonCardHeader>
                <IonCardTitle>{item}</IonCardTitle>
            </IonCardHeader>
            <strong>Descripción:</strong>
            <IonCardContent>{description.current}</IonCardContent>
      </IonCard>
      <IonCard id="ionCard-CardProveedor">
            <IonItem>PAÍS: {pais.current}</IonItem>
            <IonItem>PROVINCIA/ESTADO/DEPARTAMENTO: {provincia.current} </IonItem>
            <IonItem>CIUDAD: {ciudad.current} </IonItem>
            <IonItem>DOMICILIO: {calle.current} {numeracion.current}</IonItem>
            <IonItem>RADIO DE TRABAJO: {radius.current} Km</IonItem>
      </IonCard>
      <IonCard id="ionCard-CardProveedor">
            <IonItem>DÍAS DE TRABAJO: {days_of_works.current}</IonItem>
            <IonItem>HORARIO DE INICIO: {hour_init.current} Hs.</IonItem>
            <IonItem>HORARIO DE FINALIZACIÓN: {hour_end.current} Hs.</IonItem>
      </IonCard>
      <IonCard id="ionCard-CardProveedor">
            <strong id="textoCard">CERTIFICADO:</strong>
            <IonGrid>
                <IonRow id="row-busqueda">
                  <IonCol size="auto" id="col-explorerContainerCliente">
            
                <img id="ionCard-explorerContainer-Cliente-Imagen" src={certificate.current}></img>
            </IonCol></IonRow>
            </IonGrid>
      </IonCard>
      <IonCard id="ionCard-CardProveedor">
            <strong id="textoCard">IMÁGENES ADJUNTAS:</strong>
            <Imagenes picture1={picture1.current} picture2={picture2.current} picture3={picture3.current}></Imagenes>

        </IonCard>
            <div>
                <IonGrid>

                  <IonRow>
                    <IonCol className="columna">
                      <IonButton shape="round" onClick={() => { setModificarRubro(item!) } }>MODIFICAR DATOS DE RUBRO</IonButton>
                    </IonCol>
                  </IonRow>

                <IonRow></IonRow>

                    <IonRow>
                        <IonCol className="columna">
                            <IonButton shape="round" onClick={() => { eliminarRubro(); } }>ELIMINAR RUBRO</IonButton>
                        </IonCol>
                    </IonRow>

                    <IonRow></IonRow>

                    <IonRow>
                       <IonCol className="columna">
                           <IonButton shape="round" onClick={() => { volver(); } }>VOLVER</IonButton>
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
    
}else{

  return (  <ModificarDatosRubro 
    clientType={props.clientType} email={props.email}
    rubro={props.rubro} setVolver={setModificarRubro} 
    setRubro={props.setRubro}
    siesRubro1oRubro2={siesRubro1oRubro2} 
    setDatosListos={setDatosListos} />)
}

  
}

const ModificarDatosRubro = (props:{clientType:any, email:any,rubro:any,setRubro:any, setVolver:any,
  siesRubro1oRubro2:any, setDatosListos:any}) =>{

  //para volver props.setRubro("")

  const blobCertificado = useRef <Blob>()
  const blobFoto1 = useRef <Blob>()
  const blobFoto2 = useRef <Blob>()
  const blobFoto3 = useRef <Blob>()

  const [showModificandoRubro,setShowModificandoRubro]=useState(false)
  const [showAlertRubroModificado,setShowAlertRubroModificado]=useState(false)
  //const radio = useRef()


  const item = useRef(JSON.parse(props.rubro)[0])
  const radius = useRef(JSON.parse(props.rubro)[1])
  const description = useRef(JSON.parse(props.rubro)[2])
  const calificacion= useRef(JSON.parse(props.rubro)[3])
  const pais=useRef(JSON.parse(props.rubro)[4])
  const provincia=useRef(JSON.parse(props.rubro)[5])
  const ciudad=useRef(JSON.parse(props.rubro)[6])
  const calle=useRef(JSON.parse(props.rubro)[7])
  const numeracion=useRef(JSON.parse(props.rubro)[8])
  const days_of_works = useRef(JSON.parse(props.rubro)[9])
  const hour_init = useRef(JSON.parse(props.rubro)[10])
  const hour_end = useRef(JSON.parse(props.rubro)[11])
  const certificate = useRef(JSON.parse(props.rubro)[12])
  const picture1 = useRef(JSON.parse(props.rubro)[13])
  const picture2 = useRef(JSON.parse(props.rubro)[14])
  const picture3 = useRef(JSON.parse(props.rubro)[15])

  const modificar =()=>{

    let arreglo=new Array();

    setShowModificandoRubro(true) 

    var formDataToUpload = new FormData();
    formDataToUpload.append("tipo", String(props.clientType))
    formDataToUpload.append("email", props.email);

    formDataToUpload.append("item", item.current);
    arreglo.push(item.current)
    formDataToUpload.append("radius",radius.current!);
    arreglo.push(String(radius.current))

    formDataToUpload.append("description", description.current!);
    arreglo.push(description.current)

    arreglo.push(calificacion.current)

    formDataToUpload.append("pais", pais.current!);
    arreglo.push(pais.current)
    formDataToUpload.append("provincia", provincia.current!);
    arreglo.push(provincia.current)
    formDataToUpload.append("ciudad", ciudad.current!);
    arreglo.push(ciudad.current)
    formDataToUpload.append("calle", calle.current!);
    arreglo.push(calle.current)
    formDataToUpload.append("calle-numeracion", numeracion.current!);
    arreglo.push(numeracion.current)


    formDataToUpload.append("days_of_works", days_of_works.current!);
    arreglo.push(days_of_works.current)
    formDataToUpload.append("hour_init", hour_init.current!);
    arreglo.push(hour_init.current)
    formDataToUpload.append("hour_end", hour_end.current!);
    arreglo.push(hour_end.current)

    if(blobCertificado.current!=null || blobCertificado.current!=undefined){
      formDataToUpload.append("certificate", blobCertificado.current);
      arreglo.push(certificate.current)
  }else{
    if(certificate.current!=null && certificate.current!=""){
      var block = certificate.current!.split(";");
      var contentType = block[0].split(":")[1];
      var realData = block[1].split(",")[1];
      var blob = b64toBlob(realData, contentType,1);
      blobCertificado.current=( blob!)
      formDataToUpload.append("certificate", blobCertificado.current);
      arreglo.push(certificate.current)
    }
  }

  if(blobFoto1.current!=null || blobFoto1.current!=undefined){

      formDataToUpload.append("picture1",  blobFoto1.current);
      arreglo.push(picture1.current)
  }else{
    if(picture1.current!=null && picture1.current!=""){
      var block = picture1.current!.split(";");
      var contentType = block[0].split(":")[1];
      var realData = block[1].split(",")[1];
      var blob = b64toBlob(realData, contentType,1);
      blobFoto1.current=( blob!)
      formDataToUpload.append("picture1", blobFoto1.current);
      arreglo.push(picture1.current)
    }
  }

  if(blobFoto2.current!=null || blobFoto2.current!=undefined){

      formDataToUpload.append("picture2", blobFoto2.current);
      arreglo.push(picture2.current)
  }else{
    if(picture2.current!=null && picture2.current!=""){
      var block = picture2.current!.split(";");
      var contentType = block[0].split(":")[1];
      var realData = block[1].split(",")[1];
      var blob = b64toBlob(realData, contentType,1);
      blobFoto2.current=( blob!)
      formDataToUpload.append("picture2", blobFoto2.current);
      arreglo.push(picture2.current)
    }
  }

  if(blobFoto3.current!=null || blobFoto3.current!=undefined){
      formDataToUpload.append("picture3", blobFoto3.current);
      arreglo.push(picture3.current)
  }else{
    if(picture3.current!=null && picture3.current!=""){
      var block = picture3.current!.split(";");
      var contentType = block[0].split(":")[1];
      var realData = block[1].split(",")[1];
      var blob = b64toBlob(realData, contentType,1);
      blobFoto3.current=( blob!)
      formDataToUpload.append("picture3", blobFoto3.current);
      arreglo.push(picture3.current)
    }
  }


  const axios = require('axios');
  axios({
      url:url2+"modificarRubro",
      method:'POST',
      headers: {"content-type": "multipart/form-data"},
      data:formDataToUpload
  }).then(function(res: any){

      if(res.data=="rubro modificado"){
        if(props.siesRubro1oRubro2.current=="rubro1"){
          setItem("infoRubro1", JSON.stringify(arreglo)).then(() =>{ 
            setShowModificandoRubro(false) 
           // props.setDatosListos(false)
            props.setRubro(JSON.stringify(arreglo))
            })
        }else if (props.siesRubro1oRubro2.current=="rubro2"){
          setItem("infoRubro2", JSON.stringify(arreglo)).then(() =>{ 
            setShowModificandoRubro(false) 
          //  props.setDatosListos(false)
            props.setRubro(JSON.stringify(arreglo))
          })
        }else{
          setShowModificandoRubro(false) 
          //props.setRubro("")
        }
        setShowAlertRubroModificado(true)
      }



  }).catch((error: any) =>{
      //Network error comes in
      setShowModificandoRubro(false) 
      props.setVolver("")

  });  
}

  const volver = ()=>{
    props.setVolver("")
  }
  
  return(<> 
  
  
  <div id="cardItemModalProveedor">
  <IonTitle id="tituloModalProveedor">PUEDE MOFICIAR LA SIGUIENTE INFORMACIÓN DEL RUBRO</IonTitle>

<IonCard id="ionCard-CardProveedorGeneral">
      <IonCardHeader>
          <IonCardTitle>{item.current}</IonCardTitle>
      </IonCardHeader>
      <strong>Descripción:</strong>      
      <IonTextarea placeholder={description.current} onIonInput={(e: any) => description.current=(e.target.value)}></IonTextarea>
      </IonCard >

      <IonCard id="ionCard-CardProveedorGeneral">
      <IonCardTitle>LOCACIÓN DE TRABAJO</IonCardTitle>


      <IonItem id="ModalProveedorItem"><IonInput placeholder={"País: "+pais.current} onIonInput={(e: any) => pais.current=(e.target.value)}></IonInput></IonItem>
      <IonItem id="ModalProveedorItem"><IonInput placeholder={"Provincia/Departamento/Estado: "+provincia.current} onIonInput={(e: any) => provincia.current=(e.target.value)}></IonInput></IonItem>
      <IonItem id="ModalProveedorItem"><IonInput placeholder={"Ciudad: "+ciudad.current} onIonInput={(e: any) => ciudad.current=(e.target.value)}></IonInput></IonItem>
      <IonItem id="ModalProveedorItem"><IonInput placeholder={"Calle: "+calle.current} onIonInput={(e: any) => calle.current=(e.target.value)}></IonInput></IonItem>
      <IonItem id="ModalProveedorItem"><IonInput placeholder={"Numeración: "+numeracion.current} onIonInput={(e: any) => numeracion.current=(e.target.value)}></IonInput></IonItem>
      
      <Range radius={radius} ></Range>
      </IonCard>

      <IonCard id="ionCard-CardProveedorGeneral">

      <IonGrid>
                  <IonRow>
                      <IonCol className="columna">
                          
                              <IonCardTitle >SELECIONE LOS DIAS DE TRABAJO</IonCardTitle>                             
                         
                      </IonCol>
                  </IonRow>
                  <IonRow>
                      <IonCol className="columna">
                   <DiasdeTrabajo dias={days_of_works.current}></DiasdeTrabajo>
                   </IonCol>
                   </IonRow>
                  <IonRow>
                      <IonCol className="columna">
                          <IonItem>
                              <IonLabel id="label">HORA DE INICIO DE TRABAJO DIARIO</IonLabel>
                              <IonDatetime displayFormat="HH:mm" value={hour_init.current} onIonChange={e => hour_init.current=(e.detail.value!)}></IonDatetime>
                          </IonItem>
                      </IonCol>
                  </IonRow>
                  <IonRow>
                      <IonCol className="columna">
                          <IonItem>
                              <IonLabel id="label">HORA DE FINALIZACIÓN DE TRABAJO DIARIO</IonLabel>
                              <IonDatetime displayFormat="HH:mm" value={hour_end.current} onIonChange={e => hour_end.current=(e.detail.value!)}></IonDatetime>
                          </IonItem>
                      </IonCol>
                  </IonRow>
              </IonGrid>
              </IonCard >

              <IonCard id="ionCard-CardProveedorGeneral">

      <IonCardTitle>INGRESE FOTO O CAPTURA DE CERTIFICACIÓN</IonCardTitle>
    <div><p>Foto o captura de certificación habilitante para el trabajo o título</p>
            <p>Certificación de curso o título muestra a los clientes sus conocimientos en la materia</p></div>
            <TomarFotografia2 imagen={certificate} setFilepath={blobCertificado} ></TomarFotografia2>
        </IonCard>
        
        <IonCard id="ionCard-CardProveedorGeneral">

        <IonGrid>
          <IonRow>
            <IonCol >
                <TomarFotografia2 imagen={picture1} setFilepath={blobFoto1} />
            </IonCol>
           </IonRow>
          <IonRow>
            <IonCol >
              <TomarFotografia2 imagen={picture2} setFilepath={blobFoto2} />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol >
              <TomarFotografia2 imagen={picture3} setFilepath={blobFoto3} />
            </IonCol>
          </IonRow>
          <IonRow></IonRow>
        </IonGrid>
        </IonCard>

      <div>
          <IonGrid>

            <IonRow>
              <IonCol className="columna">
                <IonButton shape="round" onClick={() => { modificar() } }>MODIFICAR DATOS DE RUBRO</IonButton>
              </IonCol>
            </IonRow>

              <IonRow></IonRow>

              <IonRow>
                 <IonCol className="columna">
                     <IonButton shape="round" onClick={() => { volver(); } }>VOLVER</IonButton>
                 </IonCol>
             </IonRow>
          </IonGrid>
      </div>
      </div>
  

      <IonLoading
              cssClass='my-custom-class'
              isOpen={showModificandoRubro}
              onDidDismiss={() => setShowModificandoRubro(false)}
              message={'Modificando rubro...'}
              duration={15000} />
     <IonAlert
              isOpen={showAlertRubroModificado}
              onDidDismiss={() => setShowAlertRubroModificado(false)}
              cssClass='my-custom-class'
              header={'Rubro ha sido modificado'}
              subHeader={''}
              message={'Observará los cambios al cerrar e iniciar sesión'}
              buttons={['OK']}
              />
  
  </>)
}

const Range = (props:{radius:any})=>{
 
      return(
          <div>
          <IonGrid>
          <IonRow><IonCol><IonLabel> El radio de trabajo es un estimativo de cuanto se desplazaría para ir a las locaciones de los clientes </IonLabel></IonCol></IonRow> 
          <IonRow><IonCol><IonRange pin={true} value={props.radius.current} onIonChange={e => props.radius.current=(e.detail.value as number)} /> </IonCol></IonRow>

          <IonRow><IonCol><IonLabel>Radio de trabajo: {props.radius.current} Km</IonLabel></IonCol></IonRow>
          </IonGrid>
          </div>
      );
}


const TomarFotografia2 = (props: {imagen:any, setFilepath:any}) => {


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


const Imagenes= (props:{ picture1:any,picture2:any, picture3:any	}) => {

  if(props.picture1!="" && props.picture2!="" &&props.picture3!=""){
    return(
      <div id="CardProveedoresImg"><img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture1}></img>
        <img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture2}></img>
        <img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture3}></img></div>
    )
  }
  else if(props.picture1!="" && props.picture2!="" &&props.picture3==""){
    return(
      <div id="CardProveedoresImg"><img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture1}></img>
        <img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture2}></img>
      </div>
    )
  }
  else if(props.picture1!="" && props.picture2=="" &&props.picture3==""){
    return(
      <div id="CardProveedoresImg"><img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture1}></img>
      </div>
    )
  }else{
    return(
      <>
      </>
    )
  }

}

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
          <IonGrid>
          <IonRow>
              <IonCol><BotonDia dia={"LU"} setDia={setLunes} ></BotonDia></IonCol>
              <IonCol><BotonDia dia={"MA"} setDia={setMartes} ></BotonDia></IonCol>
              <IonCol><BotonDia dia={"MI"} setDia={setMiercoles} ></BotonDia></IonCol>
              <IonCol><BotonDia dia={"JU"} setDia={setJueves} ></BotonDia></IonCol>
              <IonCol><BotonDia dia={"VI"} setDia={setViernes} ></BotonDia></IonCol>
              <IonCol><BotonDia dia={"SA"} setDia={setSabado} ></BotonDia></IonCol>
              <IonCol><BotonDia dia={"DO"} setDia={setDomingo} ></BotonDia></IonCol>

              </IonRow>
          </IonGrid>


      );
}
const BotonDia=  (props:{dia:any, setDia:any})=> {
    
  const [selecionado, setSeleccionado] =useState(false)

  if (selecionado){
      props.setDia(true)
  }else{
      props.setDia(false)
  }
  
  return (
      selecionado ? <IonButton color="primary" shape="round" onClick={() => setSeleccionado(false)} id="diaSelecionado">{props.dia}</IonButton> : <IonButton color="white" shape="round" id="diaNoSelecionado" onClick={() => setSeleccionado(true)}>{props.dia}</IonButton>

  )
}
export default ModalProveedor;
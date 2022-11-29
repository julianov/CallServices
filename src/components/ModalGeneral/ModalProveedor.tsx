import { arrowBack, person, receipt, help, chatbubble, close, trash, camera, construct } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";

import './Modal.css';
import axios from "axios";
import { base64FromPath } from "@ionic/react-hooks/filesystem";
import { useRef } from "react";
import { convertTypeAcquisitionFromJson, isPropertySignature } from "typescript";
import Https from "../../utilidades/HttpsURL";
import { usePhotoGallery } from "../../hooks/usePhotoGallery";
import { getItem, removeItem, setItem } from "../../utilidades/Storage";
import { b64toBlob } from "../../utilidades/b64toBlob";
import Estrellas from "../Estrellas/Estrellas";
import CompletarRubros from "../../pages/CompletarRubros/CompletarRubros";
import { useRubroContext1, useRubroContext2 } from "../../Contexts/RubroContext";
import { useUserContext } from "../../Contexts/UserContext";
import { itemRubro, usuario } from "../../Interfaces/interfaces";
import { IonActionSheet, IonAlert, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonDatetime, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonLoading, IonRange, IonRow, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import { retornarIconoCategoria } from "../../utilidades/retornarIconoCategoria";
import { clearDB } from "../../utilidades/dataBase";

//const url='http://127.0.0.1:8000/';
//const url="https://callservicesvps.online:443/"

const url= Https

//const url2='http://127.0.0.1:8000/completarinfo/';
//const url2="https://callservicesvps.online:443/completarinfo/"

const url2 = Https+"completarinfo/"




const ModalProveedor: React.FC<{setIsReg:any,  onClose: any; tipoVista:any; completarInfoPersonal:boolean, 
}> = ({setIsReg, onClose, tipoVista, completarInfoPersonal,
}) => {
 

 if(tipoVista==="datosUsuario"){
  return (
    < >
      <DatosUsuario setIsReg={setIsReg} completarInfoPersonal={completarInfoPersonal}  onClose={onClose}
      
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

const DatosUsuario = (props:{setIsReg:any, completarInfoPersonal:any, onClose:any,
  }) =>{

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
  
    clearDB().then(()=>{
      props.setIsReg(false)

      window.location.href="/"
      window.location.reload(); 
    })

      
  }
    return(
      <DatosPersonales setIsReg={props.setIsReg} completarInfoPersonal={props.completarInfoPersonal} closeSesion={closeSesion} datosPersonales={datosPersonales} setDatosPersonales={seDatosPersonales} onClose={props.onClose}></DatosPersonales>
    )
  
}


const DatosPersonales =(props:{setIsReg:any, completarInfoPersonal:any; closeSesion:any;  datosPersonales:any;  setDatosPersonales:any, onClose:any }) => {

  const [showAlertDatosPersonales, setShowAlertDatosPersonales]=useState(false)
  const [rubros,setRubros]=useState(false) //igual a true para mostrar rubros

  const  {user,setUser}  = useUserContext()

  const [imagen, setImagen] = useState ("")

  useEffect(() => {
    if (user!.foto==""|| user!.foto==null || user!.foto==undefined){
      setImagen ("./assets/icon/nuevoUsuario.png") 
    }else{
      setImagen(user!.foto)
    }
  }, [user!.foto]);

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
                email={user?.email} tipoProveedor={user?.tipoCliente} foto={user!.foto} 
                nombre={user!.nombre} apellido={user!.apellido} calificacion={user!.calificacion} setUser={setUser}
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
                <MisRubros onClose={props.onClose} setIsReg={props.setIsReg} setRubros={setRubros} email={user?.email} tipoProveedor={user!.tipoCliente}></MisRubros>
                </IonContent>
              </>
              );


            }else{
              return (
            
                <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100vh"}}>

                  <header  style={{display:"flex", alignItems:"right", justifyContent:"right",width:"100%",height:"auto"}}>
                    <IonIcon icon={close} onClick={() => props.onClose(null)} slot="right" id="flecha-cerrar">  </IonIcon>
                  </header>

                  <div style={{display:"flex",flexDirection:"column", justifyContent:"center", alignItems:"center", width:"100%",height:"100%"}}>
                    <img onClick={() =>props.setDatosPersonales(true)} src={imagen} id="foto-usuario-grande"/>
                    
                    <div style={{display:"flex",flexDirection:"column", justifyContent:"center", alignItems:"center", width:"80%",height:"auto", marginTop:"15px"}}>

                        <IonItem id="item-modal" button onClick={() => { props.setDatosPersonales(true)}}>
                                  <IonLabel>DATOS PERSONALES</IonLabel>
                                  <IonIcon className="iconosModal" icon={person} ></IonIcon>
                        </IonItem>
                        <IonItem id="item-modal" button onClick={() => { setRubros(true)}}>
                                  <IonLabel>MIS RUBROS</IonLabel>
                                  <IonIcon className="iconosModal" icon={construct} ></IonIcon>
                        </IonItem>
                
                        <IonItem  id="item-modal" button onClick={() => { }}>
                                  <IonLabel>MIS TICKETS</IonLabel>
                                  <IonIcon className="iconosModal" icon={receipt} ></IonIcon>
                        </IonItem>
                    
                        <IonItem id="item-modal" button onClick={() => { }}>
                                  <IonLabel >PREGUNTAS</IonLabel>
                                  <IonIcon className="iconosModal" icon={help} ></IonIcon>
                        </IonItem>
                
                        <IonItem id="item-modal" button onClick={() => { }}>
                                  <IonLabel>SOPORTE</IonLabel>
                                  <IonIcon className="iconosModal" icon={chatbubble} ></IonIcon>
                        </IonItem>
                    
                 
                    </div>
                    </div>

                    <div style={{display:"flex", alignItems:"center", justifyContent:"center", width:"100%",height:"auto"}}>
                    <button  onClick={() => { props.closeSesion () } } className="cerrarsesion" >CERRAR SESIÓN</button>
                    </div>
                
              </div>

              );
            }
            
          }
          
      
    }  

}

const MostrarDatosPersonales = (props:{setDatosPersonales:any, setShowAlertDatosPersonales:any, onClose:any, 
  email:any, tipoProveedor:any, foto:any,nombre:any, apellido:any, calificacion:any, setUser:any}) => {

  const nombre = useRef(props.nombre)
  const apellido = useRef(props.apellido)
  const descripcion = useRef(props.apellido)

  const [fotoAEnviar, setFoto]=useState<String>(props.foto)
 //const [calificacion, setCalificacion]= useState("")
  const [listoCarga, setListoCarga]=useState(false)

  const [cambiar,setCambiar] =useState("nada")
  //Si es cero se muestra, si es 1 se cambia la foto, si es 2 el nombre y si es 3 el apellido
  
  const [pedirDatos, setPedirDatos]=useState(0)

  const[ showAlertDatosPersonales, setShowAlertDatosPersonales] = useState(false)

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
      
      if(nombre.current!=null&&nombre.current!=""){
        formDataToUpload.append("nombre", nombre.current)

      }

      if(apellido.current!=null&&apellido.current!=""){
        formDataToUpload.append("apellido", apellido.current);

      }
    //  formDataToUpload.append("calificacion", calificacion);

      if (fotoAEnviar!=null){
        var block = fotoAEnviar!.split(";");
        var contentType = block[0].split(":")[1];
        var realData = block[1].split(",")[1];
        var blob = b64toBlob(realData, contentType,1);
        formDataToUpload.append("image", blob);
      }
      

      const axios = require('axios');
      axios({
          url:url+"cambiarInfoPersonal",
          method:'POST',
          headers: {"content-type": "multipart/form-data"},
          data:formDataToUpload
      }).then(function(res: any){
         if(res.data=="ok"){
             //return(<Redirect to="/home" />);
             
             setItem("nombre", nombre.current)
             setItem("apellido", apellido.current)
             setItem("fotoPersonal",fotoAEnviar)

             props.setUser!((state:usuario) => ({ ...state, nombre: nombre.current }))
             props.setUser!((state:usuario) => ({ ...state, apellido: apellido.current }))
             props.setUser!((state:usuario) => ({ ...state, foto: fotoAEnviar }))
             setShowAlertDatosPersonales(false)
             setCambiar("nada")

          }
      }).catch((error: any) =>{
          setCambiar("nada")
          setShowAlertDatosPersonales(false)
          //Network error comes in
      });  
      

    }else{

      var formDataToUpload = new FormData();
      formDataToUpload.append("tipo", "3")
      if(props.email!=null&&props.email!=""){
        formDataToUpload.append("email", props.email)
      }
      if(nombre.current!=null&&nombre.current!=""){
        formDataToUpload.append("nombre", nombre.current)
      }
      if(descripcion.current!=null&&descripcion.current!=""){
        formDataToUpload.append("descripcion", descripcion.current);

      }
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
         
           setCambiar("nada")
             setItem("nombre", nombre.current)
             setItem("descripcion", descripcion.current)
             setItem("fotoPersonal",fotoAEnviar)

             props.setUser!((state:usuario) => ({ ...state, nombre: nombre.current }))
             props.setUser!((state:usuario) => ({ ...state, apellido: apellido.current }))
             props.setUser!((state:usuario) => ({ ...state, foto: fotoAEnviar }))
             setShowAlertDatosPersonales(false)
             setCambiar("nada")

          }
      }).catch((error: any) =>{
          setCambiar("nada")
          setShowAlertDatosPersonales(false)
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
          < div style={{display:"flex", flexDirection:"column", width:"100%", height:"100vh"}}>

            <div id="modalProveedor-flechaVolver">

            <IonIcon icon={arrowBack} onClick={() => props.setDatosPersonales(false)} slot="start" id="flecha-volver">  </IonIcon>
            <IonIcon icon={close} onClick={() => props.onClose(null)} slot="end" id="flecha-cerrar">  </IonIcon>
            </div>

            <div style={{display:"flex", flexDirection:"column", textAlign:"center" ,justifyContent:"center", alignItems:"center", width:"100%",height:"100%"}}>

              <IonItem lines="none" id="itemFoto" onClick={()=> cambiarElemento("foto") }>
                <img  src={props.foto} id="foto-usuario-grande"/>
              </IonItem>
              <IonItem lines="none" id="item-modal-datos" onClick={()=> cambiarElemento("nombre") } >
                <strong >NOMBRE: {nombre.current} </strong>
              </IonItem>
              <IonItem lines="none" id="item-modal-datos" onClick={()=> cambiarElemento("apellido") }>
                <strong >APELLIDO: {apellido.current} </strong>
              </IonItem>
                <strong style={{marginTop:"25px", marginBottom:"10px"}} >CALIFICACIÓN COMO PROVEEDOR: </strong>
              <Estrellas  calificacion={props.calificacion}   ></Estrellas>      
              
            </div>

            <div style={{display:"flex",height:"auto", width:"100%", justifyContent:"center", alignItems:"center"}}> 
            <h2 style={{marginTop:"25px", fontSize:"1em"}}>PRESIONE UN ELEMENTO PARA MODIFICAR</h2>
            </div>
          
        </div>
    
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

            <IonButton shape="round" onClick={()=> {setShowAlertDatosPersonales(true);enviar("foto")} } >Cambiar</IonButton>
            </div>

            <IonLoading  isOpen={showAlertDatosPersonales}   onDidDismiss={() => setShowAlertDatosPersonales(false)}
                    cssClass='my-custom-class'
                    message={'Modificando foto...'}
                    duration={10000}
                  />
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
            <IonButton shape="round" onClick={()=> {setShowAlertDatosPersonales(true);enviar("nombre")} } >Cambiar</IonButton>

            </div>

            <IonLoading  isOpen={showAlertDatosPersonales}   onDidDismiss={() => setShowAlertDatosPersonales(false)}
                    cssClass='my-custom-class'
                    message={'Modificando nombre...'}
                    duration={10000}
                  />
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
            <IonButton shape="round" onClick={()=> {setShowAlertDatosPersonales(true);enviar("apellido")} } >Cambiar</IonButton>

            </div>

            <IonLoading  isOpen={showAlertDatosPersonales}   onDidDismiss={() => setShowAlertDatosPersonales(false)}
                    cssClass='my-custom-class'
                    message={'Modificando apellido...'}
                    duration={10000}
                  />
        </>
    
        );

      }

    ///////////////////////////////////////
    /////Si el proveedor es una empresa 
    ///////////////////////////////////////
      
    }else{
      if(cambiar=="nada"){
        return (
          < div style={{display:"flex", flexDirection:"column", width:"100%", height:"100vh"}}>

            <div id="modalProveedor-flechaVolver">

            <IonIcon icon={arrowBack} onClick={() => props.setDatosPersonales(false)} slot="start" id="flecha-volver">  </IonIcon>
            <IonIcon icon={close} onClick={() => props.onClose(null)} slot="end" id="flecha-cerrar">  </IonIcon>
            </div>
          
           
          
            <div style={{display:"flex", flexDirection:"column", textAlign:"center" ,justifyContent:"center", alignItems:"center", width:"100%",height:"100%"}}>

            <IonItem lines="none" id="itemFoto" onClick={()=> cambiarElemento("foto") }>
            <img  src={props.foto} id="foto-usuario-grande"/>
            </IonItem>
            
            <IonItem id="item-modal-datos" onClick={()=> cambiarElemento("nombre") } >
            <strong >NOMBRE: {nombre.current} </strong>
            </IonItem>
            <IonItem id="item-modal-datos" onClick={()=> cambiarElemento("apellido") }>
            <strong >DESCRIPCIÓN: {apellido.current} </strong>
            </IonItem>
            <Estrellas  calificacion={props.calificacion}   ></Estrellas>      
            
            </div>

            <div style={{display:"flex",height:"auto", width:"100%", justifyContent:"center", alignItems:"center"}}> 
            <h2 style={{marginTop:"25px", fontSize:"1em"}}>PRESIONE UN ELEMENTO PARA MODIFICAR</h2>
            </div>
          
        </div>
    
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

            <IonButton shape="round" onClick={()=> {setShowAlertDatosPersonales(true);enviar("foto")} } >Cambiar</IonButton>
            </div>

            <IonLoading  isOpen={showAlertDatosPersonales}   onDidDismiss={() => setShowAlertDatosPersonales(false)}
                    cssClass='my-custom-class'
                    message={'Modificando foto...'}
                    duration={10000}
                  />
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
            <IonButton shape="round" onClick={()=> {setShowAlertDatosPersonales(true);enviar("nombre")} } >Cambiar</IonButton>

            </div>

            <IonLoading  isOpen={showAlertDatosPersonales}   onDidDismiss={() => setShowAlertDatosPersonales(false)}
                    cssClass='my-custom-class'
                    message={'Modificando nombre...'}
                    duration={10000}
                  />
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
            <IonButton shape="round" onClick={()=> {setShowAlertDatosPersonales(true);enviar("descripción")}} >Cambiar</IonButton>
            </div>

            <IonLoading  isOpen={showAlertDatosPersonales}   onDidDismiss={() => setShowAlertDatosPersonales(false)}
                    cssClass='my-custom-class'
                    message={'modificando descripción...'}
                    duration={10000}
                  />
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


const Rubritos = (props:{setAgregarOtroRubro:any,verRubros:any}) =>{


  const {rubrosItem1,setItemRubro1} = useRubroContext1 () 
  const {rubrosItem2,setItemRubro2} = useRubroContext2 () 


  if ((rubrosItem1!.rubro!="" && rubrosItem1!.rubro!=undefined) && (rubrosItem2!.rubro!="" && rubrosItem2!.rubro!=undefined)){
      return (
        <div style={{display:"flex", flexDirection:"column", width:"100%",height:"100%", justifyContent:"center", alignItems:"center"}}>
          <IonItem style={{width:"80%"}}  onClick={() => (props.verRubros(rubrosItem1!.rubro))}>
              <strong> {rubrosItem1!.rubro} </strong>
              <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria(rubrosItem1!.rubro)}></img>

          </IonItem>
          <IonItem style={{width:"80%"}}  onClick={() => (props.verRubros(rubrosItem2!.rubro))}>
              <strong> {rubrosItem2!.rubro} </strong>
              <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria(rubrosItem2!.rubro)}></img>
          </IonItem>
        </div>
      )
  }else if((rubrosItem1!.rubro=="" || rubrosItem1!.rubro==undefined) && (rubrosItem2!.rubro!="" && rubrosItem2!.rubro!=undefined)){ 
      return (
          <div style={{display:"flex", flexDirection:"column", width:"100%",height:"100%", justifyContent:"center", alignItems:"center"}}>
            <IonItem style={{width:"80%"}}  onClick={() => (props.verRubros(rubrosItem2!.rubro))}>
                  <strong> {rubrosItem2!.rubro} </strong>
                  <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria(rubrosItem2!.rubro)}></img>
              </IonItem>
              < div style={{display:"flex", width:"100%", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center"}}>
                <p style={{fontSize:"0.9em", marginTop:"45px"}}> AGREGAR OTRO RUBRO</p>
                <IonButton color="warning" shape="round" style={{width:"40px", height:"40px",}} onClick={() => {props.setAgregarOtroRubro(true)} }><p style={{fontSize:"1.4em", color:"black", fontWeight:"bold"}}>+</p></IonButton>
            </div>
           </div>
      )
  }else if((rubrosItem1!.rubro!="" && rubrosItem1!.rubro!=undefined) && (rubrosItem2!.rubro=="" || rubrosItem2!.rubro==undefined)){ 
      return (
        <div style={{display:"flex", flexDirection:"column", width:"100%",height:"100%", justifyContent:"center", alignItems:"center"}}>
        <IonItem style={{width:"80%"}} onClick={() => (props.verRubros(rubrosItem1!.rubro))}>
                  <strong> {rubrosItem1!.rubro} </strong>
              <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria(rubrosItem1!.rubro)}></img>
        </IonItem>
        < div style={{display:"flex", width:"100%", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center"}}>
                    <p style={{fontSize:"0.9em", marginTop:"45px"}}> AGREGAR OTRO RUBRO</p>
                    <IonButton color="warning" shape="round" style={{width:"40px", height:"40px",}} onClick={() => {props.setAgregarOtroRubro(true)} }><p style={{fontSize:"1.4em", color:"black", fontWeight:"bold"}}>+</p></IonButton>
            </div>
</div>
      )
  }else{
      return (
        <div style={{display:"flex", flexDirection:"column", textAlign:"center", width:"100%",height:"100%", justifyContent:"center", alignItems:"center"}}>
          <h1>NO POSEE RUBROS CARGADOS</h1>
          <IonButton shape="round" id="boton-inicialBR" onClick={() => { props.setAgregarOtroRubro(true)} }>AGREGAR RUBRO</IonButton>
        </div>
      )
  }

}

const MisRubros = (props:{setIsReg:any, setRubros:any, email:any, tipoProveedor:any,onClose:any}) => {

  const[ hayRubros, setHayRubros]=useState("comprobar")
  const[ verRubro, setVerRubro]=useState("")

  //const tituloRubros= useRef()

  const [agregarOtroRubro, setAgregarOtroRubro] = useState(false)

 // const[showCargandoRubros, setShowCargandoRubros]= useState(false)

 const {rubrosItem1,setItemRubro1} = useRubroContext1 () 
 const {rubrosItem2,setItemRubro2} = useRubroContext2 ()

 console.log("rubro 1: "+rubrosItem1?.rubro)
 console.log("rubro 2: "+rubrosItem2?.rubro)


  if (agregarOtroRubro){

    return(<CompletarRubros
        email={props.email}  clientType={props.tipoProveedor} setIsReg={props.setIsReg} />);

  }else{
    if (verRubro==""){

      
        return( <> 
          <div style={{display:"flex",flexDirection:"column", width:"100%", height:"100vh", textAlign:"center"}}>
              <div style={{display:"flex",flexDirection:"column", width:"100%",  height:"auto"}}>
                <div id="modalProveedor-flechaVolver">
                  <IonIcon icon={arrowBack} onClick={() => props.setRubros(false)} slot="start" id="flecha-volver">  </IonIcon>
                  <IonIcon icon={close} onClick={() => props.onClose(null)} slot="end" id="flecha-cerrar">  </IonIcon>
                </div>
                  <h1 style={{marginTop:"25px"}}>MIS RUBROS CARGADOS</h1>
              </div>
    
                <Rubritos setAgregarOtroRubro={setAgregarOtroRubro} verRubros={setVerRubro}></Rubritos>
            
             
            </div> 
          </>)  

   
          
    }else{
    
        return(
          < div id="contenedorModalProveedor">
          <div id="modalProveedor-flechaVolver">
          <IonIcon icon={arrowBack} onClick={() => setVerRubro("")} slot="start" id="flecha-volver">  </IonIcon>
          </div>
          <CardItemVerRubro pedir={setHayRubros} rubro={verRubro} email={props.email} clientType={props.tipoProveedor} volver={setVerRubro} />
      </div>);

  }
  

}
}

const CardItemVerRubro= (props:{ pedir:any , rubro:any, clientType:any, email:any, volver:any}) => {

  const [modificarRubro,setModificarRubro]=useState("")

  const [datosListos,setDatosListos]=useState(false);
  const [showCargando, setShowCargando]=useState(true)
  const [showRubroEliminado, setShowRubroEliminado]=useState(false)

  const {rubrosItem1,setItemRubro1} = useRubroContext1 () 
  const {rubrosItem2,setItemRubro2} = useRubroContext2 ()
  
  
    const [item, setItem]= useState("")
    const radius = useRef("")
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

       if (rubrosItem1?.rubro==props.rubro){
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
                           setShowRubroEliminado(true)
                           props.pedir("pedir")
                           props.volver("")
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
                            setShowRubroEliminado(true)
                            props.pedir("pedir")
                            props.volver("")
                          }
                        })
                      }
                   })
              }
            }else if(res.data=="no ha sido posible eliminar el rubro"){
                  props.volver("")
              }else{
                  props.volver("")
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

  return (<ModificarDatosRubro 
    clientType={props.clientType} email={props.email}
    rubro={props.rubro} setVolver={setModificarRubro} 
    setDatosListos={setDatosListos} />)
}

  
}

const ModificarDatosRubro = (props:{clientType:any, email:any,rubro:any, setVolver:any, setDatosListos:any}) =>{

  //para volver props.setRubro("")

  const {rubrosItem1,setItemRubro1} = useRubroContext1 () 
  const {rubrosItem2,setItemRubro2} = useRubroContext2 ()

  const blobCertificado = useRef <Blob>()
  const blobFoto1 = useRef <Blob>()
  const blobFoto2 = useRef <Blob>()
  const blobFoto3 = useRef <Blob>()

  const [showModificandoRubro,setShowModificandoRubro]=useState(false)
  const [showAlertRubroModificado,setShowAlertRubroModificado]=useState(false)
  //const radio = useRef()

  const [item, setItem]= useState("")
     const radius = useRef("")
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
 
        if (rubrosItem1?.rubro==props.rubro){
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

  const modificar =()=>{

    let arreglo=new Array();

    setShowModificandoRubro(true) 

    var formDataToUpload = new FormData();
    formDataToUpload.append("tipo", String(props.clientType))
    formDataToUpload.append("email", props.email);

    formDataToUpload.append("item", item);
    arreglo.push(item)
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

        getItem("rubro1").then(res4 => {
              if(rubrosItem1?.rubro==res4){
                setItemRubro1!(
                  { 
                  rubro:item,
                  radius:radius.current,
                  description:description.current,
                  calificacion:0,
                  hace_orden_emergencia:rubrosItem1!.hace_orden_emergencia,
                  days_of_works:days_of_works.current,
                  hour_init: hour_init.current,
                  hour_end:hour_end.current,
                  certificate:certificate.current,
                  picture1:picture1.current,
                  picture2:picture2.current,
                  picture3:picture3.current,
                  pais:pais.current,
                  provincia:provincia.current,
                  ciudad:ciudad.current,
                  calle:calle.current,
                  numeracion:String(numeracion.current),
              })

              setShowModificandoRubro(false)
          }else{
            getItem("rubro2").then(res5 => {
              if(rubrosItem2?.rubro==res5){
                setItemRubro2!(
                  { 
                  rubro:item,
                  radius:radius.current,
                  description:description.current,
                  calificacion:0,
                  hace_orden_emergencia:rubrosItem1!.hace_orden_emergencia,
                  days_of_works:days_of_works.current,
                  hour_init: hour_init.current,
                  hour_end:hour_end.current,
                  certificate:certificate.current,
                  picture1:picture1.current,
                  picture2:picture2.current,
                  picture3:picture3.current,
                  pais:pais.current,
                  provincia:provincia.current,
                  ciudad:ciudad.current,
                  calle:calle.current,
                  numeracion:String(numeracion.current),
              })
              setShowModificandoRubro(false)
              setShowAlertRubroModificado(true)

          }else{
            setShowModificandoRubro(false)
          }
        })
          }
        })

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
          <IonCardTitle>{item}</IonCardTitle>
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
                              <IonDatetime value={hour_init.current} onIonChange={e => hour_init.current=(e.detail.value!)}></IonDatetime>
                          </IonItem>
                      </IonCol>
                  </IonRow>
                  <IonRow>
                      <IonCol className="columna">
                          <IonItem>
                              <IonLabel id="label">HORA DE FINALIZACIÓN DE TRABAJO DIARIO</IonLabel>
                              <IonDatetime value={hour_end.current} onIonChange={e => hour_end.current=(e.detail.value!)}></IonDatetime>
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
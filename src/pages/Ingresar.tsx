import { IonAlert, IonButton, IonButtons, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonLoading, IonMenu, IonMenuButton, IonPage, IonRouterOutlet, IonRow, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { render } from '@testing-library/react';
import React, { Component, useEffect, useRef, useState } from 'react';
import Menu from './Menu';
import './Ingresar.css';
import { arrowBack, person, push} from 'ionicons/icons';
import { setItem } from '../utilidades/Storage';
import { isPropertySignature, setSyntheticLeadingComments } from 'typescript';
import { Redirect, Route } from 'react-router';
import { forceUpdate } from 'ionicons/dist/types/stencil-public-runtime';
import Home from './HomeCliente';
import Https from '../utilidades/HttpsURL';

  //const url='http://127.0.0.1:8000/login/';
  //const url="https://callservicesvps.online:443/login/"

  //const url2='http://127.0.0.1:8000/';
  //const url2="https://callservicesvps.online:443/"

  //const url3='http://127.0.0.1:8000/completarinfo/';
  //const url3="https://callservicesvps.online:443/completarinfo/"

  const url=Https+"login/"
  const url2=Https
  const url3=Https+"completarinfo/"
  


  const Ingresar = (props:{setIsReg:any, setCliente:any, setEmail:any, setFoto:any, setTipoCliente:any,
    setNombre:any, setApellido:any, setCalificacion:any,
    setRubro1:any, setRubro2:any}) => {

    const [showAlertServerConnection, setShowAlertServerConnection] = useState(false);
    const [showAlertCompletarInfo,setShowAlertCompletarInfo] = useState(false)
    const [showAlertContraseñaCambiada, setShowAlertContraseñaCambiada]= useState(false)
    const [showAlertContraseñaNoIguales, setShowAlertContraseñaNoIguales]=useState(false)
    const [showAlertBadEmail,setShowAlertBadEmail]=useState(false)
    const [showAlertBadCode, setShowAlertBadCode]=useState(false)
    const [showAlertUsuarioContraseñaIncorrectos, setShowAlertUsuarioContraseñaIncorrectos]=useState(false)
  
    const [showLoading, setShowLoading]=useState(false)


  
    return (
      <IonPage>
       
        <IonContent fullscreen id="main-container-Ingresar">
        <div id="ingresarContenedorCentral">
        
          
        <div id="hero__title">
          
        <IngresarDatos setIsReg={props.setIsReg} setCliente={props.setCliente} 
              setEmail={props.setEmail} setFoto={props.setFoto} setTipoCliente={props.setTipoCliente} 
              setNombre={props.setNombre} setApellido={props.setApellido} setCalificacion={props.setCalificacion}
              setRubro1={props.setRubro1} setRubro2={props.setRubro2}
              setShowLoading={setShowLoading} setShowAlertUsuarioContraseñaIncorrectos={setShowAlertUsuarioContraseñaIncorrectos} setShowAlertCompletarInfo={setShowAlertCompletarInfo} setShowAlertServerConnection={setShowAlertServerConnection} setShowAlertContraseñaCambiada={setShowAlertContraseñaCambiada} setShowAlertContraseñaNoIguales={setShowAlertContraseñaNoIguales} setShowAlertBadEmail={setShowAlertBadEmail} setShowAlertBadCode={setShowAlertBadCode} ></IngresarDatos>
        </div>
        <div id="cube"></div>
        <div id="cube"></div>
        <div id="cube"></div>
        <div id="cube"></div>
        <div id="cube"></div>
        <div id="cube"></div>

          
        </div>

          <IonLoading
            cssClass='my-custom-class'
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            message={'Ingresando...'}
            duration={7000}
          />
  
          <IonAlert
                  isOpen={showAlertUsuarioContraseñaIncorrectos}
                  onDidDismiss={() => setShowAlertUsuarioContraseñaIncorrectos(false)}
                  cssClass='my-custom-class'
                  header={'Email y/o contraseña no válidos'}
                  subHeader={''}
                  message={'Ingrese usuario y contraseña válidos'}
                  buttons={['OK']}
                  />
  
          <IonAlert
                  isOpen={showAlertServerConnection}
                  onDidDismiss={() => setShowAlertServerConnection(false)}
                  cssClass='my-custom-class'
                  header={'Respuesta del servidor'}
                  subHeader={''}
                  message={'No ha sido posible comunicarse con el servidor. Intente más tarde'}
                  buttons={['OK']}
                  />
          <IonAlert
                  isOpen={showAlertCompletarInfo}
                  onDidDismiss={() => setShowAlertCompletarInfo(false)}
                  cssClass='my-custom-class'
                  header={'Complete los campos'}
                  subHeader={''}
                  message={'Completar campos usuario y contraseña'}
                  buttons={['OK']}
                  />
          <IonAlert
                  isOpen={showAlertContraseñaCambiada}
                  onDidDismiss={() => setShowAlertContraseñaCambiada(false)}
                  cssClass='my-custom-class'
                  header={'Cambio de contraseña'}
                  subHeader={''}
                  message={'La contraseña ha sido modificada correctamente'}
                  buttons={['OK']}
                  />
          <IonAlert
                  isOpen={showAlertContraseñaNoIguales}
                  onDidDismiss={() => setShowAlertContraseñaNoIguales(false)}
                  cssClass='my-custom-class'
                  header={'Contraseñas no iguales'}
                  subHeader={''}
                  message={'Discrepancia entre contraseñas ingresadas'}
                  buttons={['OK']}
                  />
          <IonAlert
                  isOpen={showAlertBadEmail}
                  onDidDismiss={() => setShowAlertBadEmail(false)}
                  cssClass='my-custom-class'
                  header={'No hay usuario registrado con ese e-mail'}
                  subHeader={''}
                  message={'Corrobore e ingrese e-mail correcto'}
                  buttons={['OK']}
                  />
          <IonAlert
                  isOpen={showAlertBadCode}
                  onDidDismiss={() => setShowAlertBadCode(false)}
                  cssClass='my-custom-class'
                  header={'Código ingresado incorrecto'}
                  subHeader={''}
                  message={'Ingrese el código que ha recibido en el e-mail'}
                  buttons={['OK']}
                  />                
  
        </IonContent>
      </IonPage>
    );
  };
  

  export const IngresarDatos = (props:{setIsReg:any, setCliente:any, 
    setEmail:any, setFoto:any, setTipoCliente:any, 
    setNombre:any, setApellido:any, setCalificacion:any,
    setRubro1:any, setRubro2:any,
    setShowLoading:any, setShowAlertUsuarioContraseñaIncorrectos:any,  setShowAlertServerConnection:any, setShowAlertCompletarInfo:any, setShowAlertContraseñaCambiada:any, setShowAlertContraseñaNoIguales:any, setShowAlertBadEmail:any, setShowAlertBadCode:any}) => {
  
    const axios = require('axios');
  
    const [home, setHome]=useState(false)
  
    const [restaurar, setRestaurar]=useState(0)
  
    const password = useRef(0)
    const email=useRef("")
    const tipoDeCliente=useRef("")

    if(home){
      props.setIsReg(true)

      props.setCliente(tipoDeCliente.current=="1"?true:false)
      props.setEmail(email.current)
      //return(<Redirect push={true} to="/home" />);
     
    }
  
    const validarRestauracion = () => {
      if(email.current.length>0){
        setRestaurar(3)
      }
      
    }


  const PedirPersonalInfo = ( tipoDeCliente:any)=>{

    //tipoDeCliente.current nos da undefined 
    axios.get(url2+"askpersonalinfo/"+tipoDeCliente.current+"/"+email.current, {timeout: 7000})
    .then((resp: { data: any; }) => {

      if(resp.data!="no ha cargado información personal"){
        
        if (tipoDeCliente!="3"){
          props.setNombre(resp.data[0].name)
          props.setApellido(resp.data[0].last_name)
          props.setCalificacion(resp.data[0].qualification)

          setItem("nombre",resp.data[0].name )
          setItem("apellido",resp.data[0].last_name )
          setItem("calificacion", resp.data[0].qualification)

                 
        }else{
         props.setNombre(resp.data[0].name)
         props.setApellido(resp.data[0].description)
         props.setCalificacion(resp.data[0].qualification)

         setItem("nombre",resp.data[0].name )
         setItem("apellido",resp.data[0].description)
         setItem("calificacion", resp.data[0].qualification)
        
        }                      
       }
    })
  }

      //////// Función pedir rubro/////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////
    const PedirRubros = (setRubro1:any, setRubro2:any, email:any, tipoDeCliente:any)=>{
      const axios = require('axios');
      axios.get(url3+"rubros/"+"pedir/"+tipoDeCliente.current+"/"+email.current)
      .then((res: { data: any; }) => {
        const resquest = res.data;
        if(resquest!="No usuario registrado"){
          if(resquest!="No hay rubros cargados"){
              /* Por aquí agregar */
              let arreglo=(resquest.split("-"));
              let cantidad=0
              for (let i in arreglo) {
                if (arreglo[i]!=""){
                  axios.get(url3+"pedirrubros/"+tipoDeCliente.current+"/"+email.current+"/"+arreglo[i])
                  .then((res: { data: any; }) => {
                    const resquest = res.data;
                    let array=new Array();
                    array.push(resquest[0].item)
                    array.push(resquest[0].radius)
                    array.push(resquest[0].description)
                    array.push(resquest[0].qualification)
                    array.push(resquest[3].pais) 
                    array.push(resquest[3].provincia) 
                    array.push(resquest[3].ciudad) 
                    array.push(resquest[3].calle) 
                    array.push(resquest[3].numeracion)
                    array.push(resquest[1].days_of_works)
                    array.push(resquest[1].hour_init)
                    array.push(resquest[1].hour_end)
                    array.push(resquest[2].certificate)
                    array.push(resquest[2].picture1)
                    array.push(resquest[2].picture2)
                    array.push(resquest[2].picture3)
                    
                    if(cantidad==0){
                      props.setRubro1(JSON.stringify(array))
                      setItem("rubro1", resquest[0].item).then(() =>{     
                        setItem("infoRubro1", JSON.stringify(array)).then(() =>{ 
                          cantidad++;
                        })
                      })
                    }else{
                      props.setRubro2(JSON.stringify(array))
                      setItem("rubro2", resquest[0].item).then(() =>{     
                        setItem("infoRubro2", JSON.stringify(array)).then(() =>{ 
                          
                        })
                      })
                    }
  
                  })
                
                }
              }
              setItem("rubroLoaded", true).then(() =>{
              })
          }
        }
      });
    }
  ///////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////

    const ingresar = () => {
      if((email.current!= null && email.current!= undefined && email.current!="")&& (password.current!=null && password.current!= undefined )){
  
        props.setShowLoading(true)
  
        axios.get(url+"ingresar/"+email.current+"/"+password.current, {timeout: 7000})
        .then((res: { data: any; }) => {
         // setIngresar(false);
          const resquest = res.data;
          
          if(resquest=="usuario y contraseña no válidos"){
            props.setShowLoading(false)
            props.setShowAlertUsuarioContraseñaIncorrectos(true)
          //  setIngresar(false)
          }
          else if(resquest[0].picture ==""){

            setItem("isRegistered", resquest[0].user).then(() =>{
                setItem("clientType", resquest[0].clientType).then(() =>{
                  tipoDeCliente.current=resquest[0].clientType
                  setItem("personalInfoCompleted",false).then(() =>{
                    props.setShowLoading(false)
                    props.setFoto(person)
                    props.setTipoCliente(resquest[0].clientType)
                    tipoDeCliente.current=resquest[0].clientType
                    //Pedir Rubros
                    if (resquest[0].clientType!="1"){
                      PedirRubros(props.setRubro1,props.setRubro2, email, tipoDeCliente)
                    }//Fin pedir Rubros
                    else{
                      props.setCalificacion(resquest[0].calificacion)
                    }

                    props.setNombre("")
                    props.setApellido("")
                    props.setCalificacion(0)


                    setHome(true)
                  })
                })
              
            });
            
  
          }
          else{
            setItem("isRegistered", email.current).then(() =>{
             
              setItem("fotoPersonal", resquest[0].picture).then(() =>{
                setItem("clientType", resquest[0].clientType).then(() =>{
                  tipoDeCliente.current=(resquest[0].clientType)
                  setItem("personalInfoCompleted",true).then(() =>{
                    props.setShowLoading(false)
                    
                    props.setTipoCliente(tipoDeCliente.current)
                    props.setFoto(resquest[0].picture)
                    
                    PedirPersonalInfo(tipoDeCliente)
                    if (tipoDeCliente.current!="1"){
                      PedirRubros(props.setRubro1,props.setRubro2, email, tipoDeCliente)
                    }

                    setHome(true)


                  })
                })
              })
            });
          }
        }).catch((err: any) => {
          // what now?
         props.setShowLoading(false)
          props.setShowAlertServerConnection(true)
         // setIngresar(false)
      })
      }else{
      //  setIngresar(false)
        props.setShowAlertCompletarInfo(true)
      }  
  
    }
    
      if(restaurar==0){
        return (
          <>
          <a href="/inicio/" id="flechaIngresar">
            <IonIcon icon={arrowBack} slot="icon-only" id="icono-volver-ingresar"></IonIcon>
          </a>
          
            <div id="contenedor_central_ingresar">
            <IonTitle id="ingresar-title">INICIAR SESIÓN</IonTitle>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonItem id="item-ingresar">
                      <IonLabel position="floating">Email</IonLabel>
                      <IonInput onIonInput={(e: any) => email.current=(e.target.value)}></IonInput>
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonItem id="item-ingresar">
                      <IonLabel position="floating">Contraseña</IonLabel>
                      <IonInput type="password" onIonInput={(e: any) => password.current=(e.target.value)}></IonInput>
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonButton shape="round" id="boton-ingresar" onClick={() => { ingresar(); } }>INGRESAR </IonButton>
                 </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
            <strong id="restaurar" onClick={() => setRestaurar(1)}>Restaurar contraseña</strong>
            </IonCol>
                </IonRow>
              </IonGrid>
  
  
            </div>
          </>
        )
      }else if(restaurar==1){
        return (
          <>
            <a onClick={()=>setRestaurar(0)} id="flechaIngresar">
              <IonIcon icon={arrowBack} slot="icon-only" id="icono-volver-ingresar"></IonIcon>
            </a>

            <div id="contenedor_central_ingresar">              
            <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonTitle id="ingresar-title">RESTAURAR CONTRASEÑA</IonTitle>
                  </IonCol>
                </IonRow>
                <IonRow><IonCol><IonTitle>Ingrese dirección de correo electrónico</IonTitle></IonCol></IonRow>
                <IonRow>
                  <IonCol>
                    <IonItem id="item-ingresar">
                      <IonLabel position="floating">Email</IonLabel>
                      <IonInput type="email" onIonInput={(e: any) => email.current=(e.target.value)}></IonInput>
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow><IonCol> <IonButton shape="round" id="boton-ingresar" onClick={() => { validarRestauracion(); } }>INGRESAR </IonButton></IonCol></IonRow>

              </IonGrid>
          </div>
           </>
        )
      }else{
        return(<Restaurar email={email.current} setRestaurar={setRestaurar} setShowAlertContraseñaCambiada={props.setShowAlertContraseñaCambiada} setShowAlertContraseñaNoIguales={props.setShowAlertContraseñaNoIguales} setShowAlertBadEmail={props.setShowAlertBadEmail} setShowAlertBadCode={props.setShowAlertBadCode} />)
      }      
  
  


}
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  const Restaurar = (props:{ email:any,setRestaurar:any ,setShowAlertContraseñaCambiada:any, setShowAlertContraseñaNoIguales:any, setShowAlertBadEmail:any, setShowAlertBadCode:any}) => {
  
    const [primero, setPrimero]=useState(true)
  
    const [codigo, setCodigo]=useState("")
    const [codigoRecibido, setCodigoRecibido]=useState("")
    const [validado, setValidado]=useState(false)
     
    const [password1, setPassword1]=useState("")
    const [password2, setPassword2]=useState("")
  
  
  
    const validarCodigo = ()=>{
  
      if(codigo==codigoRecibido){
        setValidado(true)
      }else{
        props.setShowAlertBadCode(true)
        setValidado(false)
      }
    
  
    }
  
    useEffect(() => {
  
        if(primero){
          const axios = require('axios');
  
          axios.get(url+"restaurar/codigo/"+props.email)
          .then((res: { data: any; }) => {
            const resquest = res.data;
            if (resquest!="usuario y email no registrado"){
              setCodigoRecibido(resquest)
              setPrimero(false)
            }
            else{
              props.setRestaurar(1)
              props.setShowAlertBadEmail(true)
  
            }
      
          })
  
  
        }
  
    }, []);
  
    const passwordRestaurado = ()=> {
      if(password1==password2){
        const axios = require('axios');
        axios.get(url+"restaurar/setpassword/"+props.email+"/"+codigo+"/"+password1)
          .then((res: { data: any; }) => {
            const resquest = res.data;
            if(resquest=="Contraseña cambiada correctamente"){
              props.setRestaurar(false)
              props.setShowAlertContraseñaCambiada(true)
              
  
            }else{
  
            }
            
          })
      }else{
        props.setShowAlertContraseñaNoIguales(true)
  
      }
    }
  
    if(!validado){
      return(
        <>
        <div id="contenedor_central_ingresar">              
          <IonGrid>
            
          <IonRow id="IngresarPrimerRow">
                <IonCol>

                <a onClick={()=>props.setRestaurar(1)} id="flechaIngresar">
                  <IonIcon icon={arrowBack} slot="icon-only" id="icono-volver-ingresar"></IonIcon>
                </a>
                </IonCol></IonRow>   
            
            <IonRow><IonCol>
            <IonTitle id="ingresar-title">RESTAURAR CONTRASEÑA</IonTitle>
            </IonCol></IonRow>
            <IonRow><IonCol>
            <p id="ptype">Se ha enviado al e-mail un código de validación para continuar</p>
            </IonCol></IonRow>
            <IonRow>
                <IonCol>
                  <IonItem id="item-ingresar">
                    <IonLabel position="floating">Ingrese código de validación</IonLabel>
                    <IonInput onIonInput={(e: any) => setCodigo(e.target.value)}></IonInput>
                  </IonItem>
                </IonCol>
              </IonRow>
  
              <IonRow><IonCol><IonButton shape="round" id="boton-ingresar" onClick={() => { validarCodigo(); } }>INGRESAR </IonButton> </IonCol> </IonRow>
          </IonGrid>
        </div>
  
         </>
      )
    }else{
      return(
        <>

          <div id="contenedor_central_ingresar">
          <IonTitle id="ingresar-title">RESTAURAR CONTRASEÑA</IonTitle>

            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonItem id="item-ingresar">
                    <IonLabel position="floating">Ingrese nueva contraseña</IonLabel>
                    <IonInput type="password" onIonInput={(e: any) => setPassword1(e.target.value)}></IonInput>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonItem id="item-ingresar">
                    <IonLabel position="floating">Repita la nueva contraseña</IonLabel>
                    <IonInput type="password" onIonInput={(e: any) => setPassword2(e.target.value)}></IonInput>
                  </IonItem>
                </IonCol>
              </IonRow>
  
              <IonRow><IonCol><IonButton shape="round" id="boton-ingresar" onClick={() => { passwordRestaurado(); } }>INGRESAR </IonButton> </IonCol> </IonRow>
            </IonGrid>
          </div></>
      );
    }
    
  }
  
  
  export default  Ingresar;
import { IonAlert, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonLoading, IonMenu, IonMenuButton, IonPage, IonRouterOutlet, IonRow, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { render } from '@testing-library/react';
import React, { Component, useEffect, useState } from 'react';
import './Registro.css';
import { arrowBack, push} from 'ionicons/icons';
import { BrowserRouter, Redirect, Route, Switch, useHistory } from 'react-router-dom';

import { useRef } from 'react';
import { type } from 'os';
import { useMemo } from 'react';
import Https from '../../utilidades/HttpsURL';
import { setItem } from '../../utilidades/Storage';


const url=Https+"registro/"


const Registro = (props:{setIsReg:any, setCliente:any, setTipoCliente:any ,setEmail:any }) => {

  const [showAlertUsuarioRegistrado, setShowAlertUsuarioRegistrado] = useState(false);
  const [showAlertPassworNoIgual, setShowAlertPassworNoIgual] = useState(false);
  const [showAlertPasswordWeak,setShowAlertPasswordWeak]=useState(false)
  const [showAlertServerConnection, setShowAlertServerConnection] = useState(false);
  const [showAlertEmailSending,setShowAlertEmailSending]=useState(false)

  return (
    <IonPage>
      
      <IonContent text-center >
        <div id="ionContentRegistro">
  
          <RegistroNuevaCuenta setIsReg={props.setIsReg} setCliente={props.setCliente} setTipoCliente={props.setTipoCliente} setEmail={props.setEmail} setShowAlertUsuarioRegistrado={setShowAlertUsuarioRegistrado} setShowAlertPassworNoIgual={setShowAlertPassworNoIgual} setShowAlertPasswordWeak={setShowAlertPasswordWeak} setShowAlertServerConnection={setShowAlertServerConnection} setShowAlertEmailSending={setShowAlertEmailSending} ></RegistroNuevaCuenta>
        
          <IonAlert mode='ios' isOpen={showAlertServerConnection} onDidDismiss={() => setShowAlertServerConnection(false)} cssClass='my-custom-class'
                  header={'Respuesta del servidor'}
                  subHeader={''}
                  message={'No ha sido posible comunicarse con el servidor. Intente más tarde'}
                  buttons={['OK']}
                  />
              
          <IonAlert
          mode='ios'
            isOpen={showAlertUsuarioRegistrado} onDidDismiss={() => setShowAlertUsuarioRegistrado(false)} cssClass='my-custom-class'
            header={'Usuario ya registrado'}
            subHeader={''}
            message={'Ya se ha registrado un usuario con el mismo email'}
            buttons={['OK']}/>   

          <IonAlert
          mode='ios'
           isOpen={showAlertPassworNoIgual} onDidDismiss={() => setShowAlertPassworNoIgual(false)} cssClass='my-custom-class'
            header={'Contraseña'}
            subHeader={''}
            message={'Las contraseñas no son iguales'}
            buttons={['OK']}/>  

          <IonAlert 
          mode='ios'
          isOpen={showAlertPasswordWeak} onDidDismiss={() => setShowAlertPasswordWeak(false)} cssClass='my-custom-class'
            header={'Contraseña'}
            subHeader={''}
            message={"La constraseña no cumple con los requisitos de poseer al menos 8 caracteres y poseer números y letras"}
            buttons={['OK']}/>  

          <IonLoading  isOpen={showAlertEmailSending}   onDidDismiss={() => setShowAlertEmailSending(false)}
            cssClass='my-custom-class'
            message={'Esperando respuesta del servidor...'}
            duration={10000}/>
      </div>
    </IonContent>
  </IonPage>
  );
};

const Boton = (props: { name: React.ReactNode, onClick: () => void}) => 
   (      <div id="registro_contenedor_central">

     <IonButton id="boton" shape="round" onClick={props.onClick}> 
      {props.name}
    </IonButton>
 </div>);


const RegistroNuevaCuenta= (props: {setIsReg:any, setCliente:any, setTipoCliente:any, setEmail:any, 
  setShowAlertUsuarioRegistrado: any; setShowAlertPassworNoIgual:any, setShowAlertPasswordWeak:any, 
  setShowAlertServerConnection:any, setShowAlertEmailSending:any}) => {

  const [tipo, setCount] = useState <string>("registro inicio")

  const email = useRef("")
  const password = useRef("")
  const password2 = useRef("")

  const codigo = useRef(0)
  const codigo_agregado= useRef(1)

  const tipoUsuario=useRef("");

  const [alertCuentaUsuario,setShowAlertCuentaUsuario]=useState(false)
  const mensajeCuentaUsuario="Al registrarse con una cuenta de usuario podrá ver proveedores de servicio en su zona y realizar pedidos de trabajo mediante un sistema de tickets donde podrá realizar seguimiento sobre los mismos"
  
  const [alertCuentaProveedor,setShowAlertCuentaProveedor]=useState(false)
  const mensajeCuentaProveedor="Al registrarse con una cuenta de proveedor podrá ofrecer sus servicios seleccionando rubros en los cuales domina los conocimientos requeridos para llevar a cabo los trabajos mediante certificaciones que los acrediten"

  const enviarRegistro = () =>{

    if (password.current!=password2.current){
      props.setShowAlertPassworNoIgual(true)
    }else if(password.current.length<=8){
      props.setShowAlertPasswordWeak(true)
    }else{
      props.setShowAlertEmailSending(true)

      const axios = require('axios');
      axios.get(url+tipoUsuario.current+"/"+email.current+"/"+password.current).then((res: { data: any; }) => {
        const resquest = res.data;
        if(resquest==="User alredy taken"){
          props.setShowAlertUsuarioRegistrado(true);
          props.setShowAlertEmailSending(false)
        }else{
            /*Se guarda que el usuario se registró*/
            setItem("isRegistered", email.current).then( () => {
              setItem("personalInfoCompleted", false).then( () =>{
                setItem("clientType", tipoUsuario.current).then(() => {
                 // setCodigo(resquest)
                 codigo.current=resquest
                  setCount("validacion email") 
                  props.setShowAlertEmailSending(false)
                }

                )
              })
            })
        }
      }).catch((err: any) => {
        // what now?
        props.setShowAlertServerConnection(true)
        props.setShowAlertEmailSending(false)

    })
    }
    
  }

  const completarRegistro =()=>{

    if(codigo.current==codigo_agregado.current){
      props.setEmail(email.current)
      setCount("registro completo");
    }else{
      setCount("validacion erronea");
    }
  }

  if (tipo=="registro inicio"){
    return (
      <>
          <IonAlert
          mode='ios'
            isOpen={alertCuentaUsuario}
            onDidDismiss={() => setShowAlertCuentaUsuario(false)}
            cssClass='my-custom-class'
            header={'CUENTA DE USUARIO'}
            message={mensajeCuentaUsuario}
            buttons={[
              {
                text: 'CANCELAR',
                role: 'cancel',
                cssClass: 'secondary',
                handler: blah => {
                  setShowAlertCuentaUsuario(false);
                }
              },
              {
                text: 'CREAR CUENTA DE USUARIO',
                handler: () => {
                  setCount("cuenta usuario");
                }
              }
            ]} />

          <IonAlert
          mode='ios'
            isOpen={alertCuentaProveedor}
            onDidDismiss={() => setShowAlertCuentaProveedor(false)}
            cssClass='my-custom-class'
            header={'CUENTA DE PROVEEDOR DE SERVICIO'}
            message={mensajeCuentaProveedor}
            buttons={[
              {
                text: 'CANCELAR',
                role: 'cancel',
                cssClass: 'secondary',
                handler: blah => {
                  setShowAlertCuentaProveedor(false);
                }
              },
              {
                text: 'CREAR CUENTA DE PROVEEDOR',
                handler: () => {
                  setCount("cuenta proveedor");
                  
                }
              }
            ]} />


      <div id="contenedorPrincipalRegistro">
        <header id="headerRegistro">
          <a href={"/"} id="flechaIngresar">
            <IonIcon icon={arrowBack}  slot="icon-only" id="flecha-volver-registro">  </IonIcon>
          </a>
          <IonTitle id="register-title">SELECCIONE TIPO DE CUENTA</IonTitle>

        </header>

        <div id="contenedorCentralRegistro">

          <IonButton shape="round" onClick={() => { setShowAlertCuentaUsuario(true); } } id="boton-registro"> Nueva cuenta de usuario</IonButton>
          <IonButton shape="round" onClick={() => { setShowAlertCuentaProveedor(true); } } id="boton-registro">Nueva cuenta de servicio</IonButton>
        </div>
        <footer id="footerRegistro">
        </footer>
      </div> 

      
        </>
    );
  }
  if(tipo=="cuenta usuario"){
    /*
    Nueva cuenta de usuario
    */
   tipoUsuario.current="1";

   return (

    <>
      <a onClick={()=>setCount("registro inicio")} id="flechaIngresar">
        <IonIcon icon={arrowBack}  slot="icon-only" id="flecha-volver-registro">  </IonIcon>
      </a>
      <div id="registro_header">    
        <IonGrid id="registro-iongrid">
          <IonRow>
            <IonCol>
              <IonTitle id="register-title">COMPLETE SUS DATOS</IonTitle>
            </IonCol>
          </IonRow>
        </IonGrid>
      </div>
      <div id="registro_contenedor_central">
        <IonGrid>
          <IonRow>
            <IonCol>
               <IonItem id="item-registro">
                  <IonLabel position="floating">E-mail</IonLabel>
                  <IonInput autocomplete="email" type="email" onIonInput={(e: any) => email.current = e.target.value}></IonInput>
                </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem id="item-registro">
                <IonLabel position="floating">Contraseña</IonLabel>
                <IonInput type="password" onIonInput={(e: any) => password.current = (e.target.value)}></IonInput>
             </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem id="item-registro">
                <IonLabel position="floating">Repita la Contraseña</IonLabel>
                <IonInput type="password" id="contraseña2" onIonInput={(e: any) => password2.current = (e.target.value)}></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow></IonRow>
          <IonRow></IonRow>
        </IonGrid>
         
        <IonButton id="boton" shape="round" onClick={enviarRegistro}>CONTINUAR</IonButton>
      </div>
    </>
      
    );
  }
  if (tipo=="cuenta proveedor"){
    /*cuenta proveedor
      Seleccionar si es proveedor de servicio independiente o empresa
    */
    return (
         
    <div id="contenedorPrincipalRegistro">
      <header id="headerRegistro">
        <IonIcon icon={arrowBack}  slot="icon-only" id="flecha-volver-registro" onClick={()=>setCount("registro inicio")}>  </IonIcon>
        <IonTitle id="register-title">SELECCIONE TIPO DE PROVEEDOR DE SERVICIO</IonTitle>      
      </header>

      <div id="contenedorCentralRegistro">
        <IonButton shape="round" onClick={() => { setCount("proveedor independiente"); } } id="boton-registro-2">Proveedor independiente</IonButton>
        <IonButton shape="round" onClick={() => { setCount("proveedor empresa"); } } id="boton-registro-2">Empresa de servicio</IonButton>
      </div>

      <footer id="footerRegistro">
      </footer>
    </div> 
      
    );
  }
  if(tipo=="proveedor independiente"){
    /*
    Si es proveedor de servicio independiente
    */
   tipoUsuario.current="2";
   return (
    <>
      <a onClick={()=>setCount("cuenta proveedor")} id="flechaIngresar">
        <IonIcon icon={arrowBack}  slot="icon-only" id="flecha-volver-registro">  </IonIcon>
      </a>
      <div id="registro_header">
        <IonGrid id="registro-iongrid">
          <IonRow><IonCol>
            <IonTitle id="register-title">COMPLETE SUS DATOS</IonTitle>
          </IonCol></IonRow>
        </IonGrid>
      </div>
        <div id="registro_contenedor_central">
          <IonGrid>
            <IonRow><IonCol>
              <IonItem id="item-registro">
                <IonLabel position="floating">E-mail</IonLabel>
                <IonInput autocomplete="email" type="email" onIonInput={(e: any) => email.current = (e.target.value)}></IonInput>
              </IonItem>
            </IonCol></IonRow>

            <IonRow><IonCol>
              <IonItem id="item-registro">
                <IonLabel position="floating">Contraseña</IonLabel>
                <IonInput type="password" onIonInput={(e: any) => password.current = (e.target.value)}></IonInput>
              </IonItem>
            </IonCol></IonRow>

            <IonRow><IonCol>
              <IonItem id="item-registro">
                <IonLabel position="floating">Repita la Contraseña</IonLabel>
                <IonInput type="password" id="contraseña2" onIonInput={(e: any) => password2.current = (e.target.value)}></IonInput>
              </IonItem>
            </IonCol></IonRow>
            <IonRow></IonRow>
            <IonRow><IonCol>
            </IonCol></IonRow>

          </IonGrid>
          <IonButton id="boton" shape="round" onClick={enviarRegistro}>
            CONTINUAR
          </IonButton>
        </div>
      </>        
    );
  }
  if (tipo=="proveedor empresa"){
    /*
    Si es empresa
    */
   tipoUsuario.current="3";
    return (
      <>
      <a onClick={()=>setCount("cuenta proveedor")} id="flechaIngresar">
      <IonIcon icon={arrowBack}  slot="icon-only" id="flecha-volver-registro">  </IonIcon>
     </a>
      <div id="registro_header">
        <IonGrid id="registro-iongrid">
          <IonRow><IonCol>
            <IonTitle id="register-title">COMPLETE SUS DATOS</IonTitle>
          </IonCol></IonRow>
        </IonGrid>
      </div>
      <div id="registro_contenedor_central">
          <IonGrid>
            <IonRow><IonCol>
              <IonItem id="item-registro">
                <IonLabel position="floating">E-mail</IonLabel>
                <IonInput autocomplete="email" type="email" onIonInput={(e: any) => email.current = (e.target.value)}></IonInput>
              </IonItem>
            </IonCol></IonRow>

            <IonRow><IonCol>
              <IonItem id="item-registro">
                <IonLabel position="floating">Contraseña</IonLabel>
                <IonInput type="password" onIonInput={(e: any) => password.current = (e.target.value)}></IonInput>
              </IonItem>
            </IonCol></IonRow>

            <IonRow><IonCol>
              <IonItem id="item-registro">
                <IonLabel position="floating">Repita la Contraseña</IonLabel>
                <IonInput type="password" id="contraseña2" onIonInput={(e: any) => password2.current = (e.target.value)}></IonInput>
              </IonItem>
            </IonCol></IonRow>

            <IonRow></IonRow>
            <IonRow><IonCol>
            </IonCol></IonRow>

          </IonGrid>
          <IonButton id="boton" shape="round" onClick={enviarRegistro}>
            CONTINUAR
          </IonButton>
        </div></>        
      );
  }

  if(tipo=="validacion email"){
    /*
    Corroboración de email
    */
    return (

      <div id="contenedorPrincipalRegistro">
      <header id="headerRegistro">
        <IonTitle id="register-title">VALIDACIÓN VÍA EMAIL</IonTitle>
        <IonTitle id="register-title2">SE HA ENVIADO AL E-MAIL CÓDIGO PARA VALIDACIÓN</IonTitle> 
      </header>

      <div id="contenedorCentralRegistro">
        <IonItem id="item-registro-validacion">
          <IonLabel position="floating">Código de validación</IonLabel>
          <IonInput mode='ios' value="" onIonInput={(e: any) => codigo_agregado.current = (e.target.value)}></IonInput>
        </IonItem>
      </div>

      <footer id="footerRegistro">
        <Boton name="Continuar" onClick={completarRegistro}></Boton>
      </footer>
    </div> 
     
    );
  }
  if(tipo=="registro completo"){
    
    props.setCliente(tipoUsuario.current=="1"?true:false)
    
    props.setTipoCliente(tipoUsuario.current)
    props.setEmail(email.current)

    return(
    <><Redirect push={true} to="/Completarinfo"  />
        <IonAlert
        mode='ios'
          isOpen={alertCuentaProveedor}
          onDidDismiss={() => setShowAlertCuentaProveedor(false)}
          cssClass='my-custom-class'
          header={'REGISTRO DE CREDENCIALES FINALIZADO'}
          message={"Debe completar la información personal de usuario"}
          buttons={[
            {
              text: 'CONTINUAR',
              handler: () => {
                //props.setCliente(tipoUsuario=="1"?true:false)
                props.setTipoCliente(tipoUsuario.current) 

              }
            }
          ]} /></>
    );
  
  }
  else{
    return (
     
      <div id="contenedorPrincipalRegistro">
      <header id="headerRegistro">
        <IonTitle id="register-title">VALIDACIÓN VÍA EMAIL</IonTitle>
        <IonTitle id="register-title2">SE HA ENVIADO AL E-MAIL CÓDIGO PARA VALIDACIÓN</IonTitle> 
        <IonTitle id="register-title2">Código erroneo, Vuelva a verificar!</IonTitle> 
      </header>

      <div id="contenedorCentralRegistro">
        <IonItem id="item-registro-validacion">
          <IonLabel position="floating">Código de validación</IonLabel>
          <IonInput mode='ios' value="" onIonInput={(e: any) => codigo_agregado.current = (e.target.value)}></IonInput>
        </IonItem>
      </div>

      <footer id="footerRegistro">
      <Boton name="Continuar" onClick={completarRegistro}></Boton>
      </footer>
    </div> 
     

    );
  }
}


export default Registro;




/*
tipo=0 
	muestra selección usuario o proveedor de servicio
tipo=1
	nueva cuenta de usuario
tipo=2
	muestra selección proveedor de servicio independiente o empresa
tipo=3
	nuevo proveedor de servicio independiente
tipo=4
	nueva empresa
tipo=5
	corroboración de email
tipo=6 o else
	mala corroboración de email
	
*/
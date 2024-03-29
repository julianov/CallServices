import { render } from '@testing-library/react';
import React, { Component, useContext, useEffect, useRef, useState } from 'react';
import Menu from '../../components/Menu/Menu';
import './Ingresar.css';
import { arrowBack, person, push} from 'ionicons/icons';
import { setItem } from '../../utilidades/Storage';
import { isPropertySignature, setSyntheticLeadingComments } from 'typescript';
import { Redirect, Route } from 'react-router';
import { forceUpdate } from 'ionicons/dist/types/stencil-public-runtime';
import Https from '../../utilidades/HttpsURL';
import { itemRubro, usuario } from '../../Interfaces/interfaces';
import { UserContext } from '../../Contexts/UserContext';
import { IonAlert, IonButton, IonButtons, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonLoading, IonMenu, IonMenuButton, IonPage, IonRouterOutlet, IonRow, IonSearchbar, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { RubroContext1, RubroContext2 } from '../../Contexts/RubroContext';


  const url=Https+"login/"
  const url2=Https
  const url3=Https+"completarinfo/"
  

  const Ingresar = (props:{setIsReg:any, setCliente:any}) => {

    const [showAlertServerConnection, setShowAlertServerConnection] = useState(false);
    const [showAlertCompletarInfo,setShowAlertCompletarInfo] = useState(false)
    const [showAlertContraseñaCambiada, setShowAlertContraseñaCambiada]= useState(false)
    const [showAlertContraseñaNoIguales, setShowAlertContraseñaNoIguales]=useState(false)
    const [showAlertBadEmail,setShowAlertBadEmail]=useState(false)
    const [showAlertBadCode, setShowAlertBadCode]=useState(false)
    const [showAlertUsuarioContraseñaIncorrectos, setShowAlertUsuarioContraseñaIncorrectos]=useState(false)
  
    const [showLoading, setShowLoading]=useState(false)

    const  {user,setUser}  = useContext(UserContext)

  
    return (
      <IonPage>
       
        <IonContent fullscreen id="main-container-Ingresar">

        <div id="ingresarContenedorCentral">
          <div id="hero__title">
            <IngresarDatos setIsReg={props.setIsReg} setCliente={props.setCliente} setShowLoading={setShowLoading} setShowAlertUsuarioContraseñaIncorrectos={setShowAlertUsuarioContraseñaIncorrectos} setShowAlertCompletarInfo={setShowAlertCompletarInfo} setShowAlertServerConnection={setShowAlertServerConnection} setShowAlertContraseñaCambiada={setShowAlertContraseñaCambiada} setShowAlertContraseñaNoIguales={setShowAlertContraseñaNoIguales} setShowAlertBadEmail={setShowAlertBadEmail} setShowAlertBadCode={setShowAlertBadCode} ></IngresarDatos>
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
            mode='ios'
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
                  mode="ios"
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
                  mode="ios"
                  message={'Completar campos usuario y contraseña'}
                  buttons={['OK']}
                  />
          <IonAlert
                  isOpen={showAlertContraseñaCambiada}
                  onDidDismiss={() => setShowAlertContraseñaCambiada(false)}
                  cssClass='my-custom-class'
                  header={'Cambio de contraseña'}
                  subHeader={''}
                  mode="ios"
                  message={'La contraseña ha sido modificada correctamente'}
                  buttons={['OK']}
                  />
          <IonAlert
                  isOpen={showAlertContraseñaNoIguales}
                  onDidDismiss={() => setShowAlertContraseñaNoIguales(false)}
                  cssClass='my-custom-class'
                  header={'Contraseñas diferentes'}
                  subHeader={''}
                  mode="ios"
                  message={'Discrepancia entre contraseñas ingresadas'}
                  buttons={['OK']}
                  />
          <IonAlert
                  isOpen={showAlertBadEmail}
                  onDidDismiss={() => setShowAlertBadEmail(false)}
                  cssClass='my-custom-class'
                  header={'No hay usuario registrado con ese e-mail'}
                  subHeader={''}
                  mode="ios"
                  message={'Corrobore e ingrese e-mail correcto'}
                  buttons={['OK']}
                  />
          <IonAlert
                  isOpen={showAlertBadCode}
                  onDidDismiss={() => setShowAlertBadCode(false)}
                  cssClass='my-custom-class'
                  header={'Código ingresado incorrecto'}
                  subHeader={''}
                  mode="ios"
                  message={'Ingrese el código que ha recibido en el e-mail'}
                  buttons={['OK']}
                  />                
  
        </IonContent>
      </IonPage>
    );
  };
  

  export const IngresarDatos = (props:{setIsReg:any, setCliente:any, 
    setShowLoading:any, setShowAlertUsuarioContraseñaIncorrectos:any,  setShowAlertServerConnection:any, setShowAlertCompletarInfo:any, setShowAlertContraseñaCambiada:any, setShowAlertContraseñaNoIguales:any, setShowAlertBadEmail:any, setShowAlertBadCode:any}) => {
  
    const axios = require('axios');
    const [home, setHome]=useState(false)
    const [restaurar, setRestaurar]=useState(0)
    const password = useRef(0)
    const email=useRef("")
    const tipoDeCliente=useRef("")
    const  {user,setUser}  = useContext(UserContext)
    const {rubrosItem1,setItemRubro1} = useContext (RubroContext1) 
    const {rubrosItem2,setItemRubro2} = useContext (RubroContext2) 
    const router = useIonRouter();

    if(home){

      props.setIsReg(true)
      props.setCliente(tipoDeCliente.current=="1"?true:false)
      setUser!((state:usuario) => ({ ...state, email: email.current }))
     
    }
  
    const validarRestauracion = () => {

      if(email.current.length>0){
        setRestaurar(3)
      }
      
    }


  const PedirPersonalInfo = ( tipoDeCliente:any)=>{

    axios.get(url2+"askpersonalinfo/"+tipoDeCliente.current+"/"+email.current, {timeout: 10000})
    .then((resp: { data: any; }) => {

      if(resp.data!="no ha cargado información personal"){
        
        if (tipoDeCliente!="3"){
         
          setUser!((state:usuario) => ({ ...state, nombre: resp.data[0].name }))
          setUser!((state:usuario) => ({ ...state, apellido: resp.data[0].last_name }))
          setUser!((state:usuario) => ({ ...state, calificacion: resp.data[0].qualification }))
          setUser!((state:usuario) => ({ ...state, email: email.current }))

          setItem("nombre",resp.data[0].name )
          setItem("apellido",resp.data[0].last_name )
          setItem("calificacion", resp.data[0].qualification)

                 
        }else{
       
         setItem("nombre",resp.data[0].name )
         setItem("apellido",resp.data[0].description)
         setItem("calificacion", resp.data[0].qualification)

         setUser!((state:usuario) => ({ ...state, nombre: resp.data[0].name }))
         setUser!((state:usuario) => ({ ...state, apellido: resp.data[0].last_name }))
         setUser!((state:usuario) => ({ ...state, calificacion: resp.data[0].qualification }))
         setUser!((state:usuario) => ({ ...state, email: email.current }))

        }                      
       }
    })
  }



      //////// Función pedir rubro/////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////
    const PedirRubros = (email:any, tipoDeCliente:any)=>{
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
                    const resquest = (res.data);

                    if(resquest!=undefined){

                     if (cantidad==0){

                      setItemRubro1!( {rubro:resquest.rubro,
                        radius:resquest.radius,
                        description:resquest.description,
                        hace_orden_emergencia:"nop",
                        calificacion:Number(resquest.calificacion),
                        pais:resquest.pais,
                        provincia:resquest.provincia,
                        ciudad:resquest.ciudad,
                        calle:resquest.calle,
                        numeracion:resquest.numeracion,
                        days_of_works:resquest.days_of_works,
                        hour_init:resquest.hour_init,
                        hour_end:resquest.hour_end,
                        certificate:resquest.certificate,
                        picture1:resquest.picture1,
                        picture2:resquest.picture2,
                        picture3:resquest.picture3
                      })
                    
                     }else{
                      setItemRubro2!( {rubro:resquest.rubro,
                        radius:resquest.radius,
                        description:resquest.description,
                        hace_orden_emergencia:"nop",
                        calificacion:Number(resquest.calificacion),
                        pais:resquest.pais,
                        provincia:resquest.provincia,
                        ciudad:resquest.ciudad,
                        calle:resquest.calle,
                        numeracion:resquest.numeracion,
                        days_of_works:resquest.days_of_works,
                        hour_init:resquest.hour_init,
                        hour_end:resquest.hour_end,
                        certificate:resquest.certificate,
                        picture1:resquest.picture1,
                        picture2:resquest.picture2,
                        picture3:resquest.picture3
                      })
                     }
                      
                      if(cantidad==0){
                        setItem("rubro1", resquest.rubro).then(() =>{     
                        })
                        setItem("infoRubro1",JSON.stringify(resquest)).then(() =>{ 
                          cantidad++;
                        })
                        
                      }else{
                        setItem("rubro2", resquest.rubro).then(() =>{     
                          setItem("infoRubro2", JSON.stringify(resquest)).then(() =>{ 
                          })
                        })
                      }
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

  const ingresar = async () => {

    if ( email.current != null &&  email.current != undefined &&  email.current !== "" &&  password.current != null &&  password.current != undefined  ) {
      
      props.setShowLoading(true);
  
      try {
        const res = await axios.get(
          url + "ingresar/" + email.current + "/" + password.current,
          { timeout: 10000 }
        );
        const resquest = res.data;
  
        if (resquest === "user or password incorrect") {
          //credenciales incorrectas
          props.setShowLoading(false);
          props.setShowAlertUsuarioContraseñaIncorrectos(true);

        } else if (resquest[0].personalDataCompleted === "false") {
          
          //el usuario no completó su información personal. 
          
          setUser!((state) => ({...state,  email: email.current, tipoCliente: resquest[0].clientType, }));
          
          await setItem("email", email.current)
          await setItem("clientType", resquest[0].clientType)
  
          router.push("/Completarinfo", "forward", "push");

        } else if (resquest[0].picture === "") {

          //no se cargó la foto personal 

          await setItem("email", resquest[0].user);
          await setItem("clientType", resquest[0].clientType);
          await setItem("personalInfoCompleted", false);
  
          setUser!((state: usuario) => ({ ...state, foto: person }));
          setUser!((state: usuario) => ({ ...state, tipoCliente: resquest[0].clientType })); 
          setUser!((state: usuario) => ({ ...state, nombre: "" }));
          setUser!((state: usuario) => ({ ...state, apellido: "" }));
          setUser!((state: usuario) => ({ ...state, calificacion: 0 }));

          //esto lo hacemos para saber a donde redirigir
          tipoDeCliente.current=resquest[0].clientType

          //si es proveedor pedimos los rubros
          if (resquest[0].clientType !== "1") {
            await PedirRubros(email, tipoDeCliente);
          } 

          props.setShowLoading(false);

          setHome(true);
        } else {

          //si todo es correcto. 

          await setItem("email", email.current);
          await setItem("fotoPersonal", resquest[0].picture);
          await setItem("clientType", resquest[0].clientType);
          await setItem("personalInfoCompleted", true);
  
          setUser!((state: usuario) => ({ ...state, foto: resquest[0].picture }));
          setUser!((state: usuario) => ({ ...state, tipoCliente: resquest[0].clientType }));
  
          //esto lo hacemos para saber a donde redirigir
          tipoDeCliente.current=resquest[0].clientType
          
          //pedimos la información personal.
          await PedirPersonalInfo(tipoDeCliente);

          //si es proveedor pedimos la información de los rubros.
          if (resquest[0].clientType !== "1") {
            await PedirRubros(email, tipoDeCliente);
          }
  
          setHome(true);
        }
      } catch (err) {
        props.setShowLoading(false);
        props.setShowAlertServerConnection(true);
      }
    } else {
      props.setShowAlertCompletarInfo(true);
    }
  };
    
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
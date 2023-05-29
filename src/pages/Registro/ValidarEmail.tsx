import { IonAlert, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonLoading, IonMenu, IonMenuButton, IonPage, IonRouterOutlet, IonRow, IonSearchbar, IonTitle, IonToolbar, useIonRouter, useIonViewDidEnter } from '@ionic/react';
import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import Https from '../../utilidades/HttpsURL';
import { getItem, setItem } from '../../utilidades/Storage';
import { UserContext } from '../../Contexts/UserContext';

const url=Https+"registro/"


const ValidarEmail = (props:{setIsReg:any, setCliente:any, setTipoCliente:any ,setEmail:any }) => {


    const  {user,setUser}  = useContext(UserContext)

    const [email, setEmail] = useState("") 
    const [tipoCliente, setTipoCliente ] = useState("")

    const codigo = useRef(0)
    const codigo_agregado= useRef("")
    
    const [tipo, setCount] = useState <string>("registro inicio")
    const [alertCuentaProveedor,setShowAlertCuentaProveedor]=useState(false)
    const [showAlertServerConnection, setShowAlertServerConnection] = useState(false);
    const [showAlertEmailSending,setShowAlertEmailSending]=useState(false)

    const router = useIonRouter();

  const simpleNavigate = () => {
		
		router.push("/Completarinfo", "forward", "push");
   // window.location.reload();
    
	}


    useEffect(() => {

        console.log("el user email es: "+user!.email)
        console.log("el user client type es: "+user!.tipoCliente)

        if(user!.email==""){
            getItem("isRegistered").then(res =>{
                setEmail(res)
                console.log("el email en el guardado: : "+res)

            })
        }else{
            setEmail(user!.email)
        }
       
        
       // setTipoCliente(user!.tipoCliente)
}, []);


  const completarRegistro =()=>{


    var formDataToUpload = new FormData();
    formDataToUpload.append("codigo",codigo_agregado.current )
    formDataToUpload.append("email",email )

    axios({
      url:url+"verificacion/email",
      method:'POST',
      headers: {"content-type": "multipart/form-data"},
      data:formDataToUpload
      }).then((res: { data: any; }) => {
      const resquest = res.data;
      console.log(resquest)
      if(resquest==="email confirmed"){

        setItem("isRegistered", email).then( () => {
          setItem("personalInfoCompleted", false).then( () =>{
              setCount("registro completo");
              simpleNavigate()
           
          })
        })

      
        
      }else{
    
        setCount("validacion erronea");

      }
    }).catch((err: any) => {
      // what now?
      setShowAlertServerConnection(true)
      setShowAlertEmailSending(false)

  })

 
  }

  if (tipo == "registro inicio"){
    return (


        <><div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100vh" }}>

            <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100px" }}>
                <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: "1.2em", color: "black", marginTop: "35px" }}>VALIDACIÓN VÍA EMAIL</h2>
                    <h2 style={{ fontSize: "1.2em", color: "black" }}>SE HA ENVIADO AL E-MAIL CÓDIGO PARA VALIDACIÓN</h2>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                <IonItem id="item-registro-validacion">
                    <IonLabel position="floating">Código de validación</IonLabel>
                    <IonInput mode='ios' value="" onIonInput={(e: any) => codigo_agregado.current = (e.target.value)}></IonInput>
                </IonItem>
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", height: "100px" }}>
                <IonButton shape="round" onClick={completarRegistro} style={{ margin: "0px 0px 30px 0px", width: "90%" }}>CONTINUAR</IonButton>

            </div>
        </div><IonAlert mode='ios' isOpen={showAlertServerConnection} onDidDismiss={() => setShowAlertServerConnection(false)} cssClass='my-custom-class'
            header={'Respuesta del servidor'}
            subHeader={''}
            message={'No ha sido posible comunicarse con el servidor. Intente más tarde'}
            buttons={['OK']} /></>
      );
  }


  if(tipo=="registro completo"){
    
    return(
    <> 
    <div style={{ display: "flex", flexDirection: "column", justifyContent:"center", alignItems:"center", width: "100%", height: "100vh" }}>

    <p style={{fontSize:"1em", color:"black"}}>EMAIL VALIDADO</p>

    </div>
          
    </>
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

const Boton = (props: { name: React.ReactNode, onClick: () => void}) => 
   (      <div id="registro_contenedor_central">

     <IonButton id="boton" shape="round" onClick={props.onClick}> 
      {props.name}
    </IonButton>
 </div>);

export default  ValidarEmail;
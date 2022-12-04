import { IonAlert, IonButton, IonButtons, IonCard, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonListHeader, IonLoading, IonMenu, IonMenuButton, IonPage, IonRouterOutlet, IonRow, IonSearchbar, IonTitle, IonToolbar, useIonRouter, useIonViewDidEnter } from '@ionic/react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useUserContext } from '../../Contexts/UserContext';
import Https from '../../utilidades/HttpsURL';
import { getItem, setItem } from '../../utilidades/Storage';

const url=Https+"registro/"


const ValidarEmail = (props:{setIsReg:any, setCliente:any, setTipoCliente:any ,setEmail:any }) => {


    const  {user,setUser}  = useUserContext()

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
    window.location.reload();
    
	}


    useEffect(() => {

        
        if(user!.email==""){
            getItem("isRegistered").then(res =>{
                setEmail(res)
    
            })
        }else{
            setEmail(user!.email)
        }
       
        
        setTipoCliente(user!.tipoCliente)
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
            setItem("clientType", user!.tipoCliente).then(() => {
              setCount("registro completo");
              simpleNavigate()
            }

            )
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


        <><div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100vh",background: "#f3f2ef" }}>

            <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100px" }}>
               
            </div>

            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
              <IonCard style={{display:"flex",flexDirection:"column",width:"90%", height:"auto", paddingBottom:"20px"}}>
                <div style={{display:"flex", flexDirection:"column",textAlign:"left",alignItems:"left",width:"100%", height:"auto", paddingLeft:"15px"}}>
                  <h2 style={{textAlign:"left", fontSize:"1em", color:"black", margin:"15px 0 10px 0"}} >VALIDACIÓN VÍA EMAIL</h2>    
                  <IonItemDivider style={{margin:"0px 0 10px 0"}}/>
                </div>
                <h2 style={{ fontSize: "1.2em", color: "black" }}>SE HA ENVIADO AL E-MAIL CÓDIGO PARA VALIDACIÓN</h2>

                <IonItem style={{width:"80%", margin:"15px 0px 15px 0px"}} >
                    <IonLabel position="floating">Código de validación</IonLabel>
                    <IonInput mode='ios' value="" onIonInput={(e: any) => codigo_agregado.current = (e.target.value)}></IonInput>
                </IonItem>
              </IonCard>
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
     
  <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100vh",background: "#f3f2ef" }}>
      <header id="headerRegistro">
      </header>

      <div id="contenedorCentralRegistro">
        <IonCard style={{display:"flex",flexDirection:"column",width:"90%", height:"auto", paddingBottom:"20px"}}>
                <div style={{display:"flex", flexDirection:"column",textAlign:"left",alignItems:"left",width:"100%", height:"auto", paddingLeft:"15px"}}>
                  <h2 style={{textAlign:"left", fontSize:"1em", color:"black", margin:"15px 0 10px 0"}} >VALIDACIÓN VÍA EMAIL</h2>    
                  <IonItemDivider style={{margin:"0px 0 10px 0"}}/>
                </div>
                <div style={{display:"flex", flexDirection:"column",textAlign:"center",alignItems:"center", margin:"10px 0px 10px 0px"}}>
                  <h2 style={{ fontSize: "1.2em", color: "black", margin:"0px 10px 0px 10px" }}>SE HA ENVIADO AL E-MAIL CÓDIGO PARA VALIDACIÓN</h2>
                  <h2 style={{ fontSize: "0.9em", color: "black", margin:"10px 10px 0px 10px" }}>Código erroneo, Vuelva a verificar!</h2> 

                </div>
                <IonItem style={{width:"80%", margin:"15px 0px 15px 0px"}} >
                    <IonLabel position="floating">Código de validación</IonLabel>
                    <IonInput mode='ios' value="" onIonInput={(e: any) => codigo_agregado.current = (e.target.value)}></IonInput>
                </IonItem>
              </IonCard>
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
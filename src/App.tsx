import React, { createContext, useEffect, useRef, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import Ingresar from './pages/Ingresar/Ingresar';
import Menu from './components/Menu/Menu';
import MisServicios from './pages/MisServicios/MisServicios';
import Favoritos from './pages/Favoritos';
import Tab2 from './pages/Tabs2';

import { getItem ,clear, removeItem} from './utilidades/Storage';
import { render } from '@testing-library/react';
import Inicio from './pages/Inicio/Inicio';

import CompletarRubros from './pages/CompletarRubros/CompletarRubros';
import { createStore } from './utilidades/dataBase';
import { itemRubro, usuario, UsuarioType, } from './Interfaces/interfaces';
import {  UserContext, UserProvider } from './Contexts/UserContext';
import HomeCliente from './pages/Home/HomeCliente';
import HomeProveedor from './pages/Home/HomeProveedor';
import Completarinfo from './pages/CompletarInformacionPersonal/Completarinfo';
import Registro from './pages/Registro/Registro';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { RubroContext1, RubroContext2 } from './Contexts/RubroContext';

import { setupIonicReact } from '@ionic/react';


setupIonicReact({
  mode: 'md'
});

const App: React.FC = () => {

  const [isReg, setIsReg] = useState<boolean>  ();
  const [cliente, setCliente] = useState(true);

  //Para registro
  const [registroCompleto, setRegistroCompleto] =useState <boolean> ()
  const [personalInfoCompleto, setPersonalInfoCompleto] =useState <boolean> ()
  //Fin para registro

  const [email, setEmail] = useState("")
  const [tipoCliente, setTipoCliente] = useState("")

  const [foto,setFoto] = useState("") 
  const [nombre,setNombre]= useState("")
  const [apellido,setApellido]= useState("")
  const [calificacion, setCalificacion] = useState(0)

  const [rubro1, setRubro1] =useState("")
  const [rubro2, setRubro2] =useState("")

 //removeItem("primevaCargaProveedores");
 //removeItem("clientType");

 //const [usuario, setUsuario] =  useState <usuario> ()

 const [user,setUser] = useState <usuario> ({
        email:"",
        nombre:"",
        apellido:"",
        foto:"",
        calificacion:0,
        tipoCliente:"",
 })
 

 const [rubrosItem1,setItemRubro1] = useState <itemRubro>({
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
 const [rubrosItem2,setItemRubro2] = useState <itemRubro>({
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

  useEffect(() => {

    createStore("dbDispositivo")

    getItem("isRegistered").then(res => {
      if (res!=null){
        setIsReg(true);
        setEmail(res)
        setUser( (previous) => ({...previous, email: res}))

        
        getItem("clientType").then(res => {
          setTipoCliente(res)
         
          setUser((previous) => ({...previous, tipoCliente: res}))

          if (res=="1"){
            setCliente(true)
          }else{
            setCliente(false)
          }
          
        })
        getItem("fotoPersonal").then(res2 => {
          if(res2!=""||res2!=undefined|| res2!=" "){
            setFoto(res2)
            setUser((previous) => ({...previous, foto: res2}))
          }
          

          
        })
        getItem("nombre").then(res2 => {
          setNombre(res2)
          setUser((previous) => ({...previous, nombre: res2}))

        })
        getItem("apellido").then(res2 => {
          setApellido(res2)
          setUser((previous) => ({...previous, apellido: res2}))

        })
        getItem("calificacion").then(res2 => {
          setCalificacion(res2)
          setUser((previous) => ({...previous, calificacion: res2}))

        })
        getItem("infoRubro1").then(res4 => {
          setRubro1((res4))

          if(res4!=null){
            setItemRubro1({
              rubro:JSON.parse(res4).rubro,
              radius:JSON.parse(res4).radius,
              description:JSON.parse(res4).description,
              hace_orden_emergencia:JSON.parse(res4).hace_orden_emergencia,
              calificacion:JSON.parse(res4).calificacion,
              pais:JSON.parse(res4).pais,
              provincia:JSON.parse(res4).provincia,
              ciudad:JSON.parse(res4).ciudad,
              calle:JSON.parse(res4).calle,
              numeracion:JSON.parse(res4).numeracion,
              days_of_works:JSON.parse(res4).days_of_works,
              hour_init:JSON.parse(res4).hour_init,
              hour_end:JSON.parse(res4).hour_end,
              certificate:JSON.parse(res4).certificate,
              picture1:JSON.parse(res4).picture1,
              picture2:JSON.parse(res4).picture2,
              picture3:JSON.parse(res4).picture3,
              })
          }
          
        })
        getItem("infoRubro2").then(res5 => {
          setRubro2(res5)
          

          if(res5!=null){
            console.log("sera por esto?"+JSON.parse(res5).rubro)
          console.log("sera por esto?"+res5)
            setItemRubro2({
              rubro:JSON.parse(res5).rubro,
              radius:JSON.parse(res5).radius,
              description:JSON.parse(res5).description,
              hace_orden_emergencia:JSON.parse(res5).hace_orden_emergencia,
              calificacion:JSON.parse(res5).calificacion,
              pais:JSON.parse(res5).pais,
              provincia:JSON.parse(res5).provincia,
              ciudad:JSON.parse(res5).ciudad,
              calle:JSON.parse(res5).calle,
              numeracion:JSON.parse(res5).numeracion,
              days_of_works:JSON.parse(res5).days_of_works,
              hour_init:JSON.parse(res5).hour_init,
              hour_end:JSON.parse(res5).hour_end,
              certificate:JSON.parse(res5).certificate,
              picture1:JSON.parse(res5).picture1,
              picture2:JSON.parse(res5).picture2,
              picture3:JSON.parse(res5).picture3,
              })
          }
          
        })

      }
      else{
        setIsReg(false);
      }
    });
}, []);


return(
  <UserContext.Provider  value={ {user,setUser} } >
    <RubroContext1.Provider  value={ {rubrosItem1,setItemRubro1} } >
    <RubroContext2.Provider  value={ {rubrosItem2,setItemRubro2} } >


<IonApp>
<IonReactRouter>
<IonSplitPane contentId="main" when="(min-width: 4096px)">
      <Menu setIsReg={setIsReg} />
  <IonRouterOutlet id="main">

    <Route path="/" render={() => isReg ?   ( cliente ?  <HomeCliente setIsReg={setIsReg}  setNombre={setNombre} setApellido={setApellido} setFoto={setFoto} /> 
                                              :<HomeProveedor  setIsReg={setIsReg} setNombre={setNombre} setApellido={setApellido} setFoto={setFoto}  /> ) 
                                  :<Inicio  /> } />
    
    <Route path="/home" render={() =>  isReg ? (cliente ?  <HomeCliente setIsReg={setIsReg} setNombre={setNombre} setApellido={setApellido} setFoto={setFoto} /> 
                                                :<HomeProveedor  setIsReg={setIsReg}  setNombre={setNombre} setApellido={setApellido} setFoto={setFoto}  /> )
                                       :<Inicio /> } ></Route>
    
    <Route path="/registro" render={() => isReg ?   ( cliente ?  <HomeCliente setIsReg={setIsReg} setNombre={setNombre} setApellido={setApellido} setFoto={setFoto}/> 
                                                      :<HomeProveedor  setIsReg={setIsReg}  setNombre={setNombre} setApellido={setApellido} setFoto={setFoto} /> ) 
                                          :<Registro setIsReg={setIsReg} setCliente={setCliente} setTipoCliente={setTipoCliente} setEmail={setEmail } /> } />

    <Route path="/ingresar" render={() => isReg ?   ( cliente ?  <HomeCliente  setIsReg={setIsReg} setNombre={setNombre} setApellido={setApellido} setFoto={setFoto}/> 
                                                      :<HomeProveedor  setIsReg={setIsReg} setNombre={setNombre} setApellido={setApellido} setFoto={setFoto} /> ) 
                                          :<Ingresar setIsReg={setIsReg} setCliente={setCliente} setEmail={setEmail} setFoto={setFoto} setTipoCliente={setTipoCliente} setNombre={setNombre} setApellido={setApellido} setCalificacion={setCalificacion} />} /> 
    
    <Route path="/MisServicios" render={() => <MisServicios ></MisServicios>}></Route>
    
    <Route path="/Favoritos" component={Favoritos} exact={true}></Route>
        
    <Route path="/Completarinfo" render={() => <Completarinfo setIsReg={setIsReg} email={email} tipoCliente={tipoCliente} setNombre={setNombre} setApellido={setApellido} setFoto={setFoto} rubro1={rubro1} rubro2={rubro2} setRubro1={setRubro1} setRubro2={setRubro2} /> }  />
    
    <Route path="/CompletarRubros" render={() => <CompletarRubros  email={email} clientType={tipoCliente} setIsReg={setIsReg}  />  }  />   

    <Route path="/inicio" render={() => isReg ?   ( cliente ?  <HomeCliente  setIsReg={setIsReg} setNombre={setNombre} setApellido={setApellido} setFoto={setFoto} /> 
                                                    :<HomeProveedor  setIsReg={setIsReg}  setNombre={setNombre} setApellido={setApellido} setFoto={setFoto} /> ) 
                                        :<Inicio /> } />

    <Route path="/tab2" component={Tab2} exact={true} />

  </IonRouterOutlet>
  </IonSplitPane>
</IonReactRouter>
</IonApp>
</RubroContext2.Provider>
</RubroContext1.Provider>
</UserContext.Provider >

);
};


export default App;
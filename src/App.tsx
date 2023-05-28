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
import {  UserContext, UserProvider, useUserContext } from './Contexts/UserContext';
import HomeCliente from './pages/Home/HomeCliente';
import HomeProveedor from './pages/Home/HomeProveedor';
import Completarinfo from './pages/CompletarInformacionPersonal/Completarinfo';
import Registro from './pages/Registro/Registro';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { RubroContext1, RubroContext2 } from './Contexts/RubroContext';

import { setupIonicReact } from '@ionic/react';
import ValidarEmail from './pages/Registro/ValidarEmail';


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
  const loadUserData = async () => {
    await createStore("dbDispositivo");

    const res1 = await getItem("isRegistered");
    if (res1 != null) {
      setIsReg(true);
      setEmail(res1);

      const res2 = await getItem("clientType");
      setTipoCliente(res2);

      const res3 = await getItem("fotoPersonal");
      if (res3 !== "" && res3 !== undefined && res3 !== " ") {
        setFoto(res3);
      }

      const res4 = await getItem("nombre");
      setNombre(res4);

      const res5 = await getItem("apellido");
      setApellido(res5);

      const res6 = await getItem("calificacion");
      setCalificacion(res6);

      const res7 = await getItem("infoRubro1");
      if (res7 != null) {
        setRubro1(res7);
        setItemRubro1({
          rubro: JSON.parse(res7).rubro,
          radius: JSON.parse(res7).radius,
          description: JSON.parse(res7).description,
          hace_orden_emergencia: JSON.parse(res7).hace_orden_emergencia,
          calificacion: JSON.parse(res7).calificacion,
          pais: JSON.parse(res7).pais,
          provincia: JSON.parse(res7).provincia,
          ciudad: JSON.parse(res7).ciudad,
          calle: JSON.parse(res7).calle,
          numeracion: JSON.parse(res7).numeracion,
          days_of_works: JSON.parse(res7).days_of_works,
          hour_init: JSON.parse(res7).hour_init,
          hour_end: JSON.parse(res7).hour_end,
          certificate: JSON.parse(res7).certificate,
          picture1: JSON.parse(res7).picture1,
          picture2: JSON.parse(res7).picture2,
          picture3: JSON.parse(res7).picture3,
        });
      }

      const res8 = await getItem("infoRubro2");
      if (res8 != null) {
        setRubro2(res8);
        setItemRubro2({
          rubro: JSON.parse(res8).rubro,
          radius: JSON.parse(res8).radius,
          description: JSON.parse(res8).description,
          hace_orden_emergencia: JSON.parse(res8).hace_orden_emergencia,
          calificacion: JSON.parse(res8).calificacion,
          pais: JSON.parse(res8).pais,
          provincia: JSON.parse(res8).provincia,
          ciudad: JSON.parse(res8).ciudad,
          calle: JSON.parse(res8).calle,
          numeracion: JSON.parse(res8).numeracion,
          days_of_works: JSON.parse(res8).days_of_works,
          hour_init: JSON.parse(res8).hour_init,
          hour_end: JSON.parse(res8).hour_end,
          certificate: JSON.parse(res8).certificate,
          picture1: JSON.parse(res8).picture1,
          picture2: JSON.parse(res8).picture2,
          picture3: JSON.parse(res8).picture3,
        });
      }

      if (res2 == "1") {
        setCliente(true);
      } else {
        setCliente(false);
      }
    } else {
      setIsReg(false);
    }
  };

  loadUserData();

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
    <Route path="/confirmarEmail" component={ValidarEmail} exact={true} />


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
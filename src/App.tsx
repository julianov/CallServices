import React, { useEffect, useRef, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
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

import Registro from './pages/Registro';
import Ingresar from './pages/Ingresar';
import Menu from './pages/Menu';
import MisServicios from './pages/MisServicios';
import Favoritos from './pages/Favoritos';
import Tab2 from './pages/Tabs2';
import Completarinfo from './pages/Completarinfo';

import { getItem ,clear, removeItem} from './utilidades/Storage';
import { render } from '@testing-library/react';
import Inicio from './pages/Inicio';
import CompletarRubro from './pages/CompletarRubros';
import HomeCliente from './pages/HomeCliente';
import HomeProveedor from './pages/HomeProveedor';
import CompletarRubros from './pages/CompletarRubros';
import { createStore } from './utilidades/dataBase';

/*
Device's var:
  isRegistered - este devuelve el email.
  BolleanReg - este devuelve true o false
  clientType

  personalInfoCompleted
  BooleanPersonalInfo
  fotoPersonal imagen
  nombre
  apellido
  descripcion
  
  rubroLoaded
  rubro1
  rubro2
  infoRubro1
  infoRubro2

  primevaCargaProveedores
  proveedores
*/

const miemail=React.createContext("algo")


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

  useEffect(() => {

    createStore("dbDispositivo")

    getItem("isRegistered").then(res => {
      if (res!=null){
        setIsReg(true);
        setEmail(res)

        getItem("clientType").then(res => {
          setTipoCliente(res)
          if (res=="1"){
            setCliente(true)
          }else{
            setCliente(false)
          }
          
        })
        getItem("fotoPersonal").then(res2 => {
          setFoto(res2)
        })
        getItem("nombre").then(res2 => {
          console.log("SE EJECUTÓ EL NOMBRE, EL CUAL ES: "+ res2)
          setNombre(res2)
        })
        getItem("apellido").then(res2 => {
          setApellido(res2)
        })
        getItem("calificacion").then(res2 => {
          setCalificacion(res2)
        })
        getItem("infoRubro1").then(res2 => {
          setRubro1(res2)
        })
        getItem("infoRubro2").then(res2 => {
          setRubro2(res2)
        })

      }
      else{
        setIsReg(false);
      }
    });
}, []);

return(
<IonApp>
<IonReactRouter>
<IonSplitPane contentId="main" when="(min-width: 4096px)">
      <Menu email={email} foto={foto} setIsReg={setIsReg} />
  <IonRouterOutlet id="main">

    <Route path="/" render={() => isReg ?   ( cliente ?  <HomeCliente setIsReg={setIsReg} email={email} foto={foto} clientType={tipoCliente} nombre={nombre} apellido={apellido} calificacion={calificacion} setNombre={setNombre} setApellido={setApellido} setFoto={setFoto} /> 
                                              :<HomeProveedor  setIsReg={setIsReg}  email={email } tipodeCliente={tipoCliente} nombre={nombre} apellido={apellido} calificacion={calificacion} setNombre={setNombre} setApellido={setApellido} foto={foto} setFoto={setFoto} rubro1={rubro1} rubro2={rubro2} setRubro1={setRubro1} setRubro2={setRubro2} /> ) 
                                  :<Inicio  /> } />
    
    <Route path="/home" render={() =>  isReg ? (cliente ?  <HomeCliente setIsReg={setIsReg} email={email} foto={foto} clientType={tipoCliente} nombre={nombre} apellido={apellido} calificacion={calificacion} setNombre={setNombre} setApellido={setApellido} setFoto={setFoto} /> 
                                                :<HomeProveedor  setIsReg={setIsReg} email={email } tipodeCliente={tipoCliente} nombre={nombre} apellido={apellido} calificacion={calificacion} setNombre={setNombre} setApellido={setApellido} foto={foto} setFoto={setFoto} rubro1={rubro1} rubro2={rubro2} setRubro1={setRubro1} setRubro2={setRubro2} /> )
                                       :<Inicio /> } ></Route>
    
    <Route path="/registro" render={() => isReg ?   ( cliente ?  <HomeCliente setIsReg={setIsReg} email={email} foto={foto} clientType={tipoCliente} nombre={nombre} apellido={apellido} calificacion={calificacion} setNombre={setNombre} setApellido={setApellido} setFoto={setFoto}/> 
                                                      :<HomeProveedor  setIsReg={setIsReg} email={email } tipodeCliente={tipoCliente} nombre={nombre} apellido={apellido} calificacion={calificacion} setNombre={setNombre} setApellido={setApellido} foto={foto} setFoto={setFoto} rubro1={rubro1} rubro2={rubro2} setRubro1={setRubro1} setRubro2={setRubro2} /> ) 
                                          :<Registro setIsReg={setIsReg} setCliente={setCliente} setTipoCliente={setTipoCliente} setEmail={setEmail } /> } />

    <Route path="/ingresar" render={() => isReg ?   ( cliente ?  <HomeCliente  setIsReg={setIsReg} email={email} foto={foto} clientType={tipoCliente} nombre={nombre} apellido={apellido} calificacion={calificacion} setNombre={setNombre} setApellido={setApellido} setFoto={setFoto}/> 
                                                      :<HomeProveedor  setIsReg={setIsReg} email={email } tipodeCliente={tipoCliente} nombre={nombre} apellido={apellido} calificacion={calificacion} setNombre={setNombre} setApellido={setApellido} foto={foto} setFoto={setFoto} rubro1={rubro1} rubro2={rubro2} setRubro1={setRubro1} setRubro2={setRubro2} /> ) 
                                          :<Ingresar setIsReg={setIsReg} setCliente={setCliente} setEmail={setEmail} setFoto={setFoto} setTipoCliente={setTipoCliente} setNombre={setNombre} setApellido={setApellido} setCalificacion={setCalificacion} setRubro1={setRubro1} setRubro2={setRubro2} />} /> 
    
    <Route path="/MisServicios" render={() => <MisServicios cliente={cliente} email={email}  ></MisServicios>}></Route>
    
    <Route path="/Favoritos" component={Favoritos} exact={true}></Route>
        
    <Route path="/Completarinfo" render={() => <Completarinfo setIsReg={setIsReg} email={email} tipoCliente={tipoCliente} setNombre={setNombre} setApellido={setApellido} setFoto={setFoto} rubro1={rubro1} rubro2={rubro2} setRubro1={setRubro1} setRubro2={setRubro2} /> }  />
    
    <Route path="/CompletarRubros" render={() => <CompletarRubros email={email} clientType={tipoCliente} setIsReg={setIsReg} setRubro1={setRubro1} setRubro2={setRubro2} rubro1={rubro1} rubro2={rubro2}  />  }  />   

    <Route path="/inicio" render={() => isReg ?   ( cliente ?  <HomeCliente  setIsReg={setIsReg} email={email} foto={foto} clientType={tipoCliente} nombre={nombre} apellido={apellido} calificacion={calificacion} setNombre={setNombre} setApellido={setApellido} setFoto={setFoto} /> 
                                                    :<HomeProveedor  setIsReg={setIsReg}  email={email } tipodeCliente={tipoCliente} nombre={nombre} apellido={apellido} calificacion={calificacion} setNombre={setNombre} setApellido={setApellido} foto={foto} setFoto={setFoto} rubro1={rubro1} rubro2={rubro2} setRubro1={setRubro1} setRubro2={setRubro2} /> ) 
                                        :<Inicio /> } />

    <Route path="/tab2" component={Tab2} exact={true} />

  </IonRouterOutlet>
  </IonSplitPane>
</IonReactRouter>
</IonApp>

);
};


export default App;
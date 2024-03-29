import { arrowBack, person, close,receipt, help, chatbubble, camera, trash, trendingUpOutline } from "ionicons/icons";
import React, { useContext, useEffect, useState } from "react";
import { removeItem, setItem } from "../../utilidades/Storage";

import './Modal.css';
import { usePhotoGallery } from "../../hooks/usePhotoGallery";
import { b64toBlob } from "../../utilidades/b64toBlob";
import { base64FromPath } from "@ionic/react-hooks/filesystem";
import { useRef } from "react";
import Estrellas from "../Estrellas/Estrellas";
import Https from "../../utilidades/HttpsURL";
import VerOrdenesCliente from "../../pages/VerOrdenes";

import CardProveedor from "../../utilidades/CardProveedor";
import { categoriaBuscada } from "../ResultadoBusqueda/ResultadoBusqueda";
import { IonActionSheet, IonAlert, IonButton, IonCard, IonCol, IonContent, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonLoading, IonRow, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { PedirOrdenEmergencia } from "../../pages/PedirOrdenes/PedirOrdenEmergencia";
import { retornarIconoCategoria } from "../../utilidades/retornarIconoCategoria";
import { usuario } from "../../Interfaces/interfaces";
import { clearDB, removeDB } from "../../utilidades/dataBase";
import { UserContext } from "../../Contexts/UserContext";


const url=Https

let posicion: string | number;

const getLocation = async () => {
  
  try {
      Geolocation.watchPosition()
      const position = await Geolocation.getCurrentPosition();
      posicion=position.coords.latitude +"/"+ position.coords.longitude
      return posicion;

  } catch (e) {
    return 0;
  }
}

const ModalCliente: React.FC<{setIsReg:any, onClose: any; tipoVista: string; 
   completarInfoPersonal:boolean, ordenes:any, categoriaAVer:any}> 
  = ({setIsReg, onClose, tipoVista, completarInfoPersonal,ordenes, categoriaAVer }) => {
                   
  
    
    if(tipoVista=="datosUsuario"){
      return (
        <>
          <DatosUsuario  setIsReg={setIsReg} completarInfoPersonal={completarInfoPersonal}  onClose={onClose}  />
         
        </>
        );
      
    }
    
    if(tipoVista=="emergencias"){
      return (
        <>
        <IonContent>
        <PedirOrdenEmergencia setVolver={onClose} />
        </IonContent>
      </>
      );
    }
    if(tipoVista=="categorias"){
      return (
        <>
          <IonContent>
            <Categorias ordenes={ordenes} onClose={onClose} categoria={""} ></Categorias>
          </IonContent>
      </>
      );
    }else if(tipoVista=="categoríaEspecial" && categoriaAVer!=""){

      return( 
        <>
        <IonContent>
          <Categorias ordenes={ordenes} onClose={onClose} categoria={categoriaAVer} ></Categorias>
        </IonContent>
    </>
      )

    }
    else{
      return (
        <VerOrdenesCliente tipo={"cliente"} setCerrar={onClose} ></VerOrdenesCliente>
      );
    }
   
  };
  

  /////////////////////////// Fin del modal principal ////////////////////////////

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

const DatosUsuario = (props:{setIsReg:any, completarInfoPersonal:any, onClose:any }) =>{

  const [datosPersonales,seDatosPersonales]=useState(false)
 
  const closeSesion = () =>{
  
    removeItem("email")
    removeItem("clientType")
    removeItem("fotoPersonal")
    removeItem("personalInfoCompleted")
    removeItem("primevaCargaProveedores")
    removeItem("proveedores")
    removeItem("nombre")
    removeItem("apellido")
    removeItem("calificacion")
    removeDB("ordenes").then(()=> { 

      clearDB().then(()=>{
        props.setIsReg(false)
        window.location.reload();
      })
      
    })
   
  }

  return(
    <DatosPersonales completarInfoPersonal={props.completarInfoPersonal} closeSesion={closeSesion} datosPersonales={datosPersonales} setDatosPersonales={seDatosPersonales} onClose={props.onClose}  ></DatosPersonales>
  )
  
}


const DatosPersonales = (props:{closeSesion:any; completarInfoPersonal:any; datosPersonales:any; setDatosPersonales:any, onClose:any}) => {

  const [showAlertDatosPersonales, setShowAlertDatosPersonales]=useState(false)


  const  {user,setUser}  = useContext(UserContext)
  const [imagen, setImagen] = useState (user!.foto)


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
      <IonHeader>
        <IonToolbar>
          <div className="header">
            <IonIcon icon={close} onClick={() => props.onClose(null)} slot="start" id="flecha-cerrar">  </IonIcon>
            <IonTitle>CallServices</IonTitle>
          </div>
          </IonToolbar>
      </IonHeader>
      <IonContent>
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
          <MostrarDatosPersonales setShowAlertDatosPersonales={setShowAlertDatosPersonales} setDatosPersonales={props.setDatosPersonales} onClose={props.onClose} ></MostrarDatosPersonales>
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
    return (
      <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100vh"}}>
      
        <header style={{display:"flex", alignItems:"right", justifyContent:"right",width:"100%",height:"auto"}}>
          <IonIcon icon={close} onClick={() => props.onClose(null)} slot="right" id="flecha-cerrar">  </IonIcon>
        </header>

        <div style={{display:"flex",flexDirection:"column", justifyContent:"center", alignItems:"center", width:"100%",height:"100%"}}>
          <img onClick={() => props.setDatosPersonales(true)} src={imagen} id="foto-usuario-grande"/>

          <div style={{display:"flex",flexDirection:"column", justifyContent:"center", alignItems:"center", width:"80%",height:"auto", marginTop:"15px"}}>

            <IonItem id="item-modal" button onClick={() => { props.setDatosPersonales(true)}}>
                <IonLabel style={{ with:"100%" }}>DATOS PERSONALES</IonLabel>
                <IonIcon className="iconosModal" icon={person} ></IonIcon>
              </IonItem>

            <IonItem id="item-modal" button onClick={() => { }}>
                <IonLabel>MIS TICKETS</IonLabel>
                <IonIcon className="iconosModal" icon={receipt} ></IonIcon>
            </IonItem>

            <IonItem id="item-modal" button onClick={() => { }}>
                <IonLabel>PREGUNTAS</IonLabel>
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


  const MostrarDatosPersonales = (props:{ setDatosPersonales:any, setShowAlertDatosPersonales:any, onClose:any}) => {

    const  {user,setUser}  = useContext(UserContext)

    const nombre = useRef(user!.nombre)
    const apellido = useRef(user!.apellido)
    const calificacion = useRef(user!.calificacion)  

    const [fotoAEnviar, setFoto]=useState<String>(user!.foto)
    const [listoCarga, setListoCarga]=useState(false)

    const [cambiar,setCambiar] =useState("nada")

    const [pedirDatos, setPedirDatos]= useState(false)
    //Si es cero se muestra, si es 1 se cambia la foto, si es 2 el nombre y si es 3 el apellido
    
    const [showAlertDatosPersonales, setShowAlertDatosPersonales]= useState(false)
 
    const cambiarElemento = (tipo:string) => {
      if(tipo=="foto"){
          setCambiar("foto")
      }
      else if (tipo=="nombre"){
        setCambiar("nombre")
      }else{
        setCambiar("apellido")
      }
    }

    const enviar = (tipo:string) => {

        var formDataToUpload = new FormData();
        formDataToUpload.append("tipo", "1")
        if (user!.email!=null){
          formDataToUpload.append("email", user!.email)

        }
        formDataToUpload.append("nombre", nombre.current)
        formDataToUpload.append("apellido", apellido.current);
        formDataToUpload.append("calificacion", String(user!.calificacion));

        
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
        
               setItem("nombre", nombre.current)
               setItem("apellido", apellido.current) 
               setItem("fotoPersonal",fotoAEnviar)

               setUser!((state:usuario) => ({ ...state, nombre: nombre.current }))
               setUser!((state:usuario) => ({ ...state, apellido: apellido.current }))
               setUser!((state:usuario) => ({ ...state, foto: realData }))

               setShowAlertDatosPersonales(false)
               setCambiar("nada")

            }
        }).catch((error: any) =>{
            
            //Network error comes in
        });  
        setCambiar("nada")    
    }

    if(listoCarga || !pedirDatos){
      if(cambiar=="nada"){
        return (
          < div style={{display:"flex", flexDirection:"column", width:"100%", height:"100vh"}}>
           <div id="modalProveedor-flechaVolver">
              <IonIcon icon={arrowBack} onClick={() => props.setDatosPersonales(false)} slot="start" id="flecha-volver">  </IonIcon>
              <IonIcon icon={close} onClick={() => props.onClose(null)} slot="end" id="flecha-cerrar">  </IonIcon>
            </div>     
            <div style={{display:"flex", flexDirection:"column", textAlign:"center" ,justifyContent:"center", alignItems:"center", width:"100%",height:"100%"}}>
              <IonItem lines="none" id="itemFoto"  onClick={()=> cambiarElemento("foto") }>
                <img  src={user!.foto} id="foto-usuario-grande"/>
              </IonItem>
              <IonItem lines="none" id="item-modal-datos" onClick={()=> cambiarElemento("nombre") } >
                <strong >NOMBRE: {user!.nombre} </strong>
              </IonItem>
              <IonItem lines="none" id="item-modal-datos" onClick={()=> cambiarElemento("apellido") }>
                <strong >APELLIDO: {user!.apellido} </strong>
              </IonItem>
              <strong style={{marginTop:"25px", marginBottom:"10px"}} >CALIFICACIÓN COMO USUARIO:</strong>
              <Estrellas  calificacion={calificacion.current}   ></Estrellas> 
            </div>
            <div style={{display:"flex", height:"auto", width:"100%", justifyContent:"center", alignItems:"center"}}> 
              <h2 style={{marginTop:"25px", fontSize:"1em"}}>PRESIONE UN ELEMENTO PARA MODIFICAR</h2>
            </div>
            
        </div>
        );
      }else if(cambiar=="foto"){
        return (
          <>
            <div id="modalProveedor-flechaVolver">
              <IonIcon icon={arrowBack} onClick={() => setCambiar("nada")} slot="start" id="flecha-volver">  </IonIcon>
            </div>
            <div className="header">
              <IonTitle>Ingrese Nueva foto personal</IonTitle>
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
      }else if(cambiar=="nombre"){

        return (
          <>
          <div id="modalProveedor-flechaVolver">
            <IonIcon icon={arrowBack} onClick={() => setCambiar("nada")} slot="start" id="flecha-volver">  </IonIcon>
            </div>
            <div className="header">
            <IonTitle>Ingrese Nuevo Nombre</IonTitle>
            </div>

            <div id="contenedor-central">

            <IonGrid>
            <IonRow><IonCol><IonItem id="item-modal-datosCambio">
              <IonLabel position="floating">Nombre</IonLabel>
              <IonInput onIonInput={(e: any) => nombre.current=(e.target.value)}></IonInput>
            </IonItem></IonCol></IonRow>
            <IonRow><IonCol><IonButton shape="round" onClick={()=> {setShowAlertDatosPersonales(true);enviar("nombre")} } >Cambiar</IonButton></IonCol></IonRow>
            </IonGrid>

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
            <IonTitle>Ingrese Apellido</IonTitle>
            </div>

            <div id="contenedor-central">
            
            <IonGrid>
            <IonRow><IonCol><IonItem id="item-modal-datosCambio">
              <IonLabel position="floating">Apellido</IonLabel>
              <IonInput onIonInput={(e: any) => apellido.current=(e.target.value)}></IonInput>
            </IonItem></IonCol></IonRow>
            <IonRow><IonCol><IonButton shape="round" onClick={()=> {setShowAlertDatosPersonales(true);enviar("apellido")} } >Cambiar</IonButton> </IonCol></IonRow>
            </IonGrid>

            </div>
            <IonLoading  isOpen={showAlertDatosPersonales}   onDidDismiss={() => setShowAlertDatosPersonales(false)}
                    cssClass='my-custom-class'
                    message={'Modificando apellido...'}
                    duration={10000}
                  />
        </>
        );

      }
      

    }else{
      return( <> </>)

    }
    
  }


  const Categorias = (props: {ordenes:any, onClose:any, categoria:any}) => {

    const arreglo_categorias=["CARPINTERÍA","CERRAJERÍA","CONSTRUCCIÓN","CONTADURÍA","ELECTRICIDAD","ELECTRÓNICA","ESTÉTICA","FLETE","FUMIGACIÓN","GASISTA","HERRERÍA","INFORMÁTICA","JARDINERÍA","MECÁNICA","MODA","PASEADOR DE MASCOTAS","PINTOR","PLOMERÍA","REFRIGERACIÓN","REMOLQUES - GRÚAS","TELEFONÍA CELULAR","TEXTIL"]
    var i=0

    const[ categoriaABuscar, setCategoriaABuscar] = useState("")

    const [showLoading, setShowLoading]=useState(false)

    useEffect(() => {

      if (props.categoria!=""){
        setCategoriaABuscar(props.categoria)
      }


    }, []);



    if (categoriaABuscar==""){
      return (
      
        <IonContent>
          <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto", justifyContent:"center", alignItems:"center", background:"#f3f2ef"}}>
            <div id="headerModalFlechas">
            <IonIcon icon={close} onClick={() => props.onClose(null)} slot="start" id="flecha-cerrar">  </IonIcon>
            </div>
            <div style={{display:"flex", flexDirection:"column", width:"95%", height:"auto", justifyContent:"center", alignItems:"center"}}>
              <IonTitle>CATEGORÍAS</IonTitle>
              <IonItemDivider />
              <IonCard>
                  {arreglo_categorias.map((a) => {
                    i = i + 1;
                    return (
                      <IonItem key={i} id="item-busqueda" onClick={() => setCategoriaABuscar(a)}>
                        <IonTitle id="titulo-busqueda">{a}</IonTitle>
                        <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria(a)}></img>
                      </IonItem>
                    );
                  })}
              </IonCard>

            </div>
          </div>
        </IonContent>
        )
    }else{
      
      return (
        <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto", justifyContent:"center", background:"#f3f2ef"}}>

        
        <div id="headerModalFlechas">
            <IonIcon icon={arrowBack} onClick={() => setCategoriaABuscar("")} id="flecha-volver">  </IonIcon>
            <IonIcon icon={close} onClick={() => props.onClose(null)}  id="flecha-cerrar">  </IonIcon>
          </div>
          <div id="contenedorCentral-busqueda">
          <Rubros ordenes={props.ordenes} rubro={categoriaABuscar} setRubro={setCategoriaABuscar} setShowLoading={setShowLoading} ></Rubros>
          <IonLoading
                  cssClass='my-custom-class'
                  isOpen={showLoading}
                  onDidDismiss={() => setShowLoading(false)}
                  message={'Cargado datos...'}
                  duration={5000}
              />
        </div>
        
        </div>
        )
    }
    
  }

  //con setRubro vuelvo atrás si es igual a ""
  const Rubros = (props:{ordenes:any, rubro:string, setRubro:any, setShowLoading:any}) => {

    const [arregloRubroBuscado, setArregloRubroBuscado] =  useState <categoriaBuscada []> ( [])
    const [proveedorEncontrado, BuscarProveedor] = useState("")

    const [caracteres,setCaracteres]=useState()
    const [imagenes,setImagenes]=useState()

    const  {user,setUser}  = useContext(UserContext)


    useEffect(() => {
      const axios = require('axios');
      props.setShowLoading(true)
      console.log("LO QUE BUSCA ES: "+props.rubro)
      axios.get(url+"search/categoria/"+props.rubro).then((resp: { data: any; }) => {

        if (resp.data!="bad"){
          setArregloRubroBuscado(resp.data.map((d: { item: any; tipo: any; nombre: any; apellido: any; imagen: any; calificacion: any; email: any; }) => ({
            item:d.item,
            tipo:d.tipo,
            nombre:d.nombre,
            apellido:d.apellido,
            imagen:d.imagen,
            calificacion:d.calificacion,
            email:d.email
            }))
          )
          props.setShowLoading(false)
        }else{
          props.setShowLoading(false)
                //show error
        }
      })
    }, []);

    useEffect(() => {
     
      props.setShowLoading(true)
        const axios = require('axios');
        if(proveedorEncontrado!=""){
          const ubicacion = getLocation();

          ubicacion.then((value)=>{
              axios.get(url+"home/cliente/pedirdatos/"+proveedorEncontrado+"/"+"caracteres"+"/"+value, {timeout: 5000}).then((resp: { data: any; }) => {
                  
                  if (resp.data!="bad"){
                    props.setShowLoading(false)

                      setCaracteres(resp.data)
                     // email.current=proveedorEncontrado.split("/")[0]
                      axios.get(url+"home/cliente/pedirdatos/"+proveedorEncontrado+"/"+"imagenes"+"/"+value, {timeout: 5000}).then((resp: { data: any; }) => {
                          if(resp.data!="bad"){
                              setImagenes(resp.data)
                          }
                          
                      })
  
  
                  }else{
                      }
                      
                  
              }).catch((err: any) => {
  
                  
              })
          })    
        }
       
    }, [proveedorEncontrado]);

    if ( arregloRubroBuscado.length > 0 ){
      if(proveedorEncontrado==""){
        var i=0
        return (
          <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto", justifyContent:"center", background:"#f3f2ef"}}>
              <IonTitle id="titulo-busqueda">RESULTADO DE BUSQUEDA</IonTitle>
              <IonItemDivider />
             
              {arregloRubroBuscado.map((a) => {
                  i=i+1
                  return (
                    <IonCard>
                    <IonItem key={i} id="item-busqueda" onClick={() => BuscarProveedor(a.email+"/"+a.item)}>
                    <IonGrid>
                        <IonRow id="row-busqueda"><IonTitle id="titulo-busqueda">{a.nombre.toUpperCase()+" "+a.apellido.toUpperCase()}</IonTitle></IonRow>
                        <IonRow id="row-busqueda"><img id="imagen-busqueda" src= {a.imagen}></img></IonRow>
                        <IonRow id="row-busqueda"><p id="descripción-busqueda">RUBRO: {a.item}</p></IonRow>
                        <IonRow id="row-busqueda"><p id="descripción-busqueda">{a.tipo}</p></IonRow>
                        <Estrellas  calificacion={a.calificacion}   ></Estrellas> 
  
                    </IonGrid>
                </IonItem>
                </IonCard>
                  );
              })}
              
              
  
              </div>
          )
      }else{
        return(
          <>
              <div id="contenedorCentral-busqueda">
                  <CardProveedor ordenes={props.ordenes} data={caracteres} imagenes={imagenes} emailCliente={user!.email} proveedorEmail={proveedorEncontrado.split("/")[0]} ></CardProveedor>
              </div>
          </>
      )
      }
     
    }else{
      return(
      
      <div id="padreModal">
        <div id="hijoModal">
          <IonTitle id="titulo-busqueda">NO HAY PROVEDORES EN SU ZONA</IonTitle>
        </div>
      </div>
      
      
 )
    }
  }
  
  export default ModalCliente;


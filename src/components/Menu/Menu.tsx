
  
  import React, { useContext, useEffect, useRef, useState } from 'react';
  import { Redirect, useLocation } from 'react-router-dom';
  import { archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp, heart, build, location, home, time,closeCircle, book, person} from 'ionicons/icons';
  import './Menu.css';
import { getItem, removeItem, setItem } from '../../utilidades/Storage';
import { isPropertySignature } from 'typescript';
import {
  IonCol,
    IonContent,
  IonGrid,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonNote,
    IonRow,
  } from '@ionic/react';
import { UserContext } from '../../Contexts/UserContext';
    
  interface AppPage {
    url: string;
    src: string;
    iosIcon: string;
    mdIcon: string;
    title: string;
  }
  
  const appPages: AppPage[] = [
    {
      title: 'Inicio',
      url: '/home',
      src: './assets/icon/home.png',
      iosIcon: home,
      mdIcon: home
    },
    {
      title: 'Mis servicios',
      url: '/MisServicios',
      src:"./assets/icon/servicios.png",
      iosIcon: build,
      mdIcon: build
    },
    {
      title: 'Favoritos',
      url: '/Favoritos',
      src:"./assets/icon/favoritos.png",
      iosIcon: heart,
      mdIcon: heart
    },
   
    {
      title: 'Mis direcciones',
      url: '/Outbox',
      src: './assets/icon/direcciones.png',
      iosIcon: location,
      mdIcon:  location
    },
    {
      title: 'Información Legal',
      url: '/legal',
      src:"./assets/icon/aviso.png",

      iosIcon: warningOutline,
      mdIcon: warningSharp
    }
  ];
  
  const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  
  const Menu = ( props:{setIsReg:any }) => {
   // const axios = require('axios');

    const location = useLocation();

    //const user = useContext(UserContext)

    const  {user,setUser}  = useContext(UserContext)
    
    const [imagen, setImagen] = useState (user!.foto)

    useEffect(() => {
    if (user!.foto==""|| user!.foto==null || user!.foto==undefined){
      setImagen ("./assets/icon/nuevoUsuario.png") 
    }else{
      setImagen(user!.foto)
    }
  }, [user]);

  console.log("USER: "+ JSON.stringify(user))
  
  const cerrarSesion = ()=>{

    removeItem("email")
    removeItem("rubro1")
    removeItem("rubro2")
    removeItem("infoRubro1")
    removeItem("infoRubro2")
    removeItem("rubroLoaded")
    removeItem("clientType")
    removeItem("fotoPersonal")
    removeItem("personalInfoCompleted")
    removeItem("calificacion")
    removeItem("proveedores")
    removeItem("nombre")
    removeItem("apellido")
    
    localStorage.clear()

    props.setIsReg(false)

    window.location.href="/"
    window.location.reload(); 

  }

  
  if( user!.email==""|| user!.email==null){
    return (
      <IonMenu contentId="main" type="overlay">
        <IonContent>
          <IonList id="inbox-list">
          <div ><img src={"./assets/icon/nuevoUsuario.png"} id="img" />
          </div>
          <IonNote>Usuario no registrado</IonNote>

            {appPages.map((appPage, index) => {
              return (
                <IonMenuToggle   key={index} autoHide={false}>
                  <IonItem id="secciones"  className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" icon={appPage.mdIcon} />
                    <IonLabel >{appPage.title}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              );
            })}
          </IonList>

        </IonContent>
      </IonMenu>
    );
  }else{
   
    return (
      <IonMenu contentId="main" type="overlay">
        <IonContent>
          <IonList id="inbox-list">
          <div ><img src={imagen} id="foto_usuario" />
          </div>
          <IonNote id="user">{user!.nombre}</IonNote>

            {appPages.map((appPage, index) => {
              return (
                <IonMenuToggle key={index} autoHide={false}>
                  <IonItem id="secciones" className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" icon={appPage.mdIcon} />
                    <IonLabel>{appPage.title}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              );
            })}

                  <IonItem id="secciones" onClick={()=>cerrarSesion()}>
                  <IonIcon slot="start" icon={closeCircle} />
                    <IonLabel>Cerrar sesion</IonLabel>
                  </IonItem>
                
          </IonList>
        </IonContent>
      </IonMenu>
    );
    }
  };
  
  export default Menu;
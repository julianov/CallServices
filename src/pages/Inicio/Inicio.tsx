import { Icon } from 'ionicons/dist/types/components/icon/icon';
import React, { Component, useEffect, useState } from 'react';
import './Inicio.css';
import {person, home } from 'ionicons/icons';
import { IonAvatar, IonButton, IonButtons, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonModal, IonPage, IonRow, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';

const Inicio = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar  >
            <IonTitle>ServiceYA</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100vh"}}>
          
        <div id="InicioPagina">
        <div id="hero__title">

          <Iniciar ></Iniciar>
        </div>
        <div id="cube"></div>
        <div id="cube"></div>
        <div id="cube"></div>
        <div id="cube"></div>
        <div id="cube"></div>
        <div id="cube"></div>
        </div>
        </div>
      </IonPage>
    );
  };

  const Iniciar =  () => {
    
      return (

            <div id="Inicio_contenedor_central">
              <IonButton shape="round" href="/ingresar"  id="boton-inicio">Ingresar</IonButton>
              <IonButton shape="round" href="/registro" id="boton-inicio2">Registrarse</IonButton>
            </div>
          
        );
 
  }
  
  export default Inicio;

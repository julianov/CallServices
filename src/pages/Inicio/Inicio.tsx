import { IonAvatar, IonButton, IonButtons, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonModal, IonPage, IonRow, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import React, { Component, useEffect, useState } from 'react';
import './Inicio.css';
import {person, home } from 'ionicons/icons';

const Inicio = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar  >
            <IonTitle>ServiceYA</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent id="Inicio-IonContent" fullscreen>
          
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
        </IonContent>
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

import { IonAvatar, IonButton, IonButtons, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonModal, IonPage, IonRow, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import React, { Component, useState } from 'react';
import './Favoritos.css';
import {person, home } from 'ionicons/icons';

const Favoritos: React.FC = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar  >
          <IonGrid>
            <IonRow id="header">
            <IonCol size="1" > <IonButtons > <IonMenuButton />          </IonButtons> </IonCol>
            <IonCol id="columna2" ><strong id="texto-pagina">Favoritos</strong></IonCol>
            </IonRow>
          </IonGrid>
            <IonTitle></IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense" >
            <IonToolbar>
              <IonTitle size="large"></IonTitle>
            </IonToolbar>
          </IonHeader>
          <div id="contenedor-central">
                <strong id="prueba">Sin Servicios asignados</strong>
              </div>
        </IonContent>
      </IonPage>
    );
  };


  export default Favoritos;

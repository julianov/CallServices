import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonPage, IonRow, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from '@ionic/react';
import React, { Component } from 'react';
import './MisServicios.css';


const MisServicios: React.FC = () => {
    return (
            <IonPage>
              <IonHeader>
                <IonToolbar  >
                <IonGrid>
                  <IonRow >
                  <IonCol size="1" > <IonButtons > <IonMenuButton />          </IonButtons> </IonCol>
                    <IonCol id="columna2" ><strong id="texto-pagina">Mis Servicios</strong></IonCol>
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
              <Segmentos></Segmentos>
              <div id="contenedor-central">
                <strong id="prueba">Sin Servicio en Curso</strong>
              </div>
              </IonContent>
            </IonPage>
          );
  };


  const Boton = (props: { name: React.ReactNode, onClick: () => void}) => 
  (<div className="center-div">
    <IonButton shape="round" onClick={props.onClick}> 
     {props.name}
   </IonButton>
</div>);

  class servicios extends Component{
    state = {
      registro:0
    }
  
    nuevoRegistro =false
    
    handleShow = ()=>{
      this.setState({
          registro: 1
      })
    }
  
    handleHide = () =>{
      this.setState({
        registro: 0
      })
    }
  
    enviarRegistro = () =>{
      this.setState({
        registro: 2
      })
    }
  
    render(){
        if (this.state.registro==0) {
          return (
            <div className="contenedor_central">
            <strong>Completá tus datos</strong>
    
            </div>
              
            );
        } if(this.state.registro==0) {
          return (
            <div className="contenedor_central">
              <Boton name="Nueva cuenta de usuario" onClick={this.handleHide}></Boton>
              <Boton name="Nueva cuenta de servicio" onClick={this.handleShow}></Boton>
            </div>
          );
           
        } if(this.state.registro==2) {
          return(
          <div className="contenedor_central">
            <strong>Se ha enviado al correo informacion para continuar con el registro</strong>
          </div>
        );
      }
        }
  };

  class Segmentos extends Component{

    Seleccionado = (seleccion: string | undefined)  =>{
      var input=(document.getElementById("prueba") as HTMLTextAreaElement);

      if(seleccion==="pendientes"){
        input.innerHTML='Sin Servicios Pendientes';
      }
      if(seleccion==="curso"){
                input.innerHTML="Sin Servicios en Curso";
      }
      if(seleccion==="cancelados"){
        input.innerHTML="Sin Servicios en Cancelados";

      }
    }
    render(){
      return(
        <IonSegment onIonChange={e => this.Seleccionado(e.detail.value)} >
          <IonSegmentButton value="curso">
          <IonLabel>Servicios en Curso</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="pendientes">
          <IonLabel>Servicios Pendientes</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="cancelados">
          <IonLabel>Servicios Cancelados</IonLabel>
        </IonSegmentButton>
      </IonSegment>
      );
    }
  };

 

  
  export default MisServicios;

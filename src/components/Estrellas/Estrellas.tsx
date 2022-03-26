import React from "react"
import './Estrellas.css';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonTitle, IonButton } from "@ionic/react";



const Estrellas = (props:{calificacion:any}) =>{
    if (props.calificacion=="0"){
      return(
        <div id="contenedorEstrellas">
          <h2 id="badsStart">&#9733;</h2><h2 id="badsStart">&#9733;</h2 ><h2 id="badsStart">&#9733;</h2><h2 id="badsStart">&#9733;</h2><h2 id="badsStart">&#9733;</h2>
          </div >
      )
    }else if(props.calificacion=="1"){
      return(
        <div id="contenedorEstrellas">
          <h2 id="godsStart">&#9733;</h2><h2 id="badsStart">&#9733;</h2 ><h2 id="badsStart">&#9733;</h2><h2 id="badsStart">&#9733;</h2><h2 id="badsStart">&#9733;</h2>
          </div>
      )
    }else if(props.calificacion=="2"){
      return(
        <div id="contenedorEstrellas">
          <h2 id="godsStart">&#9733;</h2><h2 id="godsStart">&#9733;</h2 ><h2 id="badsStart">&#9733;</h2><h2 id="badsStart">&#9733;</h2><h2 id="badsStart">&#9733;</h2>
          </div>
      )
    }else if(props.calificacion=="3"){
      return(
        <div id="contenedorEstrellas">
          <h2 id="godsStart">&#9733;</h2><h2 id="godsStart">&#9733;</h2 ><h2 id="godsStart">&#9733;</h2><h2 id="badsStart">&#9733;</h2><h2 id="badsStart">&#9733;</h2>
          </div>
      )
    }else if(props.calificacion=="4"){
      return(
        <div id="contenedorEstrellas">
          <h2 id="godsStart">&#9733;</h2><h2 id="godsStart">&#9733;</h2 ><h2 id="godsStart">&#9733;</h2><h2 id="godsStart">&#9733;</h2><h2 id="badsStart">&#9733;</h2>
          </div>
      )
    }else{
      return(
        <div id="contenedorEstrellas">
          <h2 id="godsStart">&#9733;</h2><h2 id="godsStart">&#9733;</h2 ><h2 id="godsStart">&#9733;</h2><h2 id="godsStart">&#9733;</h2><h2 id="godsStart">&#9733;</h2>
          </div>
      )
    }
  
  }

  export default Estrellas;

  
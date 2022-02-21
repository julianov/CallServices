import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonPage, IonRow, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from '@ionic/react';
import axios from 'axios';
import { arrowBack } from 'ionicons/icons';
import React, { Component, useEffect, useRef, useState } from 'react';
import Https from '../utilidades/HttpsURL';
import './MisServicios.css';
import { informacionOrdenes } from './VerOrdenes';

const url=Https

const MisServicios = ( props: {cliente:boolean, email:string}) => {

  const [tipo, setTipo] = useState("")
  useEffect(() => {

    if(props.cliente){
      setTipo("cliente")
    }else{
      setTipo("proveedor")
    }

  }, [props.cliente]);

    return (
            <IonPage>
              <IonHeader>
                <IonToolbar  >
                <IonGrid>
                  <IonRow >
                  <IonCol size="1" > <IonButtons > <IonMenuButton />          </IonButtons> </IonCol>
                    <IonCol id="columna2" ><strong id="texto-pagina">MIS SERVICIOS</strong></IonCol>
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
              <SegmentosServicios tipo={tipo} email={props.email} ></SegmentosServicios>
              <div id="contenedor-central">
                <strong id="prueba">SIN SERVICIOS EN CURSO</strong>
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

 /* class Segmentos extends Component{

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
        <IonSegment mode="ios" onIonChange={e => this.Seleccionado(e.detail.value)} value="curso" color="primary" scrollable={true}>
          <IonSegmentButton value="pendientes">
          <IonLabel>REALIZADOS</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="curso">
          <IonLabel>EN CURSO</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="cancelados">
          <IonLabel>CANCELADOS</IonLabel>
        </IonSegmentButton>
      </IonSegment>
      );
    }
  };*/

 
const SegmentosServicios = (props: {tipo:string, email:string}) => {

  const [seleccionado, setSelecionado] = useState ( "curso")

  const [ticket, setTicket] =useState("")

  useEffect(() => {




  }, [seleccionado]);

  if(ticket!=""){

    return(
      <IonContent>
      <div id="flechaVolver">
          <IonIcon icon={arrowBack} onClick={() => setTicket("")} slot="start" id="flecha-volver">  </IonIcon>
      </div>
      <div id="contenedorCentroVerOrdenes">

          <VerOrdenParticular ticket={ticket} />
      </div>
  </IonContent>
    )

  }else{
    return(
      <><IonSegment id="segmentoMisServicios" mode="ios" onIonChange={e => setSelecionado(e.detail.value!)} value={seleccionado} color="primary" scrollable={true}>
        <IonSegmentButton value="pendientes">
          <IonLabel>REALIZADOS</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="curso">
          <IonLabel>EN CURSO</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="cancelados">
          <IonLabel>CANCELADOS</IonLabel>
        </IonSegmentButton>
      </IonSegment>
      <Elementos tipo={props.tipo} seleccion={seleccionado} email={props.email} setTicket={setTicket} ></Elementos></>
    );
  }

  
}

const Elementos = (props: {tipo:string, seleccion:any, email:string, setTicket:any}) => {

  const tipoDeOrden = useRef("")
  
const [arregloOrdenes, setArregloOrdenes] =  useState <informacionOrdenes []> ( [])

  useEffect(() => {
    setArregloOrdenes([])
    tipoDeOrden.current=("EN CURSO")

    if (props.seleccion=="curso"){
      axios.get(url+"orden/consultarOrdenesCurso/"+props.tipo+"/"+props.email).then((resp: { data: any; }) => {
        if (resp.data!="bad"){
          setArregloOrdenes(resp.data.map((d: { rubro: any; status: any; fecha: any; ticket: any; }) => ({
            rubro:d.rubro,
            status:d.status,
            fecha:d.fecha,
            ticket:d.ticket
             }))
           );     
          }
        })

    }else if(props.seleccion=="cancelados"){
      tipoDeOrden.current=("CANCELADAS O RECHAZADAS")
      setArregloOrdenes([])
      axios.get(url+"orden/consultarOrdenesCanceladas/"+props.tipo+"/"+props.email).then((resp: { data: any; }) => {
        if (resp.data!="bad"){
          setArregloOrdenes(resp.data.map((d: { rubro: any; status: any; fecha: any; ticket: any; }) => ({
            rubro:d.rubro,
            status:d.status,
            fecha:d.fecha,
            ticket:d.ticket
             }))
           );     
          }
        })
    }else{
      tipoDeOrden.current=("FINALIZADAS")
      setArregloOrdenes([])
      axios.get(url+"orden/consultarOrdenesFinalizadas/"+props.tipo+"/"+props.email).then((resp: { data: any; }) => {
        if (resp.data!="bad"){
          setArregloOrdenes(resp.data.map((d: { rubro: any; status: any; fecha: any; ticket: any; }) => ({
            rubro:d.rubro,
            status:d.status,
            fecha:d.fecha,
            ticket:d.ticket
             }))
           );     
          }
        })
    }



  }, [props.seleccion, props.tipo]);

  if(arregloOrdenes.length>0){
    return( 
        <IonContent>
            <div id="contenedorMisOrdenesColor">

            <div id="contenedorCentroVerOrdenes">
                <MostrarOrdenes informacion={arregloOrdenes} setTicket={props.setTicket}  />
            </div>
            </div>
        </IonContent>
    )
}else{
    return (
      <IonContent>
     
     <div id="padreMisServicios">
     <div id="hijoMisServicios">
                        <IonTitle id="noHayOrdenes">SIN ÓRDENES {tipoDeOrden.current} </IonTitle>
                    </div>
                </div>
            </IonContent>
    )
}
}

const MostrarOrdenes = (props:{ informacion:Array<informacionOrdenes>, setTicket:any}) => {

  var i=0
  //if (props.proveedores!=[]){
    return (
      <div id="elementos">
        {props.informacion.map((a) => {
          i=i+1
          //item, imagen personal, distancia, calificación, email, nombre, apellido, tipo
          return (
              
          <Card key={i} rubro={a.rubro} status={a.status} fecha={a.fecha} ticket={a.ticket} setTicket={props.setTicket} ></Card> 
          
          ) 
        })
        }
    </div>
  )
}



const Card = (props:{ rubro: string, status:string, fecha:string, ticket:string, setTicket:any}) => {

  const [estado, setEstado] = useState("REALIZADA")

  useEffect(() => {
  if (props.status=="ENV"){
      setEstado("GENERADA")
    }else if(props.status=="REC"){
      setEstado("ORDEN RECIBIDA POR PROVEEDOR")
    }else if(props.status=="ABI"){
      setEstado("ORDEN RECIBIDA POR PROVEEDOR")
    }else if(props.status=="PEI"){
      setEstado("ORDEN CON SOLCITUD DE MÁS INFORMACIÓN")
    } else if(props.status=="PRE"){
      setEstado("ORDEN PRE ACEPTADA POR PROVEEDOR")
    }else if(props.status=="ACE"){
      setEstado("ORDEN ACEPTADA")
    }else if(props.status=="EVI"){
      setEstado("PROVEEDOR EN VIAJE")
    }else if(props.status=="ENS"){
      setEstado("PROVEEDOR EN SITIO")
    }else if(props.status=="RED"){
      setEstado("REALIZADA")
    }else if (props.status=="REX"){
      setEstado("RECHAZADA")
    }else if (props.status=="CAN"){
      setEstado("CANCELADA")
    }
  }, [])
  return(
      <IonCard id="ionCardOrden" onClick={ () => props.setTicket(props.ticket) }>
      <div id="contenedorCamposCentro">
      <div id="divSentencias">
      <p>RUBRO: {props.rubro} </p>
      <p>ESTADO: {estado} </p> 
      <p>FECHA DE ORDEN: {props.fecha} </p>
      <p>TICKET: {props.ticket} </p>

      </div>
      </div>
      </IonCard>
  )
}

interface datosSemiCompletosOrdenes{

tipo:string
status:string
fecha_creacion:string 
ticket:string
dia:string
time:string
titulo:string
descripcion:string
reseña_al_proveedor:string
proveedor_nombre:string
}

const VerOrdenParticular = (props:{ ticket: string }) => {

const [datosOrdenGeneral, setDatosOrdenGeneral] = useState <datosSemiCompletosOrdenes> (
  {
    tipo:"",
    status:"",
    fecha_creacion:"",
    ticket:"",
    dia:"",
    time:"",
    titulo:"",
    descripcion:"",
    reseña_al_proveedor:"",
    proveedor_nombre:"",
    }
)

useEffect(() => {

  axios.get(url+"orden/consultarOrdenParticular/"+props.ticket).then((resp: { data: any; }) => {
    if (resp.data!="bad"){           
            setDatosOrdenGeneral(
              {tipo:resp.data.tipo,
                status:resp.data.status,
                fecha_creacion:resp.data.fecha_creacion,
                ticket:resp.data.ticket,
                dia:resp.data.dia,
                time:resp.data.time,
                titulo:resp.data.titulo,
                descripcion:resp.data.descripcion,
                reseña_al_proveedor:resp.data.reseña_al_proveedor,
                proveedor_nombre:resp.data.proveedor_nombre,}
            )

       
           //s informacion.push({rubro:resp.data[i].rubro,status:resp.data[i].status, fecha:resp.data[i].fecha})
            
          
     
      }
    })

  }, [])

 /* useEffect(() => {
    if (props.status=="ENV"){
        setEstado("GENERADA")
      }else if(props.status=="REC"){
        setEstado("ORDEN RECIBIDA POR PROVEEDOR")
      }else if(props.status=="ABI"){
        setEstado("ORDEN RECIBIDA POR PROVEEDOR")
      }else if(props.status=="PEI"){
        setEstado("ORDEN CON SOLCITUD DE MÁS INFORMACIÓN")
      } else if(props.status=="PRE"){
        setEstado("ORDEN PRE ACEPTADA POR PROVEEDOR")
      }else if(props.status=="ACE"){
        setEstado("ORDEN ACEPTADA")
      }else if(props.status=="EVI"){
        setEstado("PROVEEDOR EN VIAJE")
      }else if(props.status=="ENS"){
        setEstado("PROVEEDOR EN SITIO")
      }else if(props.status=="RED"){
        setEstado("REALIZADA")
      }else if (props.status=="REX"){
        setEstado("RECHAZADA")
      }else if (props.status=="CAN"){
        setEstado("CANCELADA")
      }
    }, [])*/


  return(
    <div id="ionContentModalVerOrdenes">
         
        <IonCard id="ionCard-explorerContainer-Proveedor">
          <div id="divSentencias">
          <p >TIPO: {datosOrdenGeneral.tipo.toUpperCase()}</p>
          <p >STATUS: {datosOrdenGeneral.status}</p>
          <p >TICKET: {datosOrdenGeneral.ticket}</p>
          <p >FECHA CREACIÓN: {datosOrdenGeneral.fecha_creacion}</p>
          <p >TITULO: {datosOrdenGeneral.titulo}</p>
          <p >DESCRIPCIÓN: {datosOrdenGeneral.descripcion}</p>
          <p >PROVEEDOR: {datosOrdenGeneral.proveedor_nombre}</p>
          <p >RESEÑA AL PROVEEDOR: {datosOrdenGeneral.reseña_al_proveedor}</p>
          </div>
          </IonCard >
          </div>

  )

}


  
  export default MisServicios;

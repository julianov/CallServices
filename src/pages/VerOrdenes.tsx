
import axios from 'axios';
import { arrowBack } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import Estrellas from '../components/Estrellas/Estrellas';
import Https from '../utilidades/HttpsURL';
import { IonCard, IonContent, IonIcon, IonTitle } from '@ionic/react';

import './VerOrdenes.css';
import { retornarIconoCategoria } from '../utilidades/retornarIconoCategoria';

const url=Https


export interface informacionOrdenes{
    rubro:string
    status:string
    fecha:string
    ticket:string
  }
  
  //let informacion = new Array<informacionOrdenes>();

const VerOrdenesCliente = (props:{clienteEmail:any , tipo:string, setCerrar:any}) => {

    //const [hayOrdenes, setHayOrdenes] = useState (false)
    const [ticket, setTicket] = useState ("")

    const [informacion, setInformacion] =  useState <informacionOrdenes []> ( [])

    useEffect(() => {

        axios.get(url+"orden/consultarOrdenes/"+props.tipo+"/"+props.clienteEmail).then((resp: { data: any; }) => {
            if (resp.data!="bad"){
                
              /*  for (let i=0; i<resp.data.length;i++){               
                    informacion.push({rubro:resp.data[i].rubro,status:resp.data[i].status, fecha:resp.data[i].fecha, ticket:resp.data[i].ticket})
                  }*/
                  setInformacion(resp.data.map((d: { rubro: any; status: any; fecha: any; ticket: any; }) => ({
                    rubro:d.rubro,
                    status:d.status,
                    fecha:d.fecha,
                    ticket:d.ticket
                     }))
                   );     
                 // setHayOrdenes(true)
              }
            })

    }, [])


    if(ticket==""){
      if(informacion.length>0){
        return( 
            <IonContent>
             <div id="fondeVerOrdenes">
                <div id="flechaVolver">
                    <IonIcon icon={arrowBack} onClick={() => props.setCerrar(null)} slot="start" id="flecha-volver">  </IonIcon>
                </div>
                <div id="contenedorCentroVerOrdenes">
                  <MostrarOrdenes informacion={informacion} setCerrar={props.setCerrar} setTicket={setTicket} />
                </div>
              </div>
            </IonContent>
        )
    }else{
        return (
          <IonContent>
            <div id="fondeVerOrdenes">
              <div id="flechaVolver">
                  <IonIcon icon={arrowBack} onClick={() => props.setCerrar(null)} slot="start" id="flecha-volver">  </IonIcon>
              </div>
              <div id="contenedorCentroVerOrdenes">
                <div id="contenedorPrincipal">
                  <div id="contenedorHijoCentrado">
                    <IonTitle>NO HA SOLICITADO ÓRDENES DE TRABAJO</IonTitle>
                  </div>
                </div>
              </div>
            </div>
          </IonContent>
        )
    }
    }else{

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
    }

}


const MostrarOrdenes = (props:{ informacion:Array<informacionOrdenes>,setCerrar:any, setTicket:any}) => {

    var i=0
    //if (props.proveedores!=[]){
      return (
        <div style={{display:"flex", flexDirection:"column", width:"100%", height:"auto", justifyContent:"center", alignItems:"center"}}>
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

    const [imagenes,setImagen]=useState ("")


    useEffect(() => {

      setImagen(retornarIconoCategoria(props.rubro)) 

      if (props.status=="ENV"){
        setEstado("GENERADA")
      }
      else if(props.status=="REC"){
        setEstado("ORDEN RECIBIDA POR PROVEEDOR")

      }else if(props.status=="PEI"){
        setEstado("ORDEN CON SOLCITUD DE MÁS INFORMACIÓN")

      }else if(props.status=="RES"){
        setEstado("INFORMACIÓN ADICIONAL REQUERIDA ENVIADA")

      }else if(props.status=="PRE"){
        setEstado("PRESUPUESTADA")

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
        <IonCard id="CardOrden" onClick={() => props.setTicket(props.ticket) }>
          <img id="imgOrden" src={imagenes}></img> 
          <div id="contenedorCamposCentro">
              <p>RUBRO: {props.rubro} </p>
              <p>ESTADO: {estado} </p> 
              <p>FECHA DE ORDEN: {props.fecha} </p>
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
        }
      })

    }, [])


    const [estado, setEstado] = useState("REALIZADA")

    useEffect(() => {
      if (datosOrdenGeneral.status=="ENV"){
          setEstado("GENERADA")
        }else if(datosOrdenGeneral.status=="REC"){
          setEstado("ORDEN RECIBIDA POR PROVEEDOR")
        }else if(datosOrdenGeneral.status=="ABI"){
          setEstado("ORDEN RECIBIDA POR PROVEEDOR")
        }else if(datosOrdenGeneral.status=="PEI"){
          setEstado("ORDEN CON SOLCITUD DE MÁS INFORMACIÓN")
        } else if(datosOrdenGeneral.status=="PRE"){
          setEstado("ORDEN PRE ACEPTADA POR PROVEEDOR")
        }else if(datosOrdenGeneral.status=="ACE"){
          setEstado("ORDEN ACEPTADA")
        }else if(datosOrdenGeneral.status=="EVI"){
          setEstado("PROVEEDOR EN VIAJE")
        }else if(datosOrdenGeneral.status=="ENS"){
          setEstado("PROVEEDOR EN SITIO")
        }else if(datosOrdenGeneral.status=="RED"){
          setEstado("REALIZADA")
        }else if (datosOrdenGeneral.status=="REX"){
          setEstado("RECHAZADA")
        }else if (datosOrdenGeneral.status=="CAN"){
          setEstado("CANCELADA")
        }
      }, [datosOrdenGeneral.status])

//aca en el return hay que dar vuelta la fecha porque está en año, mes y dia
    return(
      <div id="ionContentModalVerOrdenes">
        <IonCard id="ionCard-explorerContainer-Proveedor">
          <div id="divSentencias">
            <p >TIPO: {datosOrdenGeneral.tipo.toUpperCase()}</p>
            <p >STATUS: {estado}</p>
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

export default VerOrdenesCliente 
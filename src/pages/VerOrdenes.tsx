
import axios from 'axios';
import { arrowBack } from 'ionicons/icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Estrellas from '../components/Estrellas/Estrellas';
import Https from '../utilidades/HttpsURL';
import { IonCard, IonContent, IonIcon, IonTitle } from '@ionic/react';

import './VerOrdenes.css';
import { retornarIconoCategoria } from '../utilidades/retornarIconoCategoria';
import { UserContext } from '../Contexts/UserContext';

const url=Https


export interface informacionOrdenes{
    rubro:string
    status:string
    fecha:string
    ticket:string
  }
  
  //let informacion = new Array<informacionOrdenes>();

const VerOrdenesCliente = (props:{tipo:string, setCerrar:any}) => {

    //const [hayOrdenes, setHayOrdenes] = useState (false)
    const [ticket, setTicket] = useState ("")

    const [informacion, setInformacion] =  useState <informacionOrdenes []> ( [])

    const  {user,setUser}  = useContext(UserContext)

    useEffect(() => {

        axios.get(url+"orden/consultarOrdenes/"+props.tipo+"/"+user!.email).then((resp: { data: any; }) => {
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
            <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100vh", background:"#f3f2ef"}}>

              
            <div id="modalProveedor-flechaVolver">
                    <IonIcon icon={arrowBack} onClick={() => props.setCerrar(null)} slot="start" id="flecha-volver">  </IonIcon>
                </div>
                <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100%", justifyContent:"center", alignItems:"center"}}>
                  
                  <IonTitle>NO HA SOLICITADO ÓRDENES DE TRABAJO</IonTitle>
                    
                </div>
           
            </div>
          </IonContent>
        )
    }
    }else{

      return( 
        <div style={{width:"100%", height:"100%", display:"flex", flexDirection:"column"}}>
          <div id="flechaVolver">
                <IonIcon icon={arrowBack} onClick={() => setTicket("")} slot="start" id="flecha-volver">  </IonIcon>
            </div>
          <div id="contenedorCentroVerOrdenes">

            <VerOrdenParticular ticket={ticket} />
            
            </div>
        </div>
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
          
              <h1 style={{fontSize:"1em", color:"black", marginTop:"10px"}}>RUBRO: {props.rubro} </h1>
              <h1 style={{fontSize:"1em", color:"black", marginTop:"10px"}}>ESTADO: {estado} </h1> 
              <h1 style={{fontSize:"1em", color:"black", marginTop:"10px"}}>FECHA DE ORDEN: {props.fecha} </h1>
          
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
        <IonCard style={{width:"90%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center"}} >
          
            <h1 style={{fontSize:"1em", color:"black", marginTop:"10px"}} >TIPO: {datosOrdenGeneral.tipo.toUpperCase()}</h1>
            <h1 style={{fontSize:"1em", color:"black", marginTop:"10px"}}>STATUS: {estado}</h1>
            <h1 style={{fontSize:"1em", color:"black", marginTop:"10px"}}>TICKET: {datosOrdenGeneral.ticket}</h1>
            <h1 style={{fontSize:"1em", color:"black", marginTop:"10px"}}>FECHA CREACIÓN: {datosOrdenGeneral.fecha_creacion}</h1>
            <h1 style={{fontSize:"1em", color:"black", marginTop:"10px"}}>TITULO: {datosOrdenGeneral.titulo}</h1>
            <h1 style={{fontSize:"1em", color:"black", marginTop:"10px"}}>DESCRIPCIÓN: {datosOrdenGeneral.descripcion}</h1>
            <h1 style={{fontSize:"1em", color:"black", marginTop:"10px"}}>PROVEEDOR: {datosOrdenGeneral.proveedor_nombre}</h1>
            <h1 style={{fontSize:"1em", color:"black", marginTop:"10px"}}>RESEÑA AL PROVEEDOR: {datosOrdenGeneral.reseña_al_proveedor}</h1>
          
        </IonCard >
    )
}

export default VerOrdenesCliente 
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createStore, getDB, removeDB, setDB } from "./dataBase";
import { getItem, removeItem, setItem } from "./Storage";
import './CardProveedor.css';
import Estrellas from "../components/Estrellas/Estrellas";
import { contractSharp } from "ionicons/icons";
import { categoriaBuscada } from "../components/ResultadoBusqueda/ResultadoBusqueda";
import Resenas from "../components/Reseñas/Resenas";
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonTitle, IonButton, IonGrid, IonCol, IonRow, IonItemDivider, IonModal } from "@ionic/react";
import OrdenSimple from "../pages/PedirOrdenes/PedirOrden";
import { retornarIconoCategoria } from "./retornarIconoCategoria";



export interface datosOrden{
  clienteEmail:String,
  nombre:string,
  proveedorEmail:string,
  tipo:string,
  last_name:string,
  picture:string,
  items:string,
  qualification:number,
  dias_proveedor:string
   }
   
   interface datosProveedor{
    nombre:string
    tipo:string
    last_name:string
    picture:string
    distancia:number
    items:string
    qualification:number
    locacion:string
    days_of_works:string
    hour_init:string
    hour_end:string
    description:string
    pais:string
    provincia:string
    ciudad:string
    calle:string
    numeracion:string
  }

  interface imagenesProveedor{
    certificate:string
    picture1:string
    picture2:string
    picture3:string
  }


const CardProveedor= (props:{ data:any, imagenes:any, emailCliente:String, proveedorEmail:string	}) => {
   
  const [showModalOrden, setShowModalOrden] = useState( false );
  const [showModalVerReseñas, setShowModalVerReseñas] = useState( false );

  const [ultimos, setUltimos] =  useState <categoriaBuscada []> ( [])

  const [imagen,setImagen]=useState ("")

  const proveedorVaALocacion = useRef(true)
  
    const datosDeOrdenes = useRef<datosOrden>(
      {
        clienteEmail:props.emailCliente,
        nombre:"",
        proveedorEmail:props.proveedorEmail,
        tipo:"",
        last_name:"",
        picture:"",
        items:"",
        qualification:0,
        dias_proveedor:"",
         }
    )
 
  const [datosProveedoresArray, setDatosProveedores] = useState <datosProveedor>(
            {nombre:"nombre",
            last_name:"apellido",
            tipo:"",
            picture:"",
            distancia:0,
            items:"",
            qualification:0,
            locacion:"",
            days_of_works:"",
            hour_init:"",
            hour_end:"",
            description:"",
            pais:"",
            provincia:"",
            ciudad:"",
            calle:"",
            numeracion:""}
  );

  useEffect(() => {
    if (datosProveedoresArray.picture==""|| datosProveedoresArray.picture==null || datosProveedoresArray.picture==undefined){
      setImagen ("./assets/icon/nuevoUsuario.png") 
    }else{
      setImagen(datosProveedoresArray.picture)
    }
  }, [datosProveedoresArray.picture]);

  const [imagenesProveedoresArray, setImagenesProveedores] = useState <imagenesProveedor>(
    {
      certificate:"",
    picture1:"",
    picture2:"",
    picture3:""
    }
  )

  var tipo=""
 
    useEffect(() => {
      
      var location=""
      if(props.data!=undefined){   
        
        if(props.data.radio<=1){
          location=("EL PROVEEDOR NO SE DESPLAZA A LOCACIONES DE CLIENTES")
          proveedorVaALocacion.current=(false)
        }else{
          location=("EL PROVEEDOR SE DESPLAZA A LOCACIONES DE CLIENTES")
          proveedorVaALocacion.current=(true)

        }
        
        setDatosProveedores({nombre:props.data.name,
          last_name:props.data.last_name,
          tipo:props.data.tipo,
          picture:props.data.picture,
          distancia:props.data.distancia,
          items:props.data.items,
          qualification:props.data.qualification,
          locacion:location,
          days_of_works:props.data.days_of_works,
          hour_init:props.data.hour_init,
          hour_end:props.data.hour_end,
          description:props.data.description,
          pais:props.data.pais,
          provincia:props.data.provincia,
          ciudad:props.data.ciudad,
          calle:props.data.calle,
          numeracion:props.data.numeracion})

      }
      
      if(props.imagenes!=undefined){

        var certificado=""
        var imagen1=""
        var imagen2=""
        var imagen3=""
        if (props.imagenes.certificate!=undefined){
          certificado=props.imagenes.certificate
        }
        if (props.imagenes.picture1!=undefined){
          imagen1=props.imagenes.picture1
        }
        if (props.imagenes.picture2!=undefined){
          imagen2=props.imagenes.picture2
        }
        if (props.imagenes.picture3!=undefined){
          imagen3=props.imagenes.picture3
        }
        setImagenesProveedores(
          {
            certificate:certificado,
            picture1:imagen1,
            picture2:imagen2,
            picture3:imagen3
          }
        )

      }

    }, [props.data, props.imagenes])
    
     
    useEffect(() => {   

      if (datosProveedoresArray.nombre!="nombre" && datosProveedoresArray.last_name!="apellido" && datosProveedoresArray.picture!="" && datosProveedoresArray.qualification!=undefined && datosProveedoresArray.items!=""){
        console.log("tiene que haberse ejecutado getDB")
        getDB("UltimosProveedores").then(res => {
           if(res!=null){
             if(res.length<5){
               if ( ! ultimos.includes(  {item:datosProveedoresArray.items,tipo:datosProveedoresArray.tipo,nombre:datosProveedoresArray.nombre,apellido:datosProveedoresArray.last_name,imagen:datosProveedoresArray.picture,calificacion:datosProveedoresArray.qualification.toString(),email:props.proveedorEmail}  ) )
               {  
                 setUltimos([...ultimos, {item:datosProveedoresArray.items,tipo:datosProveedoresArray.tipo,nombre:datosProveedoresArray.nombre,apellido:datosProveedoresArray.last_name,imagen:datosProveedoresArray.picture,calificacion:datosProveedoresArray.qualification.toString(),email:props.proveedorEmail} ] )
                 setDB("UltimosProveedores", ultimos)
               }              
             }else{
               if ( ! ultimos.includes(  {item:datosProveedoresArray.items,tipo:datosProveedoresArray.tipo,nombre:datosProveedoresArray.nombre,apellido:datosProveedoresArray.last_name,imagen:datosProveedoresArray.picture,calificacion:datosProveedoresArray.qualification.toString(),email:props.proveedorEmail}  ) )
               {
                 ultimos.shift() //elimino el primer elemento del array
                 setUltimos([...ultimos, {item:datosProveedoresArray.items,tipo:datosProveedoresArray.tipo,nombre:datosProveedoresArray.nombre,apellido:datosProveedoresArray.last_name,imagen:datosProveedoresArray.picture,calificacion:datosProveedoresArray.qualification.toString(),email:props.proveedorEmail} ] )
               setDB("UltimosProveedores", JSON.stringify(ultimos))
               }
              
             }
           }else{
            setUltimos([{item:datosProveedoresArray.items,tipo:datosProveedoresArray.tipo,nombre:datosProveedoresArray.nombre,apellido:datosProveedoresArray.last_name,imagen:datosProveedoresArray.picture,calificacion:datosProveedoresArray.qualification!.toString(),email:props.proveedorEmail} ] )
            setDB("UltimosProveedores", ultimos)
           
           }
         })    }
    
      }, [datosProveedoresArray])
  
      useEffect(() => {
  
        if (ultimos.length  > 0 ){
          setDB("UltimosProveedores", (ultimos))
  
        }
  
        }, [ultimos])
  

      const contratar = () =>{
        datosDeOrdenes.current= (
        {
          clienteEmail:props.emailCliente,
          nombre:datosProveedoresArray.nombre+" "+datosProveedoresArray.last_name,
          proveedorEmail:props.proveedorEmail,
          tipo:datosProveedoresArray.tipo,
          last_name:datosProveedoresArray.last_name,
          picture:datosProveedoresArray.picture,
          items:datosProveedoresArray.items,
          qualification:datosProveedoresArray.qualification,
          dias_proveedor:datosProveedoresArray.days_of_works
        })

        setShowModalOrden( true )
    
      }

      
      if(datosProveedoresArray.tipo=="Proveedor de servicio independiente"){
        return (
          <>
          <IonCard id="ionCard-CardProveedor">
            <IonCardHeader>
              <IonGrid>
                <IonRow id="row-busqueda">
                  <IonCol size="auto" id="col-explorerContainerCliente">
                    <img id="ionCard-explorerContainer-Cliente-Imagen" src={imagen}></img></IonCol>
                </IonRow>
                <IonRow id="row-busqueda">
                  <IonCol size="auto" id="col-explorerContainerCliente">
                    <IonCardTitle>{datosProveedoresArray.nombre+ " " + datosProveedoresArray.last_name}</IonCardTitle>
                    <Estrellas calificacion={datosProveedoresArray.qualification}></Estrellas>

                    <IonItemDivider />

                    <IonCardSubtitle>RUBRO: {datosProveedoresArray.items}</IonCardSubtitle>
                    <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria(props.data.items)}></img>

                    <IonCardSubtitle>{tipo}</IonCardSubtitle>
                  </IonCol>
                </IonRow>
                
                <IonRow id="row-busqueda">
                  <IonCol size="auto" id="col-explorerContainerCliente">
                </IonCol>
                </IonRow>
                <IonItemDivider></IonItemDivider>
                <IonRow id="row-busqueda">
                  <IonCol size="auto" id="col-explorerContainerCliente">
                  <strong>DESCRIPCIÓN:</strong>
                  <div style={{display:"flex", flexDirection:"column", textAlign:"left"}}>

                  <p style={{fontSize:"1.2em",color:"black"}}> {datosProveedoresArray.description} </p>
                  </div>
                </IonCol></IonRow>
              </IonGrid>
            </IonCardHeader>
          </IonCard>
         
          <IonCard id="ionCard-CardProveedor">
            <div style={{display:"flex", flexDirection:"column", textAlign:"center"}}>
            <h1 style={{fontSize:"1em",fontWeight:"bold", color:"black"}}>LOCACIÓN DEL PROVEEDOR</h1>
              </div>
              <IonItemDivider></IonItemDivider>
              <div style={{display:"flex", textAlign:"center"}}>
              <IonItem lines="none"> {datosProveedoresArray.locacion} </IonItem>
              </div>
                <div id="CardProveedorContainer">
                  <IonItem  lines="none"> DISTANCIA ACTUAL AL PROVEEDOR: {Math.round(datosProveedoresArray.distancia)} km </IonItem>
                  <IonItem lines="none"> PAÍS: {datosProveedoresArray.pais}  </IonItem>
                  <IonItem lines="none"> PROVINCIA/DEPARTAMENTO/ESTADO: {datosProveedoresArray.provincia}  </IonItem>
                  <IonItem lines="none"> CIUDAD: {datosProveedoresArray.ciudad}  </IonItem>
                  <IonItem lines="none"> DOMICILIO: {datosProveedoresArray.calle} {datosProveedoresArray.numeracion}  </IonItem>
                </div>
            </IonCard>

            
            <IonCard id="ionCard-CardProveedor">
              <div style={{display:"flex", flexDirection:"column", textAlign:"center"}}>
              <h1 style={{fontSize:"1em",fontWeight:"bold", color:"black"}}>DATOS DE JORNADA LABORAL</h1>
              </div>
              <IonItemDivider></IonItemDivider>
                <div id="CardProveedorContainer">
                  <IonItem lines="none"> DIAS LABORALES: {datosProveedoresArray.days_of_works}  </IonItem>
                  <IonItem lines="none"> HORA DE INICIO DE LA JORNADA: {datosProveedoresArray.hour_init}  </IonItem>
                  <IonItem lines="none"> HORA DE FIN DE LA JORNADA: {datosProveedoresArray.hour_end}  </IonItem>
                </div>
            </IonCard>

           
            <IonCard id="ionCard-CardProveedor">
              <div style={{display:"flex", flexDirection:"column", textAlign:"center"}}>
              <h1 style={{fontSize:"1em",fontWeight:"bold", color:"black"}}>CERTIFICADO</h1>
              </div>
              <IonItemDivider></IonItemDivider>
                <Certificado certificado={imagenesProveedoresArray.certificate}></Certificado>
            </IonCard>
           
            <IonCard id="ionCard-CardProveedor">
            <div style={{display:"flex", flexDirection:"column", textAlign:"center"}}>
            <h1 style={{fontSize:"1em",fontWeight:"bold", color:"black"}}> IMÁGENES DE REFERENCIA</h1>
            </div>
            <IonItemDivider></IonItemDivider>
                <Imagenes picture1={imagenesProveedoresArray.picture1} picture2={imagenesProveedoresArray.picture2} picture3={imagenesProveedoresArray.picture3}></Imagenes>              
            </IonCard>

              <IonGrid>
                <IonRow>
                <IonCol>
                    <IonButton shape="round" color="primary"  id="botonContratar"  onClick={() => setShowModalVerReseñas( true )}>RESEÑAS</IonButton>
                    </IonCol>
                    <IonCol>
                    <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => contratar()} >CONTRATAR</IonButton>
                    </IonCol>
                </IonRow>
              </IonGrid>

            <IonModal
            animated={true}
            isOpen={showModalOrden}
            onDidDismiss={() => setShowModalOrden( false)}
            >
            <OrdenSimple
              data={datosDeOrdenes.current} 
              clienteEmail={props.emailCliente}
              proveedorVaALocacion={proveedorVaALocacion.current}
              setVolver={setShowModalOrden} />
          </IonModal>
          
          <IonModal
            animated={true}
            isOpen={showModalVerReseñas}
            onDidDismiss={() => setShowModalVerReseñas(false )}
          >
            <Resenas
              tipo={datosDeOrdenes.current.tipo}
              email_a_ver_reseñas={datosDeOrdenes.current.proveedorEmail}
              setVolver={setShowModalVerReseñas} />
          </IonModal>
          </>
             
        )
      }else{
        return (
          <><IonCard id="ionCard-CardProveedor">
            <IonCardHeader>
              <IonGrid>
                <IonRow id="row-busqueda">
                  <IonCol size="auto" id="col-explorerContainerCliente">
                    <img id="ionCard-explorerContainer-Cliente-Imagen" src={imagen}></img></IonCol>
                  <IonCol size="auto" id="col-explorerContainerCliente">
                    <IonCardTitle>{datosProveedoresArray.nombre + " " + datosProveedoresArray.last_name}</IonCardTitle>
                    <IonCardSubtitle>RUBRO: {datosProveedoresArray.items}</IonCardSubtitle>
                    <IonCardSubtitle>{tipo}</IonCardSubtitle>
                    <Estrellas calificacion={datosProveedoresArray.qualification}></Estrellas>
                  </IonCol>
                </IonRow>
                <IonRow>
                <IonItemDivider></IonItemDivider>

                <IonItem id="CardProveedorItem" lines="none"> {datosProveedoresArray.locacion} </IonItem>

                  <IonItemDivider></IonItemDivider>
                  <IonCol><div id="CardProveedorContainer">
                    <strong>DESCRIPCIÓN:</strong>
                    <IonItem lines="none"> {datosProveedoresArray.description} </IonItem>
                  </div></IonCol></IonRow>
              </IonGrid>
            </IonCardHeader>
          </IonCard>
          
          <IonCard id="ionCard-CardProveedor">
            <div style={{display:"flex", flexDirection:"column", textAlign:"center"}}>
            <h1 style={{fontSize:"1em",fontWeight:"bold", color:"black"}}>LOCACIÓN DEL PROVEEDOR</h1>
              </div>
              <IonItemDivider></IonItemDivider>
                <div id="CardProveedorContainer">
                  <IonItem  lines="none"> DISTANCIA ACTUAL AL PROVEEDOR: {Math.round(datosProveedoresArray.distancia)} km </IonItem>
                  <IonItem lines="none"> PAÍS: {datosProveedoresArray.pais}  </IonItem>
                  <IonItem lines="none"> PROVINCIA/DEPARTAMENTO/ESTADO: {datosProveedoresArray.provincia}  </IonItem>
                  <IonItem lines="none"> CIUDAD: {datosProveedoresArray.ciudad}  </IonItem>
                  <IonItem lines="none"> DOMICILIO: {datosProveedoresArray.calle} {datosProveedoresArray.numeracion}  </IonItem>
                </div>
            </IonCard>

            
            <IonCard id="ionCard-CardProveedor">
              <div style={{display:"flex", flexDirection:"column", textAlign:"center"}}>
              <h1 style={{fontSize:"1em",fontWeight:"bold", color:"black"}}>DATOS DE JORNADA LABORAL</h1>
              </div>
              <IonItemDivider></IonItemDivider>

                <div id="CardProveedorContainer">
                  <IonItem lines="none"> DIAS LABORALES: {datosProveedoresArray.days_of_works}  </IonItem>
                  <IonItem lines="none"> HORA DE INICIO DE LA JORNADA: {datosProveedoresArray.hour_init}  </IonItem>
                  <IonItem lines="none"> HORA DE FIN DE LA JORNADA: {datosProveedoresArray.hour_end}  </IonItem>
                </div>
            </IonCard>

           
            <IonCard id="ionCard-CardProveedor">
              <div style={{display:"flex", flexDirection:"column", textAlign:"center"}}>
              <h1 style={{fontSize:"1em",fontWeight:"bold", color:"black"}}>CERTIFICADO</h1>
              </div>
              <IonItemDivider></IonItemDivider>
                <Certificado certificado={imagenesProveedoresArray.certificate}></Certificado>
            </IonCard>

           
            <IonCard id="ionCard-CardProveedor">
            <div style={{display:"flex", flexDirection:"column", textAlign:"center"}}>
            <h1 style={{fontSize:"1em",fontWeight:"bold", color:"black"}}> IMÁGENES DE REFERENCIA</h1>
            </div>
            <IonItemDivider></IonItemDivider>
                <Imagenes picture1={imagenesProveedoresArray.picture1} picture2={imagenesProveedoresArray.picture2} picture3={imagenesProveedoresArray.picture3}></Imagenes>              
            </IonCard>


            <div id="tituloCardPRoveedor">
                <strong>CONTRATAR LOS SERVICIOS DEL PROVEEDOR</strong>
              </div>
              <IonCard id="ionCard-CardProveedor">
              <IonGrid>
                <IonRow>
                    <IonButton shape="round" color="primary"  id="botonContratar" onClick={() => setShowModalVerReseñas( true )}>RESEÑAS</IonButton>
                </IonRow>
                <IonRow>
                    <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => contratar()} >CONTRATAR</IonButton>
                </IonRow>
              </IonGrid>
            </IonCard>
            
            <IonModal
            animated={true}
            isOpen={showModalOrden}
            onDidDismiss={() => setShowModalOrden( false )}>
            <OrdenSimple
              data={datosDeOrdenes.current} 
              clienteEmail={props.emailCliente} 
              proveedorVaALocacion={proveedorVaALocacion.current}
              setVolver={setShowModalOrden} />
          </IonModal>
          
          <IonModal
            animated={true}
            isOpen={showModalVerReseñas}
            onDidDismiss={() => setShowModalVerReseñas( false )} >
            <Resenas
              tipo={datosDeOrdenes.current.tipo}
              email_a_ver_reseñas={datosDeOrdenes.current.proveedorEmail}
              setVolver={setShowModalVerReseñas} />
          </IonModal>
          </>
        );
      }
    
  }


  const Imagenes= (props:{ picture1:any,picture2:any, picture3:any	}) => {
    if(props.picture1!="" && props.picture2!="" &&props.picture3!=""){
      return(
        <div id="CardProveedoresImg"><img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture1}></img>
          <img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture2}></img>
          <img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture3}></img></div>
      )
    }
    else if(props.picture1!="" && props.picture2!="" &&props.picture3==""){
      return(
        <div id="CardProveedoresImg"><img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture1}></img>
          <img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture2}></img>
        </div>
      )
    }
    else if(props.picture1!="" && props.picture2=="" &&props.picture3==""){
      return(
        <div id="CardProveedoresImg"><img id="ionCard-explorerContainer-Cliente-Imagen" src={props.picture1}></img>
        </div>
      )
    }else{
      return(
        <div id="CardProveedoresImg">
          <strong>EL PROVEEDOR NO HA ADJUNTADO IMÁGENES DE REFERENCIA</strong>
        </div>
      )
    }

  }

  const Certificado= (props:{ certificado:any	}) => {

    if(props.certificado!=""){
      return(
        <div id="CardProveedoresImg">
          <img id="ionCard-explorerContainer-Cliente-Imagen" src={props.certificado}></img>
        </div>
      )
    }else{
      return(
        <div id="CardProveedoresImg">
          <strong>EL PROVEEDOR NO HA ADJUNTADO CERTIFICACIÓN</strong>
        </div>
      )
    }
  }



  export default CardProveedor;

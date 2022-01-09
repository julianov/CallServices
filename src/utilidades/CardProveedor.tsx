import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonTitle, IonButton, IonGrid, IonCol, IonRow, IonItemDivider, IonModal } from "@ionic/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createStore, getDB, removeDB, setDB } from "./dataBase";
import { getItem, removeItem, setItem } from "./Storage";
import './CardProveedor.css';
import Estrellas from "./Estrellas";
import { contractSharp } from "ionicons/icons";
import OrdenSimple from "../pages/Orden";
import Resenas from "./Resenas";


var dataS :any

const CardProveedor= (props:{ data:any, imagenes:any, emailCliente:String, proveedorEmail:string	}) => {

  //el email del props es el email del proveedor
  //asi que al parecer tenemos 2 correos del proveedor

   
  

  const [showModalOrden, setShowModalOrden] = useState({ isOpen: false });
  const [showModalVerReseñas, setShowModalVerReseñas] = useState({ isOpen: false });


  const proveedorVaALocacion = useRef(true)
  
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

  interface datosOrden{
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

  const [imagenesProveedoresArray, setImagenesProveedores] = useState <imagenesProveedor>(
    {
      certificate:"",
    picture1:"",
    picture2:"",
    picture3:""
    }
  )

  var tipo=""
     
      //en último tiene que ir:
      //"Juan Carlos","Electricidad","Proveedor de servicio independiente"
      // mas el email y una imagen
     
      const guardarUltimoProveedor = () => {
        createStore("UltimosProveedores")

        getDB("UltimosProveedores").then(res => {
          if(res!=null){
            var ultimos= JSON.parse(res)

            if(ultimos.length<5){

              let igual=false

              for (var i=0;i < ultimos.length;i++){
                if(ultimos[i]==[props.proveedorEmail, datosProveedoresArray.nombre,datosProveedoresArray.last_name,tipo,datosProveedoresArray.picture,datosProveedoresArray.qualification,datosProveedoresArray.items]){
                  igual=true
                }

              }
              if(!igual){
                ultimos.push([props.proveedorEmail, datosProveedoresArray.nombre,datosProveedoresArray.last_name,tipo,datosProveedoresArray.picture,datosProveedoresArray.qualification,datosProveedoresArray.items])
                setDB("UltimosProveedores", JSON.stringify(ultimos))
              }
              
            }else{

              let igual=false

              for (var i=0;i < ultimos.length;i++){
                if(ultimos[i]==[props.proveedorEmail, datosProveedoresArray.nombre,datosProveedoresArray.last_name,tipo,datosProveedoresArray.picture,datosProveedoresArray.qualification,datosProveedoresArray.items]){
                  igual=true
                }
              }

              if(!igual){
                ultimos.shift() //elimino el primer elemento del array
                ultimos.push([props.proveedorEmail, datosProveedoresArray.nombre,datosProveedoresArray.last_name,tipo,datosProveedoresArray.picture,datosProveedoresArray.qualification,datosProveedoresArray.items])
                setDB("UltimosProveedores", JSON.stringify(ultimos))
              }

            }
            
          }else{

            var arreglo_guardar=[]
            arreglo_guardar.push([props.proveedorEmail,datosProveedoresArray.nombre,datosProveedoresArray.last_name,tipo,datosProveedoresArray.picture, datosProveedoresArray.qualification,datosProveedoresArray.items])
            setDB("UltimosProveedores", JSON.stringify(arreglo_guardar))
          
          }
        })
      }


      if (datosProveedoresArray.nombre!="nombre" && datosProveedoresArray.last_name!="apellido" && tipo!="" && datosProveedoresArray.picture!="" && datosProveedoresArray.qualification!=0 && datosProveedoresArray.items!=""){
        guardarUltimoProveedor()
      }

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

        setShowModalOrden({ isOpen: true })
    
      }

    

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

        if(props.proveedorEmail!="" && props.data!=undefined && datosProveedoresArray.nombre!="nombre" && datosProveedoresArray.last_name!="apellido"){
          
          guardarUltimoProveedor()
  
        }
      }, [props.data, props.imagenes])
      
      if(datosProveedoresArray.tipo=="Proveedor de servicio independiente"){
        return (
          <>
          <IonCard id="ionCard-CardProveedor">
            <IonCardHeader>
              <IonGrid>
                <IonRow id="row-busqueda">
                  <IonCol size="auto" id="col-explorerContainerCliente">
                    <img id="ionCard-explorerContainer-Cliente-Imagen" src={datosProveedoresArray.picture}></img></IonCol>
                </IonRow>
                <IonRow id="row-busqueda">
                  <IonCol size="auto" id="col-explorerContainerCliente">
                    <IonCardTitle>{datosProveedoresArray.nombre+ " " + datosProveedoresArray.last_name}</IonCardTitle>
                    <IonCardSubtitle>RUBRO: {datosProveedoresArray.items}</IonCardSubtitle>
                    <IonCardSubtitle>{tipo}</IonCardSubtitle>
                    <Estrellas calificacion={datosProveedoresArray.qualification}></Estrellas>
                  </IonCol>
                </IonRow>
                
                <IonRow id="row-busqueda">
                  <IonCol size="auto" id="col-explorerContainerCliente">
                <IonItem id="CardProveedorItem" lines="none"> {datosProveedoresArray.locacion} </IonItem>
                </IonCol>
                </IonRow>
                <IonItemDivider></IonItemDivider>
                <IonRow id="row-busqueda">
                  <IonCol size="auto" id="col-explorerContainerCliente">
                  <strong>DESCRIPCIÓN:</strong>

                  <IonItem lines="none"> {datosProveedoresArray.description} </IonItem>
                </IonCol></IonRow>
              </IonGrid>
            </IonCardHeader>
          </IonCard>

          <div id="tituloCardPRoveedor">
          <strong>LOCACIÓN DEL PROVEEDOR</strong>
            </div>
          <IonCard id="ionCard-CardProveedor">
                <div id="CardProveedorContainer">
                  <IonItem id="CardProveedorItem" lines="none"> DISTANCIA ACTUAL AL PROVEEDOR: {Math.round(datosProveedoresArray.distancia)} km </IonItem>
                  <IonItem lines="none"> PAÍS: {datosProveedoresArray.pais}  </IonItem>
                  <IonItem lines="none"> PROVINCIA/DEPARTAMENTO/ESTADO: {datosProveedoresArray.provincia}  </IonItem>
                  <IonItem lines="none"> CIUDAD: {datosProveedoresArray.ciudad}  </IonItem>
                  <IonItem lines="none"> DOMICILIO: {datosProveedoresArray.calle} {datosProveedoresArray.numeracion}  </IonItem>
                </div>
            </IonCard>

            <div id="tituloCardPRoveedor">
            <strong>DATOS DE JORNADA LABORAL</strong>
            </div>
            <IonCard id="ionCard-CardProveedor">
                <div id="CardProveedorContainer">
                  <IonItem lines="none"> DIAS LABORALES: {datosProveedoresArray.days_of_works}  </IonItem>
                  <IonItem lines="none"> HORA DE INICIO DE LA JORNADA: {datosProveedoresArray.hour_init}  </IonItem>
                  <IonItem lines="none"> HORA DE FIN DE LA JORNADA: {datosProveedoresArray.hour_end}  </IonItem>
                </div>
            </IonCard>

            <div id="tituloCardPRoveedor">
            <strong>CERTIFICADO</strong>
            </div>
            <IonCard id="ionCard-CardProveedor">
                <Certificado certificado={imagenesProveedoresArray.certificate}></Certificado>
            </IonCard>

            <div id="tituloCardPRoveedor">
            <strong> IMÁGENES DE REFERENCIA</strong>
            </div>
            <IonCard id="ionCard-CardProveedor">
                <Imagenes picture1={imagenesProveedoresArray.picture1} picture2={imagenesProveedoresArray.picture2} picture3={imagenesProveedoresArray.picture3}></Imagenes>              
            </IonCard>

              <IonGrid>
                <IonRow>
                <IonCol>
                    <IonButton shape="round" color="primary"  id="botonContratar"  onClick={() => setShowModalVerReseñas({ isOpen: true })}>RESEÑAS</IonButton>
                    </IonCol>
                    <IonCol>
                    <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => contratar()} >CONTRATAR</IonButton>
                    </IonCol>
                </IonRow>
              </IonGrid>

            <IonModal
            animated={true}
            isOpen={showModalOrden.isOpen}
            onDidDismiss={() => setShowModalOrden({ isOpen: false })}
          >
            <OrdenSimple
              data={datosDeOrdenes.current} 
              clienteEmail={props.emailCliente}
              proveedorVaALocacion={proveedorVaALocacion.current}
              setVolver={setShowModalOrden} />

          </IonModal>
          
          <IonModal
            animated={true}
            isOpen={showModalVerReseñas.isOpen}
            onDidDismiss={() => setShowModalVerReseñas({ isOpen: false })}
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
                    <img id="ionCard-explorerContainer-Cliente-Imagen" src={datosProveedoresArray.picture}></img></IonCol>
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
          
          <div id="tituloCardPRoveedor">
          <strong>LOCACIÓN DEL PROVEEDOR</strong>
            </div>
          <IonCard id="ionCard-CardProveedor">
              <div id="CardProveedorContainer">
                <IonItem id="CardProveedorItem" lines="none"> DISTANCIA ACTUAL AL PROVEEDOR: {Math.round(datosProveedoresArray.distancia)} km </IonItem>
                <IonItem lines="none"> PAÍS: {datosProveedoresArray.pais}  </IonItem>
                <IonItem lines="none"> PROVINCIA/DEPARTAMENTO/ESTADO: {datosProveedoresArray.provincia}  </IonItem>
                <IonItem lines="none"> CIUDAD: {datosProveedoresArray.ciudad}  </IonItem>
                <IonItem lines="none"> DOMICILIO: {datosProveedoresArray.calle} {datosProveedoresArray.numeracion}  </IonItem>
              </div>
            </IonCard>
            
            <div id="tituloCardPRoveedor">
            <strong>DATOS DE JORNADA LABORAL</strong>
            </div>
            <IonCard id="ionCard-CardProveedor">
              <div id="CardProveedorContainer">
                <IonItem lines="none"> DIAS LABORALES: {datosProveedoresArray.days_of_works}  </IonItem>
                <IonItem lines="none"> HORA DE INICIO DE LA JORNADA: {datosProveedoresArray.hour_init}  </IonItem>
                <IonItem lines="none"> HORA DE FIN DE LA JORNADA: {datosProveedoresArray.hour_end}  </IonItem>
              </div>
            </IonCard>
            
            <div id="tituloCardPRoveedor">
            <strong>CERTIFICADO</strong>
            </div>
            
            <IonCard id="ionCard-CardProveedor">
              <Certificado certificado={imagenesProveedoresArray.certificate}></Certificado>
            </IonCard>

            <div id="tituloCardPRoveedor">
              <strong> IMÁGENES DE REFERENCIA</strong>
            </div>
            <IonCard id="ionCard-CardProveedor">
            
              <Imagenes picture1={imagenesProveedoresArray.picture1} picture2={imagenesProveedoresArray.picture2} picture3={imagenesProveedoresArray.picture3}></Imagenes>
            </IonCard>

            <div id="tituloCardPRoveedor">
                <strong>CONTRATAR LOS SERVICIOS DEL PROVEEDOR</strong>
              </div>
              <IonCard id="ionCard-CardProveedor">
              <IonGrid>
                <IonRow>
                    <IonButton shape="round" color="primary"  id="botonContratar" onClick={() => setShowModalVerReseñas({ isOpen: true })}>RESEÑAS</IonButton>
                </IonRow>
                <IonRow>
                    <IonButton shape="round" color="warning"  id="botonContratar" onClick={() => contratar()} >CONTRATAR</IonButton>
                </IonRow>
              </IonGrid>

            </IonCard>
            <IonModal
            animated={true}
            isOpen={showModalOrden.isOpen}
            onDidDismiss={() => setShowModalOrden({ isOpen: false })}
          >
            <OrdenSimple
              data={datosDeOrdenes.current} 
              clienteEmail={props.emailCliente} 
              proveedorVaALocacion={proveedorVaALocacion.current}
              setVolver={setShowModalOrden} />

          </IonModal>
          
          <IonModal
            animated={true}
            isOpen={showModalVerReseñas.isOpen}
            onDidDismiss={() => setShowModalVerReseñas({ isOpen: false })}
          >
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
      console.log("entonces debe mostrar esto una sola")
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

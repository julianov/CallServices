import { IonButton, IonIcon, IonInput, IonItem, IonLabel } from "@ionic/react"
import { arrowBack } from "ionicons/icons"
import { useEffect, useRef, useState } from "react"
import { useUserContext } from "../../Contexts/UserContext"
import Https from "../../utilidades/HttpsURL"
import { retornarIconoCategoria } from "../../utilidades/retornarIconoCategoria"
import { getLocation, TomarFotografia } from "./PedirOrden"


const url=Https+"orden/ordenEmergencia/"

let posicion: string | number;



export const PedirOrdenEmergencia = (props:{setVolver:any}) => {

    const rubrosEmergencia = ["PLOMERÍA","GASISTA","CERRAJERÍA","ELECTRICIDAD","FLETE","MECANICA","REMOLQUES - GRÚAS" ]

    const [vista,setVista] = useState("rubros")
    const [rubroSeleccionado,setRubroSeleccionado] = useState("")

    const descripcionProblema = useRef("")
    const descripcionUbicacion = useRef("")

    const latitudCliente = useRef("")
    const longitudCliente = useRef("")

    const  {user,setUser}  = useUserContext()

    const foto1Mostrar= useRef <String>()
    const foto2Mostrar= useRef <String>()

    const foto1= useRef <Blob>()
    const foto2= useRef <Blob>()

    const [ticket, setTicket]=useState(0)

    useEffect(() => {
        
        const ubicacion = getLocation();
        ubicacion.then((value)=>{
            latitudCliente.current=(value).split("/")[0]
            longitudCliente.current=(value).split("/")[1]
        });

      }, [])

     
    const solicitar = ()=> {

        var formDataToUpload = new FormData();
        if ( (user!.email!="" && user!.email!=undefined) && latitudCliente.current!="" && longitudCliente.current!="" && descripcionProblema.current!="" ){
            
            formDataToUpload.append("clienteEmail", user!.email)
            formDataToUpload.append("categoria", rubroSeleccionado)
            formDataToUpload.append("clienteLat", latitudCliente.current)
            formDataToUpload.append("clienteLong", longitudCliente.current)
            formDataToUpload.append("descripcion_problema", descripcionProblema.current)
            formDataToUpload.append("ubicacion", descripcionUbicacion.current)

            if(foto1.current!=null || foto1.current!=undefined){
                formDataToUpload.append("imagen1", foto1.current);
            }
            if(foto2.current!=null || foto2.current!=undefined){
                formDataToUpload.append("imagen2", foto2.current); 
            }

            const axios = require('axios');
                    axios({
                        url:url,
                        method:'POST',
                        headers: {"content-type": "multipart/form-data"},
                        data:formDataToUpload
                    }).then(function(res: any){

                        console.log("lo que llego es: "+res.data)
                        if(res.data!="bad" && res.data!="ya hay una orden"){

                            setVista("ordenEnProgreso")
                            setTicket(res.data)

                        }
          
                    }).catch((error: any) =>{
    
                    });
        }
        
    }

    const cancelar = ()=> {
          
    }


    if (vista=="rubros"){
        return(
            <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100%"}}> 
                <div style={{width:"100%", height:"auto"}}>
                    <div id="modalProveedor-flechaVolver">
                        <IonIcon icon={arrowBack} onClick={() => props.setVolver( false )} slot="start" id="flecha-volver">  </IonIcon>
                    </div>
                    <div style={{display:"flex", flexDirection:"column", textAlign:"center", width:"100%", height:"auto"}}>
                        <h1>EMERGENCIAS</h1>
                        <p style={{fontSize:"1.2em"}}>¿Tiene una emergencia en los siguientes rubros?</p>
                    </div>
                </div>
                <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",textAlign:"center", width:"100%", height:"100%"}}>
              
                    {rubrosEmergencia.map((a:string) => {
                        return (
                            <IonItem onClick={()=> {setRubroSeleccionado(a);setVista("rubroSeleccionado")} } >
                                <IonLabel id="laberCompletarRubrosRubros">{a}</IonLabel>
                                <img style={{width:"32px", height:"32px"}} src={retornarIconoCategoria(a)}></img>
                            </IonItem>                            
                            ) 
                    })}
                </div>
            </div>
        )
    }else if (vista=="rubroSeleccionado"){
        return (
            <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100%"}}> 
                <div style={{width:"100%", height:"auto"}}>
                    <div id="modalProveedor-flechaVolver">
                        <IonIcon icon={arrowBack} onClick={() => {setVista("rubros"); setRubroSeleccionado("")} } slot="start" id="flecha-volver">  </IonIcon>
                    </div>
                    <div style={{display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", width:"100%", height:"auto"}}>
                        <h1>EMERGENCIAS</h1>
                        <p style={{fontSize:"1.2em",color:"black"}}>{rubroSeleccionado}</p>
                        <img style={{width:"64px", height:"64px"}} src={retornarIconoCategoria(rubroSeleccionado)}></img>

                    </div>
                </div>
                <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",textAlign:"center", width:"100%", height:"100%"}}>                  
                                              
                    
                    <p style={{fontSize:"1.2em",color:"black"}}>Ingrese descripción del problema</p>
                    <IonItem >
                        <IonLabel position="floating">DESCRIPCIÓN</IonLabel>
                        <IonInput onIonInput={(e: any) => descripcionProblema.current = (e.target.value)}></IonInput>
                    </IonItem>

                    <p style={{fontSize:"1.2em",color:"black"}}>Ingrese indicaciones de su ubicación</p>
                    <IonItem >
                        <IonLabel position="floating">DESCRIPCIÓN</IonLabel>
                        <IonInput onIonInput={(e: any) => descripcionUbicacion.current = (e.target.value)}></IonInput>
                    </IonItem>
                </div>
                <div style={{width:"100%", display:"flex", justifyContent:"center", margin:"0px 0px 15px 0px"}}>
                        <IonButton shape="round" color="warning" style={{float:"right",width:"50%", marginTop:"20px"}} onClick={() => setVista("agregarImagenes")}>SIGUIENTE</IonButton>
                </div>
            </div>
        )
    }else if(vista=="agregarImagenes"){

        return(

    <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100%"}}> 
                <div style={{width:"100%", height:"auto"}}>
                    <div id="modalProveedor-flechaVolver">
                        <IonIcon icon={arrowBack} onClick={() => {setVista("rubros"); setRubroSeleccionado("")} } slot="start" id="flecha-volver">  </IonIcon>
                    </div>
                    <div style={{display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", width:"100%", height:"auto"}}>
                        <h1>EMERGENCIAS</h1>
                        <p style={{fontSize:"1.2em",color:"black"}}>{rubroSeleccionado}</p>
                        <img style={{width:"64px", height:"64px"}} src={retornarIconoCategoria(rubroSeleccionado)}></img>

                    </div>
                </div>
                <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",textAlign:"center", width:"100%", height:"100%"}}>                  
                    <p style={{fontSize:"1.2em",color:"black"}}>¿Desea ingresar imágenes?</p>
                    
                    <TomarFotografia imagen={foto1Mostrar} setFilepath={foto1} />
                    <TomarFotografia imagen={foto1Mostrar} setFilepath={foto1} />

                </div>
                <div style={{width:"100%", display:"flex", justifyContent:"center", margin:"0px 0px 15px 0px"}}>
                        <IonButton shape="round" color="warning" style={{float:"right",width:"50%", marginTop:"20px"}} onClick={() => solicitar()}>SOLICITAR</IonButton>
                </div>
            </div>

        )

    }else if(vista=="ordenEnProgreso"){
        return (
            <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100%"}}> 
                <div style={{width:"100%", height:"auto"}}>
                    <div id="modalProveedor-flechaVolver">
                        <IonIcon icon={arrowBack} onClick={() => {setVista("rubros"); setRubroSeleccionado("")} } slot="start" id="flecha-volver">  </IonIcon>
                    </div>
                    <div style={{display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", width:"100%", height:"auto"}}>
                        <h1>EMERGENCIAS</h1>
                        <p style={{fontSize:"1.2em",color:"black"}}>{rubroSeleccionado}</p>
                        <img style={{width:"64px", height:"64px"}} src={retornarIconoCategoria(rubroSeleccionado)}></img>

                    </div>
                </div>
                <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",textAlign:"center", width:"100%", height:"100%"}}>
                <h1>BUSCANDO PROVEEDORES</h1>
                <h3>TICKET DE ORDEN: {ticket} </h3>

                
                </div>
                <div style={{width:"100%", display:"flex", justifyContent:"center", margin:"0px 0px 15px 0px"}}>
                        <IonButton shape="round" color="warning" style={{float:"right",width:"50%", marginTop:"20px"}} onClick={() => cancelar()}>CANCELAR ORDEN</IonButton>
                </div>
            </div>
        )
    }
    else{
        return(
            <></>
        )
    }
}
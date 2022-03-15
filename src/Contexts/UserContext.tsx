import React, { useContext, useState } from "react";
import { createContext } from "react";
import { usuario, UsuarioType } from "../Interfaces/interfaces";



export const  UserContext = createContext <Partial<UsuarioType>>({});

export const useUserContext = () => useContext(UserContext);



interface props {
    children: JSX.Element | JSX.Element[]
}


export const UserProvider  = ({ children }: props ) => {

    const [user,setUser] = useState <usuario> ({
        email:"",
        nombre:"",
        apellido:"",
        foto:"",
        calificacion:0,
        tipoCliente:"",
    })
    
     const  UserContext = createContext ({user,setUser});

     return (
        <UserContext.Provider  value={ {user,setUser} } >
        { children }
        </UserContext.Provider   >

     )

}



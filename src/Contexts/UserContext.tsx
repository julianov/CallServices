import { createContext } from "react";

const usuario={
    email:"",
    nombre:"",
    apellido:"",
    foto:"",
    calificacion:0,
  }

const UserContext = createContext(usuario)

export default UserContext
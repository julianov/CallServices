/*
import React, { createContext, useContext, useState } from "react";
import { usuario, UsuarioType } from "../Interfaces/interfaces";

export const UserContext = createContext<Partial<UsuarioType>>({});

export const useUserContext = () => useContext(UserContext);

interface Props {
  children: JSX.Element | JSX.Element[];
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<usuario>({
    email: "",
    nombre: "",
    apellido: "",
    foto: "",
    calificacion: 0,
    tipoCliente: "",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};*/

import { createContext } from 'react';
import { UsuarioType } from '../Interfaces/interfaces';

export const UserContext = createContext<Partial<UsuarioType>>({});


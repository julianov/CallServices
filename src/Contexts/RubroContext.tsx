import { createContext, useContext } from "react";
import { RubroType } from "../Interfaces/interfaces";



export const  RubroContext = createContext({} as RubroType);

export const useRubroContext = () => useContext(RubroContext);
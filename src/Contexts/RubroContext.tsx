import { createContext, useContext } from "react";
import { RubroType1, RubroType2 } from "../Interfaces/interfaces";



export const  RubroContext1 = createContext <Partial<RubroType1>>({})
export const  RubroContext2 = createContext <Partial<RubroType2>>({})

/*
export const useRubroContext1 = () => useContext(RubroContext1);
export const useRubroContext2 = () => useContext(RubroContext2);

*/
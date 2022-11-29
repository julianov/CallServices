import { createContext, useContext, useState } from "react";
import { itemRubro, RubroType1, RubroType2 } from "../Interfaces/interfaces";


interface props {
    children: JSX.Element | JSX.Element[]
}

export const  RubroContext1 = createContext <Partial<RubroType1>>({})
export const  RubroContext2 = createContext <Partial<RubroType2>>({})


export const useRubroContext1 = () => useContext(RubroContext1);
export const useRubroContext2 = () => useContext(RubroContext2);

/*

export const RubroContext1Provider = ({ children }: props)=>{

    const [value, setValue] = useState <itemRubro> ()
    return(
        <RubroContext1.Provider 
            value = {{
                rubrosItem1 : value,
                setItemRubro1: setValue,
            }}
        >{ children }</RubroContext1.Provider>
    )
}*/
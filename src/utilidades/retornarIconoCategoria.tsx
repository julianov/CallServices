

export const retornarIconoCategoria = (categoria:string) =>{ 
    
    switch(categoria){
        case "CARPINTERÍA":{
            return ("./assets/iconosCategorias/carpinteria.png")
        }
        case "CERRAJERÍA":{
            return ("./assets/iconosCategorias/cerrajeria.png")
        }
        case "CONSTRUCCIÓN":{
            return ("./assets/iconosCategorias/construccion.png")
        }
        case "CONTADURÍA":{
            return ("./assets/iconosCategorias/contaduria.png")
        }
        case "ELECTRICIDAD":{
            return ("./assets/iconosCategorias/electricidad.png")
        }
        case "ELECTRÓNICA":{
            return ("./assets/iconosCategorias/electronica.png")
        }
        case "ESTÉTICA":{
            return ("./assets/iconosCategorias/maquillaje.png")
        }
        case "FLETE":{
            return ("./assets/iconosCategorias/flete.png")
        }
        case "FUMIGACIÓN":{
            return ("./assets/iconosCategorias/fumigacion.png")
        }
        case "GASISTA":{
            return ("./assets/iconosCategorias/gasista.png")
        }
        case "HERRERÍA":{
            return ("./assets/iconosCategorias/herreria.png")
        }
        case "INFORMÁTICA":{
            return ("./assets/iconosCategorias/informatica.png")
        }
        case "JARDINERÍA":{
            return ("./assets/iconosCategorias/jardineria.png")
        }
        case "MECÁNICA":{
            return ("./assets/iconosCategorias/mecanica.png")
        }
        case "MODA":{
            return ("./assets/iconosCategorias/moda.png")
        }
        case "PASEADOR DE MASCOTAS":{
            return ("./assets/iconosCategorias/paseador.png")
        }
        case "PINTOR":{
            return ("./assets/iconosCategorias/pintor.png")
        }
        case "REFRIGERACIÓN":{
            return ("./assets/iconosCategorias/refrigeracion.png")
        }
        case "REMOLQUES - GRÚAS":{
            return ("./assets/iconosCategorias/remolque.png")
        }
        case "PLOMERÍA":{
            return ("./assets/iconosCategorias/plomeria.png")
        }
        case "TELEFONÍA CELULAR":{
            return ("./assets/iconosCategorias/telefonia.png")
        }
        case "TEXTIL":{
            return ("./assets/iconosCategorias/coser.png")
        }
        default:{
            return ("./assets/iconosCategorias/sorpresa.png")
        }
        
    }
}
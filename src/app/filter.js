/**
 * La idea principal de esta clase es la reutilización de un buscador para otro proyectos que requieran de un buscador similar.
 * La clase tendra distintos metodos de filtrado desde un orderBy hasta busquedas complejas de array [ {key = value} ]
 * Se busca la optimización de la busqueda, la reutilización del código y con un buen rendimiento.
 */

export class Filter {
    /**
     * Metodo de filtrado por campos en los tipo Objetos
     * @param {Object} item 
     * @param {*} seach 
     * @param {{camps:boolean}} options 
     */
    searchInObject (item,search,options={camps:true}) {
        // Filtrar por campos
        let items = Object.keys(item).filter(key => {
            // Almacenamiento del campo perteneciente a item
            const value = item[key];
            // En caso de que key sea un string
            if(typeof value === "string"){
                // Validación de fecha
                if (!isNaN(Date.parse(value))) {
                    let dateStr = new Date(value).toLocaleDateString().toLowerCase();
                    // retorna el campo que contiene el valor buscado
                    if(dateStr.includes(search)) return value;
                }
                // retorna el campo que contiene el valor buscado
                if(value.toLowerCase().includes(search)) return value
            //en caso de que el campo sea un número
            }else if(typeof value === "number"){
                if(value.toString().includes(search)){
                    // retorna el campo que contiene el valor buscado
                    return value;
                }
            //  en caso de que el campo sea un array
            }else if(Array.isArray(value)){
                if(value.some(value => value.toLowerCase().includes(search))){
                    // retorna el campo que contiene el valor buscado
                    return value;
                }
            }
        })
        // Si la busqueda por campos es exitosa retorna los items encontrados
        if(items.length > 0){
            return items;
        }

    }
}
// Funciones relacionadas con el manejo del DATE

export function convertDate(date){
    if(!date) return "N/A";
    return new Date(date).toLocaleDateString();
}
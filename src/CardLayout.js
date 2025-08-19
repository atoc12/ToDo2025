import { SETTINGS } from "./settings.js";
import { Task } from "./task.js";
export class LayoutCard {
    /**
     * @type {HTMLElement[]}  
     */
    layouts = [
            SETTINGS.layouts.pending,
            SETTINGS.layouts.process,
            SETTINGS.layouts.completed
    ];
    /** @type {Record<"pending" | "process" | "completed", Task[]>} */
    cards={
        pending:[],
        process:[],
        completed:[]
    };
/** @type {Record<"pending" | "process" | "completed", {order: "ASC" | "DESC"}>} */
    settings={
        pending:{
            order:"ASC"
        },
        process:{
            order:"ASC"
        },
        completed:{
            order:"ASC"
        }

    }
    /** 
     * @param {Task} task  
     * @param {(task:Task)=>Task[]} filter 
    */
    setFilter(task,filter){
        this.cards[task.status] = this.cards[task.status].filter(filter);
    }
/** @param {Task} task  */
    addCard (task) {
        console.log(this.cards);
        this.cards[task.status].push(task);
        task.render();
    }
    /** @param {Task} task  */
    removeCard(task){
        let newArray = this.cards[task.status].filter( t => t.ID != task.ID );
        this.cards[task.status] = newArray;
        task.remove();
    }
    /**
     * Metodo encargado de aplicar un filtro a los layouts.
     * @param {HTMLElement} layout - Layout a aplicar el filtro.
     * @param {"ASC" | "DESC"} type - Tipo de filtro a aplicar.
     */
    applyFilter(layout,type="ASC"){
        if(!layout) throw new Error("Es necesario pasar el parametro layout.");
        /** @type {keyof typeof this.cards} */const layoutSection = layout.getAttribute("data-layout");
        if(!layoutSection) throw new Error("Layout no encontrado o no existe data-layout como atributo en el elemento.");
        const order = {
            ASC: (a,b)=>{
                return b.order - a.order;
            },
            DESC:(a,b)=>{
                return a.order - b.order;
            }
        }
        layout.innerHTML = '';
        this.cards[layoutSection].sort(order[type]).forEach(card => {
            card.render();
        })
    }

}

export const Layout_grid = new LayoutCard();
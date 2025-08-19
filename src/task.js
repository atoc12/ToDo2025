import { convertDate } from "../functions/date.js";
import { APP } from "../main.js";
import { Layout_grid } from "./CardLayout.js";
import { DragDrop } from "./dragdrop.js";
import { SETTINGS } from "./settings.js";

export class Task {
    /** @type {HTMLElement} - Seteo del template card.*/
    cardTemplate = document.querySelector("#template-card");
    /** @type {HTMLElement} - Clona el template de la card */
    #clone=this.cardTemplate.content.cloneNode(true);
    icons = {
        pdf:`<i class="bi bi-file-pdf pdf-link"></i>`,
        image:`<i class="bi bi-image img-link"></i>`,
        other:`<i class="bi bi-file-earmark"></i>`
    }
    /**@param {TaskUI} value */
    constructor(value){
        // Seteo de valores
        this.data = value;
        this.ID = value.ID;
        this.title = value.title;
        this.details = value.details;
        this.files = value.files;
        this.start_date = value.start_date;
        this.end_date = value.end_date;
        this.status = value.status;
        this.order = value.order || value.ID;
        // elemnto de la Card 
        this.component = this.#clone.querySelector(".card-task");
        // Se setea los elementos dentro del template para su posterior modificación,
        this.card={
            id:this.component.querySelector(".card-task-id"),
            title:this.component.querySelector(".card-task-title"),
            details:this.component.querySelector(".card-task-details"),
            other:this.component.querySelector(".card-task-other"),
            start_date:this.component.querySelector(".start"),
            end_date:this.component.querySelector(".end"),
            select:this.component.querySelector(".select-content"),
            buttons:{
                remove:this.component.querySelector(".card-task-btn-remove"),
            }
        }
        // Elementos hijos del select
        this.select={
            button:this.card.select.querySelector(".select-btn"),
            options:this.card.select.querySelectorAll(".select>li>button"),
        }
        // Sistema de drag and drop para la card
        this.dragAndDrop = new DragDrop({
            element:this.component,
            layouts:[
                SETTINGS.layouts.completed,
                SETTINGS.layouts.pending,
                SETTINGS.layouts.process
            ],
            root:document.getElementById("task-layout-container"),
            end:(value)=>{
                if(value){
                    // Se elimina del layout anterior.
                    Layout_grid.setFilter(this,(task) => this.ID != task.ID);
                    // Actualizacion del estado en la card.
                    this.status = value; 
                    // Actualización en la base de datos.
                    APP.model.task.update(this.ID,{
                        status:value
                    })
                    // Al cambiar el valor de status, se debe de actualizar el contenido.
                    this.update();
                    // Se agrega al nuevo layout.
                    Layout_grid.cards[this.status].push(this);
                }
            }
        });
        this.event();
    }
    /**
     * Metodo encargado de eliminar la card del layout.
     * @returns 
     */
    remove(){
        SETTINGS.layouts[this.status].removeChild(document.getElementById(this.ID))
        return true;
    }
    /**
     * Metodo encargado de cambiar el estado de la card
     * @param {"pending" | "process" | "completed"} value
     */
    async changeStatus (value) {
        try{
            console.log(value);
            // Elimina su pre-render.
            Layout_grid.removeCard(this);
            // Se remplaza el estado.
            this.status = value;
            // Se almacena en la base de datos.
            await APP.model.task.update(this.ID,{ status:value });
            // Renderiza denuevo pero ahora el valor de status cambia por lo tanto cambia su layout.
            Layout_grid.addCard(this);
        }catch(err){
            console.log(err);
        }
    }
    async deleted(event){
        try{
            await APP.model.task.remove(this.ID);
            this.remove();
        }catch(err){
            console.log(err);
        }
    }
    //Metodo de inicialización de eventos de la card
    event(){
        this.select.button.addEventListener("click",(e)=> this.card.select.toggleAttribute("show"))
        this.select.options.forEach((elements)=>{
            elements.addEventListener("click",(e)=>{
                e.target.value != this.status && this.changeStatus(e.target.value);
            })
        })
        // Eventos del select, mostrar u ocultar lista de opciones
        this.card.select.querySelector("span").addEventListener("click",(e)=>this.card.select.toggleAttribute("show"))
        // Eventos de eliminación por medio de un boton
        this.card.buttons.remove.addEventListener("click",this.deleted)
    }
    // Metodo encargado de actualizar el contenido de la card
    update () {
        this.component.id=this.ID;
        this.card.id.textContent = this.order;
        this.card.title.textContent=this.title;
        this.card.details.textContent=this.details;
        this.select.button.textContent=SETTINGS.enums.status.textEs[this.status];
        this.card.start_date.textContent= convertDate(this.start_date);
        this.card.end_date.textContent= convertDate(this.end_date);
        this.card.other.innerHTML = "";
        if (this.files && Array.isArray(this.files)) {
            this.files.forEach(file => {
                if (!(file instanceof File)) return;
                const url = URL.createObjectURL(file);
                const link = document.createElement("a");
                link.href = url;
                link.target = "_blank";
                if (file.type.includes("pdf")) {
                    link.innerHTML = this.icons.pdf;
                } else if (file.type.startsWith("image/")) {
                    link.innerHTML = this.icons.image;
                } else {
                    link.innerHTML = this.icons.other;
                }
                otherContainer.appendChild(link);
            });
        }
    }
    /** Metodo encargado de renderizar la card en el layout. */
    render(){
        this.update();
        SETTINGS.layouts[this.status].append(this.component);
    }
}
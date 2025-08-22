import { convertDate } from "../../functions/date.js";
import { APP } from "./main.js";
import { Layout_grid } from "./CardLayout.js";
import { DragDrop } from "./dragdrop.js";
import { SETTINGS } from "./settings.js";

export class Task {
    /** @type {HTMLElement} - Seteo del template card.*/
    cardTemplate = document.querySelector("#template-card");
    /** @type {HTMLElement} - Clona el template de la card */
    #clone = this.cardTemplate.content.cloneNode(true);
    icons = {
        pdf: `<i class="bi bi-file-pdf pdf-link"></i>`,
        image: `<i class="bi bi-image img-link"></i>`,
        other: `<i class="bi bi-file-earmark"></i>`
    }

    /**@param {TaskUI} value */
    constructor(value){
        // Seteo de valores
        this.data = { ...value };
        this.order = value.order || value.ID;

        // Clonamos status para uso independiente
        this.status = this.data.status;

        // Elemento de la Card
        this.component = this.#clone.querySelector(".card-task");

        // Se setea los elementos dentro del template para su posterior modificación
        this.card = {
            id: this.component.querySelector(".card-task-id"),
            title: this.component.querySelector(".card-task-title"),
            details: this.component.querySelector(".card-task-details"),
            other: this.component.querySelector(".card-task-other"),
            start_date: this.component.querySelector(".start"),
            end_date: this.component.querySelector(".end"),
            select: this.component.querySelector(".select-content"),
            buttons: {
                remove: this.component.querySelector(".card-task-btn-remove"),
                edit: this.component.querySelector(".card-task-btn-edit")
            }
        }

        // Elementos hijos del select
        this.select = {
            button: this.card.select.querySelector(".select-btn"),
            options: this.card.select.querySelectorAll(".select>li>button"),
        }

        // Sistema de drag and drop para la card
        this.dragAndDrop = new DragDrop({
            element: this.component,
            layouts: [
                SETTINGS.layouts.completed,
                SETTINGS.layouts.pending,
                SETTINGS.layouts.process
            ],
            root: document.getElementById("task-layout-container"),
            end: (value) => {
                if(value){
                    Layout_grid.setFilter(this, (task) => this.data.ID != task.data.ID);
                    this.status = value;
                    APP.model.task.update(this.data.ID, { status: value });
                    APP.toast.addMessage({
                        message:"Se ha movido la tarea a la sección "+SETTINGS.enums.status.textEs[value], type:"info"
                    })
                    this.update();
                    Layout_grid.cards[this.status].push(this);
                }
            }
        });

        this.event();
    }

    /**
     * Metodo encargado de eliminar la card del layout.
     * @returns {boolean}
     */
    remove(){
        SETTINGS.layouts[this.status].removeChild(document.getElementById(this.data.ID));
        return true;
    }

    /**
     * Metodo encargado de setear los valores de la card.
     * @param {TaskUI} value
     */
    setValues(value){
        this.data = { ...this.data, ...value };
        this.update();
    }

    /**
     * Metodo encargado de cambiar el estado de la card
     * @param {"pending" | "process" | "completed"} value
     */
    async changeStatus(value) {
        try{
            Layout_grid.removeCard(this);
            this.status = value;
            await APP.model.task.update(this.data.ID, { status: value });
            Layout_grid.addCard(this);
            this.update();
        }catch(err){
            console.log(err);
        }
    }

    async deleted(event){
        try{
            await APP.model.task.remove(this.data.ID).then(res=>APP.toast.addMessage({message:"Se ha eliminado la tarea #"+this.data.ID, type:"info"}));
            Layout_grid.removeCard(this);
            this.remove();
        }catch(err){
            console.log(err);
        }
    }

    /**
     * Metodo encargado de editar la card.
     * @param {TaskUI} value 
     */
    edit(value){
        APP.modalForm.open();
        APP.taskForm.setValues(value);
        APP.taskForm.save = (e, form) => {
            e.preventDefault();
            let formData = new FormData(e.target);
            let data = Object.fromEntries(
                [...formData.entries()].filter(([key, value]) => !(value instanceof File))
            );
            let files = formData.getAll("files").filter(f => f instanceof File && f.name !== "");
            if(form.field) throw new Error(SETTINGS.db.log.update.value.required);

            APP.model.task.update(this.data.ID, { ...data, files })
                .then((res) => {
                    if(res){
                        this.setValues({ ...data, files });
                        this.syncCard();
                        APP.taskForm.form.reset();
                        APP.taskForm.field = {};
                        APP.modalForm.close();   
                    }
                })
        }
    }

    // Metodo de inicialización de eventos de la card
    event(){
        this.select.button.addEventListener("click",(e) => this.card.select.toggleAttribute("show"));
        this.select.options.forEach((elements) => {
            elements.addEventListener("click",(e) => {
                e.target.value != this.status && this.changeStatus(e.target.value);
            });
        });
        this.card.select.querySelector("span").addEventListener("click",(e) => this.card.select.toggleAttribute("show"));
        this.card.buttons.remove.addEventListener("click", () => this.deleted());
        this.card.buttons.edit.addEventListener("click", () => this.edit(this.data));
    }

    // Metodo encargado de actualizar el contenido de la card
    update () {
        this.dragAndDrop.element = this.component;
        this.component.id = this.data.ID;
        this.card.id.textContent = "#" + this.data.ID;
        this.card.title.textContent = this.data.title;
        this.card.details.textContent = this.data.details;
        this.select.button.textContent = SETTINGS.enums.status.textEs[this.status];
        this.card.start_date.textContent = convertDate(this.data.start_date);
        this.card.end_date.textContent = convertDate(this.data.end_date);
        this.card.other.innerHTML = "";

        if (this.data.files && Array.isArray(this.data.files)) {
            this.data.files.forEach(file => {
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
                this.card.other.appendChild(link);
            });
        }
    }

    syncCard(){
        this.remove();
        this.render();
    }

    /** Metodo encargado de renderizar la card en el layout. */
    render(){
        this.update();
        SETTINGS.layouts[this.status].append(this.component);
    }
}

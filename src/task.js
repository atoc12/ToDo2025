import { APP } from "../main.js";
import { DragDrop } from "./dragdrop.js";
import { SETTINGS } from "./settings.js";

export class Task {
    cardTemplate = document.querySelector("#template-card");
    /**
     * @param {TaskUI} value
    */

    icons = {
        pdf:`<i class="bi bi-file-pdf pdf-link"></i>`,
        image:`<i class="bi bi-image img-link"></i>`,
        other:`<i class="bi bi-file-earmark"></i>`
    }
    constructor(value){
        this.ID = value.ID;
        this.title = value.title;
        this.details = value.details;
        this.files = value.files;
        this.start_date = value.start_date;
        this.end_date = value.end_date;
        this.status = value.status;
    }

    remove(){
        SETTINGS.layouts[this.status].removeChild(document.getElementById(this.ID))
    }

    async changeStatus (value) {
        try{
            this.remove();
            // Se remplaza el estados
            this.status = value;
            let result = await APP.model.task.update(this.ID,{
                status:value
            })
            // Renderiza denuevo pero ahora el valor de status cambia por lo tanto cambia su layout
            this.render();
        }catch(err){
            console.log(err);
        }
    }

    render(){
        function convertDate(date){
            return new Date(date).toLocaleDateString();
        }
        this.component = this.cardTemplate.content.cloneNode(true);
        let card = this.component.querySelector(".card-task");
        card.id=this.ID;
        this.component.querySelector(".card-task-title").textContent=this.title;
        this.component.querySelector(".card-task-details").textContent=this.details;
        let select = this.component.querySelector(".select-content");
        let selectBtn = select.querySelector(".select-btn");
        selectBtn.textContent=SETTINGS.enums.status.textEs[this.status];
        // Eventos del boton
        selectBtn.addEventListener("click",(e)=> select.toggleAttribute("show"))
        select.querySelector("span").addEventListener("click",(e)=>select.toggleAttribute("show"))
        let buttonSelect = select.querySelectorAll(".select>li>button");
        buttonSelect.forEach((elements)=>{
            let value = this.status;
            elements.addEventListener("click",(e)=>{
                e.target.value != this.status && this.changeStatus(e.target.value);
            })
        })
        const otherContainer = this.component.querySelector(".card-task-other");
        /** @type {DocumentFragment}*/
        let dateComponent =  this.component.querySelector(".date");
        dateComponent.querySelector(".start").textContent= convertDate(this.start_date);
        dateComponent.querySelector(".end").textContent= convertDate(this.end_date);
        otherContainer.innerHTML = "";
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
        this.component.querySelector(".card-task-btn-remove").addEventListener("click",async (e)=>{
            try{
                let response = await APP.model.task.remove(this.ID);
                console.log("Datos eliminados correctamente");
                this.remove();
            }catch(err){
                console.log(err);
            }
        })
        SETTINGS.layouts[this.status].append(this.component);
        let drag = new DragDrop({
            element:card,
            layouts:[
                SETTINGS.layouts.completed,
                SETTINGS.layouts.pending,
                SETTINGS.layouts.process
            ],
            root:document.getElementById("task-layout-container"),
            end:(value)=>{
                if(value){
                    this.status = value;
                    let result = APP.model.task.update(this.ID,{
                        status:value
                    })
                }
            }
        });

    
    }
}
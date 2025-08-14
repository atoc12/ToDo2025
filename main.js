import { Form } from "./src/form.js";
import { Modal } from "./src/modal.js";
import { DataBase,Model } from "./src/ORM.js";
import { SETTINGS } from "./src/settings.js";
/**
 * @typedef {Object} TaskUI
 * @property {number} ID
 * @property {string} title
 * @property {Object} files
 * @property {string} details
 * @property {Date} start_date
 * @property {Date} end_date
 * @property { "pending" | "completed" | "process" } status
 */
class Task {
    cardTemplate = document.querySelector("#template-card");
    /**
     * @param {TaskUI} value
     */
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

    render(){
        this.component = this.cardTemplate.content.cloneNode(true);
        this.component.querySelector(".card-task").id=this.ID;
        this.component.querySelector(".card-task-title").textContent=this.title;
        this.component.querySelector(".card-task-details").textContent=this.details;
        let select = this.component.querySelector(`select[name="status"]`);
        select.value = this.status;
        if (this.files && this.files instanceof File) {
            const fileLink = this.component.querySelector(".pdf-link");
            const url = URL.createObjectURL(this.files);
            fileLink.href = url;
            fileLink.innerHTML = `<i class="bi bi-file-pdf"></i>`;
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
        select.addEventListener("change",async (e)=>{
            try{
                this.remove();
                // Se remplaza el estados
                this.status = e.target.value;
                let result = await APP.model.task.update(this.ID,{
                    status:e.target.value
                })
                // Renderiza denuevo pero ahora el valor de status cambia por lo tanto cambia su layout
                this.render();
            }catch(err){
                console.log(err);
            }
        })
        SETTINGS.layouts[this.status].append(this.component);
    
    }
}
// ------------------ App ------------------
class App extends DataBase {
    constructor(){
        super({
            name:SETTINGS.db.name,
            version:SETTINGS.db.version
        });
        this.tasks = [];
        this.init();
    }
    async init() {
        try {
            this.model = {
                task:new Model({
                    name:"task",
                    options:{
                        keyPath:"ID",
                        autoIncrement:true
                    }
                },[
                    {name:"ID", options:{unique:true}},
                ])
            }
            await this.connect();            
            // Inicializar UI
            this.main();
        } catch(err) {
            console.error(err);
        }
    }
    main(){

        this.model.task.getAll()
        .then((/** @type {TaskUI[]} **/res)=>{
            if(res){
                console.log(res);
                res.map((task)=>{
                    let newTaskCard = new Task(task);
                    this.tasks.push(newTaskCard);
                    newTaskCard.render();
                })
            }
        });

        let modalForm = new Modal({ id:"modal-1" });
        let form = new Form({
            id:"form-task",
            cancel:(e,form)=>modalForm.show(),
            save: (e, form) => {
                e.preventDefault();
                let formData = new FormData(e.target);
                let data = {};
                formData.forEach((value, key) => {
                    if (value instanceof File && value.size > 0) {
                        data[key] = value; // queda como Blob/File
                    } else {
                        data[key] = value;
                    }
                });
                this.model.task.create({...data,status:"pending"}).then((res)=>{
                    if(res){
                        modalForm.show();
                        let newTask = new Task(res);
                        newTask.render();
                        this.tasks.push(newTask);
                    }

                })
            }            
        });
        document.getElementById("layout-btn").addEventListener("click", () => {    
            let layoutTask = document.getElementById("tasks-layout-content");
            if (layoutTask.classList.contains("row-layout")) {
                layoutTask.classList.replace("row-layout", "col-layout");
            } else {
                layoutTask.classList.replace("col-layout", "row-layout");
            }
        });

    }
}

const APP = new App();

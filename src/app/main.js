/// <reference path="./types.js" />
import { Toast } from "../UI/toast/toast.js";
import { App } from "./app.js";
import { Form } from "./form.js";
import { Modal } from "./modal.js";
import { Task } from "./task.js";
import { LayoutTask } from "./taskLayout.js";

class TODO extends App {
    layoutTask = new LayoutTask();
    modalForm = new Modal({ id: "modal-1" });
    taskForm = new Form({
        id:"form-task",
        cancel:(e,form)=>{
            form.form.reset(); 
            this.modalForm.close();  
        },
        save: (e,form) => {
            e.preventDefault();
            let formData = new FormData(e.target);
            // Campos de texto (excluye los File)
            let data = Object.fromEntries(
                [...formData.entries()].filter(([key, value]) => !(value instanceof File))
            );
            // Archivos (todos los seleccionados en <input multiple>)
            let files = formData.getAll("files").filter(f => f instanceof File && f.name !== "");
            // Validación de campos requeridos
            this.model.task.create({...data, status: "pending", files})
                .then((res)=>{
                    if(res){
                        form.form.reset();
                        let newTask = new Task(res);
                        newTask.render();
                        this.tasks.push(newTask);
                        this.layoutTask.addTask(newTask);
                        this.modalForm.close();
                        this.toast.addMessage({
                            message:"¡Tarea añadida correctamente!"
                        })
                    }
                })
                .catch(err=>console.log(err));
        }            
    });
    toast = new Toast({
        placement:"bottom-center"
    });
    /** @param {TaskUI[]} **/
    getData (res) {
        if(res){
            res.map((task)=>{
                let newTaskCard = new Task(task);
                this.tasks.push(task);
                this.layoutTask.addTask(newTaskCard);
            })
        }
    }
    // Metodo encargado de inicializar eventos dentro de la aplicación
    events(){
        this.layoutTask.events();
    }
    // Metodo principal de la aplicación.
    main(){
        this.model.task.getAll()
        .then(res=>this.getData(res))
        .finally(()=>this.layoutTask.render());
        this.events();
    }
}

export const APP = new TODO();

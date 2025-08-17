/// <reference path="src/types.js" />
import { App } from "./src/app.js";
import { Form } from "./src/form.js";
import { Modal } from "./src/modal.js";
import { Task } from "./src/task.js";
import { LayoutTask } from "./src/taskLayout.js";

class TODO extends App {
    layoutTask = new LayoutTask();
    // Metodo encargado de inicializar eventos dentro de la aplicación
    events(){
        
    }
    // Metodo principal de la aplicación.
    main(){
        this.layoutTask.main();
        this.model.task.getAll()
        .then((/** @type {TaskUI[]} **/res)=>{
            if(res){
                console.log(res);
                res.map((task)=>{
                    let newTaskCard = new Task(task);
                    this.tasks.push(task);
                    this.layoutTask.addTask(newTaskCard);
                    newTaskCard.render();
                })
            }
        });

        let modalForm = new Modal({ id:"modal-1" });
        let form = new Form({
            id:"form-task",
            cancel:(e,form)=>{
                form.form.reset(); 
                modalForm.close();  
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
            
                this.model.task.create({...data, status: "pending", files})
                    .then((res)=>{
                        if(res){
                            form.form.reset();
                            let newTask = new Task(res);
                            newTask.render();
                            this.tasks.push(newTask);
                            modalForm.close();
                        }
                    })
                    .catch(err=>console.log(err));
            }            
        });
        this.events();
    }
}

export const APP = new TODO();

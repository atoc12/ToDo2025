import { SETTINGS } from "./settings.js";

export class LayoutTask {
    /** @type {HTMLElement[]}   */
    layouts = [
        SETTINGS.layouts.pending,
        SETTINGS.layouts.process,
        SETTINGS.layouts.completed
    ];
    cards=[];
    component = document.getElementById("tasks-layout-content");

    events(){
        document.getElementById("layout-btn").addEventListener("click", () => {    
            
            if (this.component.classList.contains("row-layout")) {
                this.component.classList.replace("row-layout", "col-layout");
            } else {
                this.component.classList.replace("col-layout", "row-layout");
            }
        });

    }
    /** @param {TaskUI} task  */
    addTask (task) {
        this.cards.push(task);
    }

    main(){
        this.events();
    }



}
import { Layout_grid } from "./CardLayout.js";
import { Filter } from "./filter.js";
import { Task } from "./task.js";

export class LayoutTask {
    /** @type {HTMLElement[]}   */
    component = document.getElementById("tasks-layout-content");
    searcher = document.getElementById("layout-searcher");
    filter = new Filter();

    addTask = task => {
        Layout_grid.addCard(task);
    };
    removeTask = task => Layout_grid.removeCard(task);

    events(){
        // Dirección del layout
        document.getElementById("layout-btn").addEventListener("click", () => {    
            this.component.classList.contains("row-layout") ? this.component.classList.replace("row-layout", "col-layout")
            : this.component.classList.replace("col-layout", "row-layout");
        });
        // Funcionalidad del buscador
        this.searcher.addEventListener("input", (e) => {
            const value = e.target.value.toLowerCase();
            Object.keys(Layout_grid.cards).forEach((/** @type {keyof typeof Layout_grid.cards} */name, i) => {
                Layout_grid.layouts[i].innerHTML = '';
                Layout_grid.cards[name].filter(task => this.filter.searchInObject(task.data, value) ).forEach(card => {
                    card.render();
                });
            });
        });

        // Funcionalidad del orderBy
        Layout_grid.layouts.forEach((/** @type {HTMLElement} */layout, i) => {
            layout.parentNode.querySelector(".btn-order").addEventListener("click", () => {
                /** @type {keyof typeof Layout_grid.settings}  */
                const section = layout.getAttribute("data-layout");
                Layout_grid.settings[section].order = Layout_grid.settings[section].order === "ASC" ? "DESC" : "ASC";
                Layout_grid.applyFilter(layout,Layout_grid.settings[section].order);
            });
        });

    }

    orderBy(type){
        
    }
    
    applyFilter(){
        const order = {
            ASC: (a,b)=>{
                return b.order - a.order;
            },
            DESC:(a,b)=>{
                return a.order - b.order;
            }
        }
        Object.keys(Layout_grid.cards).forEach((/** @type {keyof typeof Layout_grid.cards} */name, i) => {
            Layout_grid.layouts[i].innerHTML = '';
            Layout_grid.cards[name].sort(order[Layout_grid.settings[name].order]).forEach(card => {
                card.render();
            });
        });

    }

    render(){
        this.applyFilter();

    }



}
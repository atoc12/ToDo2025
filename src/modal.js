export class Modal {
    constructor({id}){
        this.id = id;
        this.component = document.getElementById(id);
        this.main();
    }
    open(){
        this.component.setAttribute("data-show", "true");
    }
    close(){
        this.component.removeAttribute("data-show");
    }
    toggle(){
        this.component.toggleAttribute("data-show");
    }
    show(){
        this.component.toggleAttribute("data-show");
    }
    main(){
        let buttons = document.querySelectorAll(`*[data-modal="${this.id}"]`);
        buttons.forEach((comp)=>{
            comp.addEventListener("click",()=> this.show());
        })
    }
}
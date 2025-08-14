export class Modal {
    constructor({id}){
        this.id = id;
        this.component = document.getElementById(id);
        this.main();
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
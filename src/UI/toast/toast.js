/**
 * @typedef {Object} ToastMessage
 * @property {string} message
 * @property {"info" | "success" | "error"} type
 * @property {string | HTMLElement | null} icon
 */

/**
 * @typedef {Object} ToastOptions
 * @property {"top-left" | "top-right" | "bottom-left" | "bottom-right" | "bottom-center" | "top-center"} placement
 */

export class Toast {
    /**@type {ToastMessage[]}*/ messages = [] ;
    /**
     * @param {ToastOptions} param0 
     */
    constructor({placement}) {
        this.delay = 5000;
        this.placement = placement || "bottom-center";
        this.prevMessage = null;
        this.currentMessage = null;
        this.#addToastElement();
    }
    #addToastElement() {
        this.element = document.createElement("div");
        this.element.classList.add("toast-container");
        this.element.classList.add(this.placement);
        document.body.appendChild(this.element);
    }
    /**
     * 
     * @param {ToastMessage } param0 
     */
    addMessage({message="", type= "info" ,icon= ""}) {
        let message_container = document.createElement("div");
        message_container.classList.add("toast-message");
        message_container.classList.add("toast-" + type);
        let msj = document.createElement("p");
        let button_close = document.createElement("button");
        let icon_element = document.createElement("i");
        if(type == "success") icon_element.classList.add("bi", "bi-check-circle-fill");
        if(type == "error") icon_element.classList.add("bi", "bi-x-circle-fill");
        if(type == "info") icon_element.classList.add("bi", "bi-info-circle-fill");
        button_close.textContent = "X";
        button_close.classList.add("toast-close");
        msj.textContent = message;
        message_container.appendChild(icon_element);
        message_container.appendChild(button_close);
        message_container.appendChild(msj);
        this.element.appendChild(message_container);
        
        let timeout = setTimeout(() => {
            message_container.style.transition = "opacity 0.5s ease-in-out,scale 0.5s ease-in-out";
            message_container.style.opacity = 0;
            message_container.style.scale = 0;

            this.element.addEventListener("animationend", () => {
                if(this.element.contains(message_container)){
                    this.element.removeChild(message_container);
                }
            })
        }, this.delay);

        button_close.addEventListener("click", () => {
            this.element.removeChild(message_container);
            clearTimeout(timeout);
        })

    }

    show({message="", type= "info" ,icon= ""}) {
        
    }

    close(){

        
    }
}
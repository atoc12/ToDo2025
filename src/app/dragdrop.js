export class DragDrop {
    offsetX = 0;
    offsetY = 0;
    isDragging = false;
    holdTimer = null;
    holdDelay = 150; // tiempo en ms que hay que mantener presionado
    /**
     * @param {{ element: HTMLElement, root?: HTMLElement,layouts:HTMLElement[],end:()=>void }} param0 
     */
    constructor({ element, root,layouts,end }) {
        this.element = element;
        this.prevParent = this.element.parentNode;
        this.layouts = layouts || [];
        this.root = root || document.body;
        this.element.addEventListener("mousedown", e => this.onMouseDown(e));
        this.placeholder = document.createElement("div");
        this.end = end || null;
        this.placeholder.classList.add("card-placeholder");
        this._move = this.onMouseMove.bind(this);
        this._up = this.onMouseUp.bind(this);
    }
    onMouseDown(e) {
        if(this.isDragging) return;
        // se actualiza el padre anterior en caso de que el elemento haya sido movido y no se haya soltado correctamente.
        this.prevParent = this.element.parentNode;
        // // Verifica si el elemento tiene la clase draggable-handle de esta forma se evita que se inicie el drag and drop.
        if (e.target.closest("input, textarea, select, button, .select-content")) {
            this.element.style.cursor = "auto";
            return;
        }
        this.holdTimer = setTimeout(() => {
            this.startDrag(e);
        }, this.holdDelay);
    }
    startDrag(e) {
        document.body.style.userSelect = "none";
        this.element.classList.add("dragging");
        const rect = this.element.getBoundingClientRect();
        this.element.parentNode.replaceChild(this.placeholder, this.element);
        this.offsetX = e.clientX - rect.left;
        this.offsetY = e.clientY - rect.top;
        this.root.appendChild(this.element);
        this.element.style.position = "absolute";
        this.element.style.left = rect.left + "px";
        this.element.style.top = rect.top + "px";
        this.element.style.width = rect.width + "px";
        this.element.style.zIndex = 1000;
        this.isDragging = true;
        this.placeholder.style.maxHeight = rect.height + "px";
        this.placeholder.style.maxWidth = rect.width + "px";
        document.addEventListener("mousemove", this._move);
        document.addEventListener("mouseup", this._up)
    }
    /** @param {MouseEvent} e */
    onMouseMove(e) {
        if (!this.isDragging) return;
        this.element.style.left = (e.pageX - this.offsetX) + "px";
        this.element.style.top = (e.pageY - this.offsetY) + "px";
        this.element.style.pointerEvents = "none";
        const cursor = document.elementFromPoint(e.clientX, e.clientY);
        this.element.style.pointerEvents = "auto";
        const targetLayout = cursor?.closest(".layout");
        /*** @type {HTMLElement}*/
        const targetCard = cursor?.closest(".card");
        
        this.layoutDrop = targetLayout && this.layouts.includes(targetLayout) ? targetLayout : this.prevParent;
        if (targetCard) {
            const rect = targetCard.getBoundingClientRect();
            const middleY = rect.top + rect.height / 2;
            if (e.clientY < middleY) {
                targetCard.before(this.placeholder);
            } else {
                targetCard.after(this.placeholder);
            }
        }else{
            if(!this.layoutDrop.getAttribute){
               this.layoutDrop = this.prevParent;
            }
            this.layoutDrop.appendChild(this.placeholder); 
        }
    }
    
    onMouseUp(e,CallBack) {
        clearTimeout(this.holdTimer);
        if (!this.isDragging) return;
        if(this.end && this.layoutDrop){
            this.end(this.layoutDrop.getAttribute("data-layout"));
        }
        this.isDragging = false;
        this.element.classList.remove("dragging");
        this.placeholder.replaceWith(this.element);
        this.element.style.position = "";
        this.element.style.left = "";
        this.element.style.top = "";
        this.element.style.width = "";
        this.element.style.zIndex = "";
        document.removeEventListener("mousemove", this._move);
        document.removeEventListener("mouseup", this._up);
        this.element.style.cursor = "grab";
    }
}

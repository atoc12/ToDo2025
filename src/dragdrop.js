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
        document.addEventListener("mousemove", e => this.onMouseMove(e));
        document.addEventListener("mouseup", e => this.onMouseUp(e,end));
        this.placeholder = document.createElement("div");
        this.placeholder.classList.add("card-placeholder");
        this.placeholder.style.height = this.element.offsetHeight + "px";
    }
    onMouseDown(e) {
        this.holdTimer = setTimeout(() => {
            this.startDrag(e);
        }, this.holdDelay);
    }
    startDrag(e) {
        this.element.classList.add("dragging");
        const rect = this.element.getBoundingClientRect();
        this.offsetX = e.clientX - rect.left;
        this.offsetY = e.clientY - rect.top;
        this.root.appendChild(this.element);
        this.element.style.position = "absolute";
        this.element.style.left = rect.left + "px";
        this.element.style.top = rect.top + "px";
        this.element.style.width = rect.width + "px";
        this.element.style.zIndex = 1000;
        this.isDragging = true;
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
        if (targetLayout && this.layouts.includes(targetLayout)) {
            this.layoutDrop = targetLayout;
        } else {
            this.layoutDrop = this.prevParent;
        }
        if (targetCard) {
            const rect = targetCard.getBoundingClientRect();
            const middleY = rect.top + rect.height / 2;
        
            if (e.clientY < middleY) {
                targetCard.before(this.placeholder);
            } else {
                targetCard.after(this.placeholder);
            }
        }else{
            this.layoutDrop.appendChild(this.placeholder);
        }
    }
    
    onMouseUp(e,CallBack) {
        clearTimeout(this.holdTimer);
        if (!this.isDragging) return;
        if(CallBack){
            CallBack(this.layoutDrop.getAttribute("data-layout"));
        }
        this.isDragging = false;
        this.element.classList.remove("dragging");
        this.placeholder.replaceWith(this.element);
        this.element.style.position = "";
        this.element.style.left = "";
        this.element.style.top = "";
        this.element.style.width = "";
        this.element.style.zIndex = "";
    }
}

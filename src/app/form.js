export class Form {
    constructor({id,cancel,save}) {
        this.id = id;
        this.form = document.getElementById(id);        
        this.field = {};
        this.form.addEventListener("change",(e)=>{
            this.field = {...this.field,[e.target.name]:e.target.value}
        })
        this.form.addEventListener("reset",(e)=>{
            this.cancel(e,cancel);
        })
        this.form.addEventListener("submit",(e)=>{
            e.preventDefault();
            this.save(e,save);
        })
    }
    
    save(event,callback){
        if(callback) callback(event,this);
    }
    cancel(event,callback){
        this.field = {};
        if(callback) callback(event,this);
    }

    setValues(values) {
        console.log(values);
        this.field = { ...this.field, ...values };
        for (let key in values) {
            const input = this.form.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === "checkbox") {
                    input.checked = !!values[key];
                } else if (input.type === "radio") {
                    const radio = this.form.querySelector(`[name="${key}"][value="${values[key]}"]`);
                    if (radio) radio.checked = true;
                } else {
                    input.value = values[key];
                }
            }
        }
    }


}
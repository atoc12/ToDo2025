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
}
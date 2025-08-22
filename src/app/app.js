import { DataBase, Model } from "./ORM.js";
import { SETTINGS } from "./settings.js";

export class App extends DataBase {
    constructor(){
        super({
            name:SETTINGS.db.name,
            version:SETTINGS.db.version
        });
        this.tasks = [];
        this.init();
    }
    async init() {
        try {
            /** @type {Record<string, Model>} */
            this.model = {
                task:new Model({
                    name:"task",
                    options:{
                        keyPath:"ID",
                        autoIncrement:true
                    }
                },[
                    {name:"ID", options:{unique:true}},
                    {name:"order"}
                ])
            }
            await this.connect();            
        } catch(err) {
            console.error(err);
        }finally{
            // Inicializar UI
            this.main();
        }
    }
    main(){

    }
}
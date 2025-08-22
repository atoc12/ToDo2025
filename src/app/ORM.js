import { SETTINGS } from "./settings.js";
/**
 * Este modulo tiene por objetivo abarcar el sistema ORM
 * Se estará utilizando la API del navegador indexedDB
 * Tambíen se integra JSdocs, una forma de documentar en algunos IDLE para permitir la inferencias de datos

 */
/**
 * @typedef {Object} SettingsDB
 * @property {string} name
 * @property {number} version
*/
/**
 * @typedef {Object} SettingsModel
 * @property {string} name
 * @property {IDBDatabase} db
 * @property {IDBObjectStoreParameters} options
*/
/**
 * @typedef {Object} Structure
 * @property {string} name
 * @property {IDBIndexParameters} options
*/
export class Model {
    /** @type {SettingsModel | null} */ settings;
    /** @type {Structure[]} */ structure ;
    /** @type {IDBObjectStore | null} */ store ;
    /**
     * @param {SettingsModel } settings 
     * @param {Structure[]} structure 
     */
    constructor(settings,structure){
        this.settings = settings;
        this.structure = structure;
    }
    /**  @returns  {IDBObjectStore} */
    #transaction(){
        return this.settings.db
        .transaction(this.settings.name,SETTINGS.db.mode.crud)
        .objectStore(this.settings.name);
    }
    // Metodo encargado de generar todas las columnas del modelo
    #addColumns() {
        this.structure.map(column=>this.store.createIndex(column.name,column.name,column.options));
    }
    completed () { console.log(SETTINGS.db.log.sucess.modelCompleted(this.settings.name)); }
    error(){ console.log(SETTINGS.db.log.error.model);}
    async getAll(){
        try{
            this.store = this.#transaction();
            let result = this.store.getAll();
            return await new Promise ((resolve,reject)=> {
                result.onsuccess = async e => {
                    resolve(e.target.result);
                }
            })   
        }catch(err){
            return err;
        }
    }
    /**
     * Metodo de eliminación de un registro del modelo
     * @param {number | number[]} id  - Identificador o identificadores de registros a eliminar.
     */
    async remove(id){
        try{
            if(!id) throw new Error(SETTINGS.db.log.required.id);
            this.store = this.#transaction();
            let response;
            // En caso de ser una lista de identificadores.
            if(Array.isArray(id)){
                response = await Promise.all(id.map(id => this.store.delete(id)));
            }else{
                response = await new Promise((resolve,reject)=> {
                    let result = this.store.delete(id)
                    result.onsuccess = e => resolve(e.target.result)
                });
            }
            return response;
        }catch(err){
            return err;
        }
    }
    /**
     * Metodo de actualización de un registro del modelo
     * @param {number} id 
     * @param {Object} values 
     */
    async update(id,values){
        try{
            if(!id) throw new Error(SETTINGS.db.log.required.id);
            if(!values) throw new Error(SETTINGS.db.log.update.value.required);
            this.store = this.#transaction();
            let resutl = this.store.get(id);
            return await new Promise( (resolve,reject)=>{
                resutl.onsuccess= e =>{
                    let newValue = Object.assign(e.target.result,values)
                    let response = this.store.put(newValue);
                    response.onsuccess = e => resolve(e.target.result) ;
                }
            })
        }catch(err){
            return err;
        }
    }
    async create(data,db){
        if(!this.settings.db) throw new Error(SETTINGS.db.log.error.conexion);
        this.store = this.#transaction();
        let result = this.store.add(data);
        return new Promise ((resolve,reject)=>{
            result.onsuccess = e=>{
                let response = this.store.get(e.target.result);
                response.onsuccess = e => {
                    resolve(e.target.result);
                }
            }
            result.onerror= e =>{
                console.log("error",e)
            }
        })
    }
    // Metodo encargado de la generación del modelo
    generated(){
        try{
            if(!this.settings.db) throw new Error(SETTINGS.db.log.error.conexion);
            this.store = this.settings.db.createObjectStore(this.settings.name,this.settings.options);
            this.#addColumns();
            this.store.transaction.oncomplete = this.completed.bind(this);
            this.store.transaction.onerror = this.error.bind(this);
            if(!this.store) throw new Error("Error al generar un store");
        }catch(err){
            return err;
        }
    }
}
export class DataBase {
    /** @type {IDBFactory} */ indexedDB = window.indexedDB;
    /** @type {IDBOpenDBRequest}*/ conexion;
    /** @type {Record<string, Model>} */ model = {};
    /** @type {IDBDatabase | null} */ db=null;
    constructor({
        name,
        version
    }){
        this.name = name;
        this.version = version;
    } 
    success(event){
        console.log(SETTINGS.db.log.sucess.connected);
        this.db = event.target.result;
        Object.keys(this.model).forEach( key => {
            this.model[key].settings.db = this.db;
        });
    }
    error(){

    }
    upgrade(event){
        this.db = event.target.result;
        Object.entries(this.model).forEach(([key,model])=>{
            this.model[key].settings.db = this.db;
            this.model[key].generated();
        })
        
    }
    connect(){
        return new Promise ((resolve,reject)=>{
            this.conexion = this.indexedDB.open(this.name,this.version);
            this.conexion.onerror =  e => reject(this.error);
            this.conexion.onsuccess = e => {
                this.success(e); 
                resolve(this.db); 
            };
            this.conexion.onupgradeneeded = e => {
                this.upgrade(e); 
                resolve(this.db); 
            };

        })
    }
}
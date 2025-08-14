export const SETTINGS = {
    db:{
        name:"ToDo",
        version:4,
        mode:{
            read:"read",
            crud:"readwrite",
        },
        log:{
            sucess:{
                data:"¡Datos generados correctamente!",
                modelCompleted:(name)=>`¡El modelo ${name} se generó correctamente!`,
                connected:"¡Conexión establecida!",
            },
            required:{
                id:"Es necesario pasar el paramtero (id)"
            },
            update:{
                value:{
                    required:"El parametro (value) es necesario."
                }
            },
            error:{
                model:"Error al generar el modelo",
                conexion:"No se ha encontrado la conexión con la base de datos"
            }
        }
    },
    enums: {
        status: {
            textEs: {
                pending: "Pendiente",
                inProcess: "En proceso",
                completed: "Completado"
            },
            buttonCompared: {
                pending: "Iniciar",
                inProcess: "Completar",
                completed: "Reanudar"
            }
        }
    },
    layouts:{
        pending:document.querySelector(".pending"),
        process:document.querySelector(".process"),
        completed:document.querySelector(".completed")
    }
}
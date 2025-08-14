# ToDo2025

Este proyecto fue realizado con la API del IndexedDB con la documentación de [MDN Web Docs](https://developer.mozilla.org/es/docs/Web/API/IndexedDB_API).

Para los iconos se utilizó la librería de [Bootstrap Icons](https://icons.getbootstrap.com/).

**Objetivo:** Realizar una aplicación de To Do compleja utilizando CSS, HTML y JS vanilla y al final generar una ejecutable con Electron.

---

## Tecnologías utilizadas

- **JavaScript (Vanilla JS)**: lógica de la aplicación, manipulación del DOM y manejo de IndexedDB.  
- **HTML5 y CSS3**: estructura y estilos de la interfaz.  
- **Bootstrap Icons**: iconos para botones y elementos de la UI.  
- **Electron**: para generar una aplicación ejecutable de escritorio.  

---

## Paradigma y arquitectura

- **Orientación a objetos (POO)**:  
  La aplicación está estructurada en clases como `Model`, `Task`, `Form` y `Modal` para separar responsabilidades.  
  Cada clase tiene métodos específicos para manejar datos o actualizar la interfaz.

- **Manipulación del DOM**:  
  Las tareas se renderizan dinámicamente usando `template` de HTML y métodos como `append`, `remove` y `addEventListener`.  
  Esto permite actualizar la UI en tiempo real cuando se agregan, eliminan o modifican tareas.

- **Modelo de datos**:  
  Se utiliza IndexedDB como almacenamiento local para persistencia de tareas, implementando un mini “ORM” en la clase `Model` que maneja CRUD (crear, leer, actualizar, eliminar).

- **Tipados e Inferencia de datos**: 
  Se especificaron tipos para variables, metodos, etc. Implementando [JSDoc](https://jsdoc.app/) para su documentación.

---

## Funcionalidades

- Crear, actualizar y eliminar tareas.  
- Cambiar el estado de cada tarea: pendiente, en proceso, completada.  
- Carga y visualización de archivos asociados a tareas.  
- Layout adaptable: posibilidad de cambiar entre diseño de columnas o filas.  
- Modal de formulario para crear nuevas tareas.  
- Persistencia de datos en el navegador usando [IndexedDB]((https://developer.mozilla.org/es/docs/Web/API/IndexedDB_API)).  

---

## Licencia

Este proyecto utiliza los siguientes recursos externos:

- **[Bootstrap Icons](https://icons.getbootstrap.com/)** – Licencia MIT.  
  Permite usar, modificar y distribuir los iconos libremente, incluso en proyectos comerciales.  

- **[MDN Web Docs](https://developer.mozilla.org/)** – Contenido bajo Creative Commons BY-SA 2.5.  
  Se permite su uso citando la fuente.

- **IndexedDB** – API nativa del navegador, libre de usar sin restricciones.

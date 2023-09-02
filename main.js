document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("formulario");
    const listaContactos = document.getElementById("lista-contactos");
    const botonGuardar = document.getElementById("guardar");
    const botonBorrarLista = document.getElementById("borrar-lista");

    // Comprobar si hay datos en el localStorage y cargarlos
    const contactosGuardados = JSON.parse(localStorage.getItem("contactos")) || [];

    // Cargar los contactos guardados en la lista
    cargarContactos(contactosGuardados);

    botonGuardar.addEventListener("click", function () {
        const nombre = document.getElementById("nombre").value;
        const email = document.getElementById("email").value;
        const telefono = document.getElementById("telefono").value;
        const mensaje = document.getElementById("mensaje").value;

        // Crear un objeto para el nuevo contacto
        const nuevoContacto = {
            nombre,
            email,
            telefono,
            mensaje
        };

        // Agregar el nuevo contacto al array de contactos guardados
        contactosGuardados.push(nuevoContacto);

        // Guardar los contactos en el localStorage
        localStorage.setItem("contactos", JSON.stringify(contactosGuardados));

        // Actualizar la lista de contactos en la página
        cargarContactos(contactosGuardados);

        formulario.reset();
    });

    botonBorrarLista.addEventListener("click", function () {
        // Borrar la lista de contactos
        listaContactos.innerHTML = "";

        // Borrar los contactos guardados en el localStorage
        localStorage.removeItem("contactos");
    });

    // Función para cargar los contactos en la lista
    function cargarContactos(contactos) {
        listaContactos.innerHTML = "";
        contactos.forEach(function (contacto, index) {
            const nuevoContacto = document.createElement("li");
            nuevoContacto.innerHTML = `<strong>Nombre:</strong> ${contacto.nombre}, <strong>Email:</strong> ${contacto.email}, <strong>Teléfono:</strong> ${contacto.telefono}, <strong>Mensaje:</strong> ${contacto.mensaje}`;
            listaContactos.appendChild(nuevoContacto);
        });
    }
});

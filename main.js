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

        // Validación de email utilizando una expresión regular
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
            Swal.fire("Error", "Por favor, ingresa una dirección de correo electrónico válida.", "error");
            return; // Detener el proceso de guardar
        }

        // Validación de teléfono (ejemplo: 113-240-8212)
        const telefonoPattern = /^\d{3}-\d{3}-\d{4}$/;
        if (telefono && !telefonoPattern.test(telefono)) {
            Swal.fire("Error", "Por favor, ingresa un número de teléfono válido en el formato 123-456-7890.", "error");
            return; // Detener el proceso de guardar
        }

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

        // Mostrar una alerta de éxito con SweetAlert2
        Swal.fire("¡Éxito!", "El contacto se ha guardado correctamente.", "success");

        // Actualizar la lista de contactos en la página con el nuevo contacto
        cargarContactos([nuevoContacto]);

        formulario.reset();
    });

    botonBorrarLista.addEventListener("click", function () {
        // Mostrar una ventana modal de confirmación con SweetAlert2
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Deseas borrar la lista de contactos?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d9534f",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, borrar lista",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                // Borrar la lista de contactos
                listaContactos.innerHTML = "";

                // Borrar los contactos guardados en el localStorage
                localStorage.removeItem("contactos");

                // Mostrar una alerta de éxito
                Swal.fire("¡Éxito!", "La lista de contactos se ha borrado.", "success");
            }
        });
    });

    // Función para cargar los contactos en la lista
    function cargarContactos(contactos) {
        listaContactos.innerHTML = "";
        contactos.forEach(function (contacto, index) {
            const nuevoContacto = document.createElement("li");
            nuevoContacto.innerHTML = `<strong>Nombre:</strong> ${contacto.nombre}, <strong>Email:</strong> ${contacto.email}, <strong>Teléfono:</strong> ${contacto.telefono}, <strong>Mensaje:</strong> ${contacto.mensaje} <button class="editar" data-index="${index}">Editar</button> <button class="eliminar" data-index="${index}">Eliminar</button>`;
            listaContactos.appendChild(nuevoContacto);
        });

        // Agregar eventos para editar y eliminar contactos
        const botonesEditar = document.querySelectorAll(".editar");
        const botonesEliminar = document.querySelectorAll(".eliminar");

        botonesEditar.forEach((botonEditar) => {
            botonEditar.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                editarContacto(index, contactosGuardados[index]);
            });
        });

        botonesEliminar.forEach((botonEliminar) => {
            botonEliminar.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                eliminarContacto(index);
            });
        });
    }

    // Función para editar un contacto
    function editarContacto(index, contacto) {
        Swal.fire({
            title: "Editar Contacto",
            html: `
                <input id="nombre-editar" class="swal2-input" value="${contacto.nombre}" placeholder="Nombre">
                <input id="email-editar" class="swal2-input" value="${contacto.email}" placeholder="Email">
                <input id="telefono-editar" class="swal2-input" value="${contacto.telefono}" placeholder="Teléfono">
                <textarea id="mensaje-editar" class="swal2-input" placeholder="Mensaje">${contacto.mensaje}</textarea>
            `,
            focusConfirm: false,
            preConfirm: () => {
                const nombre = Swal.getPopup().querySelector("#nombre-editar").value;
                const email = Swal.getPopup().querySelector("#email-editar").value;
                const telefono = Swal.getPopup().querySelector("#telefono-editar").value;
                const mensaje = Swal.getPopup().querySelector("#mensaje-editar").value;

                // Validación de email
                const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                if (!emailPattern.test(email)) {
                    Swal.showValidationMessage("Por favor, ingresa una dirección de correo electrónico válida.");
                }

                // Validación de teléfono (ejemplo: 113-240-8212)
                const telefonoPattern = /^\d{3}-\d{3}-\d{4}$/;
                if (telefono && !telefonoPattern.test(telefono)) {
                    Swal.showValidationMessage("Por favor, ingresa un número de teléfono válido en el formato 123-456-7890.");
                }

                return { nombre, email, telefono, mensaje };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Actualizar el contacto en el array de contactos guardados
                contactosGuardados[index] = result.value;

                // Actualizar los contactos en el localStorage
                localStorage.setItem("contactos", JSON.stringify(contactosGuardados));

                // Recargar la lista de contactos
                cargarContactos(contactosGuardados);

                Swal.fire("¡Éxito!", "El contacto se ha editado correctamente.", "success");
            }
        });
    }

    // Función para eliminar un contacto
    function eliminarContacto(index) {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Deseas eliminar este contacto?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d9534f",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar contacto",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                // Eliminar el contacto del array de contactos guardados
                contactosGuardados.splice(index, 1);

                // Actualizar los contactos en el localStorage
                localStorage.setItem("contactos", JSON.stringify(contactosGuardados));

                // Recargar la lista de contactos
                cargarContactos(contactosGuardados);

                Swal.fire("¡Éxito!", "El contacto se ha eliminado correctamente.", "success");
            }
        });
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("formulario");
    const listaContactos = document.getElementById("lista-contactos");
    const botonGuardar = document.getElementById("guardar");
    const botonBorrarLista = document.getElementById("borrar-lista");
    const botonAgregarContactosAleatorios = document.getElementById("agregarContactosAleatorios");

    const botonCargarContactos = document.getElementById("cargar-contactos");

    botonCargarContactos.addEventListener("click", function () {
        const username = document.getElementById("username").value;

        const nombreArchivo = `${username}.json`;

        let contactosGuardados = JSON.parse(localStorage.getItem(nombreArchivo)) || [];

        cargarContactos(contactosGuardados);
    });

    botonGuardar.addEventListener("click", function () {
        const nombre = document.getElementById("nombre").value;
        const email = document.getElementById("email").value;
        const telefono = document.getElementById("telefono").value;
        const mensaje = document.getElementById("mensaje").value;

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
            Swal.fire("Error", "Por favor, ingresa una dirección de correo electrónico válida.", "error");
            return;
        }

        const telefonoPattern = /^\d+$/;
        if (telefono && !telefonoPattern.test(telefono)) {
            Swal.fire("Error", "Por favor, ingresa solo números en el campo de teléfono.", "error");
            return;
        }

        const nuevoContacto = {
            nombre,
            email,
            telefono,
            mensaje
        };

        const username = document.getElementById("username").value;
        const nombreArchivo = `${username}.json`;

        let contactosGuardados = JSON.parse(localStorage.getItem(nombreArchivo)) || [];

        contactosGuardados.push(nuevoContacto);

        localStorage.setItem(nombreArchivo, JSON.stringify(contactosGuardados));

        Swal.fire("¡Éxito!", "El contacto se ha guardado correctamente.", "success");

        cargarContactos([nuevoContacto]);

        formulario.reset();
    });

    botonBorrarLista.addEventListener("click", function () {
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
                listaContactos.innerHTML = "";

                const username = document.getElementById("username").value;
                const nombreArchivo = `${username}.json`;

                localStorage.removeItem(nombreArchivo);

                Swal.fire("¡Éxito!", "La lista de contactos se ha borrado.", "success");
            }
        });
    });

    botonAgregarContactosAleatorios.addEventListener("click", function () {
        const username = document.getElementById("username").value;
        const nombreArchivo = `${username}.json`;

        let contactosGuardados = JSON.parse(localStorage.getItem(nombreArchivo)) || [];

        contactosGuardados.length = 0;

        for (let i = 0; i < 5; i++) {
            const contacto = generarContactoAleatorio();
            contactosGuardados.push(contacto);
        }

        localStorage.setItem(nombreArchivo, JSON.stringify(contactosGuardados));

        Swal.fire("¡Éxito!", "Se han agregado 5 contactos aleatorios adicionales.", "success");

        cargarContactos(contactosGuardados);
    });

    function cargarContactos(contactos) {
        listaContactos.innerHTML = "";
        contactos.forEach(function (contacto, index) {
            const nuevoContacto = document.createElement("li");
            nuevoContacto.innerHTML = `<strong>Nombre:</strong> ${contacto.nombre}, <strong>Email:</strong> ${contacto.email}, <strong>Teléfono:</strong> ${contacto.telefono}, <strong>Mensaje:</strong> ${contacto.mensaje} <button class="editar" data-index="${index}">Editar</button> <button class="eliminar" data-index="${index}">Eliminar</button>`;
            listaContactos.appendChild(nuevoContacto);
        });

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

                const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                if (!emailPattern.test(email)) {
                    Swal.showValidationMessage("Por favor, ingresa una dirección de correo electrónico válida.");
                }

                const telefonoPattern = /^\d+$/;
                if (telefono && !telefonoPattern.test(telefono)) {
                    Swal.showValidationMessage("Por favor, ingresa un número de teléfono válido en el formato 123-456-7890.");
                }

                return { nombre, email, telefono, mensaje };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                contactosGuardados[index] = result.value;

                const username = document.getElementById("username").value;
                const nombreArchivo = `${username}.json`;

                localStorage.setItem(nombreArchivo, JSON.stringify(contactosGuardados));

                cargarContactos(contactosGuardados);
                Swal.fire("¡Éxito!", "El contacto se ha editado correctamente.", "success");
            }
        });
    }

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
                contactosGuardados.splice(index, 1);

                const username = document.getElementById("username").value;
                const nombreArchivo = `${username}.json`;

                localStorage.setItem(nombreArchivo, JSON.stringify(contactosGuardados));

                cargarContactos(contactosGuardados);
                Swal.fire("¡Éxito!", "El contacto se ha eliminado correctamente.", "success");
            }
        });
    }

    function generarContactoAleatorio() {
        const nombres = ["Juan", "Ana", "Carlos", "Luisa", "María"];
        const apellidos = ["Pérez", "Gómez", "Martínez", "Fernández", "López"];
        const emails = ["juan@example.com", "ana@example.com", "carlos@example.com", "luisa@example.com", "maria@example.com"];
        const telefonos = ["123-456-7890", "987-654-3210", "555-555-5555", "999-999-9999", "777-777-7777"];
        const mensajes = ["Hola, ¿cómo estás?", "Me gustaría conocer más sobre tu proyecto.", "¡Gracias por contactarme!", "Estoy interesado en tus servicios.", "¿Puedes ayudarme con esto?"];

        const nombreAleatorio = nombres[Math.floor(Math.random() * nombres.length)];
        const apellidoAleatorio = apellidos[Math.floor(Math.random() * apellidos.length)];
        const emailAleatorio = emails[Math.floor(Math.random() * emails.length)];
        const telefonoAleatorio = telefonos[Math.floor(Math.random() * telefonos.length)];
        const mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)];

        return {
            nombre: `${nombreAleatorio} ${apellidoAleatorio}`,
            email: emailAleatorio,
            telefono: telefonoAleatorio,
            mensaje: mensajeAleatorio
        };
    }
});

// ============================================
// CONSTANTES GLOBALES
// ============================================
const tbody = document.getElementById("container");

// ============================================
// RENDERIZAR
// ============================================
function renderizar(data, campos, filtroId, entidad) {
    tbody.innerHTML = "";
    data.forEach(function(item) {
        if (filtroId == "" || item.id == filtroId) {
            tbody.innerHTML += construirFila(item, campos, entidad);
        }
    });
    asignarEventos(campos);
}

// ============================================
// CONSTRUIR FILA
// ============================================
function construirFila(item, campos, entidad) {
    let celdas = campos.map(function(campo) {
        return `<td>${item[campo]}</td>`;
    }).join("");

    let btnUpdate = entidad !== "carts" ? `
        <td>
            <button class="btn-update"
                data-item='${encodeURIComponent(JSON.stringify(item))}'>
                Update
            </button>
        </td>` : `<td></td>`;

    return `<tr>
        ${celdas}
        ${btnUpdate}
        <td>
            <button onclick='borrar("${item.id}", "${entidad}", ${JSON.stringify(campos)})'>
                Delete
            </button>
        </td>
    </tr>`;
}

// ============================================
// ASIGNAR EVENTOS
// ============================================
function asignarEventos(campos) {
    document.querySelectorAll(".btn-update").forEach(function(btn) {
        btn.onclick = function() {
            let item = JSON.parse(decodeURIComponent(this.dataset.item));
            precargar(item, campos);
        };
    });
}

// ============================================
// OBTENER
// ============================================
function obtener(entidad, campos, filtroId) {
    api.read(entidad)
        .then(function(data) {
            renderizar(data, campos, filtroId, entidad);
        });
}

// ============================================
// CREAR
// ============================================
function crear(entidad, datos, camposLimpiar, campos) {
    let valoresVacios = Object.values(datos).some(function(v) {
        return v == "";
    });

    if (valoresVacios) {
        alert("Debes llenar todos los campos");
        return;
    }

    api.create(entidad, datos)
        .then(function(data) {
            limpiarFormulario(...camposLimpiar);
            obtener(entidad, campos, "");
        });
}

// ============================================
// ACTUALIZAR
// ============================================
function actualizar(entidad, id, datos, camposLimpiar, campos) {
    let valoresVacios = Object.values(datos).some(function(v) {
        return v == "";
    });

    if (!id || valoresVacios) {
        alert("Debes llenar todos los campos");
        return;
    }

    api.update(entidad, id, datos)
        .then(function(data) {
            limpiarFormulario(...camposLimpiar);
            obtener(entidad, campos, "");
        });
}

// ============================================
// BORRAR
// ============================================
function borrar(id, entidad, campos) {
    if (id == "") {
        alert("Ingresa el id primero");
        return;
    }

    let confirmacion = confirm("¿Estás seguro de borrar el id: " + id + "?");
    if (confirmacion) {
        api.delete(entidad, id)
            .then(function(data) {
                obtener(entidad, campos, "");
            });
    }
}

// ============================================
// PRECARGAR
// ============================================
function precargar(item, campos) {
    campos.forEach(function(campo) {
        let input = document.getElementById("update_" + campo);
        if (input) input.value = item[campo];
    });
}

// ============================================
// LIMPIAR FORMULARIO
// ============================================
function limpiarFormulario(...ids) {
    ids.forEach(function(id) {
        document.getElementById(id).value = "";
    });
}

// ============================================
// NAV ACTIVO — marca el link actual
// ============================================
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("nav a").forEach(function(link) {
        if (link.href === window.location.href) {
            link.classList.add("active");
        }
    });
});
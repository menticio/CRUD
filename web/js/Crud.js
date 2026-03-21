// ============================================
// CONSTANTES GLOBALES
// ============================================
const tbody = document.getElementById("container");

// ============================================
// RENDERIZAR — pinta cualquier entidad en la tabla
// @param data — arreglo de datos del servidor
// @param campos — campos a mostrar ej: ["id","title","price"]
// @param filtroId — id para filtrar, "" muestra todos
// ============================================
function renderizar(data, campos, filtroId) {
    tbody.innerHTML = "";
    data.forEach(function(item) {
        if (filtroId == "" || item.id == filtroId) {
            tbody.innerHTML += construirFila(item, campos);
        }
    });
    asignarEventos(campos);
}

// ============================================
// CONSTRUIR FILA — genera el HTML de una fila
// @param item — objeto con los datos
// @param campos — campos a mostrar
// ============================================
function construirFila(item, campos) {
    let celdas = campos.map(function(campo) {
        return `<td>${item[campo]}</td>`;
    }).join("");

    return `<tr>
        ${celdas}
        <td>
            <button class="btn-update"
                data-item='${JSON.stringify(item)}'>
                Update
            </button>
        </td>
        <td>
            <button onclick='borrar("${item.id}")'>
                Delete
            </button>
        </td>
    </tr>`;
}

// ============================================
// ASIGNAR EVENTOS — onclick a botones Update
// ============================================
function asignarEventos(campos) {
    document.querySelectorAll(".btn-update").forEach(function(btn) {
        btn.onclick = function() {
            let item = JSON.parse(this.dataset.item);
            precargar(item, campos);
        };
    });
}

// ============================================
// OBTENER — llama API y renderiza
// @param entidad — "products", "users", etc
// @param campos — campos a mostrar
// @param filtroId — id para filtrar
// ============================================
function obtener(entidad, campos, filtroId) {
    api.read(entidad)
        .then(function(data) {
            renderizar(data, campos, filtroId);
        });
}

// ============================================
// CREAR — valida, llama API y limpia formulario
// @param entidad — "products", "users", etc
// @param datos — objeto con los datos nuevos
// @param camposLimpiar — ids de inputs a limpiar
// ============================================
function crear(entidad, datos, camposLimpiar) {
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
            obtener(entidad, campos);
        });
}

// ============================================
// ACTUALIZAR — valida, llama API y limpia
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
            obtener(entidad, campos);
        });
}

// ============================================
// BORRAR — confirma y llama API
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
                obtener(entidad, campos);
            });
    }
}

// ============================================
// PRECARGAR — llena inputs del formulario Update
// ============================================
function precargar(item, campos) {
    campos.forEach(function(campo) {
        let input = document.getElementById("update_" + campo);
        if (input) input.value = item[campo];
    });
}

// ============================================
// LIMPIAR FORMULARIO — vacía los inputs
// ============================================
function limpiarFormulario(...ids) {
    ids.forEach(function(id) {
        document.getElementById(id).value = "";
    });
}
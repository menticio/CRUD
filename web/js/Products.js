
const tbody = document.getElementById("container");


function crearProducto() {
    let InputTitulo = document.getElementById("inputTitulo").value;
    let InputPrecio = document.getElementById("inputPrecio").value;
    let InputCategoria = document.getElementById("inputCategoria").value;

    if (InputTitulo == "" || InputPrecio == "" || InputCategoria == "") {
        alert("Debes de Llenar todos los campos");
        return;
    }

    let nuevoProducto = {
        title: InputTitulo,
        price: InputPrecio,
        category: InputCategoria
    };

    api.create("products", nuevoProducto)
        .then(function(data) {
            limpiarFormulario("inputTitulo", "inputPrecio", "inputCategoria");
            obtenerProductos();
        });
}

function obtenerProductos() {
    let filtroId = document.getElementById("idConsult").value;
    api.read("products")
        .then(function(data) {
            renderizarProductos(data, filtroId);
        });
}

function renderizarProductos(data, filtroId) {
    tbody.innerHTML = "";
    data.forEach(function(producto) {
        if (filtroId == "" || producto.id == filtroId) {
            tbody.innerHTML += construirFila(producto);
        }
    });
    asignarEventosBotones();
}

function construirFila(producto) {
    return `<tr>
        <td>${producto.id}</td>
        <td>${producto.title}</td>
        <td>${producto.price}</td>
        <td>${producto.category}</td>
        <td>
            <button class="btn-update"
                data-id="${producto.id}"
                data-title="${producto.title}"
                data-price="${producto.price}"
                data-category="${producto.category}">
                Update
            </button>
        </td>
        <td>
            <button onclick='borrarProductos("${producto.id}")'>
                Delete
            </button>
        </td>
    </tr>`;
}

function asignarEventosBotones() {
    document.querySelectorAll(".btn-update").forEach(function(btn) {
        btn.onclick = function() {
            precargarProducto(
                this.dataset.id,
                this.dataset.title,
                this.dataset.price,
                this.dataset.category
            );
        };
    });
}


function consultarProductoActulizable() {
    let filtroId = document.getElementById("idConsultUpdate").value;
    api.read("products")
        .then(function(data) {
            renderizarProductos(data, filtroId);
        });
}

function precargarProducto(id, title, price, category) {
    document.getElementById("idConsultUpdate").value = id;
    document.getElementById("inputTituloUPDATE").value = title;
    document.getElementById("inputPrecioUPDATE").value = price;
    document.getElementById("inputCategoriaUPDATE").value = category;
}

function actualizarProducto() {
    let idBusquedaUPDT = document.getElementById("idConsultUpdate").value;
    let InputTituloUPDT = document.getElementById("inputTituloUPDATE").value;
    let InputPrecioUPDT = document.getElementById("inputPrecioUPDATE").value;
    let InputCategoriaUPDT = document.getElementById("inputCategoriaUPDATE").value;

    if (idBusquedaUPDT == "" || InputTituloUPDT == "" || InputPrecioUPDT == "" || InputCategoriaUPDT == "") {
        alert("debes de llenar todos los campos");
        return;
    }

    let objetoActualizado = {
        title: InputTituloUPDT,
        price: InputPrecioUPDT,
        category: InputCategoriaUPDT
    };

    api.update("products", idBusquedaUPDT, objetoActualizado)
        .then(function(data) {
            limpiarFormulario("idConsultUpdate", "inputTituloUPDATE", "inputPrecioUPDATE", "inputCategoriaUPDATE");
            obtenerProductos();
        });
}


function borrarProductos(id) {
    if (id == "") {
        alert("ingresa el id que deseas borrar primero");
        return;
    }

    let confirmacion = confirm("¿Estás seguro de borrar el producto con id: " + id + "?");
    if (confirmacion) {
        api.delete("products", id)
            .then(function(data) {
                obtenerProductos();
            });
    }
}




function limpiarFormulario(...ids) {
    ids.forEach(function(id) {
        document.getElementById(id).value = "";
    });
}
const ENTIDAD = "products";
const CAMPOS = ["id", "title", "price", "category"];
const INPUTS_CREATE = ["inputTitulo", "inputPrecio", "inputCategoria"];
const INPUTS_UPDATE = ["update_id", "update_title", "update_price", "update_category"];

function crearProducto() {
    let datos = {
        title: document.getElementById("inputTitulo").value,
        price: document.getElementById("inputPrecio").value,
        category: document.getElementById("inputCategoria").value
    };
    crear(ENTIDAD, datos, INPUTS_CREATE, CAMPOS);
}

function obtenerProductos() {
    let filtroId = document.getElementById("idConsult").value;
    obtener(ENTIDAD, CAMPOS, filtroId);
}

function consultarUpdate() {
    let filtroId = document.getElementById("update_id").value;
    obtener(ENTIDAD, CAMPOS, filtroId);
}

function actualizarProducto() {
    let id = document.getElementById("update_id").value;
    let datos = {
        title: document.getElementById("update_title").value,
        price: document.getElementById("update_price").value,
        category: document.getElementById("update_category").value
    };
    actualizar(ENTIDAD, id, datos, INPUTS_UPDATE, CAMPOS);
}

function borrarProducto(id) {
    borrar(id, ENTIDAD, CAMPOS);
}
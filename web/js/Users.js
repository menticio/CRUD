const ENTIDAD_USERS = "users";
const CAMPOS_USERS = ["id", "firstName", "lastName", "email", "phone"];
const INPUTS_CREATE_USERS = ["inputFirstName", "inputLastName", "inputEmail", "inputPhone"];
const INPUTS_UPDATE_USERS = ["update_id_users", "update_firstName", "update_lastName", "update_email", "update_phone"];

function crearUsuario() {
    let datos = {
        firstName: document.getElementById("inputFirstName").value,
        lastName: document.getElementById("inputLastName").value,
        email: document.getElementById("inputEmail").value,
        phone: document.getElementById("inputPhone").value
    };
    crear(ENTIDAD_USERS, datos, INPUTS_CREATE_USERS, CAMPOS_USERS);
}

function obtenerUsuarios() {
    let filtroId = document.getElementById("idConsultUsers").value;
    obtener(ENTIDAD_USERS, CAMPOS_USERS, filtroId);
}

function consultarUpdateUsers() {
    let filtroId = document.getElementById("update_id_users").value;
    obtener(ENTIDAD_USERS, CAMPOS_USERS, filtroId);
}

function actualizarUsuario() {
    let id = document.getElementById("update_id_users").value;
    let datos = {
        firstName: document.getElementById("update_firstName").value,
        lastName: document.getElementById("update_lastName").value,
        email: document.getElementById("update_email").value,
        phone: document.getElementById("update_phone").value
    };
    actualizar(ENTIDAD_USERS, id, datos, INPUTS_UPDATE_USERS, CAMPOS_USERS);
}

function borrarUsuario(id) {
    borrar(id, ENTIDAD_USERS, CAMPOS_USERS);
}
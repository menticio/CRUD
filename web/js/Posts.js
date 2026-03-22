const ENTIDAD_POSTS = "posts";
const CAMPOS_POSTS = ["id", "title", "body", "userId"];
const INPUTS_CREATE_POSTS = ["inputTitlePost", "inputBodyPost", "postUserId"];
const INPUTS_UPDATE_POSTS = ["update_id_posts", "update_title", "update_body", "update_userId"];
let usuarioActualPost = null;

function verificarUsuarioPost() {
    let userId = document.getElementById("postUserId").value;

    if (userId == "") {
        alert("Ingresa un User ID primero");
        return;
    }

    api.readOne("users", userId)
        .then(function(usuario) {
            if (!usuario || usuario.message) {
                alert("Usuario no encontrado");
                return;
            }

            usuarioActualPost = usuario;

            let postUserInfo = document.getElementById("postUserInfo");
            let postUserInfoText = document.getElementById("postUserInfoText");
            postUserInfo.style.display = "block";
            postUserInfoText.innerHTML = `✅ Publicando como: <strong>${usuario.firstName} ${usuario.lastName}</strong> (ID: ${usuario.id})`;
        });
}

function crearPost() {
    if (!usuarioActualPost) {
        alert("Verifica el usuario primero");
        return;
    }

    let title = document.getElementById("inputTitlePost").value;
    let body = document.getElementById("inputBodyPost").value;

    if (title == "" || body == "") {
        alert("Debes llenar todos los campos");
        return;
    }

    let datos = {
        title: title,
        body: body,
        userId: usuarioActualPost.id
    };

    api.create("posts", datos)
        .then(function(data) {
            alert("✅ Post publicado por " + usuarioActualPost.firstName + " " + usuarioActualPost.lastName);
            limpiarFormulario("inputTitlePost", "inputBodyPost", "postUserId");
            document.getElementById("postUserInfo").style.display = "none";
            usuarioActualPost = null;
            obtenerPosts();
        });
}

function obtenerPosts() {
    let filtroId = document.getElementById("idConsultPosts").value;
    obtener(ENTIDAD_POSTS, CAMPOS_POSTS, filtroId);
}

function consultarUpdatePosts() {
    let filtroId = document.getElementById("update_id_posts").value;
    obtener(ENTIDAD_POSTS, CAMPOS_POSTS, filtroId);
}

function actualizarPost() {
    let id = document.getElementById("update_id_posts").value;
    let datos = {
        title: document.getElementById("update_title").value,
        body: document.getElementById("update_body").value,
        userId: document.getElementById("update_userId").value
    };
    actualizar(ENTIDAD_POSTS, id, datos, INPUTS_UPDATE_POSTS, CAMPOS_POSTS);
}

function borrarPost(id) {
    borrar(id, ENTIDAD_POSTS, CAMPOS_POSTS);
}
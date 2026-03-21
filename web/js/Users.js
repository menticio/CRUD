
//      "firstName": "Emily",
 //     "lastName": "Johnson",
//      "maidenName": "Smith",
//     "age": 29,
//     "gender": "female",
  //    "email": "emily.johnson@x.dummyjson.com",
 //     "phone": "+81 965-431-3024",
 //     "username": "emilys",
 //     "password": "emilyspass",


function crearUsuario() {

    let primerNombre = document.getElementById("Primer_Nombre").value;
    let segundoNombre = document.getElementById("Segundo_Nombre").value;
    let apellido = document.getElementById("Apellido").value;
    let edad = document.getElementById("Edad").value;
    let genero = document.getElementById("Genero_Sexual").value;
    let correo = document.getElementById("Correo_Electronico").value;
    let telefono = document.getElementById("Telefono").value;
    let usuairo = document.getElementById("Nombre_Usuario").value;
    let contraseña = document.getElementById("Contraseña").value;

    if (primerNombre =="" || segundoNombre =="" || apellido =="" || edad =="" || genero =="" || correo =="" || telefono == "" ||usuairo == "" || contraseña) {   
        alert("Debes de llenar todos los campos");
        return;
    }

    let UsuarioNuevo ={
        firstName : primerNombre,
        lastName : segundoNombre,
        maidenName : apellido,
        age : edad,
        gender : genero,
        email : correo,
        phone : telefono,
        username : usuairo,
        password : contraseña
    };

    api.create("users", crearUsuario)
        then(function(data){

    });


    function limpiarFormulario(params) {
        
    }


}
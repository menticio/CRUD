const ENTIDAD_CARTS = "carts";
const CAMPOS_CARTS = ["id", "userId", "total", "totalProducts", "totalQuantity"];
let productosCarrito = [];
let todosLosProductos = [];
let usuarioActual = null;

// ============================================
// VERIFICAR USUARIO
// ============================================
function verificarUsuario() {
    let userId = document.getElementById("cartUserId").value;

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

            usuarioActual = usuario;

            let userInfo = document.getElementById("userInfo");
            let userInfoText = document.getElementById("userInfoText");
            userInfo.style.display = "block";
            userInfoText.innerHTML = `✅ Usuario verificado: <strong>${usuario.firstName} ${usuario.lastName}</strong> (ID: ${usuario.id})`;

            if (productosCarrito.length > 0) {
                renderizarCarritoTemporal();
            }
        });
}

// ============================================
// CARGAR CATÁLOGO
// ============================================
function cargarCatalogo() {
    api.read("products")
        .then(function(data) {
            todosLosProductos = data;
            renderizarCatalogo(data);
        });
}

function filtrarCatalogo() {
    let busqueda = document.getElementById("searchProduct").value.toLowerCase();
    let filtrados = todosLosProductos.filter(function(p) {
        return p.title.toLowerCase().includes(busqueda);
    });
    renderizarCatalogo(filtrados);
}

function renderizarCatalogo(productos) {
    let catalogo = document.getElementById("catalogo");
    catalogo.innerHTML = "";
    productos.forEach(function(producto) {
        catalogo.innerHTML += `
        <div class="product-card">
            <img src="${producto.thumbnail}" alt="${producto.title}" class="product-img"
                onerror="this.src='https://via.placeholder.com/200x150?text=No+Image'" />
            <div class="product-info">
                <h4>${producto.title}</h4>
                <p class="product-category">${producto.category}</p>
                <p class="product-price">$${producto.price}</p>
            </div>
            <div class="product-actions">
                <input type="number" min="1" value="1" class="form-control quantity-input" id="qty_${producto.id}" />
                <button onclick="agregarAlCarrito('${producto.id}')">+ Agregar</button>
            </div>
        </div>`;
    });
}

// ============================================
// AGREGAR AL CARRITO
// ============================================
function agregarAlCarrito(productId) {
    if (!usuarioActual) {
        alert("Verifica el usuario primero");
        return;
    }

    let quantity = parseInt(document.getElementById("qty_" + productId).value);

    if (!quantity || quantity < 1) {
        alert("Ingresa una cantidad válida");
        return;
    }

    api.readOne("products", productId)
        .then(function(producto) {
            if (!producto || producto.message) {
                alert("Producto no encontrado");
                return;
            }

            let existe = productosCarrito.find(function(p) {
                return p.id == producto.id;
            });

            if (existe) {
                existe.quantity += quantity;
                existe.total = existe.price * existe.quantity;
            } else {
                productosCarrito.push({
                    id: producto.id,
                    title: producto.title,
                    price: producto.price,
                    quantity: quantity,
                    total: producto.price * quantity
                });
            }

            renderizarCarritoTemporal();
        });
}

// ============================================
// RENDERIZAR CARRITO TEMPORAL
// ============================================
function renderizarCarritoTemporal() {
    let cartItems = document.getElementById("cartItems");
    let cartPreview = document.getElementById("cartPreview");
    let cartTotal = document.getElementById("cartTotal");
    let cartUserBadge = document.getElementById("cartUserBadge");

    cartPreview.style.display = "block";
    cartItems.innerHTML = "";

    if (usuarioActual) {
        cartUserBadge.innerHTML = `👤 Carrito de: <strong>${usuarioActual.firstName} ${usuarioActual.lastName}</strong> (ID: ${usuarioActual.id})`;
    }

    let total = 0;
    productosCarrito.forEach(function(producto, index) {
        total += producto.total;
        cartItems.innerHTML += `<tr>
            <td>${producto.id}</td>
            <td>${producto.title}</td>
            <td>$${producto.price}</td>
            <td>${producto.quantity}</td>
            <td>$${producto.total.toFixed(2)}</td>
            <td><button onclick="quitarProducto(${index})">X</button></td>
        </tr>`;
    });

    cartTotal.textContent = "$" + total.toFixed(2);
}

// ============================================
// QUITAR PRODUCTO
// ============================================
function quitarProducto(index) {
    productosCarrito.splice(index, 1);
    if (productosCarrito.length === 0) {
        document.getElementById("cartPreview").style.display = "none";
    } else {
        renderizarCarritoTemporal();
    }
}

// ============================================
// GUARDAR CARRITO
// ============================================
function guardarCarrito() {
    if (!usuarioActual) {
        alert("Verifica el usuario primero");
        return;
    }

    if (productosCarrito.length === 0) {
        alert("Agrega al menos un producto");
        return;
    }

    let total = productosCarrito.reduce(function(acc, p) {
        return acc + p.total;
    }, 0);

    let nuevoCarrito = {
        userId: usuarioActual.id,
        products: productosCarrito,
        total: parseFloat(total.toFixed(2)),
        totalProducts: productosCarrito.length,
        totalQuantity: productosCarrito.reduce(function(acc, p) {
            return acc + p.quantity;
        }, 0)
    };

    api.create("carts", nuevoCarrito)
        .then(function(data) {
            alert("✅ Carrito guardado exitosamente para " + usuarioActual.firstName + " " + usuarioActual.lastName);
            productosCarrito = [];
            usuarioActual = null;
            document.getElementById("cartPreview").style.display = "none";
            document.getElementById("cartUserId").value = "";
            document.getElementById("userInfo").style.display = "none";
            obtenerCarts();
        });
}

// ============================================
// OBTENER CARRITOS
// ============================================
function obtenerCarts() {
    let filtroId = document.getElementById("idConsultCarts").value;
    obtener(ENTIDAD_CARTS, CAMPOS_CARTS, filtroId);
}

// ============================================
// BORRAR CARRITO
// ============================================
function borrarCart(id) {
    borrar(id, ENTIDAD_CARTS, CAMPOS_CARTS);
}

// ============================================
// PAGINACIÓN
// ============================================
let paginaActual = 1;
const productosPorPagina = 12;

function cargarCatalogo() {
    api.read("products")
        .then(function(data) {
            todosLosProductos = data;
            renderizarCatalogo(todosLosProductos);
        });
}

function filtrarCatalogo() {
    let busqueda = document.getElementById("searchProduct").value.toLowerCase();
    let filtrados = todosLosProductos.filter(function(p) {
        return p.title.toLowerCase().includes(busqueda);
    });
    paginaActual = 1;
    renderizarCatalogo(filtrados);
}

function renderizarCatalogo(productos) {
    let catalogo = document.getElementById("catalogo");
    let totalPaginas = Math.ceil(productos.length / productosPorPagina);
    let inicio = (paginaActual - 1) * productosPorPagina;
    let fin = inicio + productosPorPagina;
    let productosPagina = productos.slice(inicio, fin);

    catalogo.innerHTML = "";

    // CARDS
    productosPagina.forEach(function(producto) {
        catalogo.innerHTML += `
        <div class="product-card">
            <img src="${producto.thumbnail}" alt="${producto.title}" class="product-img"
                onerror="this.src='https://via.placeholder.com/200x150?text=No+Image'" />
            <div class="product-info">
                <h4>${producto.title}</h4>
                <p class="product-category">${producto.category}</p>
                <p class="product-price">$${producto.price}</p>
            </div>
            <div class="product-actions">
                <input type="number" min="1" value="1" class="form-control quantity-input" id="qty_${producto.id}" />
                <button onclick="agregarAlCarrito('${producto.id}')">+ Agregar</button>
            </div>
        </div>`;
    });

    // PAGINACIÓN
    let paginacion = `<div class="paginacion">`;
    
    paginacion += `<button class="btn-pag" onclick="cambiarPagina(${paginaActual - 1}, todosLosProductos)" 
        ${paginaActual === 1 ? "disabled" : ""}>← Anterior</button>`;

    for (let i = 1; i <= totalPaginas; i++) {
        if (
            i === 1 || 
            i === totalPaginas || 
            (i >= paginaActual - 2 && i <= paginaActual + 2)
        ) {
            paginacion += `<button class="btn-pag ${i === paginaActual ? 'active' : ''}" 
                onclick="cambiarPagina(${i}, todosLosProductos)">${i}</button>`;
        } else if (i === paginaActual - 3 || i === paginaActual + 3) {
            paginacion += `<span class="pag-dots">...</span>`;
        }
    }

    paginacion += `<button class="btn-pag" onclick="cambiarPagina(${paginaActual + 1}, todosLosProductos)"
        ${paginaActual === totalPaginas ? "disabled" : ""}>Siguiente →</button>`;

    paginacion += `<span class="pag-info">Página ${paginaActual} de ${totalPaginas} — ${productos.length} productos</span>`;
    paginacion += `</div>`;

    catalogo.innerHTML += paginacion;
}

function cambiarPagina(pagina, productos) {
    let totalPaginas = Math.ceil(productos.length / productosPorPagina);
    if (pagina < 1 || pagina > totalPaginas) return;
    paginaActual = pagina;
    renderizarCatalogo(productos);
    document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
}
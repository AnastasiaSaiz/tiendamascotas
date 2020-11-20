



carrito();
function carrito() {
    const nombre = document.getElementById("nombreMascota").value;
    const menu = document.getElementById("botonmostrar").value;
    const cesta={
        menu
    }

    fetch(`/mostrarcarro/${nombre}`)
        .then(function (response) {
            return response.json()
        }).then(function (datos) {
            let cesta = ""
            for (let i = 0; i < datos[0].carrito.length; i++) {
                console.log(datos);
                cesta += `
        <div>
        <p>Menu : ${datos[0].carrito[i].menu}</p>
        <p>Stock : ${datos[0].carrito[i].stock}</p>
        
        </div>
        
        `;
            }
            document.getElementById("div1").innerHTML = cesta;
        })
}
function pagar() {
    const nombre = document.getElementById("botonmostrar").value;
    fetch(`/borrarCarro/${nombre}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(),

    }).then(function (response) {
        return response.json();
    }).then(function (datos) {
        console.log(datos);
        carrito();
    });
}
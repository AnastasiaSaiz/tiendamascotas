function registrarMascota() {
    const nombre = document.getElementById("nombre").value;
    const edad = document.getElementById("edad").value;
    const raza = document.getElementById("raza").value;
    const alergias = document.getElementById("alergias").value;
    const tipo = document.getElementById("tipo").value;


    const mascota = {
        nombre,
        edad,
        raza,
        alergias,
        tipo
    }
    fetch("/registro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(mascota)
    }).then(function (response) {
        return response.json()
    }).then(function (datos) {
        console.log(datos);
    })
};

function editarMascota() {
    const nombre = document.getElementById("nombre").value;
    const edad = document.getElementById("edad").value;
    const raza = document.getElementById("raza").value;
    const alergias = document.getElementById("alergias").value;
    const tipo = document.getElementById("tipo").value;

    const mascota = {
        nombre,
        edad,
        raza,
        alergias,
        tipo
    }
    fetch("/editarmascota", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(mascota)
    }).then(function (response) {
        return response.json()
    }).then(function (datos) {
        console.log(datos);
    })

}

menus();
function menus() {

    fetch("/mostrarmenus").then(function (response) {
        return response.json()
    }).then(function (datos) {
        let menus = ""
        for (let i = 0; i < datos.length; i++) {
            menus += `
        <div>
        <p>Menu : ${datos[i].menu}</p>
        <p>Stock : ${datos[i].stock}</p>
        <p>Peso : ${datos[i].peso}</p>
        <p>Precio : ${datos[i].precio}</p>
        </div>
        
        `;
        }
        document.getElementById("div1").innerHTML = menus;
    })
}



function buscarMenu() {
    const menu = document.getElementById("busquedaMenu").value;

    fetch(`/mostrarmenus/${menu}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (datos) {
            console.log(datos);
            let comida = `
          <div>
              <h1>${datos[0].menu}</h1>
              <p>Stock: ${datos[0].stock}</p>
              <p>Peso: ${datos[0].peso}</p>
              <p>Precio €: ${datos[0].precio}</p>
              <button class="" onclick= "guardarmenu()"> Añadir al carrito</button>
          </div>
        `;

            document.getElementById("div1").innerHTML = comida;
        });
}

function guardarmenu() {
    const menu = document.getElementById("busquedaMenu").value;


    const carrito = {
        menu
    }
    fetch("/anyadircarrito", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(carrito)
    }).then(function (response) {
        return response.json()
    }).then(function (datos) {
        console.log(datos);
    })
}


carrito();
function carrito() {
    const nombre = document.getElementById("nombreMascota").value;

    fetch(`/mostrarcarro/${nombre}`)
        .then(function (response) {
            return response.json()
        }).then(function (datos) {
            let menus = ""
            for (let i = 0; i < datos.length; i++) {
                menus += `
        <div>
        <p>Menu : ${datos[i].menu}</p>
        <p>Unidades : ${datos[i].unidades}</p>
        <p>Precio : ${datos[i].precio}</p>
        </div>
        
        `;
            }
            document.getElementById("div1").innerHTML = menus;
        })
}
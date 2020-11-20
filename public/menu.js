menus();
function menus() {

    fetch("/mostrarmenus").then(function (response) {
        return response.json()
    }).then(function (datos) {
        let menus = ""
        for (let i = 0; i < datos.length; i++) {
            menus += `
        <div>
        <h5>Menu : ${datos[i].menu}</h5>
        <img src="${datos[i].imagen}" alt="" />
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
              <img src="${datos[0].imagen}" alt="" />
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
    const nombre =document.getElementById("nombreMascota").value;

    const carrito = {
        menu,
        nombre
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
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

function mostrarMascota() {
    const nombre = document.getElementById("nombre").value;

    fetch(`/mostrarmascota/${nombre}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (datos) {
            console.log(datos);
            let ficha = `
          <div>
              <h1>${datos[0].nombre}</h1>
              <img src="${datos[0].foto}" alt="" />
              <p>Edad: ${datos[0].edad}</p>
              <p>Tipo: ${datos[0].tipo}</p>
              <p>Raza: ${datos[0].raza}</p>
              <p>Alergias: ${datos[0].alergias}</p>
          </div>
        `;

            document.getElementById("div1").innerHTML = ficha;
        });
}

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
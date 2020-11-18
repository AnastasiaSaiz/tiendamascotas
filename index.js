const express = require("express");
const mongodb = require("mongodb");
const servidor = express();

servidor.use(express.static("public"));
servidor.use(express.urlencoded({ extended: false }));
servidor.use(express.json());

const MongoClient = mongodb.MongoClient;

let db;

MongoClient.connect("mongodb://localhost:27017", function (error, client) {
    if (error !== null) {
        console.log(error);
    } else {
        db = client.db("tiendamascotas");
    }
});

//*FUNCIONA//Ruta tipo POST para registrar a una mascota//

servidor.post("/registro", function (request, response) {
    const animal = request.body;

    db.collection("mascotas").insertOne(animal, function (error, datos) {
        if (error !== null) {
            response.send(error);
        } else {
            response.send(datos);
        }
    });
});

//*FUNCIONA//Ruta PUT para editar a la mascota//los datos que se podrán modificar es la edad y si tiene alergias//

servidor.put("/editarmascota", function (request, response) {
    const nombre = request.body.nombre;
    const mascota = {
        edad: request.body.edad,
        alergias: request.body.alergias,
    };

    db.collection("mascotas").updateOne({ nombre: nombre }, { $set: mascota }, function (error, datos) {
        if (error !== null) {
            response.send(error);
        } else {
            response.send(datos);
        }
    })
});

//*FUNCIONA//Ruta para mostrar todos los menús disponibles// por lo que necesitaremos la función tipo GET//

servidor.get("/mostrarmenus", function (request, response) {
    db.collection("menus").find().toArray(function (error, datos) {
        if (error !== null) {
            response.send(error);
        } else response.send(datos);
    })
})

//*FUNCIONA//También podemos encontrar el menu por su nombre por un parametro con la funcion de GET//

servidor.get("/mostrarmenus/:menu", function (request, response) {
    const menu = request.params.menu
    db.collection("menus").find({ menu: menu }).toArray(function (error, datos) {
        if (error !== null) {
            response.send(error);
        } else response.send(datos);
    })
});

//*FUNCIONA//Queremos añadir un menú al carrito, si hay menu en stock -> menu añadido; si no hay en stock -> fuera de stock
//Ruta POST para añadir el menu// 

servidor.post("/anyadircarrito", function (request, response) {
    const anyadircarrito = request.body;

    db.collection("menus").find({menu:anyadircarrito.menu}).toArray(function(error,menu){
        if(error!==null){
            response.send(error);
        }else{
            if (menu[0].stock === "no") {
                response.send({ mensaje: "Fuera de stock. Disculpen las molestias" })
            }else{
                db.collection("carrito").insertOne({menu:anyadircarrito.menu,unidades:anyadircarrito.unidades}, function (error, datos){
                    if(error!==null){
                        response.send(error);
                    }else{
                        response.send({mensaje: "Menu añadido"});
                    }
                })
            }
        }
    })
});

//Ahora pasamos por la caja para pagar, pero a la hora de pagar uno de los requisitos es estar registrado (en este caso nuestra mascota)//



servidor.listen(3000);
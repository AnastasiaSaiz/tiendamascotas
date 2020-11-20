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

//mostrar ficha mascota//

servidor.get("/mostrarmascota/:nombre", function (request, response) {
    const nombre = request.params.nombre
    db.collection("mascotas").find({ nombre: nombre }).toArray(function (error, datos) {
        if (error !== null) {
            response.send(error);
        } else response.send(datos);
    })
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
    let cesta=[];
    
    const anyadircarrito = request.body;

    db.collection("menus").find({ menu: anyadircarrito.menu }).toArray(function (error, menu) {
        if (error !== null) {
            response.send(error);
        } else {
            if (menu[0].stock === "no") {
                response.send({ mensaje: "Fuera de stock. Disculpen las molestias" })
            } else {
                db.collection("mascotas").find({nombre:anyadircarrito.nombre}).toArray(function(error,carrito){
                    if(error!==null){
                        response.send(error);
                    }else{
                        cesta=carrito[0].carrito;
                        console.log(cesta);
                        cesta.push(menu[0]);
                        
                        db.collection("mascotas").updateOne({ nombre: anyadircarrito.nombre }, { $set: { carrito:cesta } }, function (error, datos) {
                            if (error !== null) {
                                response.send(error);
                            } else {
                                response.send({ mensaje: "Menu añadido" });
                            }
                        })
                    }
                })
                
            }
        }
    })
});

//Ahora pasamos por la caja para pagar, pero a la hora de pagar uno de los requisitos es estar registrado (en este caso nuestra mascota)//

//1. Mostramos el carro de la compra, por lo que utilizamos el GET//

servidor.get("/mostrarcarro/:nombre", function (request, response) {
    const nombre = request.params.nombre;
    
    db.collection("mascotas").find({ nombre: nombre }).toArray(function (error, datos) {
        if (error !== null) {
            response.send(error);
        } else response.send(datos);
    })
})

//2. Modificamos unidades de menús//
//Ruta PUT para editar las unidades//

servidor.put("/editarcarro/:nombre", function (request, response) {
    const nombre = request.body.nombre;
    const carrito = {

        unidades: request.body.unidades,
    };

    db.collection("mascotas").updateOne({ nombre: nombre }, { $set: { carrito: carrito.unidades } }, function (error, datos) {
        if (error !== null) {
            response.send(error);
        } else {
            response.send(datos);
        }
    })
});

//Borrar menu  de la cesta//
servidor.delete("/borrarMenu/:nombre", function (request, response) {
    const nombre = request.params.nombre;
    const menu = request.params.menu;
    
    console.log(anyadircarrito);

    db.collection("mascotas").find({nombre:menu.nombre}).toArray(function(error,carrito){
        if(error!==null){
            response.send(error);
        }else{
            cesta=carrito[0].carrito;
            console.log(cesta);
            cesta.push(menu[0]);
            
            db.collection("mascotas").updateOne({ nombre: anyadircarrito.nombre }, { $set: { carrito:[0] } }, function (error, datos) {
                if (error !== null) {
                    response.send(error);
                } else {
                    response.send({ mensaje: "Menu elminado" });
                }
            })
        }

    
    })
});

//3.PAGAR  PUT//

servidor.put("/borrarCarro/:nombre", function (request, response) {
    const nombre = request.params.nombre;
    

    db.collection("mascotas").updateOne({ nombre: nombre }, { $set: { carrito: [] } }, function (error, datos) {
        if (error !== null) {
            response.send(error)
        } else {
            response.send({mensaje:"¡Gracias por su compra!"});
        }
    })
});

//Una vez que hayamos hecho modificaciones pertinentes, pagamos. PERO, no se puede pagar si la mascota no está registrada//
// Hacemos un DELETE para vaciar el carro//

servidor.delete("/pagar/:menu/:nombre", function (request, response) {
    const nombre = request.params.nombre;
    const menu = request.params.menu;


    db.collection("mascotas").find({ nombre: nombre }).toArray(function (error, mascota) {
        if (error !== null) {
            response.send(error)
        } else {
            if (mascota.length === 0) {
                response.send({ mensaje: "Mascota no registrada" })
            } else {
                db.collection("carrito").deleteMany({ menu: menu }, function (error, datos) {
                    if (error !== null) {
                        response.send(error);
                    } else {
                        response.send({ mensaje: "¡Gracias por su compra!" })
                    }
                })
            }
        }
    })
})
servidor.listen(3000);
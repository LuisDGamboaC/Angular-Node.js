const express = require("express"); // construir Rest APIS
const cors = require("cors"); // provides Express middleware to enable CORS  
const cookieSession = require("cookie-session"); // GURADA LOS DATOS DE LA SESION en el cliente dentro de una cookie sin tener que requeir una base de datos  servidor

const app = express();

// app.use(cors());

app.use(
    cors({
      credentials: true,
      origin: ["http://localhost:8081", "http://127.0.0.1:8081", "http://127.0.0.1:8082"],
    })
  );

const db = require("./app/models");
const Role = db.role;
 
db.sequelize.sync();

// force: true will drop the table if it already exists // lo quitamos porque no creaba la tabla 
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Db');
//   initial();
// });

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "ldgc-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true,
  })
);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to luisGamboa application node.js." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

    
function initial() { // initial() function helps us to create 3 rows in database. 
        //In development, you may need to drop existing tables and re-sync database. So you can use force: true as code above.
    Role.create({
      id: 1,
      name: "user"
    });
   
    Role.create({
      id: 2,
      name: "moderator"
    });
   
    Role.create({
      id: 3,
      name: "admin"
    });
  }
const app = require("./src/app");
const connect = require("./src/db/db");

connect()
  .then(() => {
    console.log("db connected");
    app.listen(3000,()=>{
      console.log("server is running on port 3000");
      
    })
  })
  .catch((err) => {
    console.error("db is not connected");
  });

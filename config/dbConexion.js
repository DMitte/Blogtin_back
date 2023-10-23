//conexión a Base de datos
const mongoose = require("mongoose");
const dbConnect = (err) => {
  mongoose.set("strictQuery", false);
  mongoose.connect(
    "mongodb+srv://elmitte:5demarzodel2002@cluster0.0btfapw.mongodb.net/blogtin?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
  )
  if(!err){
    console.log("*** BD Conectada 👍 ***")
  }else{
    console.log("*** Error al conectarse a la BD ⛔***")
  }
};

module.exports = { dbConnect };
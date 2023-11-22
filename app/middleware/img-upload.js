const multer = require("multer");
const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json");
const compressImage = require("compress-images")

const storage = multer.memoryStorage({});

const upload = multer({ storage: storage });

//configuration Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "blogtin-91f13.appspot.com",
});

const bucket = admin.storage().bucket();

const uploadMiddleware = (req, res, next) => {
  upload.single("avatar")(req, res, (err) => {
    const file = req.file;
    if (!file && req.url === "/new") {
      return res.status(400).send("No se ha subido ningún archivo");
    } else if (req.url === "/new") {

      const blob = bucket.file(`${Date.now()}_${file.originalname}`);

      const blobStream= blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      blobStream.on("error", (error) => {
        console.error(error);
        res.status(500).send("Error al subir el archivo");
      });

      blobStream.on("finish", () => {
        req.body.imgName = blob.name;
        next();
      });

      blobStream.end(file.buffer);
    } else if (req.url.includes("/edit")) {
      const params = req.query;
      if (!file) {
        console.log("no existe imagen que editar");
        next();
      } else {
        try {
          //delete img firebase
          bucket.file(params.img).delete();


          //upload new img
          const blob = bucket.file(`${Date.now()}_${file.originalname}`);
        
          const blobStream = blob.createWriteStream({
            metadata: {
              contentType: file.mimetype,
            },
          });
    
          blobStream.on("error", (error) => {
            console.error(error);
            res.status(500).send("Error al subir el archivo");
          });
    
          blobStream.on("finish", () => {
            req.body.imgName = blob.name;
            next();
          });
    
          blobStream.end(file.buffer);          
        } catch (err) {
          res.status(400).json({
            message: `Error en la edición de ${params.img}`,
            err,
          });
        }
      }
    } else if (req.url.includes('/delete')){
      const params = req.query
      //delete img firebase
      bucket.file(params.img).delete();
      next()

    }else{
      next()
    }
  });
};

module.exports = uploadMiddleware;

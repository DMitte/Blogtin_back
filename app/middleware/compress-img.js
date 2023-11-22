const compressImage = require("compress-images")
const compressImg = (req,res,next) =>{
    let file = req.file
    let filecompress
    if(!file){
        next()
    }

    compressImage(file, filecompress, { compress_force: false, statistic: true, autoupdate: true }, false,
        { jpg: { engine: "webp", command: ["-quality", "60"] } },
        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } })

    req.file = filecompress
    next(filecompress)
}

module.exports = compressImg
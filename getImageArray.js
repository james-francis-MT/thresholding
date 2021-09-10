const sharp = require("sharp");

convertImageToBuffer = async () => {
    const { data, info } = await sharp("grey.png")
        .resize(256, 256)
        .greyscale()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const pixelArray = new Uint8ClampedArray(data.buffer);

    console.log(pixelArray);

    // When you are done changing the pixelArray, sharp takes the `pixelArray` as an input
    const { width, height, channels } = info;
    await sharp(pixelArray, { raw: { width, height, channels } }).toFile(
        "my-changed-image.jpg"
    );
};

convertImageToBuffer();

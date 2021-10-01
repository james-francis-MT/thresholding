const sharp = require("sharp");
const thresholdArray = require("./thresholdImageArray");

module.exports = async () => {
    const { data, info } = await sharp("colour.jpg")
        .resize(256, 256)
        .greyscale()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const pixelArray = new Uint8ClampedArray(data.buffer);

    const { width, height, channels } = info;
    await sharp(pixelArray, {
        raw: { width, height, channels },
    }).toFile("grey.jpg");

    const normalArray = Array.from(pixelArray);
    const thresholdedArray = await thresholdArray(normalArray);

    // When you are done changing the pixelArray, sharp takes the `pixelArray` as an input
    await sharp(new Uint8ClampedArray(thresholdedArray), {
        raw: { width, height, channels },
    }).toFile("my-changed-image.jpg");
};

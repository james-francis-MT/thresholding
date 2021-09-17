const WINDOW_SIZE = 16;
const K = 0.2;
const R = 125;
const ARRAY_WIDTH = 256;
const ARRAY_HEIGHT = 256;

const calculateMean = (array) => {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[0].length; j++) {
            sum += array[i][j];
        }
    }
    const m = sum / (array.length * array[0].length);
    return m;
};

const calculateStandardDeviation = (array, mean) => {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[0].length; j++) {
            sum += (array[i][j] - mean) ** 2;
        }
    }
    return Math.sqrt(sum / (array.length * array[0].length));
};

const reshapeArray = (arr, size) => {
    const shapedArr = [];
    while (arr.length) shapedArr.push(arr.splice(0, size));

    return shapedArr;
};

const arraySubset = (arr, x0, y0, x1, y1) => {
    let results = [];
    for (let i = y0; i < y1; i++) {
        results.push(arr[i].slice(x0, x1));
    }
    return results;
};

const calculateThreshold = (subset, m) => {
    const sd = calculateStandardDeviation(subset, m);
    return m * (1 - K * (1 - sd / R));
    // return m + K * sd;
};

const setPixels = (arr, x0, y0, x1, y1, threshold) => {
    for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
            if (arr[x][y] > threshold) {
                arr[x][y] = 255;
            } else {
                arr[x][y] = 0;
            }
        }
    }
};

module.exports = (arr) => {
    arr = reshapeArray(arr, ARRAY_WIDTH);
    const m = calculateMean(arr);
    for (let i = 0; i < ARRAY_WIDTH / WINDOW_SIZE; i++) {
        for (let j = 0; j < ARRAY_HEIGHT / WINDOW_SIZE; j++) {
            const x0 = i * WINDOW_SIZE;
            const y0 = j * WINDOW_SIZE;
            const x1 = x0 + WINDOW_SIZE;
            const y1 = y0 + WINDOW_SIZE;

            const subset = arraySubset(arr, x0, y0, x1, y1);

            const threshold = calculateThreshold(subset, m);

            setPixels(arr, x0, y0, x1, y1, threshold);
        }
    }
    return arr.flat();
};

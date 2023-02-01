"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFileName = exports.checkAndAddMP3 = exports.randomId = void 0;
const crypto_1 = require("crypto");
const randomId = () => (0, crypto_1.randomBytes)(16).toString('hex');
exports.randomId = randomId;
const checkAndAddMP3 = (str) => {
    if (str && !str.includes('.mp3')) {
        str += '.mp3';
    }
    return str;
};
exports.checkAndAddMP3 = checkAndAddMP3;
const validateFileName = (fileName) => {
    const invalidCharsRegex = /[\\/:*?"<>|]/g;
    return fileName.replace(invalidCharsRegex, '');
};
exports.validateFileName = validateFileName;

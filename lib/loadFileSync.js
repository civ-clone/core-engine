"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
exports.default = (file) => {
    fs.accessSync(file);
    return fs.readFileSync(file, {
        encoding: 'utf8',
    });
};
//# sourceMappingURL=loadFileSync.js.map
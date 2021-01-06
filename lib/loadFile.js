"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
exports.default = (file) => fs_1.promises.access(file).then(() => fs_1.promises.readFile(file, {
    encoding: 'utf8',
}));
//# sourceMappingURL=loadFile.js.map
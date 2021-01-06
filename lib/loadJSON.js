"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loadFile_1 = require("./loadFile");
exports.default = (file) => loadFile_1.default(file).then((content) => JSON.parse(content));
//# sourceMappingURL=loadJSON.js.map
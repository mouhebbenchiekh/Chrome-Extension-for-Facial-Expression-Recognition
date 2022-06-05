/**
 * Minified by jsDelivr using Terser v5.13.1.
 * Original file: /npm/@tensorflow/tfjs-node@3.18.0/dist/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
"use strict";
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software 
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var __assign=this&&this.__assign||function(){return __assign=Object.assign||function(e){for(var r,n=1,o=arguments.length;n<o;n++)for(var i in r=arguments[n])Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i]);return e},__assign.apply(this,arguments)};function __export(e){for(var r in e)exports.hasOwnProperty(r)||(exports[r]=e[r])}Object.defineProperty(exports,"__esModule",{value:!0}),require("./register_all_kernels");var tf=require("@tensorflow/tfjs"),path=require("path"),callbacks_1=require("./callbacks"),file_system_1=require("./io/file_system"),nodeIo=require("./io/index"),nodejs_kernel_backend_1=require("./nodejs_kernel_backend"),nodeVersion=require("./version"),binary=require("@mapbox/node-pre-gyp"),bindingPath=binary.find(path.resolve(path.join(__dirname,"/../package.json"))),fs=require("fs");if(!fs.existsSync(bindingPath))throw new Error("The Node.js native addon module (tfjs_binding.node) can not be found at path: "+String(bindingPath)+". \nPlease run command 'npm rebuild @tensorflow/tfjs-node"+(String(bindingPath).indexOf("tfjs-node-gpu")>0?"-gpu":"")+" --build-addon-from-source' to rebuild the native addon module. \nIf you have problem with building the addon module, please check https://github.com/tensorflow/tfjs/blob/master/tfjs-node/WINDOWS_TROUBLESHOOTING.md or file an issue.");var bindings=require(bindingPath);exports.version=__assign({},tf.version,{"tfjs-node":nodeVersion.version}),exports.io=__assign({},tf.io,nodeIo),__export(require("@tensorflow/tfjs")),__export(require("./node"));var pjson=require("../package.json");tf.registerBackend("tensorflow",(function(){return new nodejs_kernel_backend_1.NodeJSKernelBackend(bindings,pjson.name)}),3);var success=tf.setBackend("tensorflow");if(!success)throw new Error("Could not initialize TensorFlow backend.");tf.io.registerLoadRouter(file_system_1.nodeFileSystemRouter),tf.io.registerSaveRouter(file_system_1.nodeFileSystemRouter),tf.registerCallbackConstructor(1,callbacks_1.ProgbarLogger);
//# sourceMappingURL=/sm/b3b0719caf88ed1c62cd2f5e4a838be5d9b76bc1dcfc1e3337675c82ae5451a9.map
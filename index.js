const fs = require('node:fs'); // Importo de FS
const path = require('node:path'); // Importo de path
const axios = require('axios'); 
const { link, Stats } = require('node:fs');
const { Console } = require('node:console');
const { resolve } = require('node:path');

// 1. Función existe la ruta
const existPath = (enteredPath) => {
  return fs.existsSync(enteredPath);
}; // Esta función me devuelve 1  booleano
/* console.log(existPath('E:/Laboratoria-Proyecto4/LIM018-md-links/cli.js')); */
 
// 2. Función la ruta es absoluta
const pathIsAbsolute = (enteredPath) => {
  return path.isAbsolute(enteredPath); 
};
/* console.log(pathIsAbsolute('E:/Laboratoria-Proyecto4/LIM018-md-links/cli.js')); */

// 3. Función convierte la ruta a absoluta IMPORTANTE
const convertToAbsolute = (enteredPath) => {
  return pathIsAbsolute(enteredPath) ? enteredPath : path.resolve(enteredPath);
};
/* console.log(convertToAbsolute('cli.js')); */

// 4. Función para saber sí es un archivo
const isFile = (enteredPath) => {
  return fs.statSync(enteredPath).isFile();
}
/* console.log('es un archivo')
console.log(isFile('E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba1/archi-prueba1.md'));
console.log(isFile('dir-prueba1')); */

// 5. Función para saber el tipo de extensión del archivo
const tipeOfExtension = (enteredPath) => {
  return path.extname(enteredPath) === '.md';
}
/* console.log('esto es un prueba');
console.log(tipeOfExtension('E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba1/archi-prueba1.txt')); */

// 6. Función para leer el archivo md IMPORTANTE
const readFile = (file) => {
  if(tipeOfExtension(file)){
    return fs.readFileSync(file, 'utf-8'); 
  } else {
    throw ('No se encontraron archivos con extensión .md')
  }
}
/* console.log(readFile('E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba1/archi-prueba1.md', 'utf-8')); */
 

// 7. Función para leer un directorio
const readDir = (dir) => {
  return fs.readdirSync(dir);
}
/* console.log(readDir('dir-prueba1' , 'leer un directorio')); */

// 8. Función para saber sí mi archivo incluye links .md
const getLinksMD = (enteredFile) => { // entra 1 archivo
  const rexExpretion = /(\[(.*?)\])?\(http(.*?)\)/gm;
  const arrayOfLinks = [];

  const foundLinks = readFile(enteredFile).match(rexExpretion);
  // 
  if(foundLinks === null){
    console.log('No se encontraron links');
    return [];
  }

  foundLinks.forEach((link) => {
    const separator = link.indexOf(']'); // encunetra el 1er elem q coincida
    // info que tiene que estar en mi array de obj
    const href = link.slice(separator + 2 , link.length - 1); // desde - hasta fin (sin incluirme el fin)
    const text = link.slice(1, separator);
    const file = enteredFile;

    arrayOfLinks.push({href, text, file});
  });
  return arrayOfLinks;
}  
/* console.log(getLinksMD('E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba1/archi-prueba1.md')); 
console.log(getLinksMD('E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba2/otro-archi.txt')); */

// 9. Función para validar status de los links del archivo con petición HTTP
const validateLinkStatus = (path) => { // le paso 1 ruta
  const arrayOfObj = getLinksMD(path); // le paso 1 array de obj
  return Promise.all(arrayOfObj.map((link) => {
    return axios.get(link.href) // quiero hacer 1 petición HTTP a esta dirección
      .then((response) => {
      link.status = response.status;
      link.message = response.statusText;
      return link;
    })
    .catch((error) => {
      link.status = error.response.status;
      link.message = 'Fail';
      return link;
     })
  }))
}
/* console.log(validateLinkStatus(getLinksMD('E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba1/archi-prueba1.md')).then((response) => {
  console.log(response)
})); */


// 11. Función recursiva entrar al directorio y extraer los archivos
const obtainDirAndFiles = (enteredPath) => {
  const arrayOfFiles = [];
  if(isFile(enteredPath)){
    return [enteredPath]
  } else {
    const readDirectory = readDir(enteredPath);

    readDirectory.forEach((dir) => {
      const newPath = path.join(enteredPath, dir);
      arrayOfFiles.push(obtainDirAndFiles(newPath));
    });
    return arrayOfFiles.flat();
  }
}

/* console.log('recursión');
console.log(obtainDirAndFiles('dir-prueba1')); 
console.log(obtainDirAndFiles('E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba1/archi-prueba1.md')); */

// 12. Función MD-LINKS
const mdLinks = (path, options) =>{
  return new Promise ((resolve, reject) => {
    if(!existPath(path)){
      reject(new Error('No existe la ruta, ingrese una ruta valida'));
    }
    //2. ¿El tipo de ruta es absoluta?
    const absolutePath = convertToAbsolute(path); // convierte la ruta a abs
    /* console.log(absolutePath , 'Y tú');  */
    const arrayOfFilesPaths = obtainDirAndFiles(absolutePath);
    arrayOfFilesPaths.forEach((path) => {
      if(options.validate === true){
        resolve(validateLinkStatus(path))
        .then((response) => {
          console.log(response)
        })
      }else{
        resolve(getLinksMD(path))
      }
    }); 
  });
};

mdLinks('./dir-prueba2', {validate:true}).then(console.log).catch(console.error); 
/* mdLinks('E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba1/archi-prueba1.md', {validate:true})
.then(console.log)
.catch(console.error); */



module.exports = {
  existPath,
  pathIsAbsolute,
  convertToAbsolute,
  tipeOfExtension,
  readFile,
};
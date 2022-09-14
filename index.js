const fs = require('node:fs');
const path = require('node:path'); // Importo de path
const axios = require('axios'); 
const { link } = require('node:fs');

// 1. Función existe la ruta
const existPath = (enteredPath) => {
  return fs.existsSync(enteredPath);
}; // Esta función me devuelve 1  booleano
/* console.log(existPath('E:/Laboratoria-Proyecto4/LIM018-md-links/cli.js')); */
 
// 2. Función la ruta es absoluta
const pathIsAbsolute = (enteredPath) => {
  return path.isAbsolute(enteredPath); 
};

// 3. Función convierte la ruta a absoluta
const convertToAbsolute = (enteredPath) => {
  return pathIsAbsolute(enteredPath) ? enteredPath : path.resolve(enteredPath);
};
//console.log(convertToAbsolute('cli.js'));

// 4. Función para saber el tipo de extensión del archivo
const tipeOfExtension = (enteredPath) => {
  return path.extname(enteredPath);
}
/* console.log(tipeOfExtension('E:/Laboratoria-Proyecto4/LIM018-md-links/archivos-prueba/PRUEBA1.md')); */

// 5. Función para leer el archivo md
const readFile = (file) => {
  return fs.readFileSync(file, 'utf-8'); 
}

// 6. Función para saber si el archivo md incluye links
const fileInfomation = (enteredFile) => {
  const regularExpretion = /\[([^\[]+)\](\(https:.*\))/gm;
  const readFile = fs.readFileSync(enteredFile, 'utf-8');
  const arrayOfLinks = [];

  const foundLinks = readFile.match(regularExpretion);

  if (foundLinks) {
    foundLinks.forEach((link) => {
      const separator = link.indexOf(']'); // encuentra el 1er elem q coincida
      // lo que tiene que estar en mi objeto
      const href = link.slice(separator + 2, link.length - 1);
      const text = link.slice(1, separator); // hasta el txtRef sin incluirme el 
      const file = enteredFile;

      arrayOfLinks.push({ href, text, file });
    });
  };
  return arrayOfLinks;
}
/* console.log(fileInfomation('archivos-prueba/PRUEBA1.md'));  */ // es 1 obj con la información del archivo


// 7. Función para validar status de los link con petición HTTP
const validateLinksStatus = (arrayOfLinks) => {
  return Promise.all(arrayOfLinks.map((link) => {
    return axios.get(link.href) // queremos hacer 1 petición a esta dirección

    .then((response) => {
      link.status = response.status;
      link.message = response.statusText;
      return link;
    })
    
    .catch((error) => {
      link.status = error.response.status;
      link.message = 'fail';
      return link;
    })

  }))
}  
validateLinksStatus(fileInfomation('./archivos-prueba/PRUEBA1.md')).then((response) => console.log(response));

module.exports = {
  existPath,
  pathIsAbsolute,
  convertToAbsolute,
  tipeOfExtension,
  readFile,
  fileInfomation,
  validateLinksStatus,
};
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

// 3. Función convierte la ruta a absoluta 
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
console.log(isFile('dir-prueba1'));  */

// 5. Función para saber el tipo de extensión del archivo
const tipeOfExtension = (enteredPath) => {
  return path.extname(enteredPath) === '.md';
}
/* console.log('esto es un prueba');
console.log(tipeOfExtension('E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba1/archi-prueba1.txt')); */

// 6. Función para leer el archivo md IMPORTANTE
const readFile = (file) => {
  if(tipeOfExtension(file)){
    /* console.log(file , 'que me traes'); */
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
/* console.log(getLinksMD('E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba1/archi-prueba1.md'));  */
/* console.log(getLinksMD('E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba2/otro-archi.txt'));  */

// 9. Función para validar status de los links del archivo con petición HTTP
const validateLinkStatus = (path) => { // le paso 1 ruta
  /* console.log(path, 'que me estas pasando') */
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
/* validateLinkStatus('E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba1').then((response) => {
  console.log(response)
});  */


// 10. Función recursiva entrar al directorio y extraer los archivos
const obtainDirAndFiles = (enteredPath) => {
  const arrayOfFiles = [];
  if(isFile(enteredPath)){
    return [enteredPath]
  } else {
    const readDirectory = readDir(enteredPath);
    readDirectory.forEach((file) => {
      const newPath = path.join(enteredPath, file);
      arrayOfFiles.push(obtainDirAndFiles(newPath));
    });
    return arrayOfFiles.flat();
  }
}

/* console.log('recursión');
console.log(obtainDirAndFiles('dir-prueba1'));  */
/* console.log(obtainDirAndFiles('E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba1/archi-prueba1.md')); */

const newArray =
[
  {
    href: 'https://es.wikipedia.org/wiki/Markdown',
    text: 'Markdown',
    file: 'E:\\Laboratoria-Proyecto4\\LIM018-md-links\\dir-prueba2\\archi-prueba3.md'
  },
  {
    href: 'https://nodejs.org/',
    text: 'Node.js',
    file: 'E:\\Laboratoria-Proyecto4\\LIM018-md-links\\dir-prueba2\\archi-prueba3.md'
  },
  {
    href: 'https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg',
    text: 'md-links',
    file: 'E:\\Laboratoria-Proyecto4\\LIM018-md-links\\dir-prueba2\\archi-prueba3.md'
  }
]
// 11. Funciones para representar estadísticas del total
// Total Stats
const totalStats = (arrayOfLinks) => {
  const totalLinks = arrayOfLinks.length;
  return totalLinks
};
/* console.log(totalStats(newArray));  */

// Unique Stats
const uniqueStats = (arrayOfLinks) => {
  const uniqueLinks = [...new Set(arrayOfLinks.map((link) => {
    return link.href;
  }))]
  return uniqueLinks.length;
}
/* console.log(uniqueStats(newArray)); */

// Broken Stats
const brokenStats = (arrayOfLinks) => {
  const brokenLinks = arrayOfLinks.filter((link) => {
    return link.ok === 'Fail';
  })
  return brokenLinks.length;
}
/* console.log(brokenStats(newArray)); */

// Función MD-LINKS
const mdLinks = (path, options) =>{
  return new Promise ((resolve, reject) => {
    if(!existPath(path)){
      reject(new Error('No existe la ruta, ingrese una ruta valida'));
    }
    //2. ¿El tipo de ruta es absoluta?
    const absolutePath = convertToAbsolute(path); // convierte la ruta a abs
    /* console.log(absolutePath , 'que ruta es');  */
    let arrayOfFilesPaths = obtainDirAndFiles(absolutePath);// recursión
    // array con rutas de archi de la recursión
    const arrayOfFilesPaths2 = arrayOfFilesPaths.map((path) => { //rutas de archivos
      return validateLinkStatus(path) 
      .then((response) => {
        return response
        //array de promesas pendientes
      })
    }); 

    if(options.validate === true){
      Promise.all(arrayOfFilesPaths2).then((response) => {
        resolve(response.flat());
      });
    } else{
      arrayOfFilesPaths = arrayOfFilesPaths.map((path) => {
        return getLinksMD(path);
      });
      resolve(arrayOfFilesPaths.flat())
    }

  });
};

/* mdLinks('./dir-prueba1', {validate:false}).then(console.log).catch(console.error); */  
/* mdLinks('E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba1/archi-prueba1.md', {validate:true})
.then(console.log)
.catch(console.error); */ 



module.exports = {
  existPath,
  pathIsAbsolute,
  convertToAbsolute,
  isFile,
  tipeOfExtension,
  readFile,
  readDir,
  getLinksMD,
  validateLinkStatus,
  obtainDirAndFiles,
  totalStats,
  uniqueStats,
  brokenStats,
  mdLinks,
  
};
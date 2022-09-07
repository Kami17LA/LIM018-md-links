const fs = require('node:fs');   // Exporto de file system
const path = require('node:path'); // Exporto de path

// 1. Existe la ruta
/* const existPath = fs.existsSync('E:\Laboratoria Proyecto 4\LIM018-md-links\cli.js');
console.log(existPath);
 */
function existeRuta(path){
  return fs.existsSync( path )
}
console.log(existeRuta('archivos-prueba')); // Esta función me devuelve 1  booleano

// Función según mi diagrama
const existeLaRuta = (ruta) => {
  if(fs.existsSync(ruta)){
    return (ruta);
  } else {
    return('Error 400 (no existe la ruta)');
  }
}
console.log(existeLaRuta('archivos-pruebas')); 

// 2. ¿El tipo de ruta es absoluta?
/* const pathIsAbsolute = path.isAbsolute('./archivos-prueba'); 
console.log(pathIsAbsolute); */

// Convierte la ruta relativa a absoluta
/* const convertirAbsoluta = path.resolve('cli.js');
console.log(convertirAbsoluta); */

const esAbsoluta = (ruta) => {
  if (path.isAbsolute(ruta)){
    /* console.log('La ruta es absoluta'); */
    return ruta;
 } else {
   /*  console.log('Convierte la ruta relativa a absoluta'); */
    return path.resolve(ruta); // convierte la ruta en absoluta
  }
}; 

/* console.log(esAbsoluta('E:/Laboratoria-Proyecto4/LIM018-md-links/cli.js'));
console.log(esAbsoluta('cli.js'));
 */

// ¿Es un archivo md? Verificar la extensión de mi archivo

const tipoExtension = (archivo) => {
  if(path.extname(archivo) === '.md'){ // Devuelve la extensión de la ruta
    return fs.readFileSync( archivo , 'utf-8'); // Lee el contenido de un archivo md
  } else {
    return ('Error 400 (no es un archivos md)')
  }
}

console.log(tipoExtension(esAbsoluta('./archivos-prueba/PRUEBA1.md')));


























// Convertir en string
/* const MarkdownIt = require('archivos-prueba'),
md = new MarkdownIt();

console.log(md); */
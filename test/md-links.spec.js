/* const mdLinks = require('../'); */


const {
  existPath,
  pathIsAbsolute,
  convertToAbsolute,
  tipeOfExtension,
  readFile,
  fileInfomation,
  validateLinksStatus,
} = require('../index');


describe('existPath', () => {

  it('should check if path exist', () => {
    const enteredPath = 'E:/Laboratoria-Proyecto4/LIM018-md-links/package-lock.json';
    expect(existPath(enteredPath)).toBeTruthy();
  });

  it('should check if path does not exist', () => {
    const enteredPath = 'hola.md';
    expect(existPath(enteredPath)).toBeFalsy();
  });

  it('should check if path does not exist', () => {
    const enteredPath = 'clis.js';
    expect(existPath(enteredPath)).toBeFalsy();
  });

  it('should check if the path is absolute', () => {
    const enteredPath = 'E:/Laboratoria-Proyecto4/LIM018-md-links/archivos-prueba';
    expect(pathIsAbsolute(enteredPath)).toBeTruthy();
  });

  it('should check if the path is absolute', () => {
    const enteredPath = 'cli.js';
    expect(pathIsAbsolute(enteredPath)).toBeFalsy();
  });

  it('should return an absolute path', () => {
    const enteredPath = 'cli.js';
    const absolutePath = 'E:/Laboratoria-Proyecto4/LIM018-md-links/cli.js';
    expect(convertToAbsolute(enteredPath)).toBe(absolutePath);
  });

  it('should return the type of extension', () => {
    const enteredPath = 'PRUEBA1.md';
    const typeOfExtention = '.md'
    expect(tipeOfExtension(enteredPath)).toBe(typeOfExtention);
  });

  it('should read a file', () => {
    const file = './archivos-prueba/PRUEBA1.md';
    const contentFile = '[Markdown](https://es.wikipedia.org/wiki/Markdown) es un lenguaje de marcado';
    expect(readFile(file)).toContain(contentFile);
  });


});

/* const mdLinks = require('../'); */


const {
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

} = require('../index');

// Mockeando Axios
jest.mock('axios');
const axios = require('axios'); 

arrayOfObj = [
  {
    href: 'https://es.wikipedia.org/wiki/Markdown',
    text: 'Markdown',
    file: 'E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba1/archi-prueba1.md'
  },
  {
    href: 'https://nodejs.org/',
    text: 'Node.js',
    file: 'E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba1/archi-prueba1.md'
  }
]

arrayOfObjResponse = [
  {
    href: 'https://es.wikipedia.org/wiki/Markdown',
    text: 'Markdown',
    file: 'E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba1/archi-prueba1.md',
    status: 200,
    message: 'OK'
  },
  {
    href: 'https://nodejs.org/',
    text: 'Node.js',
    file: 'E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba1/archi-prueba1.md',
    status: 200,
    message: 'OK'
  }
]

// Path para validate link status
const path1 = 'E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba1/archi-prueba1.md';


describe('existPath', () => {
  //1
  it('should check if path exist', () => {
    const enteredPath = 'E:/Laboratoria-Proyecto4/LIM018-md-links/package-lock.json';
    expect(existPath(enteredPath)).toBeTruthy();
  });
  //2
  it('should check if path does not exist', () => {
    const enteredPath = 'hola.md';
    expect(existPath(enteredPath)).toBeFalsy();
  });
  //3
  it('should check if the path is absolute', () => {
    const enteredPath = 'cli.js';
    expect(pathIsAbsolute(enteredPath)).toBeFalsy();
  });
  //4
  it('should check if the path is absolute', () => {
    const enteredPath = 'E:/Laboratoria-Proyecto4/LIM018-md-links/archivos-prueba';
    expect(pathIsAbsolute(enteredPath)).toBeTruthy();
  });
  //5
  it('should return an absolute path', () => {
    const noEscapada = 'E:\\Laboratoria-Proyecto4\\LIM018-md-links\\cli.js'
    const enteredPath = 'cli.js';
    expect(convertToAbsolute(enteredPath)).toBe(noEscapada);
  });
});
//6
describe('type of extension' ,() => {
  it('should return the type of extension', () => {
    const enteredPath = 'archi-prueba1.md';
    expect(tipeOfExtension(enteredPath)).toBe(true);
  });
})
//7
describe('is a file', () => {
  it('should be a file', () => {
    const enteredPath = './dir-prueba1/archi-prueba1.md';
    expect(isFile(enteredPath)).toBe(true);
  });
})
//8
describe('read a file' ,() => {
  it('should read a file', () => {
    const enterdeFile = ('E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba1/archi-prueba1.md');
    console.log(enterdeFile);
    const contentFile = '[Markdown](https://es.wikipedia.org/wiki/Markdown) es un lenguaje de marcado';
    expect(readFile(enterdeFile)).toContain(contentFile);
  });
})
//9
describe('read a directory', () => {
  it('should be read a dir', () => {
    const enteredPath = 'dir-prueba1';
    const result = ['archi-prueba1.md','archi-prueba2.md'];
    expect(readDir(enteredPath)).toEqual(result);
  });
})
//10
describe('include links', () => {
  it('should be include links', () => {
    const enteredPath = 'E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba1/archi-prueba1.md';
    const result = [
      {
        href: 'https://es.wikipedia.org/wiki/Markdown',
        text: 'Markdown',
        file: 'E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba1/archi-prueba1.md'
      },
      {
        href: 'https://nodejs.org/',
        text: 'Node.js',
        file: 'E:/Laboratoria-Proyecto4/LIM018-md-links/dir-prueba1/archi-prueba1.md'
      }
    ];
    expect(getLinksMD(enteredPath)).toEqual(result);
  });
})

// Funciones stats y validate
describe('totalStats  ', () => {
  it('is a function', () => {
    expect(typeof totalStats).toBe('function');
  });

  it('should indicate the total of links found', () => {
    expect(totalStats(arrayOfObj)).toEqual(2);
  });
});

describe('uniqueStats', () => {
  it('is a function', () => {
    expect(typeof uniqueStats).toBe('function');
  });
  it('should indicate the total of unique links found', () => {
    expect(uniqueStats(arrayOfObj)).toEqual(2);
  });
});

describe('brokenStats', () => {
  it('is a function', () => {
    expect(typeof brokenStats).toBe('function');
  });
  it('should indicate the total of broken links found', () => {
    expect(brokenStats(arrayOfObj)).toEqual(0);
  });
});


// Recursión
describe('obtainDirAndFiles', () => {
  it('should go into the directory and get the files', () => {
    const dirPath = 'dir-prueba1';
    const respuesta = [ 'dir-prueba1\\archi-prueba1.md', 'dir-prueba1\\archi-prueba2.md' ];
    expect(obtainDirAndFiles(dirPath)).toEqual(respuesta);
  })
})

//11
describe('validateLinkStatus', () => {
  it('is a function', () => {
    expect(typeof validateLinkStatus).toBe('function');
  });

  it('should be return status:200 y message:ok', () => {
    const respuesta = {
      status: 200,
      statusText: 'OK',
    }
    axios.get.mockResolvedValue(respuesta);
    validateLinkStatus(path1)
      .then((response) => {
        expect(response).toEqual(arrayOfObjResponse)
      });
  });

  it('should be return status: y message:Fail', () => {
    const respuesta = {
      status: '',
      statusText: 'Fail',
    }
    axios.mockResolvedValue(respuesta);
    validateLinkStatus(path1)
    .then((response) => {
      expect(response).toEqual(arrayOfObjResponse)
    })
  }) 
})



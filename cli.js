#!/usr/bin/env node
// Hash Bang #! (shebang) -- nos permite decirle a la compu
// que este archivo se debe ejecutar con node

const colorText = require('chalk');

const {
  mdLinks,
  totalStats,
  uniqueStats,
  brokenStats,
} = require("./index.js")

const process = require('node:process');
const command = process.argv;
/* console.log(command) */
const isValidate = command.includes('--validate');
/* console.log(validate); */
const isStats = command.includes('--stats');

// Sí no ponemos validate o stats
if(!isValidate && !isStats){
  mdLinks(command[2], {validate:isValidate})
  .then((links) => {
    links.forEach(link =>
      console.log( ` 
      ********* LINKS ENCONTRADOS **************************************************

      HREF : ${colorText.yellow(link.href)};
      TEXT : ${colorText.magenta(link.text)};
      FILE : ${colorText.blue(link.file)};

      ******************************************************************************
      `
    ))
  })
  .catch((error) => {
    console.log(colorText.red(error));
  })
} else if(isValidate && !isStats){
  mdLinks(command[2], {validate:isValidate})
  .then((links) => {
    links.forEach(link =>
      console.log( ` 
      ******* LINKS ENCONTRADOS Y VALIDADOS *****************************************

      HREF    : ${colorText.greenBright(link.href)};
      TEXT    : ${colorText.magenta(link.text)};
      FILE    : ${colorText.blue(link.file)};
      STATUS  : ${colorText.bgGrey(link.status)};
      MESSAGE : ${colorText.yellow(link.message)};
      
      *******************************************************************************
      `
    ))
  })
  .catch((error) => {
    console.log(colorText.red(error));
  }) 
} else if (isStats && !isValidate){
    mdLinks(command[2], {isStats:isStats})
    .then((links) => {
      console.log( ` 
      ********** STATS *****************
      __________________________________

                TOTAL LINKS  : ${colorText.blueBright(totalStats(links))};
                UNIQUE LINKS : ${colorText.redBright(uniqueStats(links))};

      **********************************
        `
      )
    })
    .catch((error) => {
      console.log(colorText.red(error));
    }) 
} else if (isStats && isValidate || isValidate && isStats){
  mdLinks(command[2], {isValidate:isValidate})
  .then((links) => {
    console.log( ` 
    ********* STATS Y VALIDATE *********
    ____________________________________
    
                TOTAL LINKS  : ${colorText.blueBright(totalStats(links))};
                UNIQUE LINKS : ${colorText.redBright(uniqueStats(links))}; 
                BROKEN LINKS : ${colorText.bgCyan(brokenStats(links))};   

    ************************************
      `
    )
  })
  .catch((error) => {
    console.log(colorText.red(error));
  })  
}
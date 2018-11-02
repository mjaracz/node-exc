'use strict'

const sqlite3 = require('sqlite3').verbose()
let sql

const tytul = process.argv[2] !== undefined ? process.argv[2] : null
const autor = process.argv[3] !== undefined ? process.argv[3] : null

let db = new sqlite3.Database('./db/melodieUlotne.db', (err) => {
  if(err) {
    return console.error(err.message)
  }
  console.log(`Polaczono poprawnie z DB, \t
    wpisz jakie piosenki umiescisz w tabeli, \t
    lub my Tobie wyswietlimy co trzeba..
  `)
});



  
if(tytul) {
  
  sql = `INSERT INTO skladanka (tytul)
    VALUES ('${tytul}')
  `
  db.all(sql, [], (err, rows) => {
    if(err) {
      throw new Error(err);
    }

    try {
      rows.forEach(row => {
        console.log(`zapytanie: INSERT \t 
          ID nowo dodanych elemntow ${row.id}
        `)
      })
    }
    catch(e) {
      console.log(e)
    }
  })

}


if(autor) {
  sql = `INSERT INTO skladanka (autor)
    VALUES ('${autor}')
  `

  db.all(sql, [], (err, rows) => {
    if(err) {
      throw new Error(err);
    }
    try {
      
      rows.forEach(row => {
        console.log(`zapytanie: INSERT \t
          ID nowo dodanych elemntow ${row.id} 
        `)
      })
    }
    catch(e) {
      console.log(e)
    }
  })
}




console.log(`wywolanie SELECT \t`)

sql = `SELECT
  ID, tytul, autor
  FROM skladanka
  ORDER BY autor
`
db.all(sql, [], (err, rows) => {
  if ((rows === undefined) || (rows.length === 0)) {
    throw new Error(err);
  }

  try{
      rows.forEach((row) => {
      console.log( row.ID + "\t" + row.tytul)
    })
  }
  catch(e) {
    console.log(`blad bazy danych: ${e}`)
  }

});




db.close((err) => {
  if(err) {
    return console.log(err.message);
  }
  console.log('Close the database connection.')
});
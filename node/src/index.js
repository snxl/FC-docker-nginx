import express from 'express'
import mysql from 'mysql'
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator'

const app = express()

const port = process.env.PORT | 8000

const config = {
  host: 'db',
  user:'root',
  password:'root',
  database:'nodedb'
};



app.get('/', (request, response) => {

  const connection = mysql.createConnection(config)
  
  const createTable = "CREATE TABLE IF NOT EXISTS people (id int NOT NULL AUTO_INCREMENT, name varchar(255), PRIMARY KEY(id))"
  connection.query(createTable)

  const random = uniqueNamesGenerator({

    dictionaries: [adjectives, animals, colors],
    length: 2
  });

  const insert = `INSERT INTO people(name) values('${random}')`
  connection.query(insert)
  
  const select = `SELECT name FROM people`;
  connection.query(select, (err, results, fields) => {
    if (err) throw new Error(err);

    const people = [];

    results.forEach(element => people.push(element.name))

    return response.status(200).send(`
    <h1>Full Cycle Rocks!</h1>
  
    <ul>
      ${people.map((people => `<li>${people}</li>` ))}
    </ul>
    `)
  });  
})

app.listen(port, '0.0.0.0', () => {
  console.log('Running on port ' + port)
})
const express = require('express');
const fs = require('fs'); //file system beépítés
const app = express();
app.use(express.json());

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Szerver fut: http://localhost:${PORT}`);
});


app.get('/', (req, res) => {
    const users = JSON.parse(fs.readFileSync('users.json')); //javascrpit tömbre alakitas
    res.json(users); //JSON válaszban visszaküldi a felhasználókat
  });


  app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const users = JSON.parse(fs.readFileSync('users.json'));
    const user = users.find(u => u.id === id);
    if (user) res.json(user);
    else res.status(404).send('Felhasználó nem található');
  });


  app.post('/ujuser', (req, res) => {
    const newUser = req.body;
    if (!newUser.id) {
      return res.status(400).send('Az ID mező kötelező!');
    }
    const users = JSON.parse(fs.readFileSync('users.json'));
    users.push(newUser);
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    res.status(201).send('Új felhasználó hozzáadva!');
  });
  
  
  app.delete('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const users = JSON.parse(fs.readFileSync('users.json'));
    const filtered = users.filter(u => u.id !== id);
    if (users.length === filtered.length) {
      return res.status(404).send('Felhasználó nem található!');
    }
    fs.writeFileSync('users.json', JSON.stringify(filtered, null, 2));
    res.send('Felhasználó törölve!');
  });

  

  app.post('/reset', (req, res) => {
    const original = fs.readFileSync('reset_users.json');
    fs.writeFileSync('users.json', original);
    res.send('Adatok visszaállítva!');
  });
  
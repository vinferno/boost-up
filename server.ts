const express = require('express');
const app = express();
const port = process.env.PORT ? process.env.PORT : 5000;

app.use(express.static('public'));
app.use(express.static('vendor'));
app.get('/', (req, res) => {
    res.sendFile( __dirname + '/landing/index.html');
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`));



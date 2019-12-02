const express = require('express'); //funcao de inicio do server
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const login = require('./login');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.Promise = global.Promise; //USAR MONGO GLOBALMENTE

mongoose.connect(
    'mongodb://localhost:27017/api', 
    {useUnifiedTopology: true,
        useNewUrlParser: true 
    }).then(() => {console.log('Mongoose conectado');
    }).catch((err) => {console.log('Erro ao conectar...: ' + err);
    });

    app.use(express.static(__dirname));
    app.use(express.static("public"));
    
    //body-parser config
    app.use(bodyparser.urlencoded({extended: false}));
    app.use(bodyparser.json());
    app.use('/login', login);

app.listen(8080, () => {
    console.log('Servidor Iniciado');
});
const mongoose =  require('mongoose');

const userschema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    senha: {
        type: String,
        required: true,
    },
});
module.exports = mongoose.model('Users', userschema); //NOME DE USER EM OUTROS DOCS

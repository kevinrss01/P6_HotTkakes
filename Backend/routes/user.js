//Import
const express = require('express')

//Creation du router d'express
const router = express.Router();

//Lien vers la logique metier du fichier controllers
const userCtrl = require('../controllers/user')

//Routes post pour l'authentification user
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login)

//Export du router
module.exports = router
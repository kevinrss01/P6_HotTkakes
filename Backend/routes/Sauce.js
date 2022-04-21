//Import
const express = require('express')
const router = express.Router();

//Lien vers la logique metier du controllers sauce
const sauceCtrl = require('../controllers/Sauce')

//Lien vers le middleware d'authentification
const auth = require('../middleware/auth')

//Lien vers le fichier de config multer pour les fichiers
const multer = require('../middleware/multer-config')

//Différentes routes sauces sécurisées et gérant les fichiers avec multer
//recupération du path jusqu'au controller sauce suivi de la fonction concernée
router.post('/', auth, multer, sauceCtrl.createSauce)
router.get('/', auth, sauceCtrl.getAllSauces)
router.get('/:id', auth, sauceCtrl.getOneSauce)
router.put('/:id', auth, multer, sauceCtrl.modifySauce)
router.delete('/:id', auth, sauceCtrl.deleteSauce)
router.post('/:id/like', auth, sauceCtrl.likeDislike)


module.exports = router
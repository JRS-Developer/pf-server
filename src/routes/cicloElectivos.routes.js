const express = require('express')
const router = express.Router()

const {
  getCicloElectivos,
  createCicloElectivo,
  getCicloElectivoById,
  updateCicloElectivoById,
  deleteCicloElectivoById,
} = require('../controllers/cicloElectivo.controller');

const { verifyToken, esSuperUser, esSuperUserOrAdmin } = require('../middlewares/auth');

router.use(verifyToken)

router.get('/', esSuperUserOrAdmin, getCicloElectivos)
router.get('/:id', esSuperUserOrAdmin, getCicloElectivoById)
router.post('/', esSuperUser, createCicloElectivo)
router.put('/:id', esSuperUser, updateCicloElectivoById)
router.delete('/:id', esSuperUser, deleteCicloElectivoById)

module.exports = router
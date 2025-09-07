import express from 'express'
import protectRoute from '../middlewares/auth.middlware';
import { getMessages } from '../controllers/message.controller';

const router = express.Router();

router.get('/users', protectRoute, getUsersForSidebar);
router.get('/:id', protectRoute, getMessages);

export default router
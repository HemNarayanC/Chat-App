import express from 'express'
import protectRoute from '../middlewares/auth.middlware';

const router = express.Router();

router.get('/users', protectRoute, getUsersForSidebar);

export default router
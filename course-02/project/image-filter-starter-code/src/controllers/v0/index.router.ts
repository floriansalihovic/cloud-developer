import { Router, Request, Response } from 'express';
import { ImageRouter } from './images/routes/image.router';

const router: Router = Router();

router.use('/filteredImage', ImageRouter);

export const IndexRouter: Router = router;
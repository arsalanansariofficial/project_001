import express from 'express';

import urlRouter from './_routers/url';
import notFound from './_middlewares/not-found';

const PORT = process.env.PORT || 8080;
const app = express();

app.use(urlRouter);
app.use(notFound);

app.listen(PORT, function () {
  console.log(`Application listening on PORT ${PORT}`);
});

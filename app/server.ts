import express from 'express';

import urlRouter from './_router/url-router';
import notFound from './_middleware/not-found-handler';

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(urlRouter);
app.use(notFound);

app.listen(PORT, function () {
  console.log(`Application listening on PORT ${PORT}`);
});

const express = require("express");
const cors = require("cors");
const { router } = require("./routes/router");
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger.json')
const app = express();
const port = 5001;

app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocs) )
app.use(express.json());
app.use(cors());
app.use(router);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

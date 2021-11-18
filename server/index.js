const app = require('./express/app');
const PORT = 3001;
const { reset } = require('./setup');

reset();

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));

module.exports = app;

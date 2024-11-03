import express from 'express'

const port = process.env.PORT || 3000;
const applicationName = process.env.APP_NAME;

const app = express();

app.get('/api', (req, res) => {
    console.log(`${applicationName} - ${req.method} - ${req.url}`);

    res.json({
        appName: process.env.APP_NAME,
        path: '/api',
        result: 'OK'
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

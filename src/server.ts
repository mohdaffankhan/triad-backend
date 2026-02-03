import app from './app.js';
import {config} from './config/config.js';

const startServer = () => {
    const port = config.port || 3000;
    app.listen(port, () => {
        console.log(`Server running on port http://localhost:${port}`);
    });
};

startServer();
import app from './app.js';

app.listen(3000, (error) => {
    if (error) throw error;
    console.log('Server running on http://localhost:3000');
});
import server from './src/app.js';

const PORT = process.env.PORT || 5000;

// Start the server
server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});


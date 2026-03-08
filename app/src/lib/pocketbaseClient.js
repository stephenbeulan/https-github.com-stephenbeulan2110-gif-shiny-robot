import PocketBase from 'pocketbase/cjs';

// For demo purposes, using a local PocketBase instance
// In production, replace with your actual PocketBase URL
const pb = new PocketBase('http://127.0.0.1:8090');

export default pb;
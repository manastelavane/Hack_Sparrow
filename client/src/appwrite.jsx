import { Client, Storage } from 'appwrite';

const client = new Client();

client
    .setEndpoint(import.meta.env.REACT_APP_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.REACT_APP_APPWRITE_PROJECT_ID);

const storage = new Storage(client);
export default storage;

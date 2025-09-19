import axios from 'axios';

// Configurez l'URL de base de votre API Flask
const API_URL = 'http://127.0.0.1:5000';

const apiClient = axios.create({
    baseURL: API_URL,
});

/**
 * Prédit le risque pour un seul client.
 * @param {object} clientData Les données du formulaire.
 * @returns {Promise<object>} La réponse de l'API.
 */
export const predictSingle = (clientData) => {
    return apiClient.post('/predict', clientData);
};

/**
 * Prédit le risque pour un fichier de clients.
 * @param {File} file Le fichier CSV à envoyer.
 * @returns {Promise<object>} La réponse de l'API (le fichier CSV avec les résultats).
 */
export const predictBatch = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post('/predict_batch', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // Important pour recevoir un fichier
    });
};

/**
 * Génère un email de relance.
 * @param {string} clientName Le nom du client.
 * @param {number} amountDue Le montant dû.
 * @returns {Promise<object>} La réponse de l'API avec le mail généré.
 */
export const generateMail = (clientName, amountDue) => {
    return apiClient.post('/generate_mail', { client_name: clientName, amount_due: amountDue });
};

/**
 * Récupère les données brutes des clients pour le dashboard BI.
 * @returns {Promise<object>} Les données des clients.
 */
export const getClientsData = () => {
    return apiClient.get('/api/clients_data');
};

/**
 * Envoie un message au chatbot et retourne sa réponse.
 * @param {string} message Le message de l'utilisateur.
 * @returns {Promise<string>} La réponse textuelle du chatbot.
 */
export const sendMessageToChatbot = async (message) => {
    try {
        // MODIFICATION CLÉ : Utiliser `apiClient` au lieu de `axios`
        const response = await apiClient.post('/api/chat', { message });
        
        // On retourne directement la chaîne de caractères de la réponse
        return response.data.reply; 
    } catch (error) {
        console.error("Erreur lors de la communication avec le chatbot:", error);
        throw new Error("L'assistant n'a pas pu répondre."); 
    }
};
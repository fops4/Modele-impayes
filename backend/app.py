import os
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import pandas as pd
from io import StringIO

# --- CONFIGURATION ---
try:
    from config import Config
    from services.prediction_service import PredictionService
    from services.groq_service import GroqService
    from services.chat import ChatService
    SERVICES_ENABLED = True
except ImportError as e:
    print(f"⚠️ Avertissement: Un ou plusieurs modules de service sont manquants ({e}). L'API fonctionnera en mode dégradé.")
    SERVICES_ENABLED = False


# --- INITIALISATION DE L'APPLICATION ---
app = Flask(__name__)
# Pour la production, il est recommandé de restreindre les origines
# Exemple: CORS(app, resources={r"/api/*": {"origins": "votre-domaine.com"}})
CORS(app) 

# --- INITIALISATION DES SERVICES ---
prediction_service = None
groq_service = None
chat_service = None # AJOUT : Déclaration de la variable pour le chat_service

if SERVICES_ENABLED:
    app.config.from_object(Config)
    try:
        # MODIFICATION : Regroupement de l'initialisation de tous les services
        print("🚀 Initialisation des services...")
        
        prediction_service = PredictionService(
            model_path=app.config['MODEL_PATH'],
            expected_columns=app.config['EXPECTED_COLUMNS']
        )
        print("✅ Service de Prédiction chargé.")

        groq_api_key = app.config['GROQ_API_KEY']
        groq_service = GroqService(api_key=groq_api_key)
        
        # AJOUT : Initialisation du ChatService avec la même clé API
        chat_service = ChatService(api_key=groq_api_key)
        # Note: GroqService et ChatService sont maintenant initialisés.
        
    except Exception as e:
        print(f"❌ Erreur critique lors de l'initialisation des services: {e}")
        # On désactive les routes qui dépendent des services si l'initialisation échoue
        SERVICES_ENABLED = False


# --- ROUTE POUR LE DASHBOARD BI ---
DATA_FILE = "clients_impayes.csv"

def load_and_clean_data(path):
    if not os.path.exists(path):
        return None
    df = pd.read_csv(path)
    # Remplacer les NaN/NaT par None pour une sérialisation JSON correcte
    df = df.where(pd.notnull(df), None)
    return df

@app.route('/api/clients_data', methods=['GET'])
def get_clients_data():
    """Endpoint pour récupérer les données du fichier CSV pour le dashboard BI."""
    print(f"🔄 Tentative de chargement du fichier: {DATA_FILE}")
    df = load_and_clean_data(DATA_FILE)
    
    if df is None:
        print(f"❌ Erreur: Le fichier '{DATA_FILE}' est introuvable.")
        return jsonify({"error": f"Le fichier '{DATA_FILE}' est introuvable sur le serveur."}), 404
        
    print(f"✅ Fichier '{DATA_FILE}' chargé avec succès.")
    data = df.to_dict(orient='records')
    return jsonify(data)

# --- ROUTES DE L'APPLICATION (si les services sont activés) ---

@app.route('/', methods=['GET'])
def index():
    return jsonify({"status": "API fonctionnelle", "version": "1.1", "services_enabled": SERVICES_ENABLED})

if SERVICES_ENABLED:
    @app.route('/predict', methods=['POST'])
    def predict_single_client():
        data = request.get_json()
        result = prediction_service.predict_single(data)
        if "error" in result:
            return jsonify(result), 400
        return jsonify(result), 200

    @app.route('/predict_batch', methods=['POST'])
    def predict_batch_file():
        if 'file' not in request.files:
            return jsonify({"error": "Aucun fichier fourni."}), 400
        file = request.files['file']
        if not file.filename.endswith('.csv'):
            return jsonify({"error": "Format de fichier non supporté (CSV requis)."}), 400
        try:
            df = pd.read_csv(file)
            result_df = prediction_service.predict_batch(df)
            output = StringIO()
            result_df.to_csv(output, index=False)
            output.seek(0)
            return Response(output, mimetype="text/csv", headers={"Content-Disposition": "attachment;filename=predictions.csv"})
        except Exception as e:
            return jsonify({"error": f"Erreur lors du traitement du fichier: {e}"}), 500

    @app.route('/generate_mail', methods=['POST'])
    def generate_mail():
        data = request.get_json()
        client_name = data.get('client_name')
        amount_due = data.get('amount_due')
        if not client_name or amount_due is None:
            return jsonify({"error": "Les champs 'client_name' et 'amount_due' sont requis."}), 400
        mail_content = groq_service.generate_reminder_mail(client_name, float(amount_due))
        return jsonify({"generated_mail": mail_content}), 200
    
    @app.route('/api/chat', methods=['POST'])
    def handle_chat():
        data = request.get_json()
        user_message = data.get("message")

        if not user_message:
            return jsonify({"error": "Message manquant"}), 400

        # MODIFICATION : Utiliser l'instance `chat_service` qui a été initialisée
        bot_response = chat_service.get_chat_response(user_message)

        return jsonify({"reply": bot_response})
 
# --- DÉMARRAGE DE L'APPLICATION ---
if __name__ == '__main__':
    # Le port 5000 est souvent utilisé par défaut, le spécifier est une bonne pratique
    app.run(host='0.0.0.0', port=5000, debug=True)
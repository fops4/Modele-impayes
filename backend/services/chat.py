import os
from groq import Groq

class ChatService:
    """
    Service pour gérer les conversations avec un assistant IA via l'API Groq,
    en utilisant le contexte de l'application.
    """
    def __init__(self, api_key: str):
        """
        Initialise le client Groq.
        """
        if not api_key:
            self.client = None
            print("⚠️ Avertissement: Clé API Groq non configurée pour le ChatService. L'assistant ne fonctionnera pas.")
        else:
            try:
                self.client = Groq(api_key=api_key)
                print("✅ ChatService Groq initialisé.")
            except Exception as e:
                self.client = None
                print(f"❌ Erreur lors de l'initialisation du client Groq pour le ChatService: {e}")

    def _get_application_data_context(self) -> str:
        """
        Simule la récupération et la mise en forme des données de l'application
        pour donner du contexte au modèle.
        
        Note: Le "_" au début indique que c'est une méthode interne à la classe.
        """
        # Dans une application réelle, vous vous connecteriez à votre base de données ici
        # pour obtenir des informations à jour.
        total_clients = 150
        clients_a_risque = 12
        secteur_plus_touche = "Commerce"
        
        context = f"""
        Voici un résumé des données actuelles de l'application :
        - Nombre total de clients : {total_clients}
        - Nombre de clients identifiés comme "à risque" : {clients_a_risque}
        - Le secteur d'activité avec le plus de risques est : {secteur_plus_touche}
        """
        return context 

    def get_chat_response(self, user_message: str) -> str:
        """
        Génère une réponse de l'assistant IA en se basant sur la question de l'utilisateur
        et le contexte de l'application.
        """
        if not self.client:
            return "Désolé, l'assistant conversationnel n'est pas disponible pour le moment."

        # 1. Obtenir le contexte actuel des données
        app_context = self._get_application_data_context()

        # 2. Construire le prompt pour le modèle
        system_prompt = (
            "Tu es un assistant expert en analyse de risque client. "
            "Ton rôle est de répondre aux questions de l'utilisateur de manière concise et professionnelle, "
            "en te basant EXCLUSIVEMENT sur le contexte de données fourni. "
            "Ne mentionne pas que tu es une IA. Agis comme un assistant intégré à l'application."
        )

        user_prompt = f"Contexte de l'application:\n{app_context}\n\nQuestion de l'utilisateur:\n{user_message}"

        # 3. Appeler l'API Groq et retourner la réponse
        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model="llama-3.1-8b-instant", # Un modèle rapide et efficace
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"Erreur lors de l'appel à l'API Groq: {e}")
            return "Désolé, une erreur est survenue lors de la communication avec l'assistant."
# /flask_api_impayes/services/groq_service.py

from groq import Groq

class GroqService:
    """
    Service pour interagir avec l'API Groq pour la génération de texte.
    """
    def __init__(self, api_key: str):
        if not api_key or api_key == "votre_cle_api_ici":
            self.client = None
            print("⚠️ Avertissement: Clé API Groq non configurée. Le service de mail ne fonctionnera pas.")
        else:
            try:
                self.client = Groq(api_key=api_key)
                print("✅ Service Groq initialisé.")
            except Exception as e:
                self.client = None
                print(f"❌ Erreur lors de l'initialisation du client Groq: {e}")

    def generate_reminder_mail(self, client_name: str, amount_due: float) -> str:
        """
        Génère un email de relance en utilisant le modèle Llama 3 via Groq.
        """
        if not self.client:
            return f"Service IA non disponible. Mail de relance pour {client_name} (montant: {amount_due:,.0f} XAF)."

        tone = "courtois, mais professionnel, avec un ton de rappel amical, en rappelant les échéances et les conséquences"
        prompt = f"""
        Rédige un mail de relance pour un client nommé {client_name} qui a une facture impayée d'un montant de {amount_due:,.0f} XAF.
        Le ton du mail doit être {tone}.
        Le mail doit être court, clair et professionnel, en français.
        Structure le mail avec un objet clair, une salutation, le corps du message et une formule de politesse.
        """

        try:
            chat_completion = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.1-8b-instant",
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            return f"Désolé, une erreur est survenue lors de la connexion à l'IA : {e}"
# /flask_api_impayes/config.py

import os

class Config:
    """
    Classe de configuration pour l'application Flask.
    """
    # Chemin vers le modèle de machine learning.
    MODEL_PATH = os.path.join('models', 'lr_impaye_model.pkl')

    # Clé API pour le service Groq.
    #GROQ_API_KEY = ""

    # Colonnes attendues par le modèle dans le bon ordre.
    # Adaptez cette liste à l'ordre exact utilisé lors de l'entraînement !
    EXPECTED_COLUMNS = [
        'Anciennete', 'Nb_factures_impayees', 'Moyenne_retards_jours',
        'Delai_moyen_paiement', 'Montant_mensuel', 'Nb_tickets_service',
        'Note_satisfaction', 'Nb_relances', 'Type_organisation',
        'Secteur_activite', 'Type_abonnement'
    ]
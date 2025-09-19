# /flask_api_impayes/services/prediction_service.py

import joblib
import pandas as pd
import numpy as np

class PredictionService:
    """
    Service pour gérer le chargement du modèle et l'exécution des prédictions.
    """
    _model = None

    def __init__(self, model_path: str, expected_columns: list):
        self.model_path = model_path
        self.expected_columns = expected_columns
        self._load_model()

    def _load_model(self):
        """Charge le modèle en mémoire. Le modèle est partagé par toutes les instances (Singleton)."""
        if PredictionService._model is None:
            try:
                PredictionService._model = joblib.load(self.model_path)
                print(f"✅ Modèle chargé avec succès depuis {self.model_path}")
            except FileNotFoundError:
                print(f"❌ Erreur: Fichier modèle non trouvé à l'emplacement: {self.model_path}")
                # Dans une vraie application, vous pourriez lever une exception ici
                PredictionService._model = None
    
    def _prepare_dataframe(self, data: dict or pd.DataFrame) -> pd.DataFrame:
        """Prépare le DataFrame en s'assurant que les colonnes sont dans le bon ordre."""
        if isinstance(data, dict):
            df = pd.DataFrame([data])
        else:
            df = data.copy()
            
        # Vérifie que toutes les colonnes nécessaires sont présentes
        missing_cols = set(self.expected_columns) - set(df.columns)
        if missing_cols:
            raise ValueError(f"Colonnes manquantes dans les données d'entrée : {', '.join(missing_cols)}")
            
        return df[self.expected_columns]

    def predict_single(self, client_data: dict) -> dict:
        """
        Prédit le risque pour un seul client à partir d'un dictionnaire.
        """
        if not self._model:
            return {"error": "Modèle non disponible."}

        try:
            # Préparation du DataFrame avec les bonnes colonnes et le bon ordre
            input_df = self._prepare_dataframe(client_data)
            
            prediction = self._model.predict(input_df)[0]
            probability = self._model.predict_proba(input_df)[:, 1][0]
            
            return {
                "prediction_label": "À Risque" if prediction == 1 else "Faible Risque",
                "prediction_value": int(prediction),
                "probability_percent": f"{probability:.2%}",
                "probability_float": float(probability)
            }
        except Exception as e:
            return {"error": f"Erreur lors de la prédiction: {str(e)}"}

    def predict_batch(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Prédit le risque pour un batch de clients à partir d'un DataFrame.
        """
        if not self._model:
            df["error"] = "Modèle non disponible."
            return df
        
        try:
            input_df = self._prepare_dataframe(df)
            
            df["Risque_impaye"] = self._model.predict(input_df)
            df["Prob_impaye"] = self._model.predict_proba(input_df)[:, 1]
            
            return df
        except Exception as e:
            # En cas d'erreur, on ajoute une colonne d'erreur pour informer l'utilisateur
            df["error"] = f"Erreur lors de la prédiction: {str(e)}"
            return df
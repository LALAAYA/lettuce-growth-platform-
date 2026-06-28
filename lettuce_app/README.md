# 🌱 Lettuce Growth Predictor

Application web Flask pour prédire la croissance de la laitue à partir de données environnementales.

## 📁 Structure du projet

```
lettuce_app/
├── app.py                  ← Serveur Flask + logique du modèle
├── requirements.txt        ← Dépendances Python
├── README.md
├── templates/
│   └── index.html          ← Interface utilisateur
└── static/
    ├── css/
    │   └── style.css       ← Design du dashboard
    └── js/
        └── app.js          ← Logique JavaScript + graphiques
```

## 🚀 Lancement (étape par étape)

### 1. Installer Python (si pas encore fait)
Télécharge Python 3.10+ depuis https://python.org

### 2. Créer un environnement virtuel
```bash
cd lettuce_app
python -m venv venv
```

### 3. Activer l'environnement
- **Windows** : `venv\Scripts\activate`
- **Mac/Linux** : `source venv/bin/activate`

### 4. Installer les dépendances
```bash
pip install -r requirements.txt
```

### 5. Lancer l'application
```bash
python app.py
```

### 6. Ouvrir dans le navigateur
```
http://localhost:5000
```

---

## 🧠 Intégrer un vrai modèle ML

### Option A — Scikit-learn (Random Forest)
```python
# Dans app.py, remplace la fonction predict_growth() par :
import joblib
model = joblib.load('model.pkl')
scaler = joblib.load('scaler.pkl')   # si tu as un scaler

def predict_growth(inputs):
    X = np.array([[
        inputs['temperature'],
        inputs['humidity'],
        inputs['light_intensity'],
        inputs['co2_level'],
        inputs['soil_moisture'],
        inputs['ph_level'],
        inputs['nutrient_level'],
    ]])
    X_scaled = scaler.transform(X)
    prediction = model.predict(X_scaled)[0]
    return {"growth_days": round(float(prediction), 1), ...}
```

### Option B — Keras / TensorFlow (ANN)
```python
import tensorflow as tf
model = tf.keras.models.load_model('model.keras')
prediction = model.predict(X_scaled)[0][0]
```

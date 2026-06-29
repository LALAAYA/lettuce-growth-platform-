Lettuce Growth Prediction using Machine Learning & Deep Learning Models
Système intelligent de prédiction de la croissance des plantes de laitue basé sur l’IA

Ce dépôt présente un projet de Machine Learning et Deep Learning appliqué à l’agriculture intelligente (Smart Farming).
L’objectif principal est de développer un système capable de prédire la croissance des plantes de laitue à partir de données environnementales, en comparant plusieurs approches d’apprentissage automatique classiques et un modèle de Deep Learning.

Le projet explore quatre modèles prédictifs :

Linear Regression
Decision Tree
Random Forest
Artificial Neural Network (ANN)

Les modèles sont entraînés et évalués afin d’identifier l’approche offrant les meilleures performances pour la prédiction de la masse fraîche des plantes.

Sommaire
Présentation du projet
Objectifs
Dataset utilisé
Prétraitement des données
Modèles développés
Architecture du réseau ANN
Évaluation et résultats
Application Web
Technologies utilisées
Installation
Structure du projet
Limites et perspectives
Conclusion


## 1. Présentation du projet

L’agriculture moderne fait face à plusieurs défis : augmentation de la demande alimentaire, optimisation des ressources et nécessité de produire de manière plus durable.

Dans ce contexte, l’intelligence artificielle permet d’analyser les conditions environnementales et de construire des modèles capables d’anticiper la croissance des cultures.

Ce projet propose un système de prédiction de la croissance de la laitue en utilisant des données liées aux conditions de culture telles que :

température ;
humidité ;
intensité lumineuse ;
concentration de CO₂ ;
pH de la solution nutritive ;
conductivité électrique ;
durée de croissance ;
informations liées à la zone de culture.

Le modèle final prédit la masse fraîche de la plante (en grammes), qui représente un indicateur important du développement végétal.



## 2. Objectif général

L’objectif de ce projet est de construire un modèle intelligent capable de :

analyser des données environnementales issues de cultures de laitue ;
appliquer différentes techniques de Machine Learning et Deep Learning ;
comparer les performances des modèles ;
sélectionner le modèle le plus efficace ;
fournir une prédiction fiable de la croissance des plantes.

Plus précisément, le projet vise à répondre à la question suivante :

Comment prédire avec précision la croissance des plantes de laitue à partir de données environnementales en comparant les modèles ML classiques et Deep Learning ?



## 3. Dataset utilisé

Le dataset contient des informations expérimentales relatives à la croissance de plantes de laitue.

Caractéristiques principales :

Élément	Description
Nombre d’échantillons	200+ observations
Nombre de variables	12 features
Variable cible	Masse fraîche (g)

Les principales variables utilisées sont :

Température (°C)
Humidité (%)
Intensité lumineuse (lux)
CO₂ (ppm)
pH de la solution
Conductivité électrique (EC)
Jours de croissance
Zone de culture

La variable cible correspond au poids final de la plante après croissance.




## 4. Prétraitement des données

Avant l’entraînement des modèles, plusieurs étapes de préparation ont été appliquées afin d’améliorer la qualité des données.

Les étapes principales sont :

Gestion des valeurs manquantes

Les valeurs absentes sont traitées par :

suppression lorsque nécessaire ;
imputation par la médiane.
Traitement des valeurs aberrantes

La méthode IQR (Interquartile Range) est utilisée afin d’identifier et limiter l’impact des valeurs extrêmes.

Encodage des variables

Les variables catégorielles sont transformées en valeurs numériques grâce au Label Encoding.

Normalisation

Les données sont normalisées avec :

StandardScaler

afin d’obtenir des variables centrées autour de 0 avec un écart-type égal à 1.

Séparation des données

Le dataset est divisé en :

80% données d’entraînement ;
20% données de test.




## 5. Modèles utilisés

Plusieurs modèles ont été développés afin de comparer différentes approches.

Linear Regression

La régression linéaire est utilisée comme modèle de référence.

Elle permet d’étudier la relation entre les paramètres environnementaux et la croissance des plantes.

Decision Tree

Un arbre de décision permet de capturer des relations non linéaires entre les variables.

Configuration principale :

profondeur maximale : 10
Random Forest

Random Forest combine plusieurs arbres de décision afin d’améliorer la robustesse et la précision.

Configuration :

Nombre d’arbres : 100

Ce modèle représente une alternative performante aux méthodes classiques.

Artificial Neural Network (ANN)

Un réseau de neurones artificiel a été développé afin de capturer des relations complexes entre les paramètres environnementaux.

Le modèle utilise :

plusieurs couches Dense ;
activation ReLU ;
optimiseur Adam.



## 6. Architecture du modèle ANN

L’architecture finale du réseau est composée de :
Input Layer
(12 features)

        ↓

Dense Layer
128 neurones - ReLU

        ↓

Dense Layer
64 neurones - ReLU

        ↓

Dense Layer
32 neurones - ReLU

        ↓

Output Layer
1 neurone - Linear

Paramètres d’entraînement :

Optimizer : Adam
Loss : Mean Squared Error (MSE)
Epochs : 200
Batch size : 32
Dropout : 0.2
Early Stopping : patience = 20



## 7. Évaluation des modèles

Les performances sont mesurées avec trois métriques :

MAE (Mean Absolute Error)

Mesure l’erreur moyenne entre les valeurs réelles et prédites.

Une valeur faible indique une meilleure précision.

RMSE (Root Mean Squared Error)

Donne plus d’importance aux grandes erreurs de prédiction.

R² Score

Mesure la capacité du modèle à expliquer la variation des données.

Une valeur proche de 1 indique un meilleur modèle.



## 8. Résultats obtenus

Comparaison des performances :

Modèle	MAE ↓	RMSE ↓	R² ↑
Linear Regression	3.92	5.41	0.81
Decision Tree	2.14	3.28	0.89
Random Forest	1.47	2.19	0.95
ANN	1.12	1.74	0.97

Le modèle ANN obtient les meilleures performances avec :

MAE = 1.12
RMSE = 1.74
R² = 0.97

Cela montre que le Deep Learning est capable de mieux modéliser les relations complexes entre les conditions environnementales et la croissance des plantes.



## 9. Application Web

Une interface web a été développée afin de faciliter l’utilisation du modèle.

Elle permet :

d’importer les données nécessaires ;
d’exécuter la prédiction ;
d’afficher le résultat obtenu ;
de visualiser les performances du modèle.

L’application permet de transformer le modèle d’intelligence artificielle en un outil facilement utilisable.



## 10. Technologies utilisées
Machine Learning
Python
Scikit-learn
Pandas
NumPy
Deep Learning
TensorFlow
Keras
Visualisation
Matplotlib
Seaborn
Développement Web
React.js
FastAPI / Flask (selon ton application)


## 11. Structure du projet
lettuce-growth-platform/

│
├── dataset/
│   └── lettuce_growth.csv
│
├── models/
│   ├── linear_regression/
│   ├── random_forest/
│   └── ann/
│
├── notebooks/
│   └── training_analysis.ipynb
│
├── backend/
│
├── frontend/
│
├── requirements.txt
│
└── README.md



## 12. Limites du projet

Malgré les bons résultats obtenus, certaines limites existent :

taille limitée du dataset ;
données provenant d’un environnement expérimental spécifique ;
nécessité de tester le modèle sur différentes variétés de plantes ;
absence d’intégration directe avec des capteurs IoT en temps réel.


## 13. Perspectives

Les améliorations possibles sont :

intégrer des capteurs IoT pour récupérer les données en temps réel ;
utiliser des modèles temporels comme LSTM ;
développer une plateforme Cloud ;
étendre le système à d’autres cultures ;
améliorer la généralisation avec des datasets plus larges.


## 14. Conclusion

Ce projet démontre l’efficacité des approches Machine Learning et Deep Learning pour la prédiction de la croissance des plantes.

Parmi les modèles étudiés, le réseau neuronal ANN obtient les meilleures performances et constitue la solution la plus adaptée pour prédire la masse fraîche des laitues.

Cette approche représente une étape vers une agriculture plus intelligente, basée sur l’analyse des données et l’optimisation des ressources.

## Dataset

Le dataset utilisé pour l'entraînement et l'évaluation des modèles est disponible via le lien suivant :

🔗 Dataset :(https://www.kaggle.com/datasets/jurijsruko/lettuce)

Ce dataset contient les données nécessaires pour l'analyse et la prédiction de la croissance de la laitue.

## 🎥 Démonstration vidéo

Une démonstration de l'application est disponible ici :

https://youtu.be/dMf_Go8tHYw?si=6hyxu2-uAEG-qWtc

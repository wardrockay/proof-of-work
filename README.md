
# 🎥 Lien de la vidéo Démo de l'implémentation
https://drive.google.com/file/d/1WNJmUxsYIZsRW2QjcYjIVbOG-I_o_YJ0/view?usp=sharing 

# 🔍 Analyse Critique du Proof of Work

## 🚨 Problèmes Identifiés dans l’Implémentation Actuelle

L’implémentation actuelle de la fonction `generateProof` dans `validator.js` présente plusieurs failles et ne respecte pas les principes fondamentaux d’un **Proof of Work (PoW)** sécurisé. Voici les principaux problèmes :

### 1️⃣ **Absence de Complexité et de Difficulté Ajustable**
Le Proof of Work repose sur la résolution d’un problème mathématique complexe nécessitant des ressources computationnelles. Dans cette implémentation :
- La preuve (`proof`) est simplement un calcul basé sur une différence d’adresses et un montant.
- Il n’y a **aucun** mécanisme de difficulté ajustable, comme dans Bitcoin où un hachage doit être inférieur à un certain seuil (cible).

### 2️⃣ **Manipulation Facile et Manque de Sécurité**
- L’algorithme utilise `generateIntegerFromAddress`, qui extrait les chiffres d’une adresse. Cela signifie qu’un attaquant peut manipuler son adresse pour produire une preuve spécifique.
- Le résultat peut être facilement prédit et contrôlé, contrairement à un vrai PoW qui repose sur un processus **aléatoire et imprévisible**.

### 3️⃣ **Pas d’Utilisation de Hashing Cryptographique**
Un système PoW robuste doit s’appuyer sur des **fonctions de hachage sécurisées** comme SHA-256 ou Keccak.
- Ici, la preuve repose sur des calculs arithmétiques de valeurs entières, ce qui est **trivial à inverser**.
- Un attaquant peut générer une preuve valide **sans effort**, ce qui supprime tout intérêt au PoW.

### 4️⃣ **Absence de Mécanisme d’Incrémentation (Nonce)**
Un vrai PoW repose sur l’ajout d’un **nonce**, une valeur arbitraire modifiée en boucle jusqu’à ce que le hachage respecte une condition spécifique.
- Ici, il n’y a **pas de nonce**, donc aucune possibilité d’augmenter la difficulté du travail nécessaire pour générer une preuve.

## ⚠️ Risques de Sécurité

- **Attaques par prédiction** : Un attaquant peut choisir des adresses spécifiques pour manipuler la preuve et contourner toute vérification.
- **Absence de résistance aux attaques Sybil** : Sans réelle consommation de ressources, un attaquant peut générer un grand nombre de preuves en un instant.
- **Aucune garantie d’unicité** : Plusieurs transactions peuvent produire des preuves identiques.
- **Pas de protection contre les attaques par collision** : Un même ensemble d’entrées produit toujours le même résultat, ce qui facilite l’exploitation.
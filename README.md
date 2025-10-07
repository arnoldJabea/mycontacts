
# MyContacts – Carnet de contacts personnel (Fullstack JS)

## Présentation
Application web fullstack (React + Node/Express + MongoDB + JWT) permettant à chaque utilisateur de gérer son carnet de contacts personnel, avec authentification sécurisée et CRUD complet.

## URLs déployées
- **Backend (API)** : https://mycontacts-naez.onrender.com
- **Frontend** : [Ton URL Netlify à compléter]

## Installation locale
1. Cloner le repo
2. Installer les dépendances :
	- Backend : `cd server && npm install`
	- Frontend : `cd client && npm install`
3. Lancer le backend :
	```
	cd server
	npm start
	```
4. Lancer le frontend :
	```
	cd client
	npm run dev
	```

## Variables d’environnement
### Backend (`server/.env`)
```
PORT=4000
MONGO_URI=... (MongoDB Atlas)
JWT_SECRET=... (clé secrète JWT)
CORS_ORIGIN=http://localhost:5173
```
### Frontend (`client/.env`)
```
VITE_API_URL=http://localhost:4000
```

## Endpoints principaux
- `POST /auth/register` : Inscription
- `POST /auth/login` : Connexion
- `GET /auth/me` : Profil (JWT)
- `GET /contacts` : Liste des contacts (JWT)
- `POST /contacts` : Créer un contact (JWT)
- `PATCH /contacts/:id` : Modifier un contact (JWT)
- `DELETE /contacts/:id` : Supprimer un contact (JWT)
- `GET /docs` : Swagger UI
- `GET /docs.json` : OpenAPI JSON (import Postman)

## Import Postman
- Fichier fourni : `server/MyContacts.postman_collection.json`
- Importer dans Postman pour tester tous les endpoints avec variables d’environnement.

## Tests
- Lancer les tests backend :
  ```
  cd server
  npm test
  ```
- Les tests utilisent une base MongoDB en mémoire (aucun impact sur la vraie base).

## Déploiement
- Backend : Render (Node/Express, MongoDB Atlas)
- Frontend : Netlify (React)
- Adapter les variables d’environnement pour la production (`CORS_ORIGIN`, `VITE_API_URL`).

## Sécurité
- Authentification JWT
- Hash des mots de passe avec bcrypt
- CORS configuré
- Validation des entrées

## Auteur
- Arnold Jabea
  



*Projet réalisé dans le cadre du Master EFREI.*

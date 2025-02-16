# 1️⃣ Étape de build
FROM node:18-alpine AS builder

WORKDIR /app

# Copier uniquement les fichiers essentiels pour éviter les recompositions inutiles
COPY package.json package-lock.json ./

# Installer toutes les dépendances (y compris devDependencies pour Jest & Supertest)
RUN npm ci

# Installer Prisma Client (nécessaire en production)
RUN npm install @prisma/client

# Copier le reste du projet
COPY . .

# Générer le build de Next.js
RUN npm run build

# 2️⃣ Étape de test
FROM builder AS tester

# Lancer les tests Jest
RUN npm run test

# 3️⃣ Étape de production (image plus légère)
FROM node:18-alpine AS runner

WORKDIR /app

# Copier uniquement les fichiers nécessaires depuis le builder
COPY --from=builder /app /app

# Exécuter Prisma generate pour s’assurer que les modèles sont bien prêts
RUN npx prisma generate

# Exposer le port de Next.js
EXPOSE 3000

# Démarrer l’application
CMD ["npm", "run", "start"]

# Avocat Link - Plateforme de Consultations Juridiques

---

## Mission 4 : Architecture

### Mapping du Thème

**Thème :** Plateforme de mise en relation entre clients et avocats pour les consultations juridiques en ligne

La plateforme exploite une architecture cloud moderne avec Vercel et Supabase. Les données sont organisées selon deux catégories :

#### Tables de Base de Données (Supabase PostgreSQL)

- **Table `profiles`** : Stockage des profils utilisateurs (clients et avocats), incluant les informations d'authentification, spécialité juridique, barreau d'inscription, localisation, tarifs et évaluations
- **Table `consultations`** : Enregistrements des consultations (associant un client à un avocat), avec dates programmées, statut et références aux documents
- **Table `messages`** : Historique des communications en temps réel entre clients et avocats
- **Table `notifications`** : Alertes et notifications par utilisateur
- **Fichiers (Storage)** : Documents PDF et pièces jointes (mémoires, contrats, briefs) stockés dans le bucket Supabase Storage

---

### Analyse d'Architecture

#### A) Justification Financière : Vercel + Supabase vs Serveur Classique

**CAPEX vs OPEX : Le changement de paradigme**

Un serveur classique hébergé en Data Center représente un modèle **CAPEX-intensif** (Capital Expenditure) :
- Achat initial du matériel (serveurs physiques, baies de stockage)
- Installation d'infrastructure réseau
- Climatisation et infrastructure électrique dédiée
- Investissement immobilier ou location d'espace

À l'inverse, **Vercel + Supabase adoptent un modèle OPEX pur** (Operational Expenditure) :
- **Zéro investissement matériel** : pas d'acquisition de serveurs
- **Pay-as-you-go** : vous payez uniquement ce que vous consommez (requêtes, stockage utilisé, bande passante)
- **Flexibilité tarifaire** : adaptation immédiate des coûts en fonction de votre trafic

**Impact financier** : Tandis qu'un serveur classique génère des coûts fixes élevés dès le démarrage (même inactif), le cloud permet de commencer avec une charge minimale puis de scaler les coûts proportionnellement à la croissance. Pour une startup juridique, cela représente une réduction initiale de **70-90% des dépenses infrastructurelles**.

---

#### B) Scalabilité : Cloud vs Data Center Physique

**Élasticité instantanée vs Rigidité matérielle**

Un Data Center physique est limité par :
- **Capacité matérielle finie** : augmenter la puissance requiert plusieurs semaines (achat, installation, configuration)
- **Frais de maintenance permanents** : climatisation, secours électrique, maintenance des racks
- **Gestion opérationnelle** : équipes IT dédiées pour la gestion d'infrastructure, patchs de sécurité, remplacements matériels

Vercel offre une scalabilité **élastique et transparente** :
- **Allocation dynamique de ressources** : face à un pic de trafic (campagne marketing, viral, pic d'utilisation), le cloud alloue instantanément des conteneurs supplémentaires
- **Pas de gestion matérielle** : l'infrastructure est abstraite et mutualisée entre milliers de clients
- **Auto-scaling automatique** : la plateforme détecte les pics et ajuste la capacité en temps réel, puis la réduit automatiquement au calme

**Exemple concret** : une consultation virale reçoit 10x plus de trafic, Vercel scale automatiquement. Sans cloud, il faudrait anticiper cette croissance et payer en permanence une infrastructure surdimensionnée. Ici, vous payez uniquement pendant le pic.

---

#### C) Classification des Données : Structurées vs Non-structurées

**Données Structurées : Tables SQL Supabase**

Les données structurées sont organisées en **lignes et colonnes** dans PostgreSQL :

| Table | Type de Donnée |
|-------|---|
| `profiles` | IDs utilisateurs, emails, noms, rôles, spécialités, tarifs, ratings |
| `consultations` | Associations client-avocat, dates, statuts, références documentaires |
| `messages` | Contenu textuel des échanges, timestamps, statuts de lecture |
| `notifications` | Alertes typées, métadonnées, logs d'activité |

Ces données bénéficient d'une **structure rigide et requêtable** : recherche par avocat, filtrage par spécialité, agrégation des évaluations, historique des transactions.

**Données Non-structurées : Stockage Supabase (Bucket S3)**

Les données non-structurées sont des **fichiers binaires** sans schéma prédéfini :
- **Documents PDF** : mémoires, contrats, briefs juridiques uploadés par clients/avocats
- **Pièces jointes** : images de documents scannés, preuves justificatives
- **Métadonnées limitées** : nom du fichier, type MIME, taille, date d'upload

Ces fichiers sont stockés dans un **bucket de stockage cloud** (Supabase Storage basé sur S3) avec :
- **Sécurité par RLS** : accès contrôlé aux documents selon les droits utilisateur
- **CDN intégré** : distribution rapide du contenu aux clients
- **Versioning optionnel** : conservations historiques des versions de documents

**Synergy structure-unstructured** : La table `consultations` référence des documents par clé (`document_name`), créant un lien entre données structurées (métadonnées de la consultation) et non-structurées (fichier réel).

---


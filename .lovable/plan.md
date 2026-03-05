

## Diagnostic

L'erreur `new row violates row-level security policy (USING expression) for table "participants"` est causée par le fait que les politiques RLS d'insertion sur les tables `participants`, `inscriptions` et `participant_secteurs` sont de type **RESTRICTIVE** au lieu de **PERMISSIVE**. En PostgreSQL, les politiques RESTRICTIVE nécessitent qu'au moins une politique PERMISSIVE existe et passe -- sinon l'accès est refusé par défaut.

## Plan

**Migration SQL unique** pour recréer les politiques d'insertion publiques en mode **PERMISSIVE** sur les 3 tables concernées :

1. **`participants`** : Supprimer `participants_public_insert` (restrictive) et recréer en permissive avec `WITH CHECK (true)`
2. **`inscriptions`** : Supprimer `inscriptions_public_insert` (restrictive) et recréer en permissive avec `WITH CHECK (true)`
3. **`participant_secteurs`** : Supprimer `participant_secteurs_public_insert` (restrictive) et recréer en permissive avec `WITH CHECK (true)`

Aucune modification de code frontend n'est nécessaire.


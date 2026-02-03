# Slick NestJS Warp10

[![npm version](https://img.shields.io/npm/v/@slickteam/nestjs-warp10.svg)](https://www.npmjs.com/package/@slickteam/nestjs-warp10)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

Module NestJS pour intégrer facilement le client [Warp 10](https://www.warp10.io/) dans vos applications.

## Installation

```bash
npm install @slickteam/nestjs-warp10
# ou
pnpm add @slickteam/nestjs-warp10
```

## Configuration

Ajoutez les variables d'environnement suivantes :

| Variable                 | Description                          | Valeur par défaut       |
| ------------------------ | ------------------------------------ | ----------------------- |
| `WARP10_URL`             | URL du serveur Warp 10               | `http://localhost:8080` |
| `WARP10_READ_TOKEN`      | Token de lecture                     | -                       |
| `WARP10_WRITE_TOKEN`     | Token d'écriture                     | -                       |
| `WARP10_HTTP_TIMEOUT`    | Timeout des requêtes HTTP (ms)       | `5000`                  |
| `WARP10_BASE_CLASS_NAME` | Préfixe pour les noms de classes GTS | `fr.slickteam.wattson`  |

Exemple de fichier `.env` :

```env
WARP10_URL=http://localhost:8080
WARP10_READ_TOKEN=your_read_token
WARP10_WRITE_TOKEN=your_write_token
WARP10_HTTP_TIMEOUT=5000
WARP10_BASE_CLASS_NAME=fr.slickteam.example
```

## Utilisation

### Import du module

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Warp10Module } from '@slickteam/nestjs-warp10';

@Module({
  imports: [ConfigModule.forRoot(), Warp10Module],
})
export class AppModule {}
```

### Injection du service

```ts
import { Injectable } from '@nestjs/common';
import { DataPoint, GTS, Warp10Service } from '@slickteam/nestjs-warp10';

@Injectable()
export class MyService {
  constructor(private readonly warp10Service: Warp10Service) {}

  // Écrire des données
  async writeData(): Promise<void> {
    const dataPoint: DataPoint = {
      className: 'my.sensor.temperature',
      labels: { location: 'office' },
      value: 23.5,
      timestamp: Date.now() * 1000, // microsecondes
    };

    await this.warp10Service.update(undefined, [dataPoint]);
  }

  // Lire des données
  async readData(): Promise<GTS[]> {
    const result = await this.warp10Service.fetch(
      undefined, // utilise le token par défaut
      '~my.sensor.*', // classe (regex supportée)
      { location: 'office' },
      'now', // début
      -100, // 100 derniers points
    );
    return result.result;
  }

  // Exécuter du WarpScript
  async executeWarpScript(): Promise<any> {
    const script = `
      [ $rt 'my.sensor.temperature' { 'location' 'office' } NOW -100 ] FETCH
    `;
    return this.warp10Service.exec(script, true); // true = injecte les tokens
  }
}
```

## API

### `Warp10Service`

| Méthode                   | Description                                        |
| ------------------------- | -------------------------------------------------- |
| `fetch()`                 | Récupère des GTS depuis Warp 10                    |
| `update()`                | Écrit des DataPoints dans Warp 10                  |
| `delete()`                | Supprime des données sur une plage de temps        |
| `deleteByTimestamp()`     | Supprime des données à un timestamp précis         |
| `meta()`                  | Met à jour les métadonnées des GTS                 |
| `exec()`                  | Exécute du WarpScript                              |
| `execWithGtsListResult()` | Exécute du WarpScript et retourne une liste de GTS |

### Accès direct au client Warp 10

Le client `@senx/warp10` est exposé via `warp10Service.w10` pour les cas d'usage avancés.

## Exports

### Modèles

- `DataPoint` - Point de données à écrire
- `DataPointResult` - Résultat de lecture
- `GTS` - Geo Time Series
- `UpdatedWarp10Result` - Résultat d'une opération d'écriture

### Types (enums WarpScript)

- `BuckertizerWarp10Type` - Fonctions de bucketization (mean, max, min, sum...)
- `MapperWarp10Type` - Fonctions de mapping (abs, delta, rate...)
- `ReducerWarp10Type` - Fonctions de réduction (mean, max, min, sum...)
- `TimeUnits` - Unités de temps (US, MS, NS)

## Dépendances

| Package          | Version    |
| ---------------- | ---------- |
| `@nestjs/common` | `^11.1.12` |
| `@nestjs/config` | `^4.0.2`   |
| `@senx/warp10`   | `^2.0.3`   |

## Licence

[Apache 2.0](LICENSE)

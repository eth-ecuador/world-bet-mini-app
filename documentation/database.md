# Estructura de la Base de Datos - World Bet Mini App

Este documento describe la estructura de la base de datos SQLite utilizada en el backend del proyecto World Bet Mini App, incluyendo las actualizaciones más recientes.

## Diagrama de Entidad-Relación

```
+----------------+       +------------------+       +----------------+
|    SPORTS      |       |   COMPETITIONS   |       |     EVENTS     |
+----------------+       +------------------+       +----------------+
| id (PK)        |       | id (PK)          |       | id (PK)        |
| name           | 1---n | sport_id (FK)    |       | name           |
| active_events  |       | name             |       | sport_type     |
| icon_url       |       | country          |       | competition    |
+----------------+       | active_events    |       | start_time     |
                         | icon_url         |       | end_time       |
                         +------------------+       | venue          |
                                                    | description    |
                                                    | markets (JSON) |
                                                    | teams (JSON)   |
                                                    | status         |
                                                    | image_url      |
                                                    | stats (JSON)   |
                                                    | highlights_url |
                                                    +----------------+
                                                           
+----------------+       +------------------+
|     USERS      |       |       BETS       |
+----------------+       +------------------+
| id (PK)        |       | id (PK)          |
| username       | 1---n | user_id (FK)     |
| password       |       | selection_id     |
+----------------+       | event_name       |
                         | selection_name   |
                         | odds             |
                         | stake_amount     |
                         | currency         |
                         | potential_return |
                         | commission (JSON)|
                         | created_at       |
                         | estimated_time   |
                         | status           |
                         | result           |
                         | used_ai_rec      |
                         +------------------+
```

## Descripción de Tablas

### Sports (Deportes)

Almacena los diferentes deportes disponibles en la plataforma.

| Campo              | Tipo    | Descripción                                   |
|--------------------|---------|-----------------------------------------------|
| id                 | TEXT    | Identificador único del deporte (UUID)        |
| name               | TEXT    | Nombre del deporte (Football, Tennis, etc.)   |
| active_events_count| INTEGER | Cantidad de eventos activos de este deporte   |
| icon_url           | TEXT    | URL del ícono del deporte                     |

### Competitions (Competiciones)

Almacena las competiciones disponibles para cada deporte.

| Campo              | Tipo    | Descripción                                   |
|--------------------|---------|-----------------------------------------------|
| id                 | TEXT    | Identificador único de la competición (UUID)  |
| name               | TEXT    | Nombre de la competición (La Liga, NBA, etc.) |
| sport_id           | TEXT    | ID del deporte al que pertenece (FK)          |
| country            | TEXT    | País o región de la competición               |
| active_events_count| INTEGER | Cantidad de eventos activos en esta competición |
| icon_url           | TEXT    | URL del ícono de la competición               |

### Events (Eventos Deportivos)

Almacena los eventos deportivos disponibles para apostar.

| Campo              | Tipo    | Descripción                                   |
|--------------------|---------|-----------------------------------------------|
| id                 | TEXT    | Identificador único del evento (UUID)         |
| name               | TEXT    | Nombre del evento (Equipo1 vs Equipo2)        |
| sport_type         | TEXT    | Tipo de deporte (football, basketball, etc.)  |
| competition        | TEXT    | Nombre de la competición asociada             |
| start_time         | TEXT    | Fecha y hora de inicio (ISO8601)              |
| end_time           | TEXT    | Fecha y hora de finalización (ISO8601)        |
| venue              | TEXT    | Lugar donde se realiza el evento              |
| description        | TEXT    | Descripción adicional del evento              |
| markets            | TEXT    | Mercados de apuestas en formato JSON          |
| teams              | TEXT    | Información de equipos en formato JSON        |
| status             | TEXT    | Estado del evento (upcoming, live, completed) |
| image_url          | TEXT    | URL de la imagen del evento                   |
| stats              | TEXT    | Estadísticas del evento en formato JSON       |
| highlights_url     | TEXT    | URL de video con highlights del evento        |

#### Estructura del campo `markets` (JSON)

```json
[
  {
    "id": "uuid-string",
    "name": "Match Winner",
    "selections": [
      {
        "id": "uuid-string",
        "name": "Team1",
        "odds": 2.1
      },
      {
        "id": "uuid-string",
        "name": "Draw",
        "odds": 3.5
      },
      {
        "id": "uuid-string",
        "name": "Team2",
        "odds": 3.2
      }
    ]
  }
]
```

#### Estructura del campo `teams` (JSON)

```json
[
  {
    "id": "team1-id-001",
    "name": "Barcelona",
    "logo_url": "/b.png",
    "is_home": true
  },
  {
    "id": "team2-id-001",
    "name": "Real Madrid",
    "logo_url": "/r.png",
    "is_home": false
  }
]
```

#### Estructura del campo `stats` (JSON)

```json
{
  "team1_form": ["W", "W", "L", "D", "W"],
  "team2_form": ["W", "W", "W", "D", "L"],
  "head_to_head": {
    "total_matches": 245,
    "team1_wins": 96,
    "team2_wins": 95,
    "draws": 54
  }
}
```

### Users (Usuarios)

Almacena los datos de usuarios registrados. Para la versión más reciente, se ha simplificado el proceso de autenticación para usar solo direcciones Ethereum.

| Campo              | Tipo    | Descripción                                   |
|--------------------|---------|-----------------------------------------------|
| id                 | TEXT    | Identificador único del usuario (UUID)        |
| username           | TEXT    | Dirección Ethereum del usuario (única)        |
| password           | TEXT    | Campo legacy, ahora se mantiene vacío         |

### Bets (Apuestas)

Almacena las apuestas realizadas por los usuarios.

| Campo              | Tipo    | Descripción                                   |
|--------------------|---------|-----------------------------------------------|
| id                 | TEXT    | Identificador único de la apuesta (UUID)      |
| user_id            | TEXT    | ID del usuario que realizó la apuesta (FK)    |
| selection_id       | TEXT    | ID de la selección apostada                   |
| event_name         | TEXT    | Nombre del evento                             |
| selection_name     | TEXT    | Nombre de la selección (ej. "Barcelona")      |
| odds               | REAL    | Cuota de la apuesta                           |
| stake_amount       | REAL    | Cantidad apostada                             |
| currency           | TEXT    | Moneda de la apuesta (WLD)                    |
| potential_return   | REAL    | Retorno potencial si la apuesta gana          |
| commission         | TEXT    | Comisiones aplicadas (JSON)                   |
| created_at         | TEXT    | Fecha y hora de creación (ISO8601)            |
| estimated_result_time | TEXT | Tiempo estimado del resultado                 |
| status             | TEXT    | Estado de la apuesta (placed, settled, etc.)  |
| result             | TEXT    | Resultado de la apuesta (win, loss, null)     |
| used_ai_recommendation | INTEGER | Si usó recomendación de IA (0 o 1)        |

#### Estructura del campo `commission` (JSON)

```json
{
  "standard": 1.5,
  "ai_premium": 0.5,
  "profit_percentage": 5
}
```

## Inicialización de la Base de Datos

La base de datos se inicializa automáticamente con datos de muestra cuando se ejecuta por primera vez el backend. Incluye:

- 5 deportes diferentes
- 9 competiciones distribuidas entre los deportes
- 10 eventos deportivos con equipos y fechas de inicio/fin
- Datos de usuario demo se crean automáticamente cuando alguien inicia sesión

## Migraciones de Base de Datos

El sistema implementa un proceso de migración para manejar cambios en el esquema de la base de datos:

1. **Migración highlights_url**: Agrega una columna para almacenar URLs de videos con highlights de eventos deportivos.
   - Script: `scripts/add_highlights.py`
   - Esta migración se ejecuta automáticamente al iniciar la aplicación si la base de datos ya existe
   - También incluye datos de ejemplo con enlaces a videos de YouTube para eventos existentes

Para verificar si una migración se ha aplicado, puede usar:

```sql
PRAGMA table_info(events)
```

## Autenticación Simplificada

La versión más reciente de la aplicación utiliza un sistema de autenticación simplificado:

1. El usuario proporciona solo su dirección Ethereum
2. El sistema crea automáticamente un usuario si no existe
3. Se genera un token JWT que se usa para autenticar solicitudes posteriores

Este enfoque facilita la integración con billeteras Web3 y elimina la necesidad de contraseñas.

## Mejoras en Eventos Deportivos

Las actualizaciones recientes incluyen:

1. **Campo teams**: Proporciona información estructurada sobre los equipos participantes
2. **Campo end_time**: Especifica la hora de finalización del evento
3. **Estado 'completed'**: Nuevo estado para eventos finalizados
4. **Campo highlights_url**: Enlaces a videos de highlights para eventos completados

Estos cambios permiten una mejor visualización de eventos, acceso a contenido multimedia y un seguimiento más preciso del ciclo de vida.

## Consultas Comunes

### Obtener Eventos Destacados con Equipos y Highlights
```sql
SELECT id, name, sport_type, competition, start_time, end_time, teams, markets, status, image_url, highlights_url 
FROM events 
WHERE sport_type = ? AND start_time >= ? AND start_time <= ?
ORDER BY start_time ASC
LIMIT ? OFFSET ?
```

### Obtener Evento por ID con Información Completa
```sql
SELECT * FROM events WHERE id = ?
```

### Obtener Apuestas de Usuario por Estado
```sql
SELECT * FROM bets WHERE user_id = ? AND status = ?
ORDER BY created_at DESC
LIMIT ? OFFSET ?
```

### Verificar si un Usuario Existe
```sql
SELECT id FROM users WHERE username = ?
```

## Consideraciones Técnicas

- Los campos JSON (markets, teams, stats, commission) se almacenan como texto y se serializan/deserializan utilizando `json.loads()` y `json.dumps()`.
- Las fechas se almacenan en formato ISO8601 para facilitar el manejo entre diferentes sistemas.
- La base de datos en producción se almacena en un disco persistente en Render.
- Para un entorno de producción a mayor escala, se recomienda:
  - Migrar a una base de datos más robusta como PostgreSQL
  - Implementar una capa de seguridad adicional para la autenticación (como validación de firmas Ethereum)
  - Considerar el uso de índices adicionales para mejorar el rendimiento de consultas frecuentes
  - Implementar un sistema más robusto de migraciones con versiones y comprobación de estado

## Actualizaciones Recientes

1. **Mayo 2025**:
   - Adición del campo `highlights_url` a la tabla `events`
   - Inclusión de enlaces a highlights para eventos existentes
   - Script de migración automática para manejar la transición
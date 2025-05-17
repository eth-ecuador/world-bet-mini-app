# Documentación de la API de World Bet Mini App

## Descripción General

World Bet Mini App es una plataforma de apuestas deportivas simuladas con una API RESTful que proporciona endpoints para acceder a información sobre eventos deportivos y gestionar apuestas. Esta documentación describe cómo interactuar con la API para obtener datos y realizar operaciones.

## URL Base

```
http://localhost:5000
```

## Autenticación

Varios endpoints requieren autenticación mediante tokens JWT (JSON Web Tokens).

Para los endpoints autenticados:
1. Obtén un token mediante el endpoint `/auth/login` (usando método POST)
2. Incluye el token en las cabeceras de la solicitud:
   ```
   Authorization: Bearer {token}
   ```

## Endpoints

### Información General

#### Verificar Estado de la API
```
GET /
```
**Respuesta (200 OK)**:
```json
{
  "message": "World Bet Mini App API",
  "status": "running",
  "available_endpoints": [
    "/events/featured",
    "/events/{event_id}",
    "/sports",
    "/competitions",
    "/bets (requires auth)",
    "/auth/login",
    "/auth/logout"
  ]
}
```

### Autenticación

#### Iniciar Sesión
```
POST /auth/login
```

**⚠️ IMPORTANTE**: Este endpoint solo acepta solicitudes POST, no GET.

**Cuerpo de la solicitud (JSON)**:
```json
{
  "username": "demouser",
  "password": "password123"
}
```

**Ejemplo de cURL**:
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"demouser","password":"password123"}' \
  http://localhost:5000/auth/login
```

**Respuesta (200 OK)**:
```json
{
  "session_id": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": "user1",
  "expires": "in 24 hours"
}
```

#### Cerrar Sesión
```
POST /auth/logout
```

**⚠️ IMPORTANTE**: Este endpoint también solo acepta solicitudes POST.

**Cabeceras**:
```
Authorization: Bearer {token}
```

**Respuesta (200 OK)**:
```json
{
  "message": "Successfully logged out"
}
```

### Eventos Deportivos

#### Listar Eventos Destacados
```
GET /events/featured
```

**Parámetros de consulta**:
- `sport_type` (opcional): Filtrar por tipo de deporte (ej. "football", "basketball")
- `date_from` (opcional): Fecha mínima (YYYY-MM-DD)
- `date_to` (opcional): Fecha máxima (YYYY-MM-DD)
- `limit` (opcional): Número máximo de resultados (predeterminado: 10)
- `page` (opcional): Número de página para paginación (predeterminado: 1)

**Ejemplo de cURL**:
```bash
curl -X GET "http://localhost:5000/events/featured?sport_type=football&limit=5"
```

**Respuesta (200 OK)**:
```json
{
  "events": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Barcelona vs Real Madrid",
      "sport_type": "football",
      "competition": "La Liga",
      "start_time": "2025-05-18T16:00:00",
      "main_markets": [
        {
          "id": "38fe3c80-1651-4d44-8e01-761a44833701",
          "name": "Match Winner",
          "selections": [
            {
              "id": "9a4d5622-7044-4a9a-b853-4efecfc7a8d9",
              "name": "Barcelona",
              "odds": 2.1
            },
            {
              "id": "23cd8b9a-eb69-414c-8171-9cacbad4db84",
              "name": "Draw",
              "odds": 3.5
            },
            {
              "id": "af1a2466-7bed-442c-a5f1-9cda1879fd23",
              "name": "Real Madrid",
              "odds": 3.2
            }
          ]
        }
      ],
      "status": "upcoming",
      "image_url": "https://www.shutterstock.com/image-photo/barcelona-vs-real-madrid-3d-260nw-2617044757.jpg"
    },
    // Más eventos...
  ],
  "total_count": 10,
  "page": 1
}
```

#### Obtener Evento por ID
```
GET /events/{event_id}
```

**Ejemplo de cURL**:
```bash
curl -X GET "http://localhost:5000/events/4f4e8e74-977a-4855-a201-5ebf676f807f"
```

**Respuesta (200 OK)**:
```json
{
  "id": "4f4e8e74-977a-4855-a201-5ebf676f807f",
  "name": "Ferrari vs Red Bull Racing",
  "sport_type": "motorsport",
  "competition": "Formula 1",
  "start_time": "2025-05-18T13:00:00",
  "venue": "Circuit de Monaco, Monte Carlo",
  "description": "Monaco Grand Prix",
  "markets": [
    {
      "id": "db96f8b1-6b11-44a1-a142-a790fa2e6f00",
      "name": "Race Winner",
      "selections": [
        {
          "id": "8c7f4994-36d6-4922-9ba6-d2fbeaaafd9f",
          "name": "Leclerc (Ferrari)",
          "odds": 2.5
        },
        {
          "id": "423b66f4-8fff-4f64-9a5e-ba73a4d5d80d",
          "name": "Verstappen (Red Bull)",
          "odds": 1.8
        },
        {
          "id": "4abcb650-2528-4ccc-9bfc-d1f35a2c3e7d",
          "name": "Hamilton (Mercedes)",
          "odds": 4.2
        }
      ]
    }
  ],
  "status": "upcoming",
  "image_url": "https://mir-s3-cdn-cf.behance.net/project_modules/fs/c39372105002709.5f6f665700bd5.jpg",
  "stats": {
    "team1_form": ["1", "3", "2", "1", "2"],
    "team2_form": ["2", "1", "1", "2", "1"],
    "head_to_head": {
      "total_matches": 23,
      "team1_wins": 9,
      "team2_wins": 14,
      "draws": 0
    }
  }
}
```

### Deportes y Competiciones

#### Listar Deportes
```
GET /sports
```

**Respuesta (200 OK)**:
```json
{
  "sports": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Football",
      "active_events_count": 120,
      "icon_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Football_in_Bloomington%2C_Indiana%2C_1995.jpg/500px-Football_in_Bloomington%2C_Indiana%2C_1995.jpg"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Basketball",
      "active_events_count": 80,
      "icon_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Kent_Benson_attempts_a_hook_shot_over_Ken_Ferdinand.jpg/500px-Kent_Benson_attempts_a_hook_shot_over_Ken_Ferdinand.jpg"
    },
    // Más deportes...
  ]
}
```

#### Listar Competiciones
```
GET /competitions
```

**Parámetros de consulta**:
- `sport_id` (opcional): Filtrar por ID de deporte

**Respuesta (200 OK)**:
```json
{
  "competitions": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "name": "La Liga",
      "sport_id": "550e8400-e29b-41d4-a716-446655440001",
      "country": "Spain",
      "active_events_count": 10,
      "icon_url": "https://w7.pngwing.com/pngs/740/650/png-transparent-spain-2011-12-la-liga-2017-18-la-liga-2014-15-la-liga-atletico-madrid-premier-league-sport-sports-liga-thumbnail.png"
    },
    // Más competiciones...
  ]
}
```

### Apuestas

#### Crear Apuesta (requiere autenticación)
```
POST /bets
```

**Cabeceras**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Cuerpo de la solicitud (JSON)**:
```json
{
  "selection_id": "8c7f4994-36d6-4922-9ba6-d2fbeaaafd9f",
  "stake_amount": 50,
  "currency": "WLD",
  "use_ai_recommendation": true
}
```

**Ejemplo de cURL**:
```bash
curl -X POST \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "selection_id": "8c7f4994-36d6-4922-9ba6-d2fbeaaafd9f",
    "stake_amount": 50,
    "currency": "WLD",
    "use_ai_recommendation": true
  }' \
  http://localhost:5000/bets
```

**Respuesta (201 Created)**:
```json
{
  "id": "a2f44039-ca1a-4d9a-bb86-9292467a51f6",
  "status": "placed",
  "selection_id": "8c7f4994-36d6-4922-9ba6-d2fbeaaafd9f",
  "event_name": "Ferrari vs Red Bull Racing",
  "selection_name": "Leclerc (Ferrari)",
  "odds": 2.5,
  "stake_amount": 50.0,
  "currency": "WLD",
  "potential_return": 125.0,
  "commission": {
    "standard": 1.5,
    "ai_premium": 0.5,
    "profit_percentage": 5
  },
  "created_at": "2025-05-17T13:39:22.116210",
  "estimated_result_time": "2025-05-18T13:00:00",
  "result": null,
  "used_ai_recommendation": 1,
  "user_id": "user1"
}
```

#### Listar Apuestas del Usuario (requiere autenticación)
```
GET /bets
```

**Cabeceras**:
```
Authorization: Bearer {token}
```

**Parámetros de consulta**:
- `status` (opcional): Filtrar por estado (active, settled, all)
- `limit` (opcional): Número máximo de resultados (predeterminado: 10)
- `page` (opcional): Número de página para paginación (predeterminado: 1)

**Ejemplo de cURL**:
```bash
curl -X GET \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:5000/bets
```

**Respuesta (200 OK)**:
```json
{
  "bets": [
    {
      "bet_id": "a2f44039-ca1a-4d9a-bb86-9292467a51f6",
      "event_name": "Ferrari vs Red Bull Racing",
      "selection_name": "Leclerc (Ferrari)",
      "odds": 2.5,
      "stake_amount": 50.0,
      "currency": "WLD",
      "potential_return": 125.0,
      "status": "placed",
      "placed_at": "2025-05-17T13:39:22.116210",
      "result": null,
      "used_ai_recommendation": true
    }
  ],
  "total_count": 1,
  "page": 1
}
```

#### Obtener Detalles de Apuesta
```
GET /bets/{bet_id}
```

**Cabeceras**:
```
Authorization: Bearer {token}
```

**Ejemplo de cURL**:
```bash
curl -X GET \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:5000/bets/a2f44039-ca1a-4d9a-bb86-9292467a51f6
```

**Respuesta (200 OK)**:
```json
{
  "id": "a2f44039-ca1a-4d9a-bb86-9292467a51f6",
  "user_id": "user1",
  "selection_id": "8c7f4994-36d6-4922-9ba6-d2fbeaaafd9f",
  "event_name": "Ferrari vs Red Bull Racing",
  "selection_name": "Leclerc (Ferrari)",
  "odds": 2.5,
  "stake_amount": 50.0,
  "currency": "WLD",
  "potential_return": 125.0,
  "commission": {
    "standard": 1.5,
    "ai_premium": 0.5,
    "profit_percentage": 5
  },
  "created_at": "2025-05-17T13:39:22.116210",
  "estimated_result_time": "2025-05-18T13:00:00",
  "status": "placed",
  "result": null,
  "used_ai_recommendation": 1
}
```

#### Liquidar Apuesta Manualmente
```
POST /bets/{bet_id}/settle
```

**Cabeceras**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Cuerpo de la solicitud (JSON)**:
```json
{
  "outcome": "win"  // Valores posibles: "win", "loss", "void", "half_win", "half_loss"
}
```

**Ejemplo de cURL**:
```bash
curl -X POST \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"outcome": "win"}' \
  http://localhost:5000/bets/a2f44039-ca1a-4d9a-bb86-9292467a51f6/settle
```

**Respuesta (200 OK)**:
```json
{
  "id": "a2f44039-ca1a-4d9a-bb86-9292467a51f6",
  "status": "settled",
  "result": "win",
  // otros campos de la apuesta...
}
```

#### Obtener Estadísticas de Apuestas
```
GET /bets/stats
```

**Cabeceras**:
```
Authorization: Bearer {token}
```

**Ejemplo de cURL**:
```bash
curl -X GET \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:5000/bets/stats
```

**Respuesta (200 OK)**:
```json
{
  "user_id": "user1",
  "betting_stats": {
    "total_bets": 1,
    "win_count": 1,
    "loss_count": 0,
    "win_rate": 100.0,
    "total_staked": 50.0,
    "total_returned": 125.0,
    "total_profit": 75.0,
    "roi": 150.0
  }
}
```

### Simulación (para pruebas y demostración)

Los siguientes endpoints permiten simular el ciclo de vida de eventos y apuestas, pero están sujetos a las restricciones temporales basadas en las fechas de inicio programadas para los eventos.

#### Actualizar Estados de Eventos
```
POST /simulation/update-events
```

**Cabeceras**:
```
Authorization: Bearer {token}
```

**Ejemplo de cURL**:
```bash
curl -X POST \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:5000/simulation/update-events
```

**Respuesta (200 OK)**:
```json
{
  "message": "Events status updated",
  "live_updated": 0,
  "completed_updated": 0
}
```

#### Simular Resultados de Eventos
```
POST /simulation/simulate-results
```

**Cabeceras**:
```
Authorization: Bearer {token}
```

**Ejemplo de cURL**:
```bash
curl -X POST \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:5000/simulation/simulate-results
```

**Respuesta (200 OK)**:
```json
{
  "message": "0 events simulated",
  "simulated_count": 0
}
```

#### Liquidar Apuestas Automáticamente
```
POST /simulation/settle-bets
```

**Cabeceras**:
```
Authorization: Bearer {token}
```

**Ejemplo de cURL**:
```bash
curl -X POST \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:5000/simulation/settle-bets
```

**Respuesta (200 OK)**:
```json
{
  "message": "0 bets settled",
  "settled_count": 0
}
```

#### Ejecutar Ciclo Completo de Simulación
```
POST /simulation/run-simulation-cycle
```

**Cabeceras**:
```
Authorization: Bearer {token}
```

**Ejemplo de cURL**:
```bash
curl -X POST \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:5000/simulation/run-simulation-cycle
```

**Respuesta (200 OK)**:
```json
{
  "message": "Simulation cycle completed",
  "events_updated": {
    "live": 0,
    "completed": 0
  },
  "events_simulated": 0,
  "bets_settled": 0
}
```

## Notas sobre la Simulación

Los endpoints de simulación funcionan según las fechas programadas de los eventos:

1. `/simulation/update-events`: Actualiza a "live" los eventos cuya fecha de inicio ya pasó pero aún no han terminado, y a "completed" los eventos que ya deberían haber terminado.

2. `/simulation/simulate-results`: Genera resultados aleatorios para eventos marcados como "completed".

3. `/simulation/settle-bets`: Liquida automáticamente las apuestas basándose en los resultados simulados.

Para ver todo el ciclo de vida de eventos y apuestas:
- Esperar a que los eventos lleguen a sus fechas programadas, o
- Usar el endpoint `/bets/{bet_id}/settle` para liquidar manualmente apuestas específicas

## Códigos de Estado HTTP

La API utiliza los siguientes códigos de estado HTTP:

- `200 OK`: La solicitud se ha completado correctamente
- `201 Created`: El recurso se ha creado correctamente (usado para crear apuestas)
- `400 Bad Request`: La solicitud contiene datos inválidos o faltantes
- `401 Unauthorized`: Autenticación requerida o credenciales inválidas
- `403 Forbidden`: No tienes permisos para acceder a este recurso
- `404 Not Found`: El recurso solicitado no existe
- `405 Method Not Allowed`: El método HTTP no está permitido para el endpoint (por ejemplo, usar GET en lugar de POST)
- `500 Internal Server Error`: Error interno del servidor

## Ejemplos con Axios (JavaScript)

Para integrar la API en una aplicación frontend con Axios, puedes usar los siguientes ejemplos:

### Configuración inicial

```javascript
import axios from 'axios';

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir automáticamente token de autenticación
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Autenticación

```javascript
// Iniciar sesión
const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', {
      username: username,
      password: password
    });
    
    // Guardar token en localStorage
    localStorage.setItem('authToken', response.data.session_id);
    return response.data;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

// Cerrar sesión
const logout = async () => {
  try {
    await api.post('/auth/logout');
    localStorage.removeItem('authToken');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};
```

### Obtener eventos deportivos

```javascript
// Listar eventos destacados
const getFeaturedEvents = async (sportType = null, limit = 10) => {
  try {
    const params = {};
    if (sportType) params.sport_type = sportType;
    if (limit) params.limit = limit;
    
    const response = await api.get('/events/featured', { params });
    return response.data;
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    throw error;
  }
};

// Obtener detalles de un evento
const getEventDetails = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener evento ${eventId}:`, error);
    throw error;
  }
};
```

### Gestionar apuestas

```javascript
// Crear una apuesta
const placeBet = async (selectionId, stakeAmount, currency = 'WLD', useAiRecommendation = false) => {
  try {
    const response = await api.post('/bets', {
      selection_id: selectionId,
      stake_amount: stakeAmount,
      currency: currency,
      use_ai_recommendation: useAiRecommendation
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear apuesta:', error);
    throw error;
  }
};

// Obtener apuestas del usuario
const getUserBets = async (status = 'all', limit = 10, page = 1) => {
  try {
    const params = { status, limit, page };
    const response = await api.get('/bets', { params });
    return response.data;
  } catch (error) {
    console.error('Error al obtener apuestas:', error);
    throw error;
  }
};

// Liquidar apuesta manualmente
const settleBet = async (betId, outcome) => {
  try {
    const response = await api.post(`/bets/${betId}/settle`, { outcome });
    return response.data;
  } catch (error) {
    console.error(`Error al liquidar apuesta ${betId}:`, error);
    throw error;
  }
};

// Obtener estadísticas de apuestas
const getBettingStats = async () => {
  try {
    const response = await api.get('/bets/stats');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};
```

### Simulación (para desarrollo y pruebas)

```javascript
// Ejecutar ciclo completo de simulación
const runSimulationCycle = async () => {
  try {
    const response = await api.post('/simulation/run-simulation-cycle');
    return response.data;
  } catch (error) {
    console.error('Error al ejecutar simulación:', error);
    throw error;
  }
};
```

### Ejemplo de uso completo

```javascript
// Flujo completo de una apuesta
const completeBettingFlow = async () => {
  try {
    // 1. Login
    await login('demouser', 'password123');
    console.log('✅ Sesión iniciada');
    
    // 2. Obtener eventos
    const eventsResponse = await getFeaturedEvents('football', 5);
    const firstEvent = eventsResponse.events[0];
    console.log(`✅ Eventos obtenidos: ${eventsResponse.events.length}`);
    
    // 3. Ver detalles del evento
    const eventDetails = await getEventDetails(firstEvent.id);
    console.log(`✅ Detalles del evento: ${eventDetails.name}`);
    
    // 4. Obtener selección para apostar
    const selectionId = eventDetails.markets[0].selections[0].id;
    
    // 5. Realizar apuesta
    const bet = await placeBet(selectionId, 50, 'WLD', true);
    console.log(`✅ Apuesta realizada: ${bet.id}`);
    
    // 6. Liquidar apuesta manualmente
    const settledBet = await settleBet(bet.id, 'win');
    console.log(`✅ Apuesta liquidada: ${settledBet.status} - ${settledBet.result}`);
    
    // 7. Ver estadísticas
    const stats = await getBettingStats();
    console.log(`✅ Estadísticas: ${stats.betting_stats.win_count} ganadas, ROI: ${stats.betting_stats.roi}%`);
    
    return {
      bet: settledBet,
      stats: stats
    };
  } catch (error) {
    console.error('Error en el flujo de apuestas:', error);
    throw error;
  }
};
```

## Flujo Completo de Pruebas

Para probar un ciclo completo de apuestas:

1. Autenticarse y obtener un token JWT
2. Explorar eventos disponibles
3. Realizar una apuesta en un evento
4. Liquidar manualmente la apuesta o esperar a la simulación automática
5. Consultar estadísticas de apuestas

### Ejemplo con cURL

```bash
# 1. Autenticarse
curl -X POST -H "Content-Type: application/json" -d '{"username":"demouser","password":"password123"}' http://localhost:5000/auth/login

# 2. Obtener eventos destacados
curl -X GET http://localhost:5000/events/featured

# 3. Ver detalles de un evento
curl -X GET http://localhost:5000/events/4f4e8e74-977a-4855-a201-5ebf676f807f

# 4. Realizar una apuesta (guarda el ID de la apuesta de la respuesta)
curl -X POST -H "Authorization: Bearer {TOKEN}" -H "Content-Type: application/json" -d '{"selection_id":"8c7f4994-36d6-4922-9ba6-d2fbeaaafd9f","stake_amount":50,"currency":"WLD","use_ai_recommendation":true}' http://localhost:5000/bets

# 5. Liquidar la apuesta manualmente
curl -X POST -H "Authorization: Bearer {TOKEN}" -H "Content-Type: application/json" -d '{"outcome":"win"}' http://localhost:5000/bets/{BET_ID}/settle

# 6. Ver estadísticas de apuestas
curl -X GET -H "Authorization: Bearer {TOKEN}" http://localhost:5000/bets/stats
```

## Consideraciones para Desarrollo

- La API incluye CORS habilitado, lo que permite solicitudes desde diferentes orígenes.
- Los tokens JWT caducan después de 24 horas.
- La simulación de eventos y resultados está basada en fechas, por lo que puede ser necesario ajustar las fechas o usar la liquidación manual para pruebas.

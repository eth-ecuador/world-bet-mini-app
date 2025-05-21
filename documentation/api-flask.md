# Documentación de World Bet Mini App API

## Descripción General

World Bet Mini App ofrece una API RESTful para gestionar apuestas deportivas simuladas. Esta documentación describe los endpoints disponibles, sus parámetros y respuestas, así como ejemplos de uso.

## URL Base de Producción

```
https://world-bet-mini-app.onrender.com
```

## Autenticación

La API utiliza autenticación basada en tokens JWT. Para los endpoints protegidos, necesitas incluir el token en el encabezado de la solicitud:

```
Authorization: Bearer {token}
```

Para obtener un token, debes autenticarte con tu dirección Ethereum.

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
  "version": "1.0.0",
  "environment": "production",
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

#### Iniciar Sesión / Registro Automático
```
POST /auth/login
```

La API permite autenticarse solo con una dirección Ethereum, creando automáticamente una cuenta si no existe.

**Cuerpo de la solicitud**:
```json
{
  "username": "0xYourEthereumAddress"
}
```

**Ejemplo de cURL**:
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"0xdF9D35B1981C8151fbdA6b32254F315DF3AFa7b8"}' \
  https://world-bet-mini-app.onrender.com/auth/login
```

**Respuesta (200 OK)**:
```json
{
  "session_id": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "0xdF9D35B1981C8151fbdA6b32254F315DF3AFa7b8",
  "expires": "in 24 hours"
}
```

#### Cerrar Sesión
```
POST /auth/logout
```

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

**Parámetros de consulta (opcionales)**:
- `sport_type` - Filtrar por tipo de deporte (ej. "football", "basketball")
- `date_from` - Fecha mínima en formato YYYY-MM-DD
- `date_to` - Fecha máxima en formato YYYY-MM-DD
- `limit` - Número máximo de resultados (predeterminado: 10)
- `page` - Número de página para paginación (predeterminado: 1)

**Ejemplo de cURL**:
```bash
curl -X GET "https://world-bet-mini-app.onrender.com/events/featured?sport_type=football&limit=5"
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
      "end_time": "2025-05-18T18:00:00",
      "teams": [
        {
          "id": "fc-barcelona-001",
          "name": "Barcelona",
          "logo_url": "/b.png",
          "is_home": true
        },
        {
          "id": "real-madrid-001",
          "name": "Real Madrid",
          "logo_url": "/r.png",
          "is_home": false
        }
      ],
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
  "total_count": 42,
  "page": 1
}
```

#### Obtener Evento por ID
```
GET /events/{event_id}
```

**Ejemplo de cURL**:
```bash
curl -X GET "https://world-bet-mini-app.onrender.com/events/550e8400-e29b-41d4-a716-446655440000"
```

**Respuesta (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Barcelona vs Real Madrid",
  "sport_type": "football",
  "competition": "La Liga",
  "start_time": "2025-05-18T16:00:00",
  "end_time": "2025-05-18T18:00:00",
  "venue": "Camp Nou, Barcelona",
  "description": "El Clásico - Round 25",
  "teams": [
    {
      "id": "fc-barcelona-001",
      "name": "Barcelona",
      "logo_url": "/b.png",
      "is_home": true
    },
    {
      "id": "real-madrid-001",
      "name": "Real Madrid",
      "logo_url": "/r.png",
      "is_home": false
    }
  ],
  "markets": [
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
    },
    {
      "id": "65fe21c9-32db-4a89-a01e-782712a45600",
      "name": "Both Teams to Score",
      "selections": [
        {
          "id": "71a34f2e-c89d-4f1a-8c1d-68a811e7f211",
          "name": "Yes",
          "odds": 1.7
        },
        {
          "id": "9c31b48f-73c2-48c7-8bfa-e77e4a82c5f6",
          "name": "No",
          "odds": 2.1
        }
      ]
    }
  ],
  "status": "upcoming",
  "image_url": "https://www.shutterstock.com/image-photo/barcelona-vs-real-madrid-3d-260nw-2617044757.jpg",
  "stats": {
    "team1_form": ["W", "W", "L", "D", "W"],
    "team2_form": ["W", "W", "W", "D", "L"],
    "head_to_head": {
      "total_matches": 245,
      "team1_wins": 96,
      "team2_wins": 95,
      "draws": 54
    }
  },
  "highlights_url": "https://www.youtube.com/watch?v=0c8RD3fd9hc"
}
```

#### Eventos Por Deporte
```
GET /events/featured?sport_type={sport_type}
```

**Ejemplo de cURL**:
```bash
curl -X GET "https://world-bet-mini-app.onrender.com/events/featured?sport_type=basketball"
```

### Deportes y Competiciones

#### Listar Deportes Disponibles
```
GET /sports
```

**Ejemplo de cURL**:
```bash
curl -X GET "https://world-bet-mini-app.onrender.com/sports"
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

**Parámetros de consulta (opcionales)**:
- `sport_id` - Filtrar por ID de deporte

**Ejemplo de cURL**:
```bash
curl -X GET "https://world-bet-mini-app.onrender.com/competitions?sport_id=550e8400-e29b-41d4-a716-446655440001"
```

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

**Cuerpo de la solicitud**:
```json
{
  "selection_id": "9a4d5622-7044-4a9a-b853-4efecfc7a8d9",
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
    "selection_id": "9a4d5622-7044-4a9a-b853-4efecfc7a8d9",
    "stake_amount": 50,
    "currency": "WLD",
    "use_ai_recommendation": true
  }' \
  https://world-bet-mini-app.onrender.com/bets
```

**Respuesta (201 Created)**:
```json
{
  "id": "a2f44039-ca1a-4d9a-bb86-9292467a51f6",
  "status": "placed",
  "selection_id": "9a4d5622-7044-4a9a-b853-4efecfc7a8d9",
  "event_name": "Barcelona vs Real Madrid",
  "selection_name": "Barcelona",
  "odds": 2.1,
  "stake_amount": 50,
  "currency": "WLD",
  "potential_return": 105,
  "commission": {
    "standard": 1.5,
    "ai_premium": 0.5,
    "profit_percentage": 5
  },
  "created_at": "2025-05-17T13:39:22.116210",
  "estimated_result_time": "2025-05-18T16:00:00",
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

**Parámetros de consulta (opcionales)**:
- `status` - Filtrar por estado (active, settled, all)
- `limit` - Número máximo de resultados (predeterminado: 10)
- `page` - Número de página para paginación (predeterminado: 1)

**Ejemplo de cURL**:
```bash
curl -X GET \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  "https://world-bet-mini-app.onrender.com/bets"
```

**Respuesta (200 OK)**:
```json
{
  "bets": [
    {
      "bet_id": "a2f44039-ca1a-4d9a-bb86-9292467a51f6",
      "event_name": "Barcelona vs Real Madrid",
      "selection_name": "Barcelona",
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

#### Obtener Detalles de Apuesta (requiere autenticación)
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
  "https://world-bet-mini-app.onrender.com/bets/a2f44039-ca1a-4d9a-bb86-9292467a51f6"
```

**Respuesta (200 OK)**:
```json
{
  "id": "a2f44039-ca1a-4d9a-bb86-9292467a51f6",
  "user_id": "user1",
  "selection_id": "9a4d5622-7044-4a9a-b853-4efecfc7a8d9",
  "event_name": "Barcelona vs Real Madrid",
  "selection_name": "Barcelona",
  "odds": 2.1,
  "stake_amount": 50.0,
  "currency": "WLD",
  "potential_return": 105.0,
  "commission": {
    "standard": 1.5,
    "ai_premium": 0.5,
    "profit_percentage": 5
  },
  "created_at": "2025-05-17T13:39:22.116210",
  "estimated_result_time": "2025-05-18T16:00:00",
  "status": "placed",
  "result": null,
  "used_ai_recommendation": 1
}
```

#### Liquidar Apuesta Manualmente (requiere autenticación)
```
POST /bets/{bet_id}/settle
```

**Cabeceras**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Cuerpo de la solicitud**:
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
  "https://world-bet-mini-app.onrender.com/bets/a2f44039-ca1a-4d9a-bb86-9292467a51f6/settle"
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

#### Obtener Estadísticas de Apuestas (requiere autenticación)
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
  "https://world-bet-mini-app.onrender.com/bets/stats"
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

#### Ver Apuestas Activas (requiere autenticación)
```
GET /bets/active
```

**Cabeceras**:
```
Authorization: Bearer {token}
```

**Ejemplo de cURL**:
```bash
curl -X GET \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  "https://world-bet-mini-app.onrender.com/bets/active"
```

**Respuesta (200 OK)**:
Similar a GET /bets pero solo muestra apuestas con status="placed"

#### Ver Historial de Apuestas (requiere autenticación)
```
GET /bets/history
```

**Cabeceras**:
```
Authorization: Bearer {token}
```

**Ejemplo de cURL**:
```bash
curl -X GET \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  "https://world-bet-mini-app.onrender.com/bets/history"
```

**Respuesta (200 OK)**:
Similar a GET /bets pero solo muestra apuestas con status="settled"

### Simulación (para pruebas)

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
  "https://world-bet-mini-app.onrender.com/simulation/run-simulation-cycle"
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

## Ejemplos con Axios (JavaScript)

### Configuración Inicial

```javascript
import axios from 'axios';

const API_URL = 'https://world-bet-mini-app.onrender.com';

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir el token de autenticación
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
// Iniciar sesión con dirección Ethereum
const login = async (ethAddress) => {
  try {
    const response = await api.post('/auth/login', {
      username: ethAddress
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

### Obtener Eventos

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

### Gestión de Apuestas

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

## Códigos de Estado HTTP

La API utiliza los siguientes códigos de estado HTTP:

- `200 OK`: La solicitud se ha completado correctamente
- `201 Created`: El recurso se ha creado correctamente (usado para crear apuestas)
- `400 Bad Request`: La solicitud contiene datos inválidos o faltantes
- `401 Unauthorized`: Autenticación requerida o credenciales inválidas
- `403 Forbidden`: No tienes permisos para acceder a este recurso
- `404 Not Found`: El recurso solicitado no existe
- `405 Method Not Allowed`: El método HTTP no está permitido para el endpoint
- `500 Internal Server Error`: Error interno del servidor

## Consideraciones Importantes

1. **Autenticación**: Todas las solicitudes a endpoints protegidos deben incluir el token JWT en el encabezado.
2. **Direcciones Ethereum**: La API acepta cualquier dirección Ethereum válida como nombre de usuario.
3. **Entorno de Producción**: La API está desplegada en Render, y podría experimentar retrasos iniciales si el servicio ha estado inactivo.
4. **Datos Simulados**: Los eventos y resultados son simulados, no reflejan eventos deportivos reales.
5. **Simulación de Tiempo**: La simulación está basada en las fechas de los eventos, por lo que puedes necesitar usar las funciones de liquidación manual para probar el flujo completo.

## Soporte y Contacto

Para soporte técnico o preguntas sobre la API, contacta a:

- Equipo de Desarrollo: eth-ecuador@example.com
- Repositorio del Proyecto: [GitHub](https://github.com/eth-ecuador/world-bet-mini-app)

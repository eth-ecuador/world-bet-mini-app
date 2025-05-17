# Documentación de la API de World Bet Mini App

## Descripción General

La API de World Bet Mini App proporciona endpoints para acceder a información sobre eventos deportivos y gestionar apuestas. Esta documentación describe cómo el frontend puede interactuar con estos endpoints para obtener datos y realizar operaciones.

## URL Base

```
http://localhost:5000
```

## Autenticación

Varios endpoints requieren autenticación. La API utiliza autenticación basada en tokens JWT (JSON Web Tokens).

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

**Ejemplo de solicitud**:
```
GET /events/featured?sport_type=football&limit=5
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

**Ejemplo de solicitud**:
```
GET /events/550e8400-e29b-41d4-a716-446655440000
```

**Respuesta (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Barcelona vs Real Madrid",
  "sport_type": "football",
  "competition": "La Liga",
  "start_time": "2025-05-18T16:00:00",
  "venue": "Camp Nou, Barcelona",
  "description": "El Clásico - Round 25",
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
  }
}
```

**Respuesta de error (404 Not Found)**:
```json
{
  "message": "Event not found"
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

**Ejemplo de solicitud**:
```
GET /competitions?sport_id=550e8400-e29b-41d4-a716-446655440001
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
    {
      "id": "550e8400-e29b-41d4-a716-446655440011",
      "name": "Premier League",
      "sport_id": "550e8400-e29b-41d4-a716-446655440001",
      "country": "England",
      "active_events_count": 12,
      "icon_url": "https://static.vecteezy.com/system/resources/thumbnails/010/994/451/small/premier-league-logo-symbol-with-name-design-england-football-european-countries-football-teams-illustration-with-purple-background-free-vector.jpg"
    },
    // Más competiciones...
  ]
}
```

### Autenticación

#### Iniciar Sesión
```
POST /auth/login
```

**⚠️ IMPORTANTE**: Este endpoint solo acepta solicitudes POST, no GET. Si intentas acceder a esta URL directamente desde el navegador (método GET), recibirás un error "Method Not Allowed".

**Cuerpo de la solicitud (JSON)**:
```json
{
  "username": "demouser",
  "password": "password123"
}
```

**Respuesta (200 OK)**:
```json
{
  "session_id": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": "user1",
  "expires": "in 24 hours"
}
```

**Respuesta de error (401 Unauthorized)**:
```json
{
  "message": "Invalid credentials"
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
  "selection_id": "9a4d5622-7044-4a9a-b853-4efecfc7a8d9",
  "stake_amount": 50,
  "currency": "WLD",
  "use_ai_recommendation": true
}
```

**Respuesta (201 Created)**:
```json
{
  "bet_id": "550e8400-e29b-41d4-a716-446655440020",
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
  "created_at": "2025-05-17T10:30:00",
  "estimated_result_time": "2025-05-18T16:00:00"
}
```

**Respuesta de error (400 Bad Request)**:
```json
{
  "message": "Missing required field: selection_id"
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

**Ejemplo de solicitud**:
```
GET /bets?status=active&limit=5
```

**Respuesta (200 OK)**:
```json
{
  "bets": [
    {
      "bet_id": "550e8400-e29b-41d4-a716-446655440020",
      "event_name": "Barcelona vs Real Madrid",
      "selection_name": "Barcelona",
      "odds": 2.1,
      "stake_amount": 50,
      "currency": "WLD",
      "potential_return": 105,
      "status": "active",
      "placed_at": "2025-05-17T10:30:00",
      "result": null,
      "used_ai_recommendation": true
    },
    // Más apuestas...
  ],
  "total_count": 5,
  "page": 1
}
```

## Códigos de Estado HTTP

La API utiliza los siguientes códigos de estado HTTP:

- `200 OK`: La solicitud se ha completado correctamente
- `201 Created`: El recurso se ha creado correctamente (usado para crear apuestas)
- `400 Bad Request`: La solicitud contiene datos inválidos o faltantes
- `401 Unauthorized`: Autenticación requerida o credenciales inválidas
- `404 Not Found`: El recurso solicitado no existe
- `405 Method Not Allowed`: El método HTTP no está permitido para el endpoint (por ejemplo, usar GET en lugar de POST)
- `500 Internal Server Error`: Error interno del servidor

## Integración con el Frontend

### Ejemplos de Uso con Axios

Primero, instala Axios:
```bash
npm install axios
# o con yarn
yarn add axios
```

#### Configuración Básica
```javascript
import axios from 'axios';

// Crear una instancia de Axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir el token de autenticación a las solicitudes
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### Obtener Eventos Destacados
```javascript
// Método simple
axios.get('http://localhost:5000/events/featured?sport_type=football&limit=5')
  .then(response => {
    console.log(response.data.events);
    // Renderizar los eventos en la interfaz de usuario
  })
  .catch(error => console.error('Error:', error));

// Usando la instancia configurada
api.get('/events/featured', {
  params: {
    sport_type: 'football',
    limit: 5
  }
})
  .then(response => {
    console.log(response.data.events);
    // Renderizar los eventos en la interfaz de usuario
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

#### Obtener un Evento Específico
```javascript
const eventId = '550e8400-e29b-41d4-a716-446655440000';

api.get(`/events/${eventId}`)
  .then(response => {
    console.log(response.data);
    // Mostrar detalles del evento
  })
  .catch(error => {
    if (error.response && error.response.status === 404) {
      console.error('Evento no encontrado');
    } else {
      console.error('Error:', error);
    }
  });
```

#### Iniciar Sesión
```javascript
api.post('/auth/login', {
  username: 'demouser',
  password: 'password123'
})
  .then(response => {
    // Guardar el token en localStorage o sessionStorage
    localStorage.setItem('authToken', response.data.session_id);
    console.log('Login successful:', response.data);
  })
  .catch(error => {
    if (error.response && error.response.status === 401) {
      console.error('Credenciales inválidas');
    } else {
      console.error('Error en el inicio de sesión:', error);
    }
  });
```

#### Crear una Apuesta
```javascript
api.post('/bets', {
  selection_id: '9a4d5622-7044-4a9a-b853-4efecfc7a8d9',
  stake_amount: 50,
  currency: 'WLD',
  use_ai_recommendation: true
})
  .then(response => {
    console.log('Bet placed:', response.data);
    // Mostrar confirmación de apuesta
  })
  .catch(error => {
    if (error.response) {
      console.error('Error en la apuesta:', error.response.data.message);
    } else {
      console.error('Error de conexión:', error);
    }
  });
```

### Pruebas con herramientas de API

Para probar los endpoints de autenticación y apuestas, es recomendable usar herramientas como Postman, cURL o Thunder Client (extensión de VS Code), ya que permiten especificar métodos HTTP, cabeceras y cuerpos de solicitud de manera sencilla.

#### Ejemplo con cURL para iniciar sesión

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"demouser","password":"password123"}' \
  http://localhost:5000/auth/login
```

## Consideraciones de CORS

El backend tiene habilitado CORS (Cross-Origin Resource Sharing), lo que permite que el frontend acceda a los recursos de la API desde un origen diferente. No es necesario configurar nada adicional en el frontend para realizar solicitudes a la API.

## Manejo de Errores

Se recomienda implementar manejo de errores adecuado en el frontend para proporcionar feedback al usuario. Con Axios, puedes manejar los errores de forma más elegante:

```javascript
api.get(`/events/invalid-id`)
  .then(response => {
    // Procesar los datos recibidos
    console.log(response.data);
  })
  .catch(error => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      switch (error.response.status) {
        case 404:
          console.error('Evento no encontrado');
          displayErrorMessage('El evento solicitado no existe');
          break;
        case 401:
          console.error('No autorizado');
          displayErrorMessage('Necesitas iniciar sesión para acceder a este recurso');
          // Redirigir a la página de login
          break;
        case 405:
          console.error('Método no permitido');
          displayErrorMessage('Operación no válida');
          break;
        default:
          console.error(`Error del servidor: ${error.response.status}`);
          displayErrorMessage('Ha ocurrido un error en el servidor');
      }
    } else if (error.request) {
      // La solicitud se realizó pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor');
      displayErrorMessage('No se pudo conectar con el servidor');
    } else {
      // Ocurrió un error al configurar la solicitud
      console.error('Error de configuración:', error.message);
      displayErrorMessage('Error al procesar la solicitud');
    }
  });
```

## Desarrollo Local

Para ejecutar la API localmente:

1. Asegúrate de tener Python 3.7+ instalado
2. Instala las dependencias: `pip install -r requirements.txt`
3. Ejecuta el servidor: `python app.py`
4. La API estará disponible en `http://localhost:5000`

## Solución de problemas comunes

### "Method Not Allowed"
Si recibes un error "Method Not Allowed", asegúrate de estar utilizando el método HTTP correcto:
- `/auth/login` y `/auth/logout` requieren POST, no GET
- `/events/featured`, `/events/{id}`, `/sports` y `/competitions` usan GET
- `/bets` acepta tanto GET (para listar) como POST (para crear)

### "Unauthorized"
Si recibes un error "Unauthorized" al acceder a rutas protegidas:
1. Asegúrate de haber iniciado sesión correctamente y obtenido un token
2. Verifica que el token esté incluido en las cabeceras de la solicitud como `Authorization: Bearer {token}`
3. Comprueba que el token no haya expirado (duración: 24 horas)

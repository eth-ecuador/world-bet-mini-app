# API Backend - Especificación de Interfaces
**Mini App de Apuestas Deportivas - Hackathon World 2025**

## Información General
- **Base URL:** `/api/v1`
- **Formato:** JSON
- **Autenticación:** Basada en World ID

## Interfaces para MVP Versión 1

### 1. Autenticación con World ID

#### 1.1 Verificar Prueba de World ID
```
POST /auth/verify-world-id
```

**Descripción:** Verifica la prueba de World ID enviada desde el frontend.

**Parámetros de entrada:**
```json
{
  "merkle_root": "string",
  "nullifier_hash": "string",
  "proof": "string",
  "verification_level": "string",
  "action": "string",
  "signal": "string"
}
```

**Respuesta (éxito - 200):**
```json
{
  "success": true,
  "session_id": "string",
  "expires_at": "ISO8601 timestamp"
}
```

**Respuesta (error - 401):**
```json
{
  "success": false,
  "error": "Invalid World ID verification"
}
```

#### 1.2 Verificar Sesión
```
GET /auth/verify-session
```

**Descripción:** Verifica si la sesión del usuario es válida.

**Headers:**
```
Authorization: Bearer {session_id}
```

**Respuesta (éxito - 200):**
```json
{
  "valid": true,
  "expires_at": "ISO8601 timestamp"
}
```

**Respuesta (error - 401):**
```json
{
  "valid": false,
  "error": "Session expired or invalid"
}
```

### 2. Eventos Deportivos

#### 2.1 Listar Eventos Destacados
```
GET /events/featured
```

**Descripción:** Devuelve la lista de eventos deportivos destacados (datos simulados).

**Parámetros de consulta (opcional):**
```
sport_type: string (football, tennis, basketball, etc.)
date_from: string (YYYY-MM-DD)
date_to: string (YYYY-MM-DD)
limit: integer (default: 10)
```

**Respuesta (éxito - 200):**
```json
{
  "events": [
    {
      "id": "string",
      "name": "Barcelona vs Real Madrid",
      "sport_type": "football",
      "competition": "La Liga",
      "start_time": "ISO8601 timestamp",
      "main_markets": [
        {
          "id": "string",
          "name": "Match Winner",
          "selections": [
            {
              "id": "string",
              "name": "Barcelona",
              "odds": 2.1
            },
            {
              "id": "string",
              "name": "Draw",
              "odds": 3.5
            },
            {
              "id": "string",
              "name": "Real Madrid",
              "odds": 3.2
            }
          ]
        }
      ],
      "status": "upcoming",
      "image_url": "string (url)"
    }
  ],
  "total_count": 42,
  "page": 1
}
```

#### 2.2 Obtener Evento por ID
```
GET /events/{event_id}
```

**Descripción:** Devuelve información detallada sobre un evento específico.

**Respuesta (éxito - 200):**
```json
{
  "id": "string",
  "name": "Barcelona vs Real Madrid",
  "sport_type": "football",
  "competition": "La Liga",
  "start_time": "ISO8601 timestamp",
  "venue": "Camp Nou, Barcelona",
  "description": "El Clásico - Round 25",
  "markets": [
    {
      "id": "string",
      "name": "Match Winner",
      "selections": [
        {
          "id": "string",
          "name": "Barcelona",
          "odds": 2.1
        },
        {
          "id": "string",
          "name": "Draw",
          "odds": 3.5
        },
        {
          "id": "string",
          "name": "Real Madrid",
          "odds": 3.2
        }
      ]
    },
    {
      "id": "string",
      "name": "Both Teams to Score",
      "selections": [
        {
          "id": "string",
          "name": "Yes",
          "odds": 1.7
        },
        {
          "id": "string",
          "name": "No",
          "odds": 2.1
        }
      ]
    }
  ],
  "status": "upcoming",
  "image_url": "string (url)",
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

#### 2.3 Listar Deportes
```
GET /sports
```

**Descripción:** Devuelve la lista de deportes disponibles.

**Respuesta (éxito - 200):**
```json
{
  "sports": [
    {
      "id": "string",
      "name": "Football",
      "active_events_count": 120,
      "icon_url": "string"
    },
    {
      "id": "string",
      "name": "Tennis",
      "active_events_count": 80,
      "icon_url": "string"
    }
  ]
}
```

#### 2.4 Listar Competiciones
```
GET /competitions
```

**Descripción:** Devuelve las competiciones disponibles.

**Parámetros de consulta (opcional):**
```
sport_id: string
```

**Respuesta (éxito - 200):**
```json
{
  "competitions": [
    {
      "id": "string",
      "name": "La Liga",
      "sport_id": "string",
      "country": "Spain",
      "active_events_count": 10,
      "icon_url": "string"
    }
  ]
}
```

### 3. Apuestas

#### 3.1 Crear Apuesta (Simulación)
```
POST /bets
```

**Descripción:** Registra una apuesta simulada.

**Headers:**
```
Authorization: Bearer {session_id}
```

**Parámetros de entrada:**
```json
{
  "selection_id": "string",
  "stake_amount": 50,
  "currency": "WLD",
  "use_ai_recommendation": true
}
```

**Respuesta (éxito - 201):**
```json
{
  "bet_id": "string",
  "status": "placed",
  "selection_id": "string",
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
  "created_at": "ISO8601 timestamp",
  "estimated_result_time": "ISO8601 timestamp"
}
```

#### 3.2 Listar Apuestas del Usuario
```
GET /bets
```

**Descripción:** Obtiene las apuestas simuladas del usuario actual.

**Headers:**
```
Authorization: Bearer {session_id}
```

**Parámetros de consulta (opcional):**
```
status: string (active, settled, all)
limit: integer (default: 10)
page: integer (default: 1)
```

**Respuesta (éxito - 200):**
```json
{
  "bets": [
    {
      "bet_id": "string",
      "event_name": "Barcelona vs Real Madrid",
      "selection_name": "Barcelona",
      "odds": 2.1,
      "stake_amount": 50,
      "currency": "WLD",
      "potential_return": 105,
      "status": "active",
      "placed_at": "ISO8601 timestamp",
      "result": null,
      "used_ai_recommendation": true
    }
  ],
  "total_count": 5,
  "page": 1
}
```

### 4. Agente IA (Recomendaciones)

#### 4.1 Obtener Recomendaciones
```
GET /ai/recommendations
```

**Descripción:** Obtiene recomendaciones personalizadas basadas en el saldo real del usuario.

**Headers:**
```
Authorization: Bearer {session_id}
```

**Parámetros de consulta (opcional):**
```
sport_type: string
max_events: integer (default: 3)
```

**Respuesta (éxito - 200):**
```json
{
  "recommendations": [
    {
      "event_id": "string",
      "event_name": "Barcelona vs Real Madrid",
      "selection_id": "string",
      "selection_name": "Barcelona",
      "odds": 2.1,
      "confidence_score": 0.85,
      "reasoning": "Based on recent form, Barcelona has won 4 of last 5 matches at home",
      "recommended_stake": {
        "amount": 45,
        "currency": "WLD"
      }
    }
  ],
  "wallet_balance_used": true,
  "balance_considerations": "Recommendations are optimized for your current balance of 120 WLD"
}
```

#### 4.2 Obtener Estadísticas del Agente IA
```
GET /ai/performance
```

**Descripción:** Obtiene estadísticas de rendimiento simuladas del agente IA.

**Respuesta (éxito - 200):**
```json
{
  "performance": {
    "success_rate": 68.5,
    "total_recommendations": 500,
    "successful_predictions": 342,
    "avg_odds_recommended": 2.4,
    "potential_roi": 12.5
  },
  "recent_successes": [
    {
      "event_name": "Arsenal vs Chelsea",
      "selection": "Arsenal",
      "odds": 2.3,
      "result": "win"
    }
  ]
}
```

### 5. Wallet y Finanzas

#### 5.1 Obtener Saldo de Usuario
```
GET /wallet/balance
```

**Descripción:** Obtiene el saldo real del usuario desde World App.

**Headers:**
```
Authorization: Bearer {session_id}
```

**Respuesta (éxito - 200):**
```json
{
  "balances": [
    {
      "currency": "WLD",
      "amount": 120.5,
      "usd_equivalent": 240.75
    },
    {
      "currency": "USDC",
      "amount": 50.25,
      "usd_equivalent": 50.25
    }
  ],
  "timestamp": "ISO8601 timestamp"
}
```

#### 5.2 Simular Transacción
```
POST /wallet/simulate-transaction
```

**Descripción:** Simula una transacción sin realizar movimientos reales.

**Headers:**
```
Authorization: Bearer {session_id}
```

**Parámetros de entrada:**
```json
{
  "amount": 50,
  "currency": "WLD",
  "transaction_type": "bet_placement"
}
```

**Respuesta (éxito - 200):**
```json
{
  "would_succeed": true,
  "simulated_balance_after": 70.5,
  "fees": {
    "standard_commission": 1.5,
    "ai_premium_fee": 0.5,
    "profit_percentage": 5
  }
}
```

### 6. Admin y Utilidades

#### 6.1 Verificar Estado de la API
```
GET /health
```

**Descripción:** Verifica el estado de la API.

**Respuesta (éxito - 200):**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "ISO8601 timestamp"
}
```

#### 6.2 Resetear Datos de Prueba
```
POST /admin/reset-demo-data
```

**Descripción:** Reinicia los datos de prueba para demostraciones (solo disponible durante el hackathon).

**Headers:**
```
Authorization: Bearer {admin_key}
```

**Respuesta (éxito - 200):**
```json
{
  "success": true,
  "message": "Demo data has been reset"
}
```

## Códigos de Error Comunes

- `400` - Bad Request: Datos de entrada incorrectos o incompletos
- `401` - Unauthorized: Falta autenticación o credenciales inválidas
- `403` - Forbidden: No tiene permisos para este recurso
- `404` - Not Found: Recurso no encontrado
- `422` - Unprocessable Entity: La solicitud fue bien formada pero no se puede procesar
- `500` - Internal Server Error: Error en el servidor

## Notas de Implementación

1. **Datos simulados**: Todos los datos de eventos deportivos son simulados para el MVP Versión 1, excepto:
   - La autenticación con World ID es real
   - El saldo de la wallet es real (obtenido de World App)

2. **Autenticación**: La autenticación se realiza a través de World ID. Una vez verificado, se genera un session_id que debe enviarse en todas las solicitudes posteriores.

3. **Recomendaciones de IA**: El agente de IA utiliza datos simulados para las recomendaciones, pero el saldo real del usuario para personalizar las recomendaciones.

4. **Monetización dual**: La API soporta el modelo dual de comisiones:
   - Comisión estándar para apuestas regulares
   - Comisión premium + porcentaje de ganancias para apuestas basadas en recomendaciones de IA
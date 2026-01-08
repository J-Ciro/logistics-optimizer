---
goal: Crear colecciones de Postman para pruebas automatizadas de endpoints API
version: 1.0
date_created: 2026-01-07
last_updated: 2026-01-07
owner: Backend Team
status: 'Planned'
tags: [testing, automation, api, postman, quality-assurance]
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

Este plan define la implementación de colecciones de Postman en formato JSON para realizar pruebas automatizadas de todos los endpoints del sistema de cotización de envíos. Las colecciones incluirán casos de prueba para validación, flujos exitosos y manejo de errores, permitiendo pruebas manuales y automatización en pipelines CI/CD.

## 1. Requirements & Constraints

- **REQ-001**: La colección debe incluir todos los endpoints activos del sistema (POST /api/quotes, GET /api/adapters/status)
- **REQ-002**: Cada endpoint debe tener múltiples casos de prueba: éxito (happy path), validación, errores, edge cases
- **REQ-003**: Debe cubrir todos los escenarios de HU-01, HU-02, HU-04 y HU-05 (validación, error handling, health)
- **REQ-004**: Las variables de entorno deben ser configurables (baseUrl, ports)
- **REQ-005**: Los tests automáticos deben validar status codes, estructura de respuesta, datos y comportamiento
- **REQ-006**: La colección debe ser compatible con Postman v2.1 schema
- **REQ-007**: Debe incluir scripts de pre-request y tests automatizados con helpers reutilizables
- **REQ-008**: Mínimo 50 tests cubriendo: happy path (20%), validación (30%), error handling (30%), edge cases (20%)
- **SEC-001**: No incluir credenciales, tokens o secrets hardcoded en la colección
- **CON-001**: El archivo JSON debe ser versionado en Git en directorio /postman
- **CON-002**: Los tests deben ser independientes entre sí (no depender de orden de ejecución)
- **CON-003**: Los tests deben usar datos dinámicos (fechas generadas, no hardcoded)
- **GUD-001**: Usar nombres descriptivos en español para facilitar el entendimiento del equipo
- **GUD-002**: Documentar cada request con descripción, parámetros esperados y ejemplos de respuesta
- **GUD-003**: Incluir comentarios en scripts explicando lógica compleja
- **PAT-001**: Organizar requests en carpetas lógicas por tipo de prueba (Health, Success, Validation, Errors, Edge Cases)
- **PAT-002**: Usar pattern AAA (Arrange-Act-Assert) en tests de Postman

## 2. Implementation Steps

### Implementation Phase 1: Estructura Base y Configuración

- GOAL-001: Crear la estructura base de la colección de Postman con configuración de entorno

| Task     | Description                                                                                                      | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-001 | Crear archivo \`postman_collection.json\` en directorio \`/postman\` con metadata básica y schema v2.1             |           |      |
| TASK-002 | Crear archivo \`postman_environment.json\` con variables: \`baseUrl\` (http://localhost:3000), \`apiPrefix\` (/api)  |           |      |
| TASK-003 | Definir estructura de carpetas: "1. Health Check", "2. Quote Requests - Success", "3. Quote Requests - Validation", "4. Quote Requests - Error Handling", "5. Edge Cases & Performance" |           |      |
| TASK-004 | Configurar variables de colección: \`timestamp\`, \`randomWeight\`, \`randomDate\`                                    |           |      |

### Implementation Phase 2: Health Check Endpoints

- GOAL-002: Implementar requests y tests para endpoint de health check del sistema

| Task     | Description                                                                                                      | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-005 | Crear request "GET System Health" (GET {{baseUrl}}{{apiPrefix}}/adapters/status)                                |           |      |
| TASK-006 | Agregar test: validar status code 200                                                                            |           |      |
| TASK-007 | Agregar test: validar estructura de respuesta (status, activeProviders, totalProviders, providers array)        |           |      |
| TASK-008 | Agregar test: validar que cada provider tenga providerName, status, responseTime, lastCheck                     |           |      |
| TASK-009 | Agregar test: validar que systemStatus sea uno de: ONLINE, DEGRADED, OFFLINE                                    |           |      |
| TASK-009a | Agregar test: validar que activeProviders esté en rango 0-3                                                     |           |      |
| TASK-009b | Agregar test: validar que cada provider.lastCheck sea una fecha válida reciente (< 1 minuto)                   |           |      |

### Implementation Phase 3: Quote Requests - Casos Exitosos

- GOAL-003: Implementar requests para flujos exitosos de solicitud de cotizaciones

| Task     | Description                                                                                                      | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-010 | Crear request "Quote Request - Valid Data" con body JSON válido (Bogotá → Medellín, 5.5kg, fecha futura, fragile: false) |           |      |
| TASK-011 | Agregar test: validar status code 200                                                                            |           |      |
| TASK-012 | Agregar test: validar que quotes array tenga 3 elementos (FedEx, DHL, Local)                                    |           |      |
| TASK-013 | Agregar test: validar estructura de quote (providerId, providerName, price, currency, minDays, maxDays, estimatedDays, transportMode, isCheapest, isFastest) |           |      |
| TASK-014 | Agregar test: validar que exactamente un quote tenga isCheapest: true                                           |           |      |
| TASK-015 | Agregar test: validar que exactamente un quote tenga isFastest: true                                            |           |      |
| TASK-016 | Crear request "Quote Request - Fragile Package" con fragile: true                                               |           |      |
| TASK-017 | Agregar test: validar que precios sean 15% más altos que caso sin frágil (comparar con variable guardada)      |           |      |
| TASK-018 | Crear request "Quote Request - Heavy Package" con peso 500kg                                                     |           |      |
| TASK-019 | Agregar test: validar que precios reflejen peso alto correctamente                                              |           |      |

### Implementation Phase 4: Quote Requests - Validación de Entrada

- GOAL-004: Implementar requests para casos de validación de datos de entrada

| Task     | Description                                                                                                      | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-020 | Crear request "Validation - Weight Below Minimum" con weight: 0.05                                              |           |      |
| TASK-021 | Agregar test: validar status code 400                                                                            |           |      |
| TASK-022 | Agregar test: validar que error message contenga "peso" y "0.1 kg"                                              |           |      |
| TASK-023 | Agregar test: validar que field sea "weight"                                                                     |           |      |
| TASK-024 | Crear request "Validation - Weight Above Maximum" con weight: 1001                                              |           |      |
| TASK-025 | Agregar test: validar error para peso máximo excedido                                                           |           |      |
| TASK-026 | Crear request "Validation - Past Date" con pickupDate de ayer                                                   |           |      |
| TASK-027 | Agregar test: validar error para fecha en el pasado                                                             |           |      |
| TASK-028 | Crear request "Validation - Future Date >30 days" con pickupDate de 35 días adelante                           |           |      |
| TASK-029 | Agregar test: validar error para fecha fuera de rango                                                           |           |      |
| TASK-030 | Crear request "Validation - Missing Origin" sin campo origin                                                    |           |      |
| TASK-031 | Agregar test: validar error para origen requerido                                                               |           |      |
| TASK-032 | Crear request "Validation - Missing Destination" sin campo destination                                          |           |      |
| TASK-033 | Agregar test: validar error para destino requerido                                                              |           |      |
| TASK-035a | Crear request "Validation - Null Weight" con weight: null                                                       |           |      |
| TASK-035b | Agregar test: validar error para peso null                                                                       |           |      |
| TASK-035c | Crear request "Validation - Negative Weight" con weight: -5                                                     |           |      |
| TASK-035d | Agregar test: validar error para peso negativo                                                                   |           |      |
| TASK-035e | Crear request "Validation - Invalid Date Format" con pickupDate: "fecha-invalida"                              |           |      |
| TASK-035f | Agregar test: validar error para formato de fecha inválido                                                      |           |      |

### Implementation Phase 4b: Quote Requests - Error Handling (HU-05)

- GOAL-004b: Implementar requests para casos de error handling y graceful degradation

| Task     | Description                                                                                                      | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-036a | Crear request "Error - All Providers Offline" (requiere mock o detener adapters manualmente)                   |           |      |
| TASK-036b | Agregar test: validar status code 503                                                                            |           |      |
| TASK-036c | Agregar test: validar que response tenga error message indicando que no hay proveedores disponibles             |           |      |
| TASK-036d | Agregar test: validar que retryAfter sea 30 (segundos)                                                          |           |      |
| TASK-036e | Agregar test: validar que messages array contenga los 3 proveedores                                             |           |      |
| TASK-037a | Crear request "Error - One Provider Offline" (simular con peso específico que cause timeout en uno)            |           |      |
| TASK-037b | Agregar test: validar status code 200 (graceful degradation)                                                    |           |      |
| TASK-037c | Agregar test: validar que quotes array tenga 2 elementos                                                        |           |      |
| TASK-037d | Agregar test: validar que messages array tenga 1 elemento con provider offline                                  |           |      |
| TASK-037e | Agregar test: validar que badges (isCheapest/isFastest) se asignen correctamente entre quotes disponibles      |           |      |
| TASK-038a | Crear request "Error - Two Providers Offline"                                                                   |           |      |
| TASK-038b | Agregar test: validar status code 200 con 1 quote y 2 messages                                                  |           |      |
| TASK-038c | Agregar test: validar que el único quote tenga ambos badges (isCheapest: true, isFastest: true)                |           |      |
| TASK-039a | Crear request "Error - Provider Timeout" (request que tarde más de 5 segundos - edge case)                     |           |      |
| TASK-039b | Agregar test: validar que response llegue en < 6 segundos (timeout es 5s)                                       |           |      |
| TASK-039c | Agregar test: validar que providers que timeout aparezcan en messages array                                     |           |      |
| TASK-040a | Crear request "Error - Invalid JSON Body" con body malformado                                                   |           |      |
| TASK-040b | Agregar test: validar status code 400                                                                            |           |      |
| TASK-040c | Agregar test: validar mensaje de error apropiado                                                                |           |      |
| TASK-041a | Crear request "Error - Missing Content-Type Header"                                                             |           |      |
| TASK-041b | Agregar test: validar que servidor maneje correctamente (400 o error parsing)                                   |           |      |

### Implementation Phase 4c: Health Check - Casos de Error y Degradación

- GOAL-004c: Implementar requests para casos de sistema degradado y offline en health check

| Task     | Description                                                                                                      | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-042a | Crear request "Health - System Degraded" (cuando 1-2 providers están offline)                                  |           |      |
| TASK-042b | Agregar test: validar status code 200 (aunque degradado, endpoint responde)                                     |           |      |
| TASK-042c | Agregar test: validar que systemStatus sea "DEGRADED"                                                           |           |      |
| TASK-042d | Agregar test: validar que activeProviders esté entre 1-2                                                        |           |      |
| TASK-042e | Agregar test: validar que al menos un provider tenga status "offline"                                           |           |      |
| TASK-043a | Crear request "Health - System Offline" (todos los providers offline)                                          |           |      |
| TASK-043b | Agregar test: validar status code 503                                                                            |           |      |
| TASK-043c | Agregar test: validar que systemStatus sea "OFFLINE"                                                            |           |      |
| TASK-043d | Agregar test: validar que activeProviders sea 0                                                                 |           |      |
| TASK-043e | Agregar test: validar que todos los providers tengan status "offline"                                           |           |      |

### Implementation Phase 5: Edge Cases & Performance

- GOAL-005: Implementar requests para casos extremos y pruebas de performance

| Task     | Description                                                                                                      | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-044a | Crear request "Edge - Minimum Weight" con weight: 0.1 (exactamente en el límite)                               |           |      |
| TASK-044b | Agregar test: validar que se acepte y calcule correctamente                                                     |           |      |
| TASK-045a | Crear request "Edge - Maximum Weight" con weight: 1000 (exactamente en el límite)                              |           |      |
| TASK-045b | Agregar test: validar que se acepte y calcule correctamente                                                     |           |      |
| TASK-046a | Crear request "Edge - Today Pickup Date" con fecha de hoy                                                       |           |      |
| TASK-046b | Agregar test: validar que se acepte                                                                              |           |      |
| TASK-047a | Crear request "Edge - 30 Days Future Date" con fecha exactamente 30 días adelante                              |           |      |
| TASK-047b | Agregar test: validar que se acepte                                                                              |           |      |
| TASK-048a | Crear request "Edge - Very Long City Names" con nombres largos (>100 chars)                                    |           |      |
| TASK-048b | Agregar test: validar comportamiento (debe aceptar o rechazar consistentemente)                                |           |      |
| TASK-049a | Crear request "Edge - Special Characters in City Names" con caracteres especiales, tildes, ñ                   |           |      |
| TASK-049b | Agregar test: validar que maneje correctamente caracteres UTF-8                                                 |           |      |
| TASK-050a | Crear request "Performance - Concurrent Requests" (ejecutar múltiples veces en paralelo)                       |           |      |
| TASK-050b | Agregar test: validar que tiempo de respuesta promedio sea < 3 segundos                                         |           |      |
| TASK-050c | Agregar test: validar que no haya errores por concurrencia                                                      |           |      |
| TASK-051a | Crear request "Edge - Whitespace in Fields" con espacios al inicio/fin de origin/destination                   |           |      |
| TASK-051b | Agregar test: validar que se limpien o mane de schema o formato
- **TEST-002**: Ejecutar "Run Collection" y obtener 100% success rate en happy path (0 failures)
- **TEST-003**: Ejecutar requests de validación y verificar que retornen 400 como esperado
- **TEST-004**: Ejecutar requests de error handling y verificar graceful degradation
- **TEST-005**: Ejecutar con Newman desde CLI y obtener exit code 0
- **TEST-006**: Validar que cada request tenga al menos 3-5 tests relevantes
- **TEST-007**: Validar que todos los status codes esperados sean correctos (200, 400, 503)
- **TEST-008**: Validar que tests de estructura de respuesta sean exhaustivos (verificar todos los campos requeridos)
- **TEST-009**: Validar que edge cases cubran límites (0.1kg, 1000kg, hoy, +30 días)
- **TEST-010**: Ejecutar colección 3 veces consecutivas y verificar resultados consistentes (idempotencia)
- **TEST-011**: Probar con diferentes valores de variables de entorno (diferentes puertos: 3000, 3001, 8080)
- **TEST-012**: Validar tiempo de ejecución total < 45 segundos para toda la colección
- **TEST-013**: Verificar que tests fallen apropiadamente cuando backend está offline
- **TEST-014**: Verificar coverage total: mínimo 50 tests cubriendo todos los escenarios
- **TEST-015**: Validar que ningún test tenga hardcoded values que expiren (usar scripts dinámicos)tización

| Task     | Description                                                                                                      | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-036 | Crear pre-request script global para generar timestamp actual                                                   |           |      |
| TASK-037 | Crear pre-request script para generar peso aleatorio válido (0.1-1000)                                          |           |      |
| TASK-038 | Crear pre-request script para generar fecha futura válida aleatoria (hoy + 1 a 30 días)                        |           |      |
| TASK-039 | Crear test script global para guardar tiempo de respuesta en variable                                           |           |      |
| TASK-040 | Agregar test global: validar que tiempo de respuesta < 3000ms para quote requests                              |           |      |
| TASK-041 | Agregar test global: validar que Content-Type sea application/json                                              |           |      |
| TASK-042 | Crear helper function para validar estructura de Quote object                                                    |           |      |
| TASK-043 | Crear helper function para validar estructura de ProviderStatus object                                          |           |      |

### Implementation Phase 6: Documentación y Ejemplos

- GOAL-006: Documentar la colección con descripciones, ejemplos y guías de uso

| Task     | Description                                                                                                      | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-044 | Agregar descripción a la colección explicando propósito y cómo usarla                                           |           |      |
| TASK-045 | Agregar descripción a cada carpeta explicando los casos de prueba incluidos                                     |           |      |
| TASK-046 | Agregar descripción a cada request con formato, parámetros esperados y resultado esperado                       |           |      |
| TASK-047 | Guardar ejemplos de respuesta exitosa para cada request                                                         |           |      |
| TASK-048 | Guardar ejemplos de respuesta de error para cada request de validación                                          |           |      |
| TASK-049 | Crear archivo README.md en /postman explicando cómo importar y ejecutar la colección                            |           |      |
| TASK-050 | Documentar cómo ejecutar la colección con Newman (CLI) para CI/CD                                               |           |      |

### Implementation Phase 6: Scripts Avanzados y Automatización

- GOAL-006: Implementar scripts de pre-request, tests avanzados y utilidades de automatización

| Task     | Description                                                                                                      | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-053 | Crear pre-request script global para generar timestamp actual                                                   |           |      |
| TASK-054 | Crear pre-request script para generar peso aleatorio válido (0.1-1000)                                          |           |      |
| TASK-055 | Crear pre-request script para generar fecha futura válida aleatoria (hoy + 1 a 30 días)                        |           |      |
| TASK-056 | Crear pre-request script para generar ciudades colombianas aleatorias de una lista                             |           |      |
| TASK-057 | Crear test script global para guardar tiempo de respuesta en variable                                           |           |      |
| TASK-058 | Agregar test global: validar que tiempo de respuesta < 3000ms para quote requests                              |           |      |
| TASK-059 | Agregar test global: validar que tiempo de respuesta < 500ms para health check                                 |           |      |
| TASK-060 | Agregar test global: validar que Content-Type sea application/json                                              |           |      |
| TASK-061 | Crear helper function para validar estructura completa de Quote object con todos sus campos                    |           |      |
| TASK-062 | Crear helper function para validar estructura de ProviderStatus object                                          |           |      |
| TASK-063 | Crear helper function para validar que exactamente un quote tenga badge específico                             |           |      |
| TASK-064 | Crear helper function para validar formato de moneda (COP, con decimales correctos)                            |           |      |
| TASK-065 | Crear test script para validar que no haya memory leaks (headers razonables, sin datos excesivos)              |           |      |

### Implementation Phase 7: Documentación y Ejemplos

- GOAL-007: Documentar la colección con descripciones, ejemplos y guías de uso

| Task     | Description                                                                                                      | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-066 | Agregar descripción a la colección explicando propósito, estructura y cómo usarla                               |           |      |
| TASK-067 | Agregar descripción a cada carpeta explicando los casos de prueba incluidos y objetivo                          |           |      |
| TASK-068 | Agregar descripción detallada a cada request con formato, parámetros esperados y resultado esperado            |           |      |
| TASK-069 | Guardar ejemplos de respuesta exitosa para cada request (200, quotes con badges)                               |           |      |
| TASK-070 | Guardar ejemplos de respuesta de error para cada request de validación (400 con field y error)                 |           |      |
| TASK-071 | Guardar ejemplos de respuesta de error handling (503, parcial con messages)                                    |           |      |
| TASK-072 | Crear archivo README.md en /postman explicando cómo importar y ejecutar la colección                            |           |      |
| TASK-073 | Documentar en README casos especiales (cómo simular providers offline, timeouts)                                |           |      |
| TASK-074 | Documentar cómo ejecutar la colección con Newman (CLI) para CI/CD                                               |           |      |
| TASK-075 | Crear tabla de casos de prueba cubiertos vs HU requirements en README                                           |           |      |

### Implementation Phase 8: Pruebas y Validación

- GOAL-008: Probar la colección completa y validar que todos los tests pasen correctamente

| Task     | Description                                                                                                      | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-076 | Importar colección en Postman y verificar que se cargue correctamente sin errores                               |           |      |
| TASK-077 | Ejecutar cada carpeta individualmente y verificar que funcionen todos los requests                              |           |      |
| TASK-078 | Ejecutar requests de validación y verificar que fallen correctamente (status 400)                               |           |      |
| TASK-079 | Ejecutar requests de error handling y verificar comportamiento correcto (graceful degradation)                  |           |      |
| TASK-080 | Ejecutar "Run Collection" completa y verificar que todos los tests pasen                                        |           |      |
| TASK-081 | Verificar coverage: al menos 50 tests en total (happy path + validación + errors + edge cases)                 |           |      |
| TASK-082 | Instalar Newman: \`npm install -g newman\`                                                                         |           |      |
| TASK-083 | Instalar Newman HTML Reporter: \`npm install -g newman-reporter-html\`                                            |           |      |
| TASK-084 | Ejecutar colección con Newman: \`newman run postman_collection.json -e postman_environment.json --reporters cli,html\` |           |      |
| TASK-085 | Verificar que reporte de Newman muestre 100% de tests pasados (considerando que algunos providers pueden estar offline) |           |      |
| TASK-086 | Ejecutar colección 3 veces consecutivas para verificar estabilidad e idempotencia                               |           |      |
| TASK-087 | Agregar script en package.json: \`"test:api": "newman run postman/postman_collection.json -e postman/postman_environment.json --reporters cli,html"\` |           |      |
| TASK-088 | Probar con diferentes puertos cambiando variable de entorno (3001, 8080, etc.)                                  |           |      |
| TASK-089 | Documentar cualquier bug, inconsistencia o comportamiento inesperado encontrado                                 |           |      |
| TASK-090 | Crear matriz de trazabilidad: Request → HU → Acceptance Criteria                                                |           |      |

## 3. Alternatives

- **ALT-001**: Usar Insomnia en lugar de Postman - Descartado porque Postman tiene mejor integración con CI/CD y Newman para automatización
- **ALT-002**: Usar Thunder Client (VS Code extension) - Descartado porque no tiene capacidades de automatización robustas como Newman
- **ALT-003**: Usar archivo OpenAPI/Swagger para generar tests automáticamente - Considerado para el futuro, pero Postman permite más flexibilidad para tests específicos
- **ALT-004**: Usar herramientas de testing de API específicas (REST Assured, Supertest) - Ya implementado en Jest, Postman complementa con tests manuales y ad-hoc
- **ALT-005**: Crear colecciones separadas por HU - Decidido usar una colección unificada organizada en carpetas para facilitar ejecución completa

## 4. Dependencies

- **DEP-001**: Backend debe estar corriendo en http://localhost:3000 para ejecutar los tests
- **DEP-002**: Endpoints /api/quotes y /api/adapters/status deben estar implementados y funcionales
- **DEP-003**: Validación de datos debe estar implementada en el backend (HU-02)
- **DEP-004**: Middleware de validación debe estar aplicado en las rutas
- **DEP-005**: Postman instalado (desktop o web) para edición manual
- **DEP-006**: Node.js y npm instalados para ejecutar Newman

## 5. Files

- **FILE-001**: \`/postman/postman_collection.json\` - Colección principal con todos los requests y tests
- **FILE-002**: \`/postman/postman_environment.json\` - Variables de entorno (baseUrl, apiPrefix, etc.)
- **FILE-003**: \`/postman/README.md\` - Documentación de uso de la colección
- **FILE-004**: \`/logistics-back/package.json\` - Agregar script test:api para ejecutar Newman
- **FILE-005**: \`.gitignore\` - Asegurar que no se ignoren archivos de /postman

## 6. Testing

- **TEST-001**: Importar colección en Postman sin errores de schema o formato
- **TEST-002**: Ejecutar "Run Collection" y obtener 100% success rate en happy path (0 failures)
- **TEST-003**: Ejecutar requests de validación y verificar que retornen 400 como esperado
- **TEST-004**: Ejecutar requests de error handling y verificar graceful degradation
- **TEST-005**: Ejecutar con Newman desde CLI y obtener exit code 0
- **TEST-006**: Validar que cada request tenga al menos 3-5 tests relevantes
- **TEST-007**: Validar que todos los status codes esperados sean correctos (200, 400, 503)
- **TEST-008**: Validar que tests de estructura de respuesta sean exhaustivos (verificar todos los campos requeridos)
- **TEST-009**: Validar que edge cases cubran límites (0.1kg, 1000kg, hoy, +30 días)
- **TEST-010**: Ejecutar colección 3 veces consecutivas y verificar resultados consistentes (idempotencia)
- **TEST-011**: Probar con diferentes valores de variables de entorno (diferentes puertos: 3000, 3001, 8080)
- **TEST-012**: Validar tiempo de ejecución total < 45 segundos para toda la colección
- **TEST-013**: Verificar que tests fallen apropiadamente cuando backend está offline
- **TEST-014**: Verificar coverage total: mínimo 50 tests cubriendo todos los escenarios
- **TEST-015**: Validar que ningún test tenga hardcoded values que expiren (usar scripts dinámicos)

## 7. Risks & Assumptions

- **RISK-001**: Si el backend está offline, todos los tests fallarán - Mitigación: Incluir instrucciones claras en README sobre cómo iniciar el backend
- **RISK-002**: Tests pueden fallar si adapters están genuinamente offline - Mitigación: Documentar que esto es comportamiento esperado
- **RISK-003**: Diferencias entre Postman desktop y web pueden causar incompatibilidades - Mitigación: Usar schema v2.1 que es compatible con ambos
- **RISK-004**: Newman puede tener diferente comportamiento que Postman GUI - Mitigación: Probar ambos antes de finalizar
- **RISK-005**: Fechas hardcoded se volverán inválidas con el tiempo - Mitigación: Usar pre-request scripts para generar fechas dinámicamente
- **ASSUMPTION-001**: El equipo tiene conocimiento básico de Postman
- **ASSUMPTION-002**: Los endpoints no requieren autenticación (para MVP)
- **ASSUMPTION-003**: Backend corre en puerto 3000 por defecto
- **ASSUMPTION-004**: Los datos de prueba son válidos en contexto colombiano (ciudades, etc.)

## 8. Related Specifications / Further Reading

- [Postman Collection Format v2.1 Schema](https://schema.postman.com/json/collection/v2.1.0/docs/index.html)
- [Newman CLI Documentation](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)
- [Writing Postman Tests](https://learning.postman.com/docs/writing-scripts/test-scripts/)
- [HU-01 Plan](./HU-01-quote-request.md) - Endpoints de cotización
- [HU-02 Plan](./HU-02-input-validation.md) - Validación de datos
- [HU-04 Plan](./HU-04-system-health.md) - Health check endpoint
- [HU-05 Plan](./HU-05-error-handling.md) - Manejo de errores
- [API Testing Best Practices](https://www.postman.com/api-testing-best-practices/)

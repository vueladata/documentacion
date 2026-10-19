# VuelaData — prototipo de portal para pasajeros

La página principal de este proyecto Docusaurus presenta una visión del portal de pasajeros de VuelaData: buscador visual de vuelos, mis viajes, estado del vuelo, destinos, información de viaje y orientación sobre incidencias.

## Estado de funcionalidad

- La navegación, las pestañas del buscador, el intercambio de origen/destino y los formularios tienen interacciones locales.
- La búsqueda de vuelos, consulta de reservas y consulta de estado **no llaman al backend todavía**. La API actual no expone esos endpoints.
- La API FastAPI que se entregó se centra en el módulo F7: causas, reglas de compensación, compensaciones, pagos y eventos de pago.
- No se conectaron formularios públicos a operaciones CRUD de pagos o compensaciones, ya que no son endpoints de consulta de pasajeros y deben protegerse con validación y autorización.
- Las imágenes de destinos son recursos de demostración que puedes reemplazar por fotografías definitivas.

## Ejecutar

Requiere Node.js 20 o superior.

```bash
npm install
npm run start
```

## Build de producción

```bash
npm run build
```

## Archivos principales

- `src/pages/index.js`: composición de la página y las interacciones del buscador.
- `src/pages/index.module.css`: diseño responsive.
- `static/img/vueladata-logo.png`: logo oficial proporcionado para el proyecto.\n- `static/img/vueladata-hero.jpg`: imagen principal generada para el prototipo.
- `static/img/destination-bogota.jpg`: imagen local de destino.
- `static/img/destination-madrid.jpg`: imagen local de destino.
- `static/img/destination-san-andres.jpg`: imagen local de destino.
- `docusaurus.config.js`: configuración y navegación de Docusaurus.

## Próxima integración

Cuando se decida conectar la API, configura una URL base mediante una variable de entorno pública de Docusaurus y crea un cliente HTTP pequeño. Antes de conectar, verifica los contratos reales en `/openapi.json`. Los endpoints de búsqueda de vuelos, itinerarios y estado deberán desarrollarse en el backend si siguen sin estar disponibles.


## Página principal de documentación

La ruta `/docs` muestra el índice de la documentación técnica disponible. El índice se encuentra en `docs/index.md` y enlaza a los documentos existentes.


## Rutas de documentación

- `/docs`: página principal de documentación, implementada en `src/pages/docs.js`.
- `/documentacion/stream-f4-simulator`: documentación técnica del simulador OOOI.


## Documentación

La documentación técnica permanece bajo `/docs`. La portada está definida en `docs/index.md` y los documentos técnicos se sirven desde la misma sección de Docusaurus.


## Si `/docs` muestra 404

La portada está definida en `docs/index.md` con `slug: /`, para que Docusaurus la publique en `/docs`. Si vienes de una ejecución anterior, detén el servidor y limpia la caché generada antes de volver a iniciar:

```bash
npm run clear
npm run start
```

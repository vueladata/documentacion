# Documentación de VuelaData

El sitio Docusaurus publica la documentación técnica en [GitHub Pages](https://vueladata.github.io/documentacion/docs/). El contenido empieza en [docs/index.md](docs/index.md). El sitio también contiene una [portada de pasajeros](https://vueladata.github.io/documentacion/) con formularios de demostración. El backend ofrece rutas de consulta para pasajeros y operaciones F7.

## Editar y verificar

Usa Node.js 24, la versión del workflow de Pages.

```bash
npm ci
npm run start
npm run build
```

El índice usa `slug: /` dentro de la sección `docs`. Las categorías se generan a partir de `docs/`. Conserva las rutas existentes al mover contenido. El workflow compila y publica GitHub Pages con los cambios de `main`.

# Mud Espacio

Sitio de presentación, clases y catálogo de merch. Consultas por WhatsApp; pagos por transferencia bancaria o efectivo.

## Administrar
Ingresar a /admin con la cuenta ChatGPT autorizada en ADMIN_EMAIL. Cargar nombre, descripción, precio opcional en ARS, variantes, foto y disponibilidad. Guardar como borrador o activar Mostrar en el catálogo. Para ocultar un producto, desactivar esa opción y guardar.

## Desarrollo
npm ci
npm run dev
npm run build
npm test

En Windows se puede ejecutar node node_modules/vinext/dist/cli.js dev o build. Configurar ADMIN_EMAIL en .dev.vars para desarrollo y en las variables de Sites para producción. Nunca habilitar administradores desde datos enviados por el navegador. La identidad se recibe exclusivamente del dispatcher confiable de Sites.

D1 almacena los productos; R2 almacena las fotos. Las migraciones están en drizzle. No hay carrito ni cobros en línea.

Las pruebas de integración en tests/catalog.integration.mjs y tests/images.integration.mjs se ejecutan solo contra localhost:3000, con ADMIN_EMAIL configurado; crean productos locales ocultos. No ejecutarlas contra producción.

La imagen public/og.png se generó con ImageGen integrado. Brief: tarjeta social Mud Espacio, fondo crema, verde, terracota y mostaza; collage artesanal, cerámica y flores; textos Un ratito para vos / Las manos en el barro / Cerámica · Wilde, Buenos Aires.

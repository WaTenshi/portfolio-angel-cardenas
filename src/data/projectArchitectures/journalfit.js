import { localized as t } from './schema.js'

const publicCommit = '57c4d08b63dca1b6a64cceba8fd43808be4c48f1'
const publicSource = (path) => `https://github.com/WaTenshi/Landing-Journal-Fit/blob/${publicCommit}/${path}`
const privateEvidence = () => ({ private: true, verified: true })

/** @type {import('./schema.js').ProjectArchitecture} */
const journalfit = {
  id: 'journalfit',
  title: 'JournalFit',
  subtitle: t('Producto móvil de entrenamiento con persistencia híbrida.', 'Mobile training product with hybrid persistence.'),
  sourceCommit: publicCommit,
  sourceLabel: 'Landing pública + fuente privada verificada',
  visibility: 'mixed',
  stack: ['Expo', 'React Native', 'Firebase Auth', 'Firestore', 'AsyncStorage'],
  nodes: [
    { id: 'landing', layer: 'ui', position: { x: 10, y: 17, z: -24 }, title: 'Product landing', technology: 'React + TypeScript + Vite', responsibility: t('Presenta públicamente el producto.', 'Presents the product publicly.'), details: t('Superficie web pública desplegada de forma independiente.', 'Public web surface deployed independently.'), evidence: [{ path: 'src/App.tsx', sourceUrl: publicSource('src/App.tsx') }, { path: 'package.json', sourceUrl: publicSource('package.json') }] },
    { id: 'mobile-ui', layer: 'ui', position: { x: 27, y: 48, z: 18 }, title: 'Mobile experience', technology: 'Expo + React Native', responsibility: t('Organiza la experiencia móvil de entrenamiento.', 'Organizes the mobile training experience.'), details: t('Implementación confirmada mediante una fuente privada.', 'Implementation confirmed through a private source.'), evidence: [privateEvidence()] },
    { id: 'auth-context', layer: 'business', position: { x: 48, y: 24, z: 36 }, title: 'Session boundary', technology: 'Authentication context', responsibility: t('Delimita la experiencia según el estado de sesión.', 'Scopes the experience according to session state.'), details: t('Comportamiento verificado sin publicar rutas ni símbolos internos.', 'Behavior verified without publishing internal paths or symbols.'), evidence: [privateEvidence()] },
    { id: 'routine-service', layer: 'services', position: { x: 59, y: 53, z: 28 }, title: 'Routine service', technology: 'Cloud data helpers', responsibility: t('Concentra las operaciones de rutinas.', 'Centralizes routine operations.'), details: t('Capa de servicio confirmada mediante una fuente privada.', 'Service layer confirmed through a private source.'), evidence: [privateEvidence()] },
    { id: 'firebase-auth', layer: 'services', position: { x: 73, y: 19, z: 2 }, title: 'Identity', technology: 'Firebase Auth', responsibility: t('Autentica usuarios y mantiene la sesión.', 'Authenticates users and maintains the session.'), details: t('Integración verificada sin exponer detalles internos.', 'Integration verified without exposing internal details.'), evidence: [privateEvidence()] },
    { id: 'firestore', layer: 'data', position: { x: 83, y: 52, z: -8 }, title: 'Cloud records', technology: 'Cloud Firestore', responsibility: t('Sincroniza información asociada a la experiencia de entrenamiento.', 'Synchronizes information associated with the training experience.'), details: t('Persistencia cloud confirmada mediante una fuente privada.', 'Cloud persistence confirmed through a private source.'), evidence: [privateEvidence()] },
    { id: 'local-progress', layer: 'data', position: { x: 47, y: 79, z: -4 }, title: 'Private progress', technology: 'Local storage', responsibility: t('Mantiene información sensible en el dispositivo.', 'Keeps sensitive information on the device.'), details: t('Persistencia local confirmada sin publicar claves ni estructura interna.', 'Local persistence confirmed without publishing keys or internal structure.'), evidence: [privateEvidence()] },
  ],
  connections: [
    { id: 'mobile-auth-context', from: 'mobile-ui', to: 'auth-context', label: t('estado de sesión', 'session state'), kind: 'auth' },
    { id: 'context-auth', from: 'auth-context', to: 'firebase-auth', label: t('identidad', 'identity'), kind: 'auth' },
    { id: 'mobile-routines', from: 'mobile-ui', to: 'routine-service', label: t('acciones de rutina', 'routine actions'), kind: 'request' },
    { id: 'routines-firestore', from: 'routine-service', to: 'firestore', label: t('sincronización', 'synchronization'), kind: 'data' },
    { id: 'mobile-progress', from: 'mobile-ui', to: 'local-progress', label: t('progreso local', 'local progress'), kind: 'local' },
  ],
  flows: [
    { id: 'create-routine', title: t('Crear rutina personalizada', 'Create a custom routine'), description: t('Flujo funcional verificado en una fuente privada.', 'Functional flow verified in a private source.'), steps: [
      { node: 'mobile-ui', title: t('Capturar rutina', 'Capture routine'), description: t('La interfaz recibe y valida la información necesaria.', 'The interface receives and validates the required information.'), packet: 'Datos validados' },
      { node: 'auth-context', connection: 'mobile-auth-context', title: t('Resolver identidad', 'Resolve identity'), description: t('La sesión delimita la operación.', 'The session scopes the operation.'), packet: 'Sesión activa' },
      { node: 'routine-service', connection: 'mobile-routines', title: t('Preparar registro', 'Prepare record'), description: t('La capa de servicio prepara la operación.', 'The service layer prepares the operation.'), packet: 'Operación verificada' },
      { node: 'firestore', connection: 'routines-firestore', title: t('Persistir rutina', 'Persist routine'), description: t('La información se sincroniza en la nube.', 'The information synchronizes to the cloud.'), packet: 'Registro cloud' },
      { node: 'mobile-ui', title: t('Confirmar resultado', 'Confirm result'), description: t('La interfaz presenta el resultado del flujo.', 'The interface presents the flow result.'), packet: 'Estado actualizado' },
    ] },
    { id: 'save-progress', title: t('Registrar progreso local', 'Save local progress'), description: t('La información sensible permanece en el dispositivo.', 'Sensitive information remains on the device.'), steps: [
      { node: 'mobile-ui', title: t('Completar registro', 'Complete entry'), description: t('La interfaz valida el registro.', 'The interface validates the entry.'), packet: 'Entrada local' },
      { node: 'local-progress', connection: 'mobile-progress', title: t('Persistir localmente', 'Persist locally'), description: t('El registro se conserva en el dispositivo.', 'The entry remains on the device.'), packet: 'Fuente privada verificada' },
      { node: 'mobile-ui', connection: 'mobile-progress', title: t('Actualizar análisis', 'Update analysis'), description: t('La interfaz actualiza el resumen local.', 'The interface updates the local summary.'), packet: 'Resumen local' },
    ] },
  ],
  decisions: [
    { id: 'hybrid-storage', kind: 'observation', category: 'DATA', title: t('Persistencia según sensibilidad', 'Persistence by sensitivity'), context: t('Distintos datos tienen necesidades diferentes de sincronización y privacidad.', 'Different data has different synchronization and privacy needs.'), choice: t('Separar persistencia cloud y local.', 'Separate cloud and local persistence.'), tradeoff: t('Mejora la privacidad, pero limita la sincronización de ciertos datos.', 'Improves privacy but limits synchronization for some data.'), evidence: ['Fuente privada verificada'] },
    { id: 'auth-gate', kind: 'observation', category: 'AUTH', title: t('Navegación guiada por sesión', 'Session-driven navigation'), context: t('La experiencia personal requiere una sesión resuelta.', 'The personal experience requires a resolved session.'), choice: t('Centralizar el límite de autenticación.', 'Centralize the authentication boundary.'), tradeoff: t('Simplifica el acceso, aunque requiere resolver la sesión al iniciar.', 'Simplifies access while requiring session resolution at startup.'), evidence: ['Fuente privada verificada'] },
    { id: 'product-surfaces', kind: 'observation', category: 'INFRA', title: t('Superficies independientes', 'Independent surfaces'), context: t('El producto combina comunicación pública y experiencia móvil.', 'The product combines public communication and a mobile experience.'), choice: t('Mantener despliegues independientes.', 'Maintain independent deployments.'), tradeoff: t('Aísla ciclos de entrega, a cambio de coordinar dos superficies.', 'Isolates delivery cycles at the cost of coordinating two surfaces.'), evidence: ['WaTenshi/Landing-Journal-Fit', 'Fuente privada verificada'] },
  ],
  tour: [
    { node: 'landing', text: t('La entrada pública presenta el producto.', 'The public entry point presents the product.') },
    { node: 'mobile-ui', text: t('Expo organiza la experiencia móvil.', 'Expo organizes the mobile experience.') },
    { node: 'auth-context', text: t('La sesión delimita la navegación.', 'The session scopes navigation.') },
    { node: 'routine-service', text: t('Una capa dedicada concentra las operaciones.', 'A dedicated layer centralizes operations.') },
    { node: 'firestore', text: t('La información sincronizable utiliza persistencia cloud.', 'Synchronizable information uses cloud persistence.') },
    { node: 'local-progress', text: t('La información sensible permanece en el dispositivo.', 'Sensitive information stays on the device.') },
  ],
}

export default journalfit

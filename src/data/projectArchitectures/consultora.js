import { localized as t } from './schema.js'

const commit = 'c98278b17974d2ab12d78f8d90933efbcef2f571'
const source = (path) => `https://github.com/WaTenshi/consultora-psicologica/blob/${commit}/${path}`

const consultora = {
  id: 'consultora',
  title: 'Consultora Psicológica',
  subtitle: t('Reserva pública y operación clínica protegida.', 'Public booking and protected clinical operations.'),
  sourceCommit: commit,
  sourceLabel: 'WaTenshi/consultora-psicologica',
  visibility: 'public',
  stack: ['React', 'Firebase', 'EmailJS', 'Firestore Rules', 'GitHub Pages'],
  nodes: [
    { id: 'public-ui', layer: 'ui', position: { x: 14, y: 25, z: 20 }, title: 'Public experience', technology: 'React + Vite', responsibility: t('Presenta servicios y abre el flujo de reserva.', 'Presents services and opens the booking flow.'), details: t('La aplicación pública y el dashboard se intercambian según el estado de Firebase Auth.', 'The public application and dashboard switch according to Firebase Auth state.'), evidence: [{ path: 'src/App.jsx', symbols: ['App'], previewId: 'consultora-app', sourceUrl: source('src/App.jsx') }] },
    { id: 'booking-ui', layer: 'business', position: { x: 31, y: 58, z: 38 }, title: 'Booking workflow', technology: 'BookingModal', responsibility: t('Valida datos, consulta disponibilidad y coordina la confirmación.', 'Validates data, queries availability, and coordinates confirmation.'), details: t('Ofrece horas de lunes a sábado, consulta bloqueos y verifica otra vez el slot antes de guardar.', 'Offers Monday-to-Saturday slots, queries blocks, and checks the slot again before saving.'), evidence: [{ path: 'src/components/BookingModal.jsx', symbols: ['checkAvailableSlots', 'isSlotStillAvailable', 'handleSubmitBooking'], previewId: 'consultora-booking', sourceUrl: source('src/components/BookingModal.jsx') }] },
    { id: 'booking-service', layer: 'services', position: { x: 55, y: 58, z: 30 }, title: 'Reservation service', technology: 'Firestore transaction', responsibility: t('Crea cita y bloqueo horario de manera atómica.', 'Creates the appointment and time block atomically.'), details: t('runTransaction evita que dos reservas ocupen el mismo identificador fecha_hora.', 'runTransaction prevents two bookings from taking the same date_time identifier.'), evidence: [{ path: 'src/services/emailService.js', symbols: ['saveBookingToFirestore'], previewId: 'consultora-transaction', sourceUrl: source('src/services/emailService.js') }] },
    { id: 'firestore', layer: 'data', position: { x: 82, y: 63, z: -6 }, title: 'Operational data', technology: 'Cloud Firestore', responsibility: t('Almacena disponibilidad, citas, pacientes, sesiones y notas.', 'Stores availability, appointments, patients, sessions, and notes.'), details: t('Las reglas permiten reservas públicas validadas y restringen los datos clínicos al administrador.', 'Rules allow validated public bookings and restrict clinical data to the administrator.'), evidence: [{ path: 'firestore.rules', symbols: ['validPublicAppointment', 'validAvailabilityBlock', 'isAdmin'], previewId: 'consultora-rules', sourceUrl: source('firestore.rules') }] },
    { id: 'email', layer: 'services', position: { x: 76, y: 30, z: 5 }, title: 'Notifications', technology: 'EmailJS', responsibility: t('Envía confirmación al paciente y aviso a la profesional.', 'Sends confirmation to the patient and notification to the professional.'), details: t('Los dos correos se ejecutan en paralelo después de guardar la cita.', 'Both emails run in parallel after the appointment is saved.'), evidence: [{ path: 'src/services/emailService.js', symbols: ['sendBookingEmails', 'sendTherapistEmail'], previewId: 'consultora-email', sourceUrl: source('src/services/emailService.js') }] },
    { id: 'auth', layer: 'services', position: { x: 36, y: 16, z: 6 }, title: 'Admin identity', technology: 'Firebase Auth', responsibility: t('Autentica la cuenta que accede al panel administrativo.', 'Authenticates the account that accesses the admin dashboard.'), details: t('App observa la sesión y AdminLogin usa email y contraseña.', 'App observes the session and AdminLogin uses email and password.'), evidence: [{ path: 'src/components/AdminLogin.jsx', symbols: ['handleLogin'], previewId: 'consultora-login', sourceUrl: source('src/components/AdminLogin.jsx') }, { path: 'src/App.jsx', symbols: ['onAuthStateChanged'] }] },
    { id: 'admin', layer: 'ui', position: { x: 60, y: 15, z: 22 }, title: 'Clinical workspace', technology: 'AdminDashboard', responsibility: t('Reúne agenda, pacientes, sesiones, notas y analítica.', 'Brings together schedule, patients, sessions, notes, and analytics.'), details: t('La interfaz se renderiza solamente cuando Firebase entrega un usuario autenticado.', 'The interface renders only when Firebase returns an authenticated user.'), evidence: [{ path: 'src/components/AdminDashboard.jsx', symbols: ['AdminDashboard'] }, { path: 'src/components/PatientManagement.jsx' }, { path: 'src/components/SessionHistory.jsx' }] },
    { id: 'deploy', layer: 'infra', position: { x: 88, y: 16, z: -28 }, title: 'Delivery', technology: 'GitHub Actions + Pages', responsibility: t('Construye con Node 22 e inyecta configuración desde GitHub Secrets.', 'Builds with Node 22 and injects configuration from GitHub Secrets.'), details: t('Cada push a main ejecuta npm ci, build y despliegue de dist.', 'Each push to main runs npm ci, build, and deploys dist.'), evidence: [{ path: '.github/workflows/deploy-pages.yml', sourceUrl: source('.github/workflows/deploy-pages.yml') }] },
  ],
  connections: [
    { id: 'public-booking', from: 'public-ui', to: 'booking-ui', label: t('abrir reserva', 'open booking'), kind: 'request' },
    { id: 'booking-read', from: 'booking-ui', to: 'firestore', label: t('consultar horarios', 'query slots'), kind: 'data' },
    { id: 'booking-transaction', from: 'booking-ui', to: 'booking-service', label: t('confirmar cita', 'confirm booking'), kind: 'request' },
    { id: 'transaction-data', from: 'booking-service', to: 'firestore', label: t('transacción atómica', 'atomic transaction'), kind: 'data' },
    { id: 'service-email', from: 'booking-service', to: 'email', label: t('confirmaciones', 'confirmations'), kind: 'request' },
    { id: 'public-auth', from: 'public-ui', to: 'auth', label: t('acceso admin', 'admin access'), kind: 'auth' },
    { id: 'auth-admin', from: 'auth', to: 'admin', label: t('sesión válida', 'valid session'), kind: 'auth' },
    { id: 'admin-data', from: 'admin', to: 'firestore', label: t('datos protegidos', 'protected data'), kind: 'data' },
    { id: 'deploy-public', from: 'deploy', to: 'public-ui', label: t('publicar dist', 'publish dist'), kind: 'deployment' },
  ],
  flows: [
    { id: 'book-appointment', title: t('Reservar una cita', 'Book an appointment'), description: t('Consulta, bloqueo atómico y correos de confirmación.', 'Query, atomic lock, and confirmation emails.'), steps: [
      { node: 'booking-ui', connection: 'public-booking', title: t('Validar datos', 'Validate data'), description: t('El formulario exige identidad, contacto y motivo.', 'The form requires identity, contact, and reason.'), packet: '{ nombre, rut, email, motivo }' },
      { node: 'firestore', connection: 'booking-read', title: t('Consultar disponibilidad', 'Query availability'), description: t('Se leen los bloques correspondientes a la fecha elegida.', 'Blocks for the selected date are read.'), packet: "where('fecha', '==', date)" },
      { node: 'booking-service', connection: 'booking-transaction', title: t('Iniciar transacción', 'Start transaction'), description: t('El slot se verifica nuevamente antes de escribir.', 'The slot is checked again before writing.'), packet: 'runTransaction(db)' },
      { node: 'firestore', connection: 'transaction-data', title: t('Persistir dos documentos', 'Persist two documents'), description: t('Cita y bloqueo horario se confirman juntos.', 'Appointment and time block are committed together.'), packet: 'appointments + availability_blocks' },
      { node: 'email', connection: 'service-email', title: t('Notificar', 'Notify'), description: t('EmailJS envía ambos correos en paralelo; un fallo no elimina la cita.', 'EmailJS sends both emails in parallel; a failure does not remove the booking.'), packet: 'Promise.all([client, therapist])' },
      { node: 'booking-ui', title: t('Confirmar resultado', 'Confirm result'), description: t('La UI diferencia reserva completa de reserva guardada sin correo.', 'The UI distinguishes a complete booking from one saved without email.'), packet: '{ success, emailStatus }' },
    ] },
    { id: 'admin-access', title: t('Acceder al panel', 'Access the dashboard'), description: t('La sesión autenticada habilita la operación clínica.', 'The authenticated session enables clinical operations.'), steps: [
      { node: 'auth', connection: 'public-auth', title: t('Autenticar credenciales', 'Authenticate credentials'), description: t('Firebase Auth valida email y contraseña.', 'Firebase Auth validates email and password.'), packet: 'signInWithEmailAndPassword' },
      { node: 'public-ui', title: t('Observar sesión', 'Observe session'), description: t('App recibe el usuario mediante onAuthStateChanged.', 'App receives the user through onAuthStateChanged.'), packet: 'adminUser' },
      { node: 'admin', connection: 'auth-admin', title: t('Montar dashboard', 'Mount dashboard'), description: t('La landing pública se reemplaza por el workspace.', 'The public landing is replaced by the workspace.'), packet: '<AdminDashboard />' },
      { node: 'firestore', connection: 'admin-data', title: t('Autorizar datos', 'Authorize data'), description: t('Las reglas comparan el email autenticado para colecciones privadas.', 'Rules compare the authenticated email for private collections.'), packet: 'isAdmin()' },
    ] },
  ],
  decisions: [
    { id: 'atomic-slot', kind: 'verified', category: 'DATA', title: t('Bloqueo horario atómico', 'Atomic time-slot lock'), context: t('Dos visitantes podrían elegir la misma hora antes de guardar.', 'Two visitors could choose the same time before saving.'), choice: t('Una transacción crea simultáneamente cita y bloqueo con un ID determinista.', 'A transaction simultaneously creates the booking and block with a deterministic ID.'), tradeoff: t('Evita dobles reservas, pero acopla el flujo a la disponibilidad de Firestore.', 'Prevents double bookings, but couples the flow to Firestore availability.'), evidence: ['src/services/emailService.js', 'src/components/BookingModal.jsx'] },
    { id: 'persist-before-email', kind: 'observation', category: 'SERVICES', title: t('Persistir antes de notificar', 'Persist before notifying'), context: t('El proveedor de correo puede fallar aunque la hora siga disponible.', 'The email provider can fail while the slot remains available.'), choice: t('Guardar primero y tratar el correo como resultado secundario.', 'Save first and treat email as a secondary result.'), tradeoff: t('La cita no se pierde, pero requiere avisar claramente si no llegó la confirmación.', 'The booking is not lost, but the UI must clearly report a missing confirmation.'), evidence: ['src/components/BookingModal.jsx', 'src/services/emailService.js'] },
    { id: 'rules-boundary', kind: 'verified', category: 'AUTH', title: t('Seguridad en la capa de datos', 'Security at the data layer'), context: t('El formulario público escribe datos, mientras el historial clínico debe permanecer privado.', 'The public form writes data while clinical history must stay private.'), choice: t('Reglas con validación de campos públicos y acceso administrativo para colecciones clínicas.', 'Rules validate public fields and require admin access for clinical collections.'), tradeoff: t('Las reglas son críticas y deben evolucionar junto al formulario y sus campos.', 'Rules are critical and must evolve alongside the form and its fields.'), evidence: ['firestore.rules'] },
  ],
  tour: [
    { node: 'public-ui', text: t('La experiencia comienza en la web pública.', 'The experience begins on the public website.') },
    { node: 'booking-ui', text: t('El flujo valida y consulta horas disponibles.', 'The flow validates and queries available slots.') },
    { node: 'booking-service', text: t('Una transacción protege la hora elegida.', 'A transaction protects the selected time.') },
    { node: 'firestore', text: t('Las reglas separan reservas públicas de datos clínicos.', 'Rules separate public bookings from clinical data.') },
    { node: 'email', text: t('Las notificaciones ocurren después de persistir.', 'Notifications happen after persistence.') },
    { node: 'admin', text: t('La sesión autorizada abre el workspace clínico.', 'The authorized session opens the clinical workspace.') },
  ],
}

export default consultora

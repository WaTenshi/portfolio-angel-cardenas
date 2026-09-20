const commit = 'c98278b17974d2ab12d78f8d90933efbcef2f571'
const url = (path) => `https://github.com/WaTenshi/consultora-psicologica/blob/${commit}/${path}`

export default {
  'consultora-app': { path: 'src/App.jsx', language: 'jsx', url: url('src/App.jsx'), code: `useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setAdminUser(user)
      setShowAdminLogin(false)
    } else {
      setAdminUser(null)
    }
    setLoadingAuth(false)
  })

  return () => unsubscribe()
}, [])` },
  'consultora-booking': { path: 'src/components/BookingModal.jsx', language: 'jsx', url: url('src/components/BookingModal.jsx'), code: `const checkAvailableSlots = async (date) => {
  try {
    setLoadingSlots(true)
    const dateString = formatDateKey(date)
    const availabilityRef = collection(db, 'availability_blocks')
    const q = query(availabilityRef, where('fecha', '==', dateString))
    const snapshot = await getDocs(q)
    const bookedTimes = snapshot.docs.map((doc) => doc.data().hora)
    const available = timeSlots.filter((time) => !bookedTimes.includes(time))
    setAvailableSlots(available)
  } catch (err) {
    console.error('Error al verificar horarios:', err)
    setAvailableSlots([])
  } finally {
    setLoadingSlots(false)
  }
}` },
  'consultora-transaction': { path: 'src/services/emailService.js', language: 'js', url: url('src/services/emailService.js'), code: `await runTransaction(db, async (transaction) => {
  const existingSlot = await transaction.get(availabilityRef)

  if (existingSlot.exists()) {
    throw new Error('Ese horario ya no está disponible. Elige otra hora.')
  }

  transaction.set(appointmentRef, appointmentData)
  transaction.set(availabilityRef, {
    fecha: bookingData.fecha,
    hora: bookingData.hora,
    tipo: 'sesion',
    createdAt: serverTimestamp(),
  })
})` },
  'consultora-rules': { path: 'firestore.rules', language: 'rules', url: url('firestore.rules'), code: `match /appointments/{appointmentId} {
  allow read, update, delete: if isAdmin();
  allow create: if isAdmin() || validPublicAppointment();
}

match /patients/{document=**} {
  allow read, write: if isAdmin();
}

match /sessions/{document=**} {
  allow read, write: if isAdmin();
}` },
  'consultora-email': { path: 'src/services/emailService.js', language: 'js', url: url('src/services/emailService.js'), code: `export const sendBookingEmails = async (bookingData) => {
  if (!hasEmailConfig()) {
    return { success: false, error: 'Servicio de correo no configurado' }
  }

  try {
    await Promise.all([
      sendClientEmail(bookingData),
      sendTherapistEmail(bookingData),
    ])
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error?.text || error?.message || String(error),
    }
  }
}` },
  'consultora-login': { path: 'src/components/AdminLogin.jsx', language: 'jsx', url: url('src/components/AdminLogin.jsx'), code: `const handleLogin = async (e) => {
  e.preventDefault()
  setError('')
  setLoading(true)

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    if (userCredential.user) {
      onLoginSuccess(userCredential.user)
      setEmail('')
      setPassword('')
    }
  } catch (err) {
    console.error('Error de login:', err)
    setError('Error al iniciar sesión')
  } finally { setLoading(false) }
}` },
}

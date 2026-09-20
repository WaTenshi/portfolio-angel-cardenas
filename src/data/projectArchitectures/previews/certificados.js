const commit = '63cfd551d00d8c94e0c892da9b0911673dc0499f'
const url = (path) => `https://github.com/WaTenshi/sistema-certificados/blob/${commit}/${path}`

export default {
  'cert-app': { path: 'src/App.tsx', language: 'tsx', url: url('src/App.tsx'), code: `export default function App() {
  const workspace = useCertificateWorkspace()
  const [workflowCollapsed, setWorkflowCollapsed] = useState(false)

  useEffect(() => {
    if (workspace.hasStudents && !previouslyHadStudents.current) {
      setWorkflowCollapsed(true)
    }
    previouslyHadStudents.current = workspace.hasStudents
  }, [workspace.hasStudents])

  return (
    <div className="app-shell">
      <AppHeader
        feedback={workspace.feedback}
        onReset={workspace.resetSystem}
        onDismissFeedback={workspace.dismissFeedback}
      />
    </div>
  )
}` },
  'cert-workspace': { path: 'src/hooks/useCertificateWorkspace.ts', language: 'ts', url: url('src/hooks/useCertificateWorkspace.ts'), code: `async function processExcel() {
  if (!excelFile) {
    notify('Selecciona un archivo Excel antes de continuar.', 'error')
    return
  }
  if (!hasTemplate) {
    notify(\`Primero carga una plantilla \${mode === 'png' ? 'PNG o JPG' : 'Word'}.\`, 'error')
    return
  }
  setBusy(true)
  notify('Procesando y validando el Excel...')
  try {
    if (mode === 'png') {
      const workbook = await parsePngWorkbook(excelFile)
      if (!workbook.sheetNames.length) throw new Error('No se encontraron alumnos válidos.')
    }
  } finally {
    setBusy(false)
  }
}` },
  'cert-excel': { path: 'src/services/excel.ts', language: 'ts', url: url('src/services/excel.ts'), code: `function readWorkbook(file: File): Promise<XLSX.WorkBook> {
  return file.arrayBuffer().then((buffer) => XLSX.read(buffer, { type: 'array' }))
}

export async function parsePngWorkbook(file: File): Promise<PngWorkbook> {
  const workbook = await readWorkbook(file)
  const studentsBySheet: Record<string, Student[]> = {}
  const sheetNames: string[] = []
  const incompleteRecords: IncompleteRecord[] = []

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json<RawRow>(sheet, { header: 1, defval: '' })
    let firstStudentRow = 0

    for (let index = 0; index < Math.min(30, rows.length); index += 1) {
      const row = rows[index]
      const rut = text(row?.[3])
      if (row?.[1] && row?.[2] && rut && (rut.includes('.') || rut.includes('-'))) {
        firstStudentRow = index
        break
      }
    }
  })
}` },
  'cert-layout': { path: 'src/utils/certificateLayout.ts', language: 'ts', url: url('src/utils/certificateLayout.ts'), code: `export function certificateFieldText(
  field: CertificateFieldKey,
  student: Student,
  code: string,
  texts: CertificateTextContent = defaultCertificateTexts,
): string {
  if (field === 'registro') return code
  if (field === 'nombre') return studentName(student)
  if (field === 'rut') return student.rut
  if (field === 'introText') return texts.introText
  if (field === 'curso') return student.curso
  if (field === 'senceLegend') return texts.senceLegend
  return certificateDetail(student, field).text
}` },
  'cert-png': { path: 'src/services/pngPdf.ts', language: 'ts', url: url('src/services/pngPdf.ts'), code: `export async function createPngCertificatePdf(
  student: Student,
  templateUrl: string,
  code: string,
  layout?: CertificateLayout,
  texts?: CertificateTextContent,
): Promise<jsPDF> {
  const canvas = await createCertificateCanvas(student, templateUrl, code, layout, texts)
  const imageBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error('No se pudo comprimir el certificado')),
      'image/jpeg',
      PDF_IMAGE_QUALITY,
    )
  })
  const imageData = new Uint8Array(await imageBlob.arrayBuffer())
}` },
  'cert-word': { path: 'src/services/word.ts', language: 'ts', url: url('src/services/word.ts'), code: `export async function renderFilledWordTemplate(
  container: HTMLElement,
  template: ArrayBuffer,
  student: Student,
  dataStyles?: WordDataStyles,
  includeSenceCode = false,
  senceCodeOverride = '',
  evaluationLabel = 'Evaluación',
): Promise<void> {
  container.replaceChildren()
  const documentBuffer = await fillWordTemplate(
    template,
    student,
    dataStyles,
    includeSenceCode,
    senceCodeOverride,
    evaluationLabel,
  )
  await renderAsync(documentBuffer, container, container, renderOptions)
  await waitForImages(container)
  await document.fonts?.ready
}` },
}

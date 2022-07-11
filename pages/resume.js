import { Container, Heading } from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'

// Core viewer
import { Worker, Viewer } from '@react-pdf-viewer/core'

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

const Resume = () => {
  return (
    <div>
    <Heading as="h3" fontSize={20} mb={4}>
        My Resume (Update: July 9 2022)
    </Heading>

    <Section>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.14.305/build/pdf.worker.min.js">
        <Viewer
            fileUrl="http://localhost:3000/Henry.Lin-CV.pdf"
        />
        </Worker>
    </Section>
    </div>
  )
}

export default Resume

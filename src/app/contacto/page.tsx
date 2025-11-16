'use client'

import { Navbar } from '@/components/Navbar'
import { ContactSection } from '@/components/ContactSection'
import { ToastContainer } from '@/components/ToastNotifications'
import styles from './contacto.module.css'

export default function ContactoPage() {
  return (
    <>
      <Navbar />
      <div className={styles.pageWrapper}>
        <ContactSection />
      </div>
      <ToastContainer />
    </>
  )
}

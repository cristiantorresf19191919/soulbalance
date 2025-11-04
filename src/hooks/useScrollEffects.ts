'use client'

import { useEffect, useState } from 'react'

export function useScrollEffects() {
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      
      // Scroll indicator visibility
      if (scrollY > 100) {
        setScrollIndicatorVisible(false)
      } else if (scrollY < 50) {
        setScrollIndicatorVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Smooth scroll for anchor links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Don't handle clicks inside accordions (they should expand/collapse, not scroll)
      const accordion = target.closest('[role="region"], .MuiAccordion-root, [class*="categoryAccordion"], [class*="categorySummary"]')
      if (accordion) {
        return
      }
      
      const link = target.closest('a[href^="#"]')
      if (link) {
        e.preventDefault()
        const href = link.getAttribute('href')
        if (href && href !== '#') {
          const element = document.querySelector(href)
          if (element) {
            const navHeight = 80
            const targetPosition = (element as HTMLElement).offsetTop - navHeight
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            })
          }
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // Scroll indicator
  useEffect(() => {
    const scrollIndicator = document.querySelector('.scroll-indicator')
    if (scrollIndicator) {
      if (scrollIndicatorVisible) {
        scrollIndicator.classList.remove('hidden')
        scrollIndicator.classList.add('visible')
      } else {
        scrollIndicator.classList.add('hidden')
        scrollIndicator.classList.remove('visible')
      }
    }
  }, [scrollIndicatorVisible])
}


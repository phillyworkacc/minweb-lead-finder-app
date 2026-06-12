'use client'
import './Card.css'
import { CSSProperties } from 'react'

export default function LoadingCard ({ styles }: { styles: CSSProperties }) {
   return (
      <div className='loading-card' style={styles} />
   )
}

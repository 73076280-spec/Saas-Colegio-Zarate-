import campus from '../assets/campus-zarate.webp'
export default function CampusVisual({ compact = false }: { compact?: boolean }) {
  return <figure className={'campus-visual ' + (compact ? 'campus-visual-compact' : '')}>
    <img src={campus} alt="Infraestructura educativa de Colegios Zárate" width="1400" height="800" loading="lazy" />
    <figcaption><span className="campus-label">COLEGIOS ZÁRATE</span><span>Un espacio para construir tu futuro.</span></figcaption>
  </figure>
}

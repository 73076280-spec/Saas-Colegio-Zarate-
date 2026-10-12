import logo from '../assets/colegios-zarate.webp'
export default function Brand({ className = '' }: { className?: string }) {
  return <img src={logo} alt="Colegios Zárate" width="470" height="130" className={'h-auto w-44 max-w-full object-contain ' + className} />
}

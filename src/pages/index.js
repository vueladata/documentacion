import React, {useState} from 'react';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

const destinations = [
  {name: 'Bogotá', detail: 'Cultura, historia y altura', image: 'bogota'},
  {name: 'Madrid', detail: 'Arte, gastronomía y más', image: 'madrid'},
  {name: 'San Andrés', detail: 'Playas que te esperan', image: 'san-andres'},
];

function Brand() {
  const homeUrl = useBaseUrl('/');
  const logoUrl = useBaseUrl('/img/vueladata-logo.png');
  return <a className={styles.brand} href={homeUrl} aria-label="VuelaData, inicio"><img className={styles.brandLogo} src={logoUrl} alt="VuelaData" /><span>Vuela<span>Data</span></span></a>;
}

function Header() {
  const docsUrl = useBaseUrl('/docs');
  return <header className={styles.header}>
    <Brand/>
    <nav className={styles.navigation} aria-label="Navegación principal">
      <a href="#buscar">Vuelos</a><a href="#destinos">Destinos</a><a href="#informacion">Información</a><a href="#ayuda">Ayuda</a>
    </nav>
    <div className={styles.headerActions}><button className={styles.language} type="button" aria-label="Idioma">◎ ES⌄</button><a className={styles.login} href={docsUrl}>Ver documentación</a></div>
  </header>;
}

function BookingSearch() {
  const [tab, setTab] = useState('flight');
  const [origin, setOrigin] = useState('Bogotá (BOG)');
  const [destination, setDestination] = useState('Madrid (MAD)');
  const [departure, setDeparture] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState('1 pasajero');
  const [code, setCode] = useState('');
  const [notice, setNotice] = useState('');

  function submitSearch(event) {
    event.preventDefault();
    if (tab === 'flight') {
      setNotice('La búsqueda visual está lista. La API actual todavía no incluye un endpoint de búsqueda de vuelos.');
    } else if (tab === 'trip') {
      setNotice('La consulta de reservas requiere un endpoint de itinerarios y una validación segura del pasajero, aún no disponible en la API actual.');
    } else {
      setNotice('La API actual gestiona compensaciones y pagos. Para consultar el estado de un vuelo necesitamos un endpoint específico de vuelos.');
    }
  }

  return <section className={styles.bookingWrap} id="buscar">
    <div className={styles.tabs} role="tablist" aria-label="Servicios de viaje">
      <button type="button" role="tab" aria-selected={tab === 'flight'} className={tab === 'flight' ? styles.tabActive : ''} onClick={() => {setTab('flight'); setNotice('');}}>✈ <span>Buscar vuelo</span></button>
      <button type="button" role="tab" aria-selected={tab === 'trip'} className={tab === 'trip' ? styles.tabActive : ''} onClick={() => {setTab('trip'); setNotice('');}}>▣ <span>Mis viajes</span></button>
      <button type="button" role="tab" aria-selected={tab === 'status'} className={tab === 'status' ? styles.tabActive : ''} onClick={() => {setTab('status'); setNotice('');}}>◷ <span>Estado de vuelo</span></button>
    </div>
    <form className={styles.searchForm} onSubmit={submitSearch}>
      {tab === 'flight' ? <>
        <label>Origen<select value={origin} onChange={e => setOrigin(e.target.value)}><option>Bogotá (BOG)</option><option>Medellín (MDE)</option><option>Cartagena (CTG)</option><option>Cali (CLO)</option></select></label>
        <button className={styles.swap} type="button" aria-label="Intercambiar origen y destino" onClick={() => {setOrigin(destination);setDestination(origin);}}>⇄</button>
        <label>Destino<select value={destination} onChange={e => setDestination(e.target.value)}><option>Madrid (MAD)</option><option>Bogotá (BOG)</option><option>Medellín (MDE)</option><option>Cartagena (CTG)</option><option>San Andrés (ADZ)</option></select></label>
        <label>Fecha ida<input type="date" value={departure} onChange={e => setDeparture(e.target.value)}/></label>
        <label>Fecha regreso<input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)}/></label>
        <label>Pasajeros<select value={passengers} onChange={e => setPassengers(e.target.value)}><option>1 pasajero</option><option>2 pasajeros</option><option>3 pasajeros</option><option>4 pasajeros</option></select></label>
      </> : tab === 'trip' ? <label className={styles.wideField}>Código de reserva o referencia<input value={code} onChange={e => setCode(e.target.value)} placeholder="Ej. ABC123"/></label> : <label className={styles.wideField}>Número de vuelo<input value={code} onChange={e => setCode(e.target.value)} placeholder="Ej. VD204"/></label>}
      <button className={styles.searchButton} type="submit">{tab === 'flight' ? 'Buscar vuelos' : tab === 'trip' ? 'Consultar viaje' : 'Consultar estado'} <span>→</span></button>
    </form>
    {notice && <div className={styles.notice} role="status">{notice}</div>}
  </section>;
}

function Hero() {
  return <section className={styles.hero}>
    <div className={styles.heroImage}/>
    <div className={styles.heroShade}/>
    <Header/>
    <div className={styles.heroCopy}>
      <p className={styles.eyebrow}>TU PRÓXIMO VIAJE COMIENZA AQUÍ</p>
      <h1>Cada viaje<br/>conecta <span>historias</span></h1>
      <p>En VuelaData te acompañamos en cada etapa de tu viaje con información clara, actualizada y confiable.</p>
    </div>
    <BookingSearch/>
  </section>;
}

function Benefits() {
  const items = [
    ['▱', 'Consulta tu vuelo', 'Estado y horarios del viaje'],
    ['▦', 'Gestiona tu itinerario', 'Tu información en un solo lugar'],
    ['♧', 'Recibe notificaciones', 'Cambios y actualizaciones'],
    ['⌁', 'Conexiones más simples', 'Información para cada tramo'],
    ['♢', 'Información confiable', 'Viaja con mayor tranquilidad'],
  ];
  return <section className={styles.benefits}>{items.map(([icon, title, desc]) => <article className={styles.benefit} key={title}><span>{icon}</span><div><strong>{title}</strong><p>{desc}</p></div></article>)}</section>;
}

function Destinations() {
  return <section className={styles.destinations} id="destinos">
    <div className={styles.destinationIntro}><p className={styles.sectionEyebrow}>EXPLORA</p><h2>Tu viaje,<br/>más que un destino</h2><p>Inspírate y empieza a imaginar tu próxima aventura.</p></div>
    {destinations.map((item, index) => <article className={`${styles.destinationCard} ${styles[item.image]}`} key={item.name}><div className={styles.destinationOverlay}/><div className={styles.destinationText}><h3>{item.name}</h3><p>{item.detail}</p></div><span className={styles.destinationArrow}>↗</span></article>)}
  </section>;
}

function Information() {
  return <section className={styles.information} id="informacion">
    <div className={styles.infoCopy}><p className={styles.sectionEyebrow}>SIEMPRE CONTIGO</p><h2>Información que<br/>te lleva más lejos</h2><p>Desde la consulta de tu viaje hasta la información sobre una incidencia, VuelaData busca ayudarte a entender qué sucede y cuáles son los siguientes pasos.</p><a href="#ayuda">Conoce cómo podemos ayudarte <span>→</span></a></div>
    <div className={styles.infoVisual} aria-hidden="true"><div className={styles.worldGrid}/><div className={styles.flightPath}>✈ <span>· · · · · · · · · · · · · · ·</span> ✈</div><div className={styles.infoStats}><div><strong>Tu viaje</strong><span>En un solo lugar</span></div><div><strong>Información</strong><span>Clara y útil</span></div><div><strong>VuelaData</strong><span>Contigo en el camino</span></div></div></div>
  </section>;
}

function PassengerSupport() {
  return <section className={styles.support} id="ayuda">
    <div><p className={styles.sectionEyebrow}>¿NECESITAS AYUDA?</p><h2>Estamos para acompañarte</h2><p>Consulta información sobre incidencias y compensaciones relacionadas con tu viaje.</p></div>
    <div className={styles.supportCard}><span className={styles.supportIcon}>♡</span><div><strong>Incidencias y compensaciones</strong><p>Conoce las reglas generales que contempla VuelaData para gestionar compensaciones por retrasos o cancelaciones.</p><small>La consulta personalizada todavía requiere endpoints de pasajero y reserva.</small></div><a href="#mis-viajes" aria-label="Ir a mis viajes">→</a></div>
  </section>;
}

function Footer() {
  return <footer className={styles.footer}><Brand/><p>Tu viaje, mejor informado.</p><div><a href="#buscar">Vuelos</a><a href="#mis-viajes">Mis viajes</a><a href="#ayuda">Ayuda</a><a href="/docs">Documentación técnica</a></div><small>© {new Date().getFullYear()} VuelaData · Prototipo de experiencia de viaje</small></footer>;
}

export default function Home() {
  return <Layout title="Viaja con VuelaData" description="VuelaData: consulta tu viaje, organiza tu itinerario y mantente informado.">
    <main className={styles.page}>
      <Hero/>
      <Benefits/>
      <Destinations/>
      <Information/>
      <PassengerSupport/>
      <Footer/>
    </main>
  </Layout>;
}

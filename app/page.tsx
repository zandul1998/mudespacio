import Catalog from './Catalog';
import {wa} from './shared';

const classes=wa('¡Hola Mud! Quisiera conocer los horarios y cómo inscribirme a las clases de cerámica.');
const general=wa('¡Hola Mud! Quisiera hacerles una consulta.');

export default function Home(){return <>
<a className="skip" href="#contenido">Ir al contenido</a>
<div className="home-strip" aria-label="Información destacada"><span>Taller de cerámica en Wilde</span><span>Un espacio para crear con las manos</span><span>Merch hecha en Mud</span></div>
<header className="home-header home-wrap">
  <a className="home-logo" href="#inicio" aria-label="Mud Espacio, inicio">Mud<span>ESPACIO</span></a>
  <nav aria-label="Navegación principal"><a href="#inicio">Inicio</a><a href="#espacio">El espacio</a><a href="#clases">Clases</a><a href="#merch">Merch</a><a href="#contacto">Contacto</a></nav>
  <a className="home-header-action" href={general} target="_blank" rel="noreferrer">Escribinos</a>
</header>
<main id="contenido">
  <section className="home-hero home-wrap" id="inicio">
    <div className="home-hero-copy"><p className="home-kicker">CERÁMICA · ENCUENTROS · OBJETOS</p><h1>Mud<br/><em>Espacio</em></h1><p>Un taller para bajar un cambio, aprender cerámica y darle forma a tus ideas. También hacemos objetos y merch con la identidad de Mud.</p><div className="home-actions"><a className="home-button" href={classes} target="_blank" rel="noreferrer">Quiero sumarme a las clases</a><a className="home-button outline" href="#merch">Ver la merch</a></div></div>
    <div className="home-hero-visual"><div className="home-hero-image"><img src="/og.png" alt="Cuenco de cerámica artesanal de Mud Espacio"/></div><span className="home-flower" aria-hidden="true"></span><span className="home-seal">Hecho<br/><strong>con las manos</strong><br/>en Wilde</span></div>
  </section>

  <section className="home-paths home-wrap" aria-label="Conocé Mud">
    <a className="home-path coral" href="#clases"><span>01</span><strong>Clases de<br/>cerámica</strong><small>Aprender y explorar →</small></a>
    <a className="home-path mustard" href="#espacio"><span>02</span><strong>El espacio</strong><small>Conocé Mud →</small></a>
    <a className="home-path sage" href="#merch"><span>03</span><strong>Merch<br/>de Mud</strong><small>Objetos por encargo →</small></a>
    <a className="home-path lilac" href="https://www.instagram.com/mudespacio/" target="_blank" rel="noreferrer"><span>04</span><strong>Así se<br/>vive Mud</strong><small>Ver Instagram</small></a>
  </section>

  <section className="home-values"><div className="home-wrap"><article><b>01</b><div><h3>Un ratito para vos</h3><p>Crear también es encontrarse.</p></div></article><article><b>02</b><div><h3>Aprender haciendo</h3><p>Exploramos materiales y procesos.</p></div></article><article><b>03</b><div><h3>Taller en Wilde</h3><p>Un espacio cercano para compartir.</p></div></article></div></section>

  <section className="home-about home-wrap home-section" id="espacio"><div className="home-about-title"><p className="home-kicker">HOLA, SOMOS MUD</p><h2>Hacer lugar a<br/><em>lo creativo.</em></h2><span aria-hidden="true">MUD · WILDE · BARRO ·</span></div><div className="home-about-copy"><p className="home-lead">En Mud nos encontramos alrededor de la cerámica: las manos en movimiento, las ideas tomando forma y el placer de crear algo propio.</p><p>Somos un taller en Wilde, Buenos Aires. Un espacio para aprender, explorar materiales y compartir el proceso con otras personas.</p><a className="home-text-link" href="https://www.instagram.com/mudespacio/" target="_blank" rel="noreferrer">Conocé el día a día en Instagram ↗</a></div></section>

  <section className="home-classes" id="clases"><div className="home-wrap home-section"><div className="home-section-head"><div><p className="home-kicker">TU PRÓXIMO MOMENTO CREATIVO</p><h2>Nos vemos<br/><em>en el taller.</em></h2></div><div><p>Si tenés ganas de empezar o seguir explorando la cerámica, escribinos. Te contamos cómo son las clases y qué horarios hay disponibles.</p><a className="home-button light" href={classes} target="_blank" rel="noreferrer">Consultar clases e inscripción</a></div></div><div className="home-steps">{[['01','Charlamos','Contanos qué te gustaría aprender.'],['02','Buscamos tu horario','Vemos días, horarios y lugares disponibles.'],['03','Te sumás a Mud','Coordinamos todo para que empieces.']].map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>

  <section className="home-merch home-wrap home-section" id="merch"><div className="home-section-head merch-head"><div><p className="home-kicker">UN PEDACITO DE MUD CON VOS</p><h2>Objetos con<br/><em>nuestra identidad.</em></h2></div><p>Para darte un gusto o hacer un regalo. Elegí lo que te guste y escribinos para coordinar tu encargo.</p></div><Catalog/></section>

  <section className="home-contact home-wrap" id="contacto"><span className="home-contact-mark" aria-hidden="true"></span><div><p className="home-kicker">EL PRIMER PASO ES UN HOLA</p><h2>¿Hacemos algo lindo?</h2><p>Clases, merch o cualquier consulta: estamos del otro lado.</p></div><a className="home-button" href={general} target="_blank" rel="noreferrer">Hablemos por WhatsApp</a></section>
</main>
<a className="mobile-contact" href={classes} target="_blank" rel="noreferrer" aria-label="Consultar clases por WhatsApp">Consultar clases</a>
<footer className="home-footer"><div className="home-wrap"><div><a className="home-logo inverse" href="#inicio">Mud<span>ESPACIO</span></a><p>Taller de cerámica y espacio creativo<br/>en Wilde, Buenos Aires.</p></div><div><h3>Encontranos</h3><a href="https://www.instagram.com/mudespacio/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="tel:+5491139148205">11 3914-8205</a></div><div><h3>En el sitio</h3><a href="#clases">Clases</a><a href="#merch">Merch</a><a href="/admin">Administrar</a></div><span>© {new Date().getFullYear()} Mud Espacio</span></div></footer>
</>}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ h: "23", m: "59", s: "53" });
  const [liveUsers, setLiveUsers] = useState(15421);
  const [stock, setStock] = useState(17);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handlePaymentClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Cuando hacen clic, el enlace se abre en una pestaña nueva (por el target="_blank"),
    // y redirigimos la pestaña actual mágicamente a la página de gracias de fondo.
    setTimeout(() => {
      window.location.href = "/gracias";
    }, 500);
  };

  useEffect(() => {
    const key = "cv_deadline";
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(key);
    } catch (e) { }

    let deadline: number;
    if (saved) {
      deadline = parseInt(saved, 10);
      if (isNaN(deadline)) deadline = Date.now() + 23 * 60 * 60 * 1000;
    } else {
      deadline = Date.now() + 23 * 60 * 60 * 1000;
      try { localStorage.setItem(key, deadline.toString()); } catch (e) { }
    }

    const tick = () => {
      let diff = deadline - Date.now();
      if (diff <= 0 || isNaN(diff)) {
        deadline = Date.now() + 23 * 60 * 60 * 1000;
        try { localStorage.setItem(key, deadline.toString()); } catch (e) { }
        diff = deadline - Date.now();
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      const pad = (n: number) => (n < 10 ? "0" + n : n.toString());
      const hh = pad(h), mm = pad(m), ss = pad(s);
      setTimeLeft({ h: hh, m: mm, s: ss });

      // Vanilla JS override to forcefully update DOM even if React suspends render
      document.querySelectorAll(".th").forEach(el => el.textContent = hh);
      document.querySelectorAll(".tm").forEach(el => el.textContent = mm);
      document.querySelectorAll(".ts").forEach(el => el.textContent = ss);
    };

    let interval1: ReturnType<typeof setInterval>;
    let intervalOnLive: ReturnType<typeof setInterval>;
    let timeoutStock: ReturnType<typeof setTimeout>;

    let base = 15420;
    let currStock = 17;

    const startTimers = () => {
      tick();
      interval1 = setInterval(tick, 1000);

      intervalOnLive = setInterval(() => {
        base += Math.floor(Math.random() * 2);
        setLiveUsers(base);
      }, 8000);

      const runStock = () => {
        if (currStock > 3 && Math.random() > 0.4) {
          currStock--;
          setStock(currStock);
        }
        timeoutStock = setTimeout(runStock, 180000 + Math.random() * 240000);
      };
      timeoutStock = setTimeout(runStock, 180000);
    };

    const stopTimers = () => {
      clearInterval(interval1);
      clearInterval(intervalOnLive);
      clearTimeout(timeoutStock);
    };

    startTimers();

    const restartAll = () => {
      stopTimers();
      startTimers();
    };

    // Safari bfcache persist bypass: constantly ensure it runs on any visual return
    window.addEventListener("pageshow", restartAll);
    window.addEventListener("focus", restartAll);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") restartAll();
    });

    return () => {
      stopTimers();
      window.removeEventListener("pageshow", restartAll);
      window.removeEventListener("focus", restartAll);
    };
  }, []);

  return (
    <>
      {/* URGENCY STRIP */}
      <div className="urgency-strip">
        ⚠️ <b>Precio sube la próxima semana.</b> Activa tu acceso PRO hoy por solo <span>$18.900/mes</span> — garantizado.
      </div>

      {/* NAV */}
      <nav>
        <div className="nav-logo">
          {/* Canva Logo Local Image */}
          <img src="/canva.png" alt="Canva Logo" style={{ height: "30px", width: "auto", objectFit: "contain" }} />
          <span className="nav-logo-text">Canva<span>PRO</span></span>
        </div>
        <a href="https://checkout.bold.co/payment/LNK_CA38MMMYKT" target="_blank" rel="noopener noreferrer" onClick={handlePaymentClick} className="btn-primary" style={{ fontSize: "14px", padding: "12px 24px", maxWidth: "none", width: "auto" }}>💳 Pagar ahora</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="container" style={{ maxWidth: "700px" }}>
          <div className="reveal">
            <div className="hero-badge"><span className="hero-badge-dot"></span> 🇨🇴 +<span className="live-num">{liveUsers.toLocaleString('es-CO')}</span> creadores activos en Colombia</div>
            <h1 className="hero-title">Diseña como <span>PRO.</span><br />Sin pagar como PRO.</h1>
            <p className="hero-sub">El mismo Canva Pro de la tienda oficial habilitado en tu <b>correo personalizado o a dominio propio</b> — sin limitaciones y a menos de la mitad del precio. Funciona en todos tus dispositivos.</p>
          </div>

          <div className="reveal">
            <div className="price-compare">
              <div className="price-old">Tienda oficial: <span>$50.000+/mes</span></div>
              <div style={{ width: "1px", height: "32px", background: "rgba(255,255,255,.1)" }}></div>
              <div className="price-new">$18.900 <small>COP/mes</small></div>
            </div>
          </div>

          <div className="reveal">
            <div className="countdown-box">
              <div className="cd-label">⏳ Precio especial termina en</div>
              <div className="cd-display">
                <div className="cd-block"><span className="cd-num th">{timeLeft.h}</span><span className="cd-unit">horas</span></div>
                <span className="cd-sep">:</span>
                <div className="cd-block"><span className="cd-num tm">{timeLeft.m}</span><span className="cd-unit">min</span></div>
                <span className="cd-sep">:</span>
                <div className="cd-block"><span className="cd-num ts">{timeLeft.s}</span><span className="cd-unit">seg</span></div>
              </div>
              <div className="cd-stock">Solo <b><span className="stock-num">{stock}</span> cupos disponibles</b> este mes — <span>activa el tuyo ahora</span></div>
            </div>
          </div>

          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="price-warning">⚠️ El precio sube a $29.900 la próxima semana. Activa hoy y congelas $18.900.</div>
            <p style={{ fontSize: "13px", color: "var(--green)", fontWeight: 600, marginBottom: "12px" }}>⚡ <span className="live-num">{liveUsers.toLocaleString('es-CO')}</span> creadores ya lo activaron — activa el tuyo antes de que se agoten los cupos</p>
            <a href="https://checkout.bold.co/payment/LNK_CA38MMMYKT" target="_blank" rel="noopener noreferrer" onClick={handlePaymentClick} className="btn-primary">💳 Pagar ahora — $18.900/mes</a>
            <div style={{ marginTop: "10px" }}>
              <div style={{ fontSize: "12px", color: "var(--gray)", marginBottom: "6px" }}>🔒 Pago seguro · Entrega inmediata · Garantía real</div>
              <a href="https://wa.me/message/TEIMDMVA6SBTC1" style={{ fontSize: "12px", color: "var(--gray)", textDecoration: "underline" }}>¿Tienes dudas? Escríbenos por WhatsApp</a>
            </div>
          </div>

          <div className="reveal">
            <div className="devices">
              <div className="device-chip">📱 iPhone</div>
              <div className="device-chip">📱 Android</div>
              <div className="device-chip">💻 PC Windows</div>
              <div className="device-chip">🍎 Mac</div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="trust-bar">
        <div className="trust-grid">
          <div className="trust-item"><div className="num">+15K</div><div className="label">Clientes activos</div></div>
          <div className="trust-item"><div className="num">+200</div><div className="label">Reseñas reales</div></div>
          <div className="trust-item"><div className="num">6+</div><div className="label">Meses recurrentes</div></div>
          <div className="trust-item"><div className="num">2h</div><div className="label">Entrega máxima</div></div>
        </div>
      </div>

      {/* WARNING SECTION */}
      <section className="apk-section">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="reveal">
            <span className="section-tag">Esto es lo que necesitas saber</span>
            <h2 className="section-title">No. <span style={{ color: "#FF6B6B" }}>No es una APK pirata.</span><br />Y eso lo cambia todo.</h2>
            <p className="section-sub">La pregunta que nos hacen todos los días — y la respondemos con la verdad completa.</p>
          </div>
          <div className="apk-grid reveal">
            <div className="apk-card apk-bad">
              <span className="apk-tag tag-bad">❌ APK / Pirata</span>
              <div className="apk-list">
                <div className="apk-item"><span className="icon-bad">✗</span>NO funciona en iPhone — iOS no las permite</div>
                <div className="apk-item"><span className="icon-bad">✗</span>Dura días o semanas, luego falla</div>
                <div className="apk-item"><span className="icon-bad">✗</span>No tienes miles de plantillas en la nube</div>
                <div className="apk-item"><span className="icon-bad">✗</span>Riesgo de virus en tu dispositivo</div>
                <div className="apk-item"><span className="icon-bad">✗</span>Sin soporte cuando falla</div>
              </div>
            </div>
            <div className="apk-card apk-good">
              <span className="apk-tag tag-good">✅ Nuestro acceso original</span>
              <div className="apk-list">
                <div className="apk-item"><span className="icon-good">✓</span><b style={{ color: "#fff" }}>SÍ funciona en todos lados</b> — 100% original en tu cuenta</div>
                <div className="apk-item"><span className="icon-good">✓</span>Acceso estable, oficial y en la nube</div>
                <div className="apk-item"><span className="icon-good">✓</span>Garantía real de devolución</div>
                <div className="apk-item"><span className="icon-good">✓</span>Seguro — es una invitación a equipo premium</div>
                <div className="apk-item"><span className="icon-good">✓</span>Precio fijo: $18.900/mes</div>
              </div>
            </div>
          </div>
          <div className="reveal" style={{ marginTop: "36px" }}>
            <p style={{ fontSize: "14px", color: "var(--green)", fontWeight: 600, marginBottom: "14px" }}>🔐 Es el mismo acceso premium que obtienes en la tienda oficial. La diferencia es el precio al pertenecer a nuestro equipo exclusivo.</p>
            <a href="https://checkout.bold.co/payment/LNK_CA38MMMYKT" target="_blank" rel="noopener noreferrer" onClick={handlePaymentClick} className="btn-primary">💳 Quiero el acceso original — $18.900</a>
          </div>
        </div>
      </section>

      {/* COURSE SECTION */}
      <section className="course-section">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="reveal">
            <span className="section-tag">Incluido sin costo extra</span>
            <h2 className="section-title">No solo obtienes Canva Pro.<br /><span>Obtienes todo esto también.</span></h2>
          </div>
          <div className="course-card reveal">
            <span className="course-badge-big">🎓 GRATIS CON TU ACCESO</span>
            <h3 className="course-title">"Diseñador Master en <span>Canva"</span></h3>
            <p style={{ fontSize: "14px", color: "var(--gray2)", lineHeight: 1.65 }}>Aprende a crear publicaciones profesionales desde el principio — Carruseles virales, posts que venden y diseños premium. Sin costo adicional.</p>
            <div className="resources-grid">
              <div className="resource-item">
                <span className="resource-icon">🎨</span>
                <div className="resource-text"><b>+5.000 recursos editables</b>Plantillas y mockups de alta conversión</div>
              </div>
              <div className="resource-item">
                <span className="resource-icon">📚</span>
                <div className="resource-text"><b>Masterclass paso a paso</b>De cero a diseñar como agencia</div>
              </div>
              <div className="resource-item">
                <span className="resource-icon">🎵</span>
                <div className="resource-text"><b>Audio y Video Pro</b>Toda la galería premium desbloqueada</div>
              </div>
              <div className="resource-item">
                <span className="resource-icon">✨</span>
                <div className="resource-text"><b>Brand Kit Ilimitado</b>Tus fuentes y paletas de colores guardadas</div>
              </div>
            </div>
            <div className="course-value">Valor real de recursos y curso: <b>$50.000</b> — incluido <b style={{ color: "var(--green)" }}>completamente gratis</b> con tu acceso PRO</div>
          </div>
          <div className="reveal" style={{ marginTop: "28px" }}>
            <a href="https://checkout.bold.co/payment/LNK_CA38MMMYKT" target="_blank" rel="noopener noreferrer" onClick={handlePaymentClick} className="btn-primary">💳 Quiero el PRO + recursos — $18.900</a>
          </div>
        </div>
      </section>

      {/* IMAGE SHOWCASE */}
      <section className="showcase">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="reveal">
            <span className="section-tag">Así se ve en acción</span>
            <h2 className="section-title">Diseño profesional<br /><span>desde cualquier dispositivo</span></h2>
          </div>
          <div className="showcase-grid reveal">
            <div className="showcase-card">
              <Image src="/canva_setup.png" alt="Setup diseño profesional" width={500} height={240} style={{ height: "240px" }} />
              <div className="showcase-label">Diseños ilimitados <span>con Magic Studio</span></div>
            </div>
            <div className="showcase-card">
              <Image src="/canva_laptop.png" alt="Editando en laptop" width={500} height={240} style={{ height: "240px" }} />
              <div className="showcase-label">Edición en la web — <span>acceso 100% oficial</span></div>
            </div>
            <div className="showcase-card" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--navy)", padding: "32px" }}>
              <div style={{ textAlign: "center" }}>
                <svg viewBox="0 0 24 24" fill="var(--cyan)" style={{ width: "80px", height: "80px", margin: "0 auto 16px" }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9h2v9h-2zm-4 0v-5h2v5H7zm8 0v-7h2v7h-2z" />
                </svg>
                <p style={{ fontSize: "14px", color: "var(--gray2)" }}>La plataforma #1 en diseño<br />gráfico y web 🇨🇴</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="benefits">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="reveal">
            <span className="section-tag">¿Qué obtienes exactamente?</span>
            <h2 className="section-title">Todo lo que incluye<br /><span>tu acceso PRO original</span></h2>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card reveal">
              <div className="benefit-icon">🚫</div>
              <div className="benefit-title">PNG Transparente y SVG</div>
              <div className="benefit-desc">Descarga logos brillantes sin fondos. Exporta tus diseños en alta calidad.</div>
              <div className="benefit-result">→ Archivos 100% profesionales</div>
            </div>
            <div className="benefit-card reveal">
              <div className="benefit-icon">✨</div>
              <div className="benefit-title">Magic Studio AI</div>
              <div className="benefit-desc">Generación de imágenes con inteligencia artificial, expansión mágica y redacción PRO.</div>
              <div className="benefit-result">→ Multitudplica tu creatividad con IA</div>
            </div>
            <div className="benefit-card reveal">
              <div className="benefit-icon">📤</div>
              <div className="benefit-title">Millones de elementos Premium</div>
              <div className="benefit-desc">Acceso ilimitado a más de 100 millones de plantillas premium, fotos de stock, gráficos y videos.</div>
              <div className="benefit-result">→ No más elementos con la coronita</div>
            </div>
            <div className="benefit-card reveal">
              <div className="benefit-icon">📱</div>
              <div className="benefit-title">Kit de Marca Integrado</div>
              <div className="benefit-desc">Sube tus propios logos, usa tus fuentes personalizadas y mantén colores de tu empresa a un clic.</div>
              <div className="benefit-result">→ Consistencia completa en tus redes</div>
            </div>
            <div className="benefit-card reveal">
              <div className="benefit-icon">🎓</div>
              <div className="benefit-title">Espacio ampliado (1TB)</div>
              <div className="benefit-desc">Ten almacenamiento ilimitado de tus fotos y videos en alta resolución directamente en tu cuenta.</div>
              <div className="benefit-result">→ Más capacidad sin restricciones</div>
            </div>
            <div className="benefit-card reveal">
              <div className="benefit-icon">🛡</div>
              <div className="benefit-title">Garantía real de devolución</div>
              <div className="benefit-desc">Si por cualquier razón no funciona o no te gusta, te devolvemos el 100% del dinero. Sin pegas.</div>
              <div className="benefit-result">→ Cero estrés, todo el valor</div>
            </div>
          </div>
        </div>
      </section>

      {/* MID CTA */}
      <section className="mid-cta">
        <div className="container reveal" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: "var(--green)", fontWeight: 600, marginBottom: "12px" }}>⚡ <span className="stock-num">{stock}</span> cupos disponibles · El precio sube la próxima semana</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", background: "var(--navy)", border: "1px solid rgba(226,75,74,.2)", borderRadius: "100px", padding: "10px 20px", marginBottom: "20px" }}>
            <span style={{ fontSize: "12px", color: "#FF6B6B", fontWeight: 600 }}>⏳ Oferta termina en</span>
            <span style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, fontSize: "16px", color: "#FF6B6B" }}><span className="th">{timeLeft.h}</span>:<span className="tm">{timeLeft.m}</span>:<span className="ts">{timeLeft.s}</span></span>
          </div>
          <br />
          <a href="https://checkout.bold.co/payment/LNK_CA38MMMYKT" target="_blank" rel="noopener noreferrer" onClick={handlePaymentClick} className="btn-primary">💳 Activar mi Canva Pro ahora — $18.900</a>
          <p style={{ fontSize: "12px", color: "var(--gray)", marginTop: "10px" }}>🔒 Nequi · Daviplata · Transferencia · Tarjeta · Entrega al instante</p>
        </div>
      </section>

      {/* VS TABLE */}
      <section className="vs-table">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="reveal">
            <span className="section-tag">Comparativo honesto</span>
            <h2 className="section-title">Nosotros vs<br /><span>las otras opciones</span></h2>
          </div>
          <div className="table-wrap reveal">
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", color: "var(--gray)" }}>Característica</th>
                  <th className="col-bad">APK / Cuenta Gratis</th>
                  <th className="col-mid">Tienda oficial</th>
                  <th className="col-us">✦ Nosotros</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ textAlign: "left" }}>100% original en tu correo</td><td className="check-no">✗</td><td className="check-yes">✓</td><td className="col-us check-yes">✓</td></tr>
                <tr><td style={{ textAlign: "left" }}>+100 Millones de Elements</td><td className="check-no">✗</td><td className="check-yes">✓</td><td className="col-us check-yes">✓</td></tr>
                <tr><td style={{ textAlign: "left" }}>Garantía devolución</td><td className="check-no">✗</td><td className="check-no">✗</td><td className="col-us check-yes">✓</td></tr>
                <tr><td style={{ textAlign: "left" }}>Redimensión Mágica e IA</td><td className="check-no">✗</td><td className="check-yes">✓</td><td className="col-us check-yes">✓</td></tr>
                <tr><td style={{ textAlign: "left" }}>Soporte real WhatsApp</td><td className="check-no">✗</td><td className="check-no">✗</td><td className="col-us check-yes">✓</td></tr>
                <tr><td style={{ textAlign: "left" }}>Plantillas de agencia (Gratis)</td><td className="check-no">✗</td><td className="check-no">✗</td><td className="col-us check-yes">✓</td></tr>
                <tr><td style={{ textAlign: "left" }}>Precio mensual</td><td style={{ color: "#FF6B6B" }}>Con marca / Virus</td><td style={{ color: "#FF6B6B" }}>$50.000+</td><td className="col-us" style={{ color: "var(--cyan)", fontWeight: 700 }}>$18.900</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="reveal">
            <span className="section-tag">Prueba social real</span>
            <h2 className="section-title">Lo que dicen<br /><span>nuestros clientes</span></h2>
            <p className="section-sub">Creadores y marcas que ya están diseñando con nuestra invitación exclusiva.</p>
          </div>
          <div className="testi-grid reveal">
            <div className="testi-card">
              <div className="testi-header">
                <div className="testi-avatar" style={{ backgroundColor: "#ff7b72" }}>M</div>
                <div className="testi-header-info">
                  <span className="testi-name">Marketing Digital Col</span>
                  <span className="testi-user">@mariamarketingco</span>
                </div>
              </div>
              <div className="testi-body">¡Me salvaron la vida! Literal llevo pagando un platal en Canva oficial y ahora esto es mucho mejor y por solo $20k mensuales 🙌 Recomendados al 100%.</div>
            </div>
            <div className="testi-card">
              <div className="testi-header">
                <div className="testi-avatar" style={{ backgroundColor: "#a5d6a7" }}>J</div>
                <div className="testi-header-info">
                  <span className="testi-name">Juan David Lopez</span>
                  <span className="testi-user">@jualodigital</span>
                </div>
              </div>
              <div className="testi-body">Yo no creía al principio jaja pensaba que era estafa, pagué para probar y me habilitaron todo premium en mi propio correo. Funciona súper bien 🚀</div>
            </div>
            <div className="testi-card">
              <div className="testi-header">
                <div className="testi-avatar" style={{ backgroundColor: "#81d4fa" }}>A</div>
                <div className="testi-header-info">
                  <span className="testi-name">Agencia Creativa</span>
                  <span className="testi-user">@agenciacreativa.bog</span>
                </div>
              </div>
              <div className="testi-body">Lo compre hace 3 meses y ha funcionado todo sin interrupciones. Las herramientas de Inteligencia Artificial están 10/10. Gracias!!</div>
            </div>
            <div className="testi-card">
              <div className="testi-header">
                <div className="testi-avatar" style={{ backgroundColor: "#ce93d8" }}>C</div>
                <div className="testi-header-info">
                  <span className="testi-name">Catalina Ríos</span>
                  <span className="testi-user">@catarios.design</span>
                </div>
              </div>
              <div className="testi-body">Poder descargar como PNG transparente de nuevo sin pagar tanto es un alivio total. Muchas gracias a ustedes, excelente servicio técnico. Atienden muy rápido.</div>
            </div>
            <div className="testi-card">
              <div className="testi-header">
                <div className="testi-avatar" style={{ backgroundColor: "#ffcc80" }}>S</div>
                <div className="testi-header-info">
                  <span className="testi-name">Store Belleza</span>
                  <span className="testi-user">@storebellezacali</span>
                </div>
              </div>
              <div className="testi-body">Increíble ✨ Los bonos que dan con las plantillas ya hechas me han ayudado a ahorrar mucho tiempo en mis reels del local. 10/10.</div>
            </div>
            <div className="testi-card">
              <div className="testi-header">
                <div className="testi-avatar" style={{ backgroundColor: "#a1887f" }}>E</div>
                <div className="testi-header-info">
                  <span className="testi-name">Emprendedor 5.0</span>
                  <span className="testi-user">@emprendedor5.0</span>
                </div>
              </div>
              <div className="testi-body">Hice el pago por nequi y a los 5 minutos me llegó la invitación de Canva al correo. Súper legal todo, sin problemas para editar en mi pc y celular.</div>
            </div>
          </div>
          <div className="reveal" style={{ marginTop: "32px" }}>
            <a href="https://checkout.bold.co/payment/LNK_CA38MMMYKT" target="_blank" rel="noopener noreferrer" onClick={handlePaymentClick} className="btn-primary">💳 Unirme a la familia Pro — $18.900</a>
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="guarantee">
        <div className="container reveal">
          <div style={{ textAlign: "center" }}>
            <span className="section-tag">Cero riesgo</span>
            <h2 className="section-title">Garantía total<br /><span>de devolución</span></h2>
          </div>
          <div className="guarantee-card">
            <div className="guarantee-icon">🛡</div>
            <div className="guarantee-title">Si no funciona, te devolvemos el 100%</div>
            <div className="guarantee-text">Sin preguntas. Sin procesos complicados. Sin letra pequeña. Llevamos +15.000 clientes activos con esta garantía — y la hemos honrado siempre. Si el acceso falla y no podemos solucionarlo, tu dinero vuelve completo.</div>
            <a href="https://checkout.bold.co/payment/LNK_CA38MMMYKT" target="_blank" rel="noopener noreferrer" onClick={handlePaymentClick} className="btn-primary" style={{ marginTop: "8px" }}>💳 Con esta garantía el riesgo es cero → Pagar $18.900</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <div className="container">
          <div className="reveal" style={{ textAlign: "center" }}>
            <span className="section-tag">Resolvemos todo</span>
            <h2 className="section-title">Preguntas<br /><span>frecuentes</span></h2>
          </div>
          <div className="faq-list reveal">
            <div className={`faq-item ${activeFaq === 0 ? "open" : ""}`}>
              <div className="faq-q" onClick={() => toggleFaq(0)}>¿Me dan una cuenta nueva o habilitan la mía? <span>+</span></div>
              <div className="faq-a"><b style={{ color: "var(--cyan)" }}>Tu propia cuenta.</b> Es acceso 100% oficial. Te activamos Canva Pro en tu <b>correo personalizado o dominio propio</b>, o te enviamos la invitación al que ya usas. Todo lo que ya has diseñado se mantiene.</div>
            </div>
            <div className={`faq-item ${activeFaq === 1 ? "open" : ""}`}>
              <div className="faq-q" onClick={() => toggleFaq(1)}>¿Pierdo mis diseños guardados antes? <span>+</span></div>
              <div className="faq-a"><b style={{ color: "var(--cyan)" }}>No pierdes nada.</b> Al aceptar la invitación se te agrega un "Equipo Pro", y puedes cambiarte entre tu sección personal y la Pro sin borrar nada. Tus diseños siguen intactos y podrás copiar cualquier cosa a tu nuevo espacio premium.</div>
            </div>
            <div className={`faq-item ${activeFaq === 2 ? "open" : ""}`}>
              <div className="faq-q" onClick={() => toggleFaq(2)}>¿Cómo llega el acceso? ¿Cuánto tarda? <span>+</span></div>
              <div className="faq-a">Después del pago, te enviamos el link de invitación vía WhatsApp y correo en menos de 1 a 2 horas (normalmente es en minutos). Es solo darle clic en "Aceptar Invitación" o "Join Team", y queda activo de una vez.</div>
            </div>
            <div className={`faq-item ${activeFaq === 3 ? "open" : ""}`}>
              <div className="faq-q" onClick={() => toggleFaq(3)}>¿Por qué es más barato que la página principal de Canva? <span>+</span></div>
              <div className="faq-a">Tenemos licencias Enterprise / Team compradas al por mayor lo cual nos permite vender invitaciones a nuestros cupos a fracciones del costo y darle los beneficios de equipos completos a cada persona individualmente, sin problemas.</div>
            </div>
            <div className={`faq-item ${activeFaq === 4 ? "open" : ""}`}>
              <div className="faq-q" onClick={() => toggleFaq(4)}>¿Qué pasa si mi acceso se sale de PRO a Free? <span>+</span></div>
              <div className="faq-a">En los raros casos donde Canva hace mantenimiento o actualiza membresías y se bloquea tu acceso, nos escribes y te enviamos un nuevo enlace o restauración el mismo día, si por algún motivo no podemos arreglarlo a tiempo, se ejecuta tu garantía de devolución de manera transparente.</div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="container reveal" style={{ textAlign: "center" }}>
          <span className="section-tag">Último paso</span>
          <h2 className="section-title">Cada día sin PRO<br />es un trabajo <span>con peores resultados.</span></h2>
          <p style={{ fontSize: "16px", color: "var(--gray2)", margin: "12px auto 24px", maxWidth: "500px" }}>+15.000 creadores y freelancers ya diseñando sin marca de agua y de forma premium. Hoy es tu turno.</p>

          <div className="final-checklist">
            <div className="final-check"><span>✓</span> Cuentas 100% original</div>
            <div className="final-check"><span>✓</span> Tu propio correo (o dominio propio)</div>
            <div className="final-check"><span>✓</span> Garantía real</div>
            <div className="final-check"><span>✓</span> En Móvil y Desktop</div>
            <div className="final-check"><span>✓</span> Magic Studio Inteligencia Artificial</div>
            <div className="final-check"><span>✓</span> +5.000 plantillas base gratis</div>
            <div className="final-check"><span>✓</span> Activación sin software raro</div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", background: "var(--navy2)", border: "1px solid rgba(226,75,74,.2)", borderRadius: "100px", padding: "10px 20px", marginBottom: "16px" }}>
              <span style={{ fontSize: "12px", color: "#FF6B6B", fontWeight: 600 }}>⏳ Precio sube pronto</span>
              <span style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, fontSize: "16px", color: "#FF6B6B" }}><span className="th">{timeLeft.h}</span>:<span className="tm">{timeLeft.m}</span>:<span className="ts">{timeLeft.s}</span></span>
              <span style={{ fontSize: "12px", color: "var(--gray)" }}>· <span className="stock-num">{stock}</span> cupos restantes</span>
            </div>
          </div>

          <a href="https://checkout.bold.co/payment/LNK_CA38MMMYKT" target="_blank" rel="noopener noreferrer" onClick={handlePaymentClick} className="btn-primary">💳 Activar mi Canva Pro ahora — $18.900</a>
          <div style={{ marginTop: "12px" }}>
            <a href="https://wa.me/message/TEIMDMVA6SBTC1" style={{ fontSize: "12px", color: "var(--gray)", textDecoration: "underline" }}>¿Tienes dudas? Escríbenos por WhatsApp</a>
          </div>
          <p style={{ fontSize: "12px", color: "var(--gray)", marginTop: "8px" }}>🔒 Nequi · Daviplata · Bancolombia · Tarjeta</p>
        </div>
      </section>

      {/* WA FLOAT */}
      <a href="https://wa.me/message/TEIMDMVA6SBTC1" className="wa-float">
        <svg viewBox="0 0 24 24" fill="white" style={{ width: "28px", height: "28px" }}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.535 5.856L0 24l6.335-1.52A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.373l-.36-.214-3.727.894.946-3.624-.236-.373A9.818 9.818 0 112 12c0-5.414 4.404-9.818 9.818-9.818 5.415 0 9.819 4.404 9.819 9.818 0 5.415-4.404 9.818-9.819 9.818z" />
        </svg>
        <div className="wa-pulse"></div>
      </a>

      {/* STICKY BAR MOBILE */}
      <div className="sticky-bar">
        <div className="sticky-price">
          <small>Canva Pro original</small>
          <strong>$18.900/mes</strong>
        </div>
        <a href="https://checkout.bold.co/payment/LNK_CA38MMMYKT" target="_blank" rel="noopener noreferrer" onClick={handlePaymentClick} className="sticky-btn">💳 Pagar ahora</a>
      </div>
    </>
  );
}

import Link from "next/link";

export default function Gracias() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ background: "var(--navy)" }}>
      <div style={{ background: "var(--navy2)", border: "1px solid rgba(0,194,255,.2)", boxShadow: "0 0 40px rgba(0,194,255,.1)" }} className="max-w-xl w-full rounded-2xl p-10 flex flex-col items-center gap-6">
        <div style={{ width: "80px", height: "80px", background: "rgba(0,194,255,.1)", border: "2px solid var(--cyan)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "40px" }}>⌛</span>
        </div>
        
        <h1 className="section-title" style={{ marginBottom: 0 }}>Termina tu <span>Activación</span></h1>
        
        <p className="section-sub" style={{ fontSize: "16px", color: "var(--gray2)" }}>
          <b>¿Finalizaste tu pago o tuviste algún problema?</b> Escríbenos ahora mismo a nuestro WhatsApp. Si ya pagaste envíanos el comprobante para darte el acceso; si el pago falló o te arrepentiste, cuéntanos y te ayudaremos a no perder tu cupo de Canva Pro con nosotros.
        </p>

        <a href="https://wa.me/message/TEIMDMVA6SBTC1" className="btn-wa" style={{ marginTop: "10px", width: "100%", justifyContent: "center", textDecoration: "none" }}>
          📲 Recibir mi cuenta / Pedir Ayuda
        </a>

        <div style={{ fontSize: "13px", color: "var(--gray)", marginTop: "16px" }}>
          Nuestro equipo te responderá en minutos para darte acceso de inmediato a tus herramientas premium.
        </div>
      </div>
    </div>
  );
}

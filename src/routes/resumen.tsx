import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, FilePlus2, Printer } from "lucide-react";
import {
  ESTILOS,
  limpiarBorrador,
  listarBriefings,
  TIPOS_PROYECTO,
  type Briefing,
} from "@/lib/briefing";

export const Route = createFileRoute("/resumen")({
  head: () => ({
    meta: [
      { title: "Resumen del briefing — Enrigraphics" },
      {
        name: "description",
        content:
          "Revisa el briefing guardado: datos del cliente, dirección creativa y referencias visuales.",
      },
      { property: "og:title", content: "Resumen del briefing — Enrigraphics" },
      {
        property: "og:description",
        content: "Vista de resumen del briefing de cliente guardado en este dispositivo.",
      },
    ],
  }),
  component: ResumenPage,
});

function Dato({ label, valor }: { label: string; valor?: string | undefined }) {
  if (!valor || !valor.trim()) return null;
  return (
    <div className="grid gap-1 border-b border-border py-3 last:border-0 sm:grid-cols-[11rem_1fr] sm:gap-4">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="whitespace-pre-line text-sm font-medium text-foreground">{valor}</p>
    </div>
  );
}

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2 className="mb-2 text-base font-black tracking-tight text-foreground">{titulo}</h2>
      <div>{children}</div>
    </section>
  );
}

function ResumenPage() {
  const navigate = useNavigate();
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setBriefing(listarBriefings()[0] ?? null);
    setCargando(false);
  }, []);

  if (cargando) return <div className="min-h-screen bg-background" />;

  if (!briefing) {
    return (
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-black text-foreground">Aún no hay briefings guardados</h1>
        <p className="text-sm text-muted-foreground">
          Rellena la ficha y guárdala para verla aquí.
        </p>
        <Link
          to="/"
          className="inline-flex min-h-12 items-center rounded-xl bg-mustard px-5 text-sm font-black text-accent-foreground"
        >
          Ir al briefing
        </Link>
      </div>
    );
  }

  const b = briefing;
  const tipos = b.tipos
    .map((t) => TIPOS_PROYECTO.find((x) => x.id === t)?.titulo ?? t)
    .join(" · ");
  const fecha = b.guardadoEn
    ? new Date(b.guardadoEn).toLocaleString("es-ES", { dateStyle: "long", timeStyle: "short" })
    : "";
  const lista = (v: string[]) => v.join(", ");

  const nuevo = () => {
    if (!window.confirm("¿Crear un briefing nuevo? Se limpiará el borrador actual.")) return;
    limpiarBorrador();
    void navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background pb-28 print:bg-white print:pb-0">
      <header className="px-5 pt-10 pb-7 print:px-0 print:pt-0">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 text-[1.35rem] font-black lowercase tracking-[-0.04em] text-foreground">
            enrigraphics<span className="text-mustard">.</span>
          </div>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-muted-foreground print:hidden"
          >
            <ArrowLeft className="h-4 w-4" /> Editar briefing
          </Link>
          <div className="mt-4 flex items-center gap-2 text-accent-foreground print:mt-0">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-black">Briefing guardado correctamente</span>
          </div>
          <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight text-foreground">
            {b.cliente.empresa || b.cliente.nombre || "Resumen del briefing"}
          </h1>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            {tipos ? `${tipos} · ` : ""}
            {fecha}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-4 px-5 py-3 print:max-w-none print:px-0">
        <Bloque titulo="Datos del cliente">
          <Dato label="Nombre" valor={b.cliente.nombre} />
          <Dato label="Empresa / marca" valor={b.cliente.empresa} />
          <Dato label="Teléfono" valor={b.cliente.telefono} />
          <Dato label="Email" valor={b.cliente.email} />
          <Dato label="Persona de contacto" valor={b.cliente.contacto} />
        </Bloque>

        <Bloque titulo="Proyecto">
          <Dato label="Tipo" valor={tipos} />
          <Dato label="Descripción" valor={b.general.descripcion} />
          <Dato label="Objetivo" valor={b.general.objetivo} />
          <Dato label="Público objetivo" valor={b.general.publico} />
          <Dato label="Fecha límite" valor={b.general.fecha} />
          <Dato label="Presupuesto" valor={b.general.presupuesto} />
          <Dato label="Decisión final" valor={b.general.decisor} />
        </Bloque>

        <Bloque titulo="Dirección creativa">
          <Dato label="Colores que gustan" valor={b.creativa.coloresGustan} />
          <Dato label="Colores a evitar" valor={b.creativa.coloresEvitar} />
          <Dato label="Tipografías que gustan" valor={b.creativa.tipografiasGustan} />
          <Dato label="Tipografías a evitar" valor={b.creativa.tipografiasEvitar} />
          <Dato
            label="Estilo visual"
            valor={lista(b.creativa.estilos.filter((e) => ESTILOS.includes(e)))}
          />
          <Dato label="Notas de estilo" valor={b.creativa.libre} />
        </Bloque>

        <Bloque titulo="Referencias visuales">
          <div className="space-y-4">
            {b.referencias.filter((r) => r.imagen || r.url || r.gusta || r.archivo).length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin referencias añadidas.</p>
            ) : (
              b.referencias
                .filter((r) => r.imagen || r.url || r.gusta || r.archivo)
                .map((r, i) => (
                  <div key={r.id} className="overflow-hidden rounded-xl border border-border">
                    {r.imagen ? (
                      <img
                        src={r.imagen}
                        alt={`Referencia visual ${i + 1}`}
                        className="block max-h-80 w-full object-cover print:max-h-56 print:w-auto"
                      />
                    ) : null}
                    <div className="p-3">
                      <Dato label="Enlace" valor={r.url} />
                      <Dato label="Qué gusta" valor={r.gusta} />
                      <Dato label="Archivo adjunto" valor={r.archivo?.name} />
                    </div>
                  </div>
                ))
            )}
          </div>
        </Bloque>

        {b.tipos.includes("logo") ? (
          <Bloque titulo="Logo / Branding">
            <Dato label="Nombre exacto" valor={b.logo.nombreExacto} />
            <Dato label="Eslogan" valor={b.logo.eslogan} />
            <Dato label="Símbolos" valor={b.logo.simbolos} />
            <Dato label="No incluir" valor={b.logo.noQuiere} />
            <Dato label="Usos" valor={lista(b.logo.usos)} />
          </Bloque>
        ) : null}

        {b.tipos.includes("web") ? (
          <Bloque titulo="Web">
            <Dato label="Web actual" valor={b.web.webActual} />
            <Dato label="Dominio" valor={b.web.dominio} />
            <Dato label="Hosting" valor={b.web.hosting} />
            <Dato label="Objetivo" valor={b.web.objetivo} />
            <Dato label="Tipo de web" valor={b.web.tipoWeb} />
            <Dato label="Páginas" valor={b.web.paginas} />
            <Dato label="Textos" valor={b.web.textos} />
            <Dato label="Fotos" valor={b.web.fotos} />
            <Dato label="Idiomas" valor={b.web.idiomas} />
            <Dato label="Funcionalidades" valor={lista(b.web.funciones)} />
            <Dato label="Mantenimiento" valor={b.web.mantenimiento} />
          </Bloque>
        ) : null}

        {b.tipos.includes("app") ? (
          <Bloque titulo="App">
            <Dato label="Problema" valor={b.app.problema} />
            <Dato label="Usuarios" valor={b.app.usuarios} />
            <Dato label="Flujo" valor={b.app.flujo} />
            <Dato label="Funcionalidades" valor={lista(b.app.funciones)} />
            <Dato label="Plataformas" valor={lista(b.app.plataformas)} />
          </Bloque>
        ) : null}

        {b.tipos.includes("automatizacion") ? (
          <Bloque titulo="Automatización">
            <Dato label="Tarea" valor={b.automatizacion.tarea} />
            <Dato label="Cómo se hace ahora" valor={b.automatizacion.comoAhora} />
            <Dato label="Tiempo" valor={b.automatizacion.tiempo} />
            <Dato label="Frecuencia" valor={b.automatizacion.frecuencia} />
            <Dato label="Responsable" valor={b.automatizacion.quien} />
            <Dato label="Herramientas" valor={b.automatizacion.herramientas} />
            <Dato
              label="Regla"
              valor={
                b.automatizacion.reglaX || b.automatizacion.reglaY
                  ? `Cuando ocurre ${b.automatizacion.reglaX || "..."}, quiero que ocurra ${
                      b.automatizacion.reglaY || "..."
                    } automáticamente.`
                  : ""
              }
            />
          </Bloque>
        ) : null}

        <Bloque titulo="Notas finales">
          <Dato label="Notas" valor={b.notas} />
        </Bloque>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 px-5 py-3 backdrop-blur print:hidden">
        <div className="mx-auto grid max-w-2xl grid-cols-3 gap-2">
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-card text-sm font-black text-foreground"
          >
            Editar
          </Link>
          <button
            type="button"
            onClick={nuevo}
            className="inline-flex min-h-12 items-center justify-center gap-1 rounded-xl border border-border bg-card text-sm font-black text-foreground"
          >
            <FilePlus2 className="h-4 w-4" /> Nuevo
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-12 items-center justify-center gap-1 rounded-xl bg-foreground text-sm font-black text-card"
          >
            <Printer className="h-4 w-4" /> PDF
          </button>
        </div>
      </nav>
    </div>
  );
}

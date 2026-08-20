import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  AreaTexto,
  Campo,
  Chips,
  Seccion,
  Selector,
  TarjetaTipo,
  Texto,
} from "@/components/briefing/campos";
import { ReferenciaCard } from "@/components/briefing/referencia-card";
import {
  briefingVacio,
  cargarBorrador,
  ESTILOS,
  FUNCIONES_APP,
  FUNCIONES_WEB,
  guardarBorrador,
  guardarBriefing,
  nuevaReferencia,
  PLATAFORMAS_APP,
  PRESUPUESTOS,
  progresoBriefing,
  TIPOS_PROYECTO,
  USOS_LOGO,
  type Briefing,
} from "@/lib/briefing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Enrigraphics — Briefing de cliente" },
      {
        name: "description",
        content:
          "Ficha de briefing móvil para reuniones con clientes: datos, dirección creativa y referencias visuales con foto desde el móvil.",
      },
      { property: "og:title", content: "Enrigraphics — Briefing de cliente" },
      {
        property: "og:description",
        content:
          "Rellena el briefing completo desde el móvil: tipo de proyecto, dirección creativa y referencias visuales.",
      },
    ],
  }),
  component: BriefingPage,
});

function BriefingPage() {
  const navigate = useNavigate();
  const [b, setB] = useState<Briefing>(briefingVacio);
  const [hidratado, setHidratado] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const primerCampo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const borrador = cargarBorrador();
    if (borrador) setB(borrador);
    setHidratado(true);
  }, []);

  useEffect(() => {
    if (!hidratado) return;
    const t = setTimeout(() => guardarBorrador(b), 400);
    return () => clearTimeout(t);
  }, [b, hidratado]);

  const progreso = useMemo(() => progresoBriefing(b), [b]);
  const tiene = (id: string) => b.tipos.includes(id);

  const set = <K extends keyof Briefing>(clave: K, valor: Briefing[K]) =>
    setB((prev) => ({ ...prev, [clave]: valor }));

  const setGrupo = <K extends "cliente" | "general" | "creativa" | "logo" | "web" | "app" | "automatizacion">(
    grupo: K,
    parche: Partial<Briefing[K]>,
  ) => setB((prev) => ({ ...prev, [grupo]: { ...prev[grupo], ...parche } }));

  const alternar = (lista: string[], valor: string) =>
    lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor];

  const emailInvalido =
    enviado && b.cliente.email.trim().length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.cliente.email);
  const faltaNombre = enviado && !b.cliente.nombre.trim();
  const faltaTipo = enviado && b.tipos.length === 0;

  const onGuardar = () => {
    setEnviado(true);
    if (!b.cliente.nombre.trim() || b.tipos.length === 0) {
      toast("Faltan un par de datos", {
        description: "Añade el nombre del cliente y al menos un tipo de proyecto.",
      });
      primerCampo.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    guardarBriefing(b);
    toast.success("Briefing guardado", { description: "Ya puedes revisar el resumen." });
    void navigate({ to: "/resumen" });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="border-b border-border bg-card/70 px-5 pt-10 pb-8 backdrop-blur">
        <div className="mx-auto max-w-2xl">
          <p className="eyebrow">Enrigraphics</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Nuevo proyecto
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Cuéntame lo necesario para empezar bien el proyecto.
          </p>
        </div>
      </header>

      <div className="sticky top-0 z-10 border-b border-border bg-background/90 px-5 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-2xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="h-1.5 min-w-0 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-mustard transition-all duration-500"
              style={{ width: `${Math.max(progreso, 3)}%` }}
            />
          </div>
          <span className="shrink-0 text-xs font-medium text-muted-foreground tabular-nums">
            {progreso}% · guardado automático
          </span>
        </div>
      </div>

      <main className="mx-auto max-w-2xl space-y-8 px-5 py-8">
        <div ref={primerCampo}>
          <Seccion numero="1" titulo="Datos del cliente">
            <Campo label="Nombre">
              <Texto
                value={b.cliente.nombre}
                invalido={faltaNombre}
                placeholder="Nombre y apellidos"
                onChange={(nombre) => setGrupo("cliente", { nombre })}
              />
            </Campo>
            <Campo label="Empresa / marca">
              <Texto
                value={b.cliente.empresa}
                placeholder="Nombre comercial"
                onChange={(empresa) => setGrupo("cliente", { empresa })}
              />
            </Campo>
            <Campo label="Teléfono">
              <Texto
                value={b.cliente.telefono}
                type="tel"
                inputMode="tel"
                placeholder="600 000 000"
                onChange={(telefono) => setGrupo("cliente", { telefono })}
              />
            </Campo>
            <Campo
              label="Email"
              ayuda={emailInvalido ? "Revisa el formato del email." : undefined}
            >
              <Texto
                value={b.cliente.email}
                type="email"
                inputMode="email"
                invalido={emailInvalido}
                placeholder="hola@empresa.com"
                onChange={(email) => setGrupo("cliente", { email })}
              />
            </Campo>
            <Campo label="Persona de contacto">
              <Texto
                value={b.cliente.contacto}
                placeholder="¿Con quién hablo durante el proyecto?"
                onChange={(contacto) => setGrupo("cliente", { contacto })}
              />
            </Campo>
          </Seccion>
        </div>

        <Seccion
          numero="2"
          titulo="Tipo de proyecto"
          descripcion="Puedes seleccionar uno o varios."
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {TIPOS_PROYECTO.map((t) => (
              <TarjetaTipo
                key={t.id}
                titulo={t.titulo}
                desc={t.desc}
                activo={tiene(t.id)}
                onClick={() => set("tipos", alternar(b.tipos, t.id))}
              />
            ))}
          </div>
          {faltaTipo ? (
            <p className="text-xs text-destructive">Selecciona al menos un tipo de proyecto.</p>
          ) : null}
        </Seccion>

        <Seccion numero="3" titulo="Información general">
          <Campo label="Descripción del proyecto">
            <AreaTexto
              value={b.general.descripcion}
              placeholder="¿Qué necesitas exactamente?"
              onChange={(descripcion) => setGrupo("general", { descripcion })}
            />
          </Campo>
          <Campo label="Objetivo principal">
            <AreaTexto
              rows={3}
              value={b.general.objetivo}
              placeholder="Vender más, ganar imagen, ahorrar tiempo…"
              onChange={(objetivo) => setGrupo("general", { objetivo })}
            />
          </Campo>
          <Campo label="Público objetivo">
            <AreaTexto
              rows={3}
              value={b.general.publico}
              placeholder="¿A quién quieres llegar?"
              onChange={(publico) => setGrupo("general", { publico })}
            />
          </Campo>
          <Campo label="Fecha límite real">
            <Texto
              value={b.general.fecha}
              type="date"
              onChange={(fecha) => setGrupo("general", { fecha })}
            />
          </Campo>
          <Campo label="Presupuesto aproximado">
            <Selector
              value={b.general.presupuesto}
              opciones={PRESUPUESTOS}
              onChange={(presupuesto) => setGrupo("general", { presupuesto })}
            />
          </Campo>
          <Campo label="¿Quién toma la decisión final?">
            <Texto
              value={b.general.decisor}
              placeholder="Nombre y rol"
              onChange={(decisor) => setGrupo("general", { decisor })}
            />
          </Campo>
        </Seccion>

        <Seccion numero="4" titulo="Dirección creativa">
          <Campo label="Colores que te gustan">
            <Texto
              value={b.creativa.coloresGustan}
              placeholder="Mostaza, negro, tonos tierra…"
              onChange={(coloresGustan) => setGrupo("creativa", { coloresGustan })}
            />
          </Campo>
          <Campo label="Colores a evitar">
            <Texto
              value={b.creativa.coloresEvitar}
              placeholder="Rojo, morado…"
              onChange={(coloresEvitar) => setGrupo("creativa", { coloresEvitar })}
            />
          </Campo>
          <Campo label="Tipografías que te gustan">
            <Texto
              value={b.creativa.tipografiasGustan}
              placeholder="Sans geométrica, serif editorial…"
              onChange={(tipografiasGustan) => setGrupo("creativa", { tipografiasGustan })}
            />
          </Campo>
          <Campo label="Tipografías a evitar">
            <Texto
              value={b.creativa.tipografiasEvitar}
              placeholder="Manuscritas, condensadas…"
              onChange={(tipografiasEvitar) => setGrupo("creativa", { tipografiasEvitar })}
            />
          </Campo>
          <Campo label="Estilo visual">
            <Chips
              opciones={ESTILOS}
              valor={b.creativa.estilos}
              onToggle={(v) => setGrupo("creativa", { estilos: alternar(b.creativa.estilos, v) })}
            />
          </Campo>
          <Campo label="Otras ideas sobre el estilo">
            <AreaTexto
              rows={3}
              value={b.creativa.libre}
              placeholder="Todo lo que te venga a la cabeza"
              onChange={(libre) => setGrupo("creativa", { libre })}
            />
          </Campo>
        </Seccion>

        <Seccion
          numero="5"
          titulo="Referencias visuales"
          descripcion="Haz una foto ahora mismo o elige imágenes del teléfono."
        >
          {b.referencias.map((r, i) => (
            <ReferenciaCard
              key={r.id}
              indice={i + 1}
              referencia={r}
              onChange={(nueva) =>
                set(
                  "referencias",
                  b.referencias.map((x) => (x.id === r.id ? nueva : x)),
                )
              }
              {...(b.referencias.length > 3
                ? {
                    onEliminar: () =>
                      set(
                        "referencias",
                        b.referencias.filter((x) => x.id !== r.id),
                      ),
                  }
                : {})}
            />
          ))}
          <button
            type="button"
            onClick={() => set("referencias", [...b.referencias, nuevaReferencia()])}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground"
          >
            <Plus className="h-4 w-4" /> Añadir otra referencia
          </button>
        </Seccion>

        {tiene("logo") ? (
          <Seccion numero="6" titulo="Logo / Branding">
            <Campo label="Nombre exacto de la marca">
              <Texto
                value={b.logo.nombreExacto}
                placeholder="Tal y como debe escribirse"
                onChange={(nombreExacto) => setGrupo("logo", { nombreExacto })}
              />
            </Campo>
            <Campo label="Eslogan">
              <Texto
                value={b.logo.eslogan}
                onChange={(eslogan) => setGrupo("logo", { eslogan })}
              />
            </Campo>
            <Campo label="Símbolos o elementos que quieres">
              <AreaTexto
                rows={3}
                value={b.logo.simbolos}
                onChange={(simbolos) => setGrupo("logo", { simbolos })}
              />
            </Campo>
            <Campo label="Cosas que NO quieres">
              <AreaTexto
                rows={3}
                value={b.logo.noQuiere}
                onChange={(noQuiere) => setGrupo("logo", { noQuiere })}
              />
            </Campo>
            <Campo label="Usos del logo">
              <Chips
                opciones={USOS_LOGO}
                valor={b.logo.usos}
                onToggle={(v) => setGrupo("logo", { usos: alternar(b.logo.usos, v) })}
              />
            </Campo>
          </Seccion>
        ) : null}

        {tiene("web") ? (
          <Seccion numero="7" titulo="Proyecto web">
            <Campo label="Web actual">
              <Texto
                value={b.web.webActual}
                inputMode="url"
                placeholder="https://…"
                onChange={(webActual) => setGrupo("web", { webActual })}
              />
            </Campo>
            <Campo label="Dominio">
              <Texto value={b.web.dominio} onChange={(dominio) => setGrupo("web", { dominio })} />
            </Campo>
            <Campo label="Hosting">
              <Texto value={b.web.hosting} onChange={(hosting) => setGrupo("web", { hosting })} />
            </Campo>
            <Campo label="Objetivo de la web">
              <AreaTexto
                rows={3}
                value={b.web.objetivo}
                onChange={(objetivo) => setGrupo("web", { objetivo })}
              />
            </Campo>
            <Campo label="Tipo de web">
              <Selector
                value={b.web.tipoWeb}
                opciones={["Landing", "Corporativa", "Tienda online", "Portfolio", "Blog", "Otra"]}
                onChange={(tipoWeb) => setGrupo("web", { tipoWeb })}
              />
            </Campo>
            <Campo label="Páginas aproximadas">
              <Texto
                value={b.web.paginas}
                inputMode="numeric"
                placeholder="5"
                onChange={(paginas) => setGrupo("web", { paginas })}
              />
            </Campo>
            <Campo label="¿Quién aporta los textos?">
              <Texto value={b.web.textos} onChange={(textos) => setGrupo("web", { textos })} />
            </Campo>
            <Campo label="¿Quién aporta las fotos?">
              <Texto value={b.web.fotos} onChange={(fotos) => setGrupo("web", { fotos })} />
            </Campo>
            <Campo label="Idiomas">
              <Texto
                value={b.web.idiomas}
                placeholder="Castellano, catalán, inglés…"
                onChange={(idiomas) => setGrupo("web", { idiomas })}
              />
            </Campo>
            <Campo label="Funcionalidades necesarias">
              <Chips
                opciones={FUNCIONES_WEB}
                valor={b.web.funciones}
                onToggle={(v) => setGrupo("web", { funciones: alternar(b.web.funciones, v) })}
              />
            </Campo>
            <Campo label="¿Quién actualizará la web?">
              <Texto
                value={b.web.mantenimiento}
                onChange={(mantenimiento) => setGrupo("web", { mantenimiento })}
              />
            </Campo>
          </Seccion>
        ) : null}

        {tiene("app") ? (
          <Seccion numero="8" titulo="Proyecto de app">
            <Campo label="¿Qué problema resuelve?">
              <AreaTexto
                rows={3}
                value={b.app.problema}
                onChange={(problema) => setGrupo("app", { problema })}
              />
            </Campo>
            <Campo label="¿Quiénes son los usuarios?">
              <AreaTexto
                rows={3}
                value={b.app.usuarios}
                onChange={(usuarios) => setGrupo("app", { usuarios })}
              />
            </Campo>
            <Campo label="Flujo principal en 3-4 pasos">
              <AreaTexto
                value={b.app.flujo}
                placeholder={"1. …\n2. …\n3. …"}
                onChange={(flujo) => setGrupo("app", { flujo })}
              />
            </Campo>
            <Campo label="Funcionalidades">
              <Chips
                opciones={FUNCIONES_APP}
                valor={b.app.funciones}
                onToggle={(v) => setGrupo("app", { funciones: alternar(b.app.funciones, v) })}
              />
            </Campo>
            <Campo label="Plataformas">
              <Chips
                opciones={PLATAFORMAS_APP}
                valor={b.app.plataformas}
                onToggle={(v) => setGrupo("app", { plataformas: alternar(b.app.plataformas, v) })}
              />
            </Campo>
          </Seccion>
        ) : null}

        {tiene("automatizacion") ? (
          <Seccion numero="9" titulo="Automatización">
            <Campo label="Tarea a automatizar">
              <AreaTexto
                rows={3}
                value={b.automatizacion.tarea}
                onChange={(tarea) => setGrupo("automatizacion", { tarea })}
              />
            </Campo>
            <Campo label="¿Cómo se hace actualmente?">
              <AreaTexto
                rows={3}
                value={b.automatizacion.comoAhora}
                onChange={(comoAhora) => setGrupo("automatizacion", { comoAhora })}
              />
            </Campo>
            <Campo label="Tiempo que ocupa">
              <Texto
                value={b.automatizacion.tiempo}
                placeholder="2 horas por semana"
                onChange={(tiempo) => setGrupo("automatizacion", { tiempo })}
              />
            </Campo>
            <Campo label="Frecuencia">
              <Selector
                value={b.automatizacion.frecuencia}
                opciones={["Varias veces al día", "Diaria", "Semanal", "Mensual", "Puntual"]}
                onChange={(frecuencia) => setGrupo("automatizacion", { frecuencia })}
              />
            </Campo>
            <Campo label="¿Quién la realiza?">
              <Texto
                value={b.automatizacion.quien}
                onChange={(quien) => setGrupo("automatizacion", { quien })}
              />
            </Campo>
            <Campo label="Herramientas usadas">
              <Texto
                value={b.automatizacion.herramientas}
                placeholder="Excel, Gmail, Holded…"
                onChange={(herramientas) => setGrupo("automatizacion", { herramientas })}
              />
            </Campo>
            <div className="rounded-2xl border border-border bg-mustard-soft p-4">
              <p className="mb-3 text-sm font-medium text-accent-foreground">
                Cuando ocurre X, quiero que ocurra Y automáticamente
              </p>
              <div className="space-y-3">
                <Campo label="Cuando ocurre… (X)">
                  <Texto
                    value={b.automatizacion.reglaX}
                    onChange={(reglaX) => setGrupo("automatizacion", { reglaX })}
                  />
                </Campo>
                <Campo label="Quiero que ocurra… (Y)">
                  <Texto
                    value={b.automatizacion.reglaY}
                    onChange={(reglaY) => setGrupo("automatizacion", { reglaY })}
                  />
                </Campo>
              </div>
            </div>
          </Seccion>
        ) : null}

        <Seccion numero="10" titulo="Notas finales">
          <Campo label="Cualquier cosa más que quieras contarme">
            <AreaTexto
              rows={4}
              value={b.notas}
              onChange={(notas) => set("notas", notas)}
            />
          </Campo>
        </Seccion>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-card/95 px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mx-auto max-w-2xl">
          <button
            type="button"
            onClick={onGuardar}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-mustard text-base font-semibold text-accent-foreground shadow-soft transition-transform active:scale-[0.99]"
          >
            <Check className="h-5 w-5" /> Guardar briefing
          </button>
        </div>
      </div>
    </div>
  );
}

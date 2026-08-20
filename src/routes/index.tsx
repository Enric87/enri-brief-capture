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
  cargarPaso,
  ESTILOS,
  FUNCIONES_APP,
  FUNCIONES_WEB,
  guardarBorrador,
  guardarBriefing,
  guardarPaso,
  limpiarBorrador,
  nuevaReferencia,
  PLATAFORMAS_APP,
  PRESUPUESTOS,
  TIPOS_PROYECTO,
  USOS_LOGO,
  type Briefing,
} from "@/lib/briefing";

const TOTAL_PASOS = 6;

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
  const [paso, setPaso] = useState(1);
  const [hidratado, setHidratado] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [sinEspacio, setSinEspacio] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const borrador = cargarBorrador();
    if (borrador) setB(borrador);
    setPaso(cargarPaso());
    setHidratado(true);
  }, []);

  useEffect(() => {
    if (!hidratado) return;
    const t = setTimeout(() => {
      const ok = guardarBorrador(b) && guardarPaso(paso);
      if (!ok && !sinEspacio) {
        setSinEspacio(true);
        toast("No queda espacio para guardar todo el borrador", {
          description: "Las fotos se han comprimido, pero este navegador tiene poco almacenamiento.",
        });
      }
    }, 300);
    return () => clearTimeout(t);
  }, [b, hidratado, paso, sinEspacio]);

  const progreso = useMemo(() => Math.round((paso / TOTAL_PASOS) * 100), [paso]);
  const tiene = (id: string) => b.tipos.includes(id);

  const set = <K extends keyof Briefing>(clave: K, valor: Briefing[K]) =>
    setB((prev) => ({ ...prev, [clave]: valor }));

  const setGrupo = <
    K extends "cliente" | "general" | "creativa" | "logo" | "web" | "app" | "automatizacion",
  >(
    grupo: K,
    parche: Partial<Briefing[K]>,
  ) => setB((prev) => ({ ...prev, [grupo]: { ...prev[grupo], ...parche } }));

  const alternar = (lista: string[], valor: string) =>
    lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor];

  const emailInvalido =
    enviado &&
    b.cliente.email.trim().length > 0 &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.cliente.email);
  const faltaNombre = enviado && !b.cliente.nombre.trim();
  const faltaTipo = enviado && b.tipos.length === 0;

  const irPaso = (siguiente: number) => {
    setPaso(Math.min(TOTAL_PASOS, Math.max(1, siguiente)));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onGuardar = () => {
    setEnviado(true);
    if (!b.cliente.nombre.trim() || b.tipos.length === 0) {
      toast("Faltan un par de datos", {
        description: "Añade el nombre del cliente y al menos un tipo de proyecto.",
      });
      irPaso(!b.cliente.nombre.trim() ? 1 : 2);
      return;
    }
    guardarBriefing(b);
    toast.success("Briefing guardado", { description: "Ya puedes revisar el resumen." });
    void navigate({ to: "/resumen" });
  };

  const nuevoBriefing = () => {
    if (!window.confirm("¿Crear un briefing nuevo? Se limpiará el borrador actual.")) return;
    limpiarBorrador();
    setB(briefingVacio());
    setEnviado(false);
    setSinEspacio(false);
    irPaso(1);
  };

  return (
    <div ref={topRef} className="min-h-screen bg-background pb-28">
      <header className="px-5 pt-12 pb-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[1.35rem] font-black lowercase tracking-[-0.04em] text-foreground">
                enrigraphics<span className="text-mustard">.</span>
              </div>
              <div className="mt-1 hidden text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground sm:block">
                Branding / diseño / web / apps / automatización
              </div>
            </div>
            <button
              type="button"
              onClick={nuevoBriefing}
              className="min-h-11 text-lg font-black text-muted-foreground"
            >
              Nuevo
            </button>
          </div>

          <div className="pt-10">
            <div className="mb-8 h-7 w-7 rounded-md bg-mustard shadow-soft" aria-hidden="true" />
            <p className="eyebrow text-[1.05rem] font-black">Briefing de cliente</p>
            <h1 className="mt-3 text-[3.9rem] font-black leading-[0.95] tracking-[-0.07em] text-foreground sm:text-8xl">
              Nuevo
              <br />
              proyecto
            </h1>
            <p className="mt-4 max-w-lg text-[1.42rem] leading-[1.13] text-muted-foreground sm:text-3xl">
              Cuéntame lo necesario para empezar bien el proyecto.
            </p>
          </div>

          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between text-lg font-black text-muted-foreground">
              <span>
                Paso {paso} de {TOTAL_PASOS}
              </span>
              <span>{progreso}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-mustard transition-all duration-300"
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5">
        {paso === 1 ? (
          <Seccion numero="01" titulo="Datos del cliente" descripcion="Información de contacto básica.">
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
            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>
            <Campo label="Persona de contacto">
              <Texto
                value={b.cliente.contacto}
                placeholder="¿Con quién hablo durante el proyecto?"
                onChange={(contacto) => setGrupo("cliente", { contacto })}
              />
            </Campo>
          </Seccion>
        ) : null}

        {paso === 2 ? (
          <Seccion numero="02" titulo="Proyecto" descripcion="Qué se necesita y para qué.">
            <div>
              <div className="mb-3 text-sm font-bold text-foreground">
                Tipo de proyecto
                <span className="ml-2 font-medium text-muted-foreground">
                  Puedes seleccionar más de uno.
                </span>
              </div>
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
                <p className="mt-2 text-xs font-bold text-destructive">
                  Selecciona al menos un tipo de proyecto.
                </p>
              ) : null}
            </div>
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
                placeholder="Vender más, ganar imagen, ahorrar tiempo..."
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
            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>
            <Campo label="¿Quién toma la decisión final?">
              <Texto
                value={b.general.decisor}
                placeholder="Nombre y rol"
                onChange={(decisor) => setGrupo("general", { decisor })}
              />
            </Campo>
          </Seccion>
        ) : null}

        {paso === 3 ? (
          <Seccion numero="03" titulo="Dirección creativa" descripcion="Preferencias visuales y estilo.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo label="Colores que te gustan">
                <Texto
                  value={b.creativa.coloresGustan}
                  placeholder="Mostaza, negro, tonos tierra..."
                  onChange={(coloresGustan) => setGrupo("creativa", { coloresGustan })}
                />
              </Campo>
              <Campo label="Colores a evitar">
                <Texto
                  value={b.creativa.coloresEvitar}
                  placeholder="Rojo, morado..."
                  onChange={(coloresEvitar) => setGrupo("creativa", { coloresEvitar })}
                />
              </Campo>
              <Campo label="Tipografías que te gustan">
                <Texto
                  value={b.creativa.tipografiasGustan}
                  placeholder="Sans geométrica, serif editorial..."
                  onChange={(tipografiasGustan) => setGrupo("creativa", { tipografiasGustan })}
                />
              </Campo>
              <Campo label="Tipografías a evitar">
                <Texto
                  value={b.creativa.tipografiasEvitar}
                  placeholder="Manuscritas, condensadas..."
                  onChange={(tipografiasEvitar) => setGrupo("creativa", { tipografiasEvitar })}
                />
              </Campo>
            </div>
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
        ) : null}

        {paso === 4 ? (
          <Seccion
            numero="04"
            titulo="Referencias visuales"
            descripcion="Haz una foto, elige una imagen o adjunta un archivo."
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
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-black text-foreground"
            >
              <Plus className="h-4 w-4" /> Añadir otra referencia
            </button>
          </Seccion>
        ) : null}

        {paso === 5 ? (
          <Seccion
            numero="05"
            titulo="Detalles del servicio"
            descripcion="Solo aparecen los apartados seleccionados."
          >
            {b.tipos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-5 text-center text-sm font-bold text-muted-foreground">
                Selecciona al menos un tipo de proyecto en el paso 2 para ver sus preguntas específicas.
              </div>
            ) : null}

            {tiene("logo") ? (
              <div className="space-y-4 rounded-2xl border border-border p-4">
                <h3 className="eyebrow">Logo / Branding</h3>
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
              </div>
            ) : null}

            {tiene("web") ? (
              <div className="space-y-4 rounded-2xl border border-border p-4">
                <h3 className="eyebrow">Web</h3>
                <Campo label="Web actual">
                  <Texto
                    value={b.web.webActual}
                    inputMode="url"
                    placeholder="https://..."
                    onChange={(webActual) => setGrupo("web", { webActual })}
                  />
                </Campo>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Campo label="Dominio">
                    <Texto
                      value={b.web.dominio}
                      onChange={(dominio) => setGrupo("web", { dominio })}
                    />
                  </Campo>
                  <Campo label="Hosting">
                    <Texto
                      value={b.web.hosting}
                      onChange={(hosting) => setGrupo("web", { hosting })}
                    />
                  </Campo>
                </div>
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
                    placeholder="Castellano, catalán, inglés..."
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
              </div>
            ) : null}

            {tiene("app") ? (
              <div className="space-y-4 rounded-2xl border border-border p-4">
                <h3 className="eyebrow">App</h3>
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
                    placeholder={"1. ...\n2. ...\n3. ..."}
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
              </div>
            ) : null}

            {tiene("automatizacion") ? (
              <div className="space-y-4 rounded-2xl border border-border p-4">
                <h3 className="eyebrow">Automatización</h3>
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
                <div className="grid gap-4 sm:grid-cols-2">
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
                </div>
                <Campo label="¿Quién la realiza?">
                  <Texto
                    value={b.automatizacion.quien}
                    onChange={(quien) => setGrupo("automatizacion", { quien })}
                  />
                </Campo>
                <Campo label="Herramientas usadas">
                  <Texto
                    value={b.automatizacion.herramientas}
                    placeholder="Excel, Gmail, Holded..."
                    onChange={(herramientas) => setGrupo("automatizacion", { herramientas })}
                  />
                </Campo>
                <div className="rounded-2xl border border-border bg-mustard-soft p-4">
                  <p className="mb-3 text-sm font-black text-accent-foreground">
                    Cuando ocurre X, quiero que ocurra Y automáticamente
                  </p>
                  <div className="space-y-3">
                    <Campo label="Cuando ocurre... (X)">
                      <Texto
                        value={b.automatizacion.reglaX}
                        onChange={(reglaX) => setGrupo("automatizacion", { reglaX })}
                      />
                    </Campo>
                    <Campo label="Quiero que ocurra... (Y)">
                      <Texto
                        value={b.automatizacion.reglaY}
                        onChange={(reglaY) => setGrupo("automatizacion", { reglaY })}
                      />
                    </Campo>
                  </div>
                </div>
              </div>
            ) : null}
          </Seccion>
        ) : null}

        {paso === 6 ? (
          <Seccion numero="06" titulo="Notas y revisión" descripcion="Últimos detalles antes de guardar.">
            <Campo label="Notas finales">
              <AreaTexto
                rows={6}
                value={b.notas}
                placeholder="Cualquier detalle adicional del cliente o de la reunión..."
                onChange={(notas) => set("notas", notas)}
              />
            </Campo>
            <div className="rounded-2xl border border-border bg-mustard-soft p-4 text-sm text-accent-foreground">
              <strong>Guardado automático activo</strong>
              <p className="mt-1">
                El borrador se guarda en este navegador mientras rellenas el formulario.
              </p>
            </div>
            <button
              type="button"
              onClick={onGuardar}
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-foreground text-base font-black text-card shadow-soft transition-transform active:scale-[0.99]"
            >
              <Check className="h-5 w-5" /> Guardar briefing
            </button>
          </Seccion>
        ) : null}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-background via-background to-background/0 px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-7">
        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => irPaso(paso - 1)}
            disabled={paso === 1}
            className="min-h-16 rounded-2xl border border-border bg-card text-2xl font-black text-foreground disabled:opacity-40"
          >
            Atrás
          </button>
          {paso < TOTAL_PASOS ? (
            <button
              type="button"
              onClick={() => irPaso(paso + 1)}
              className="min-h-16 rounded-2xl bg-foreground text-2xl font-black text-card"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="button"
              onClick={onGuardar}
              className="min-h-16 rounded-2xl bg-foreground text-2xl font-black text-card"
            >
              Guardar
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

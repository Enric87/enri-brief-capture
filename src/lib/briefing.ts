export type Attachment = {
  name: string;
  size: number;
  type: string;
  dataUrl?: string | undefined;
};

export type Referencia = {
  id: string;
  imagen?: string | undefined;
  archivo?: Attachment | undefined;
  url: string;
  gusta: string;
};

export type Briefing = {
  cliente: {
    nombre: string;
    empresa: string;
    telefono: string;
    email: string;
    contacto: string;
  };
  tipos: string[];
  general: {
    descripcion: string;
    objetivo: string;
    publico: string;
    fecha: string;
    presupuesto: string;
    decisor: string;
  };
  creativa: {
    coloresGustan: string;
    coloresEvitar: string;
    tipografiasGustan: string;
    tipografiasEvitar: string;
    estilos: string[];
    libre: string;
  };
  referencias: Referencia[];
  logo: {
    nombreExacto: string;
    eslogan: string;
    simbolos: string;
    noQuiere: string;
    usos: string[];
  };
  web: {
    webActual: string;
    dominio: string;
    hosting: string;
    objetivo: string;
    tipoWeb: string;
    paginas: string;
    textos: string;
    fotos: string;
    idiomas: string;
    funciones: string[];
    mantenimiento: string;
  };
  app: {
    problema: string;
    usuarios: string;
    flujo: string;
    funciones: string[];
    plataformas: string[];
  };
  automatizacion: {
    tarea: string;
    comoAhora: string;
    tiempo: string;
    frecuencia: string;
    quien: string;
    herramientas: string;
    reglaX: string;
    reglaY: string;
  };
  notas: string;
  guardadoEn?: string | undefined;
};

export const TIPOS_PROYECTO = [
  { id: "logo", titulo: "Logo / Branding", desc: "Identidad, marca, aplicaciones" },
  { id: "web", titulo: "Web", desc: "Corporativa, tienda, landing" },
  { id: "app", titulo: "App", desc: "Móvil o web app" },
  { id: "automatizacion", titulo: "Automatización", desc: "Procesos y flujos" },
] as const;

export const ESTILOS = [
  "Minimalista",
  "Elegante",
  "Artesanal",
  "Moderno",
  "Premium",
  "Divertido",
  "Industrial",
  "Retro",
];

export const PRESUPUESTOS = [
  "Menos de 500 €",
  "500 € - 1.000 €",
  "1.000 € - 2.500 €",
  "2.500 € - 5.000 €",
  "5.000 € - 10.000 €",
  "Más de 10.000 €",
  "Aún por definir",
];

export const USOS_LOGO = [
  "Web",
  "Redes sociales",
  "Rótulo",
  "Vehículo",
  "Textil",
  "Packaging",
  "Impresión",
];

export const FUNCIONES_WEB = [
  "Formulario de contacto",
  "WhatsApp",
  "Newsletter",
  "Pagos online",
  "Reservas / citas",
  "Área privada",
];

export const FUNCIONES_APP = [
  "Login",
  "Perfiles de usuario",
  "Pagos",
  "Notificaciones",
  "Cámara",
  "GPS",
  "Archivos",
  "Chat",
  "Panel de administración",
];

export const PLATAFORMAS_APP = ["iOS", "Android", "Web app"];

const nuevaReferencia = (): Referencia => ({
  id: Math.random().toString(36).slice(2),
  url: "",
  gusta: "",
});

export const briefingVacio = (): Briefing => ({
  cliente: { nombre: "", empresa: "", telefono: "", email: "", contacto: "" },
  tipos: [],
  general: {
    descripcion: "",
    objetivo: "",
    publico: "",
    fecha: "",
    presupuesto: "",
    decisor: "",
  },
  creativa: {
    coloresGustan: "",
    coloresEvitar: "",
    tipografiasGustan: "",
    tipografiasEvitar: "",
    estilos: [],
    libre: "",
  },
  referencias: [nuevaReferencia(), nuevaReferencia(), nuevaReferencia()],
  logo: { nombreExacto: "", eslogan: "", simbolos: "", noQuiere: "", usos: [] },
  web: {
    webActual: "",
    dominio: "",
    hosting: "",
    objetivo: "",
    tipoWeb: "",
    paginas: "",
    textos: "",
    fotos: "",
    idiomas: "",
    funciones: [],
    mantenimiento: "",
  },
  app: { problema: "", usuarios: "", flujo: "", funciones: [], plataformas: [] },
  automatizacion: {
    tarea: "",
    comoAhora: "",
    tiempo: "",
    frecuencia: "",
    quien: "",
    herramientas: "",
    reglaX: "",
    reglaY: "",
  },
  notas: "",
});

export { nuevaReferencia };

export const BORRADOR_KEY = "enrigraphics.briefing.borrador";
export const GUARDADOS_KEY = "enrigraphics.briefing.guardados";
export const ULTIMO_KEY = "enrigraphics.briefing.ultimo";
export const PASO_KEY = "enrigraphics.briefing.paso";

const disponible = () => typeof window !== "undefined" && !!window.localStorage;

export function cargarBorrador(): Briefing | null {
  if (!disponible()) return null;
  try {
    const raw = localStorage.getItem(BORRADOR_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Briefing;
    return {
      ...briefingVacio(),
      ...parsed,
      referencias: Array.isArray(parsed.referencias)
        ? parsed.referencias
        : briefingVacio().referencias,
    };
  } catch {
    return null;
  }
}

export function guardarBorrador(b: Briefing): boolean {
  if (!disponible()) return false;
  try {
    localStorage.setItem(BORRADOR_KEY, JSON.stringify(b));
    return true;
  } catch {
    return false;
  }
}

export function limpiarBorrador() {
  if (!disponible()) return;
  localStorage.removeItem(BORRADOR_KEY);
  localStorage.removeItem(PASO_KEY);
}

export function guardarBriefing(b: Briefing): Briefing {
  const final = { ...b, guardadoEn: new Date().toISOString() };
  if (disponible()) {
    try {
      localStorage.setItem(ULTIMO_KEY, JSON.stringify(final));
    } catch {
      // Si ni siquiera cabe el último briefing, el usuario verá el aviso de cuota durante el borrador.
    }
    try {
      const previos = listarBriefings();
      localStorage.setItem(GUARDADOS_KEY, JSON.stringify([final, ...previos].slice(0, 20)));
    } catch {
      try {
        localStorage.setItem(GUARDADOS_KEY, JSON.stringify([final]));
      } catch {
        // El resumen seguirá funcionando con el estado de navegación aunque el historial local falle.
      }
    }
  }
  return final;
}

export function listarBriefings(): Briefing[] {
  if (!disponible()) return [];
  try {
    const raw = localStorage.getItem(GUARDADOS_KEY);
    const guardados = raw ? (JSON.parse(raw) as Briefing[]) : [];
    if (guardados.length) return guardados;
    const ultimo = localStorage.getItem(ULTIMO_KEY);
    return ultimo ? [JSON.parse(ultimo) as Briefing] : [];
  } catch {
    try {
      const ultimo = localStorage.getItem(ULTIMO_KEY);
      return ultimo ? [JSON.parse(ultimo) as Briefing] : [];
    } catch {
      return [];
    }
  }
}

export function guardarPaso(paso: number): boolean {
  if (!disponible()) return false;
  try {
    localStorage.setItem(PASO_KEY, String(paso));
    return true;
  } catch {
    return false;
  }
}

export function cargarPaso(): number {
  if (!disponible()) return 1;
  const paso = Number(localStorage.getItem(PASO_KEY));
  return Number.isFinite(paso) ? Math.min(6, Math.max(1, paso)) : 1;
}

export function leerImagenComprimida(file: File, max = 1600): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
    reader.onload = () => {
      const src = String(reader.result);
      const img = new Image();
      img.onerror = () => resolve(src);
      img.onload = () => {
        const escala = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * escala));
        canvas.height = Math.max(1, Math.round(img.height * escala));
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(src);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

export function leerArchivo(file: File): Promise<Attachment> {
  return new Promise((resolve) => {
    const meta: Attachment = { name: file.name, size: file.size, type: file.type };
    if (file.size > 1_500_000) return resolve(meta);
    const reader = new FileReader();
    reader.onerror = () => resolve(meta);
    reader.onload = () => resolve({ ...meta, dataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  });
}

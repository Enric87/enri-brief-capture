import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Seccion({
  numero,
  titulo,
  descripcion,
  children,
}: {
  numero: string;
  titulo: string;
  descripcion?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border pt-8">
      <div className="mb-5 flex items-start gap-3">
        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-mustard-soft text-xs font-bold text-accent-foreground">
          {numero}
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{titulo}</h2>
          {descripcion ? (
            <p className="mt-1 text-sm text-muted-foreground">{descripcion}</p>
          ) : null}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function Campo({
  label,
  ayuda,
  children,
}: {
  label: string;
  ayuda?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {ayuda ? <span className="mt-1.5 block text-xs text-muted-foreground">{ayuda}</span> : null}
    </label>
  );
}

type TextoProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "tel" | "email" | "url" | "numeric";
  invalido?: boolean;
};

export function Texto({ value, onChange, invalido, ...rest }: TextoProps) {
  return (
    <input
      {...rest}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn("field", invalido && "border-destructive")}
    />
  );
}

export function AreaTexto({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="field resize-y leading-relaxed"
    />
  );
}

export function Selector({
  value,
  onChange,
  opciones,
  placeholder = "Selecciona una opción",
}: {
  value: string;
  onChange: (v: string) => void;
  opciones: string[];
  placeholder?: string;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="field">
      <option value="">{placeholder}</option>
      {opciones.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function Chips({
  opciones,
  valor,
  onToggle,
}: {
  opciones: string[];
  valor: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map((o) => {
        const activo = valor.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            aria-pressed={activo}
            className={cn(
              "min-h-11 rounded-full border px-4 text-sm transition-colors",
              activo
                ? "border-mustard bg-mustard text-accent-foreground font-medium"
                : "border-border bg-card text-foreground hover:bg-secondary",
            )}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

export function TarjetaTipo({
  titulo,
  desc,
  activo,
  onClick,
}: {
  titulo: string;
  desc: string;
  activo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={cn(
        "min-h-[5.5rem] rounded-xl border p-4 text-left transition-all",
        activo
          ? "border-mustard bg-mustard-soft shadow-soft"
          : "border-border bg-card hover:border-mustard/60",
      )}
    >
      <span className="block text-base font-semibold text-foreground">{titulo}</span>
      <span className="mt-1 block text-xs text-muted-foreground">{desc}</span>
    </button>
  );
}

import { useRef } from "react";
import { Camera, ImagePlus, Paperclip, Trash2 } from "lucide-react";
import { AreaTexto, Campo, Texto } from "./campos";
import { leerArchivo, leerImagenComprimida, type Referencia } from "@/lib/briefing";

export function ReferenciaCard({
  indice,
  referencia,
  onChange,
  onEliminar,
}: {
  indice: number;
  referencia: Referencia;
  onChange: (r: Referencia) => void;
  onEliminar?: () => void;
}) {
  const camaraRef = useRef<HTMLInputElement>(null);
  const galeriaRef = useRef<HTMLInputElement>(null);
  const archivoRef = useRef<HTMLInputElement>(null);

  const cargarImagen = async (file?: File | null) => {
    if (!file) return;
    const imagen = await leerImagenComprimida(file);
    onChange({ ...referencia, imagen });
  };

  const cargarArchivo = async (file?: File | null) => {
    if (!file) return;
    onChange({ ...referencia, archivo: await leerArchivo(file) });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="eyebrow">Referencia {indice}</span>
        {onEliminar ? (
          <button
            type="button"
            onClick={onEliminar}
            className="min-h-11 px-2 text-xs text-muted-foreground underline underline-offset-4"
          >
            Quitar bloque
          </button>
        ) : null}
      </div>

      {referencia.imagen ? (
        <div className="relative overflow-hidden rounded-xl border border-border">
          <img
            src={referencia.imagen}
            alt={`Referencia visual ${indice}`}
            className="block max-h-72 w-full object-cover"
          />
          <div className="flex gap-2 border-t border-border bg-secondary p-2">
            <button
              type="button"
              onClick={() => galeriaRef.current?.click()}
              className="min-h-11 flex-1 rounded-lg border border-border bg-card text-sm font-medium"
            >
              Reemplazar
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...referencia, imagen: undefined })}
              className="min-h-11 shrink-0 rounded-lg border border-border bg-card px-3 text-sm text-destructive"
              aria-label="Eliminar imagen"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => camaraRef.current?.click()}
            className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-mustard text-sm font-semibold text-accent-foreground"
          >
            <Camera className="h-4 w-4" /> Hacer foto
          </button>
          <button
            type="button"
            onClick={() => galeriaRef.current?.click()}
            className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground"
          >
            <ImagePlus className="h-4 w-4" /> Elegir imagen
          </button>
        </div>
      )}

      <input
        ref={camaraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => {
          void cargarImagen(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <input
        ref={galeriaRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          void cargarImagen(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <input
        ref={archivoRef}
        type="file"
        className="sr-only"
        onChange={(e) => {
          void cargarArchivo(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <div className="mt-3 space-y-3">
        <button
          type="button"
          onClick={() => archivoRef.current?.click()}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary text-sm font-medium text-foreground"
        >
          <Paperclip className="h-4 w-4" /> Adjuntar archivo (PDF u otro)
        </button>

        {referencia.archivo ? (
          <div className="flex items-center justify-between gap-3 rounded-lg bg-mustard-soft px-3 py-2 text-xs">
            <span className="min-w-0 truncate text-accent-foreground">
              {referencia.archivo.name} · {Math.max(1, Math.round(referencia.archivo.size / 1024))}{" "}
              KB
            </span>
            <button
              type="button"
              onClick={() => onChange({ ...referencia, archivo: undefined })}
              className="shrink-0 text-destructive underline underline-offset-2"
            >
              Quitar
            </button>
          </div>
        ) : null}

        <Campo label="URL de referencia">
          <Texto
            value={referencia.url}
            inputMode="url"
            placeholder="https://…"
            onChange={(url) => onChange({ ...referencia, url })}
          />
        </Campo>
        <Campo label="¿Qué te gusta de esta referencia?">
          <AreaTexto
            rows={3}
            value={referencia.gusta}
            placeholder="Los colores, la tipografía, la sensación…"
            onChange={(gusta) => onChange({ ...referencia, gusta })}
          />
        </Campo>
      </div>
    </div>
  );
}

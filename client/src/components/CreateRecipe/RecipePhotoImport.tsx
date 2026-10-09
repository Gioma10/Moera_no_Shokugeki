"use client";

import { Camera, ImageIcon, Loader2, ScanText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { extractRecipePhoto } from "@/api/recipes";
import { Button } from "@/components/ui/button";
import {
  EXTRACTION_LABELS,
  type ExtractedRecipe,
  IMPORT_ACCEPT,
  MAX_IMPORT_BYTES,
  type RecipeExtraction,
  isHeic,
  isImportableImage,
} from "@/types/recipe-extraction";

type Props = {
  /** Fills the form; with overwrite=false fields the user already filled are kept. */
  onApply: (recipe: ExtractedRecipe, overwrite: boolean) => void;
  onUseAsCover: (file: File) => void;
};

type Scan = { file: File; result: RecipeExtraction };

/**
 * Scan flow: the camera opens straight away, reading starts on capture and the
 * empty fields are filled automatically. Nothing is saved until the user submits.
 */
export function RecipePhotoImport({ onApply, onUseAsCover }: Props) {
  const cameraInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const request = useRef<AbortController | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [scan, setScan] = useState<Scan | null>(null);
  const [replaced, setReplaced] = useState(false);
  const [coverSet, setCoverSet] = useState(false);
  useEffect(() => () => request.current?.abort(), []);

  async function read(file: File) {
    if (!isImportableImage(file) || file.size === 0 || file.size > MAX_IMPORT_BYTES) {
      setError("Scegli una foto JPG, PNG, WebP o HEIC non vuota, fino a 8 MB.");
      return;
    }
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setPending(true); setError(""); setScan(null); setReplaced(false); setCoverSet(false);
    try {
      const result = await extractRecipePhoto(file, controller.signal);
      if (controller.signal.aborted) return;
      onApply(result.recipe, false);
      setScan({ file, result });
    } catch (error) {
      if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "Lettura non riuscita. Riprova.");
    } finally {
      if (request.current === controller) { setPending(false); request.current = null; }
    }
  }

  function onPick(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) read(file);
  }

  const recipe = scan?.result.recipe;
  const missing = recipe
    ? (Object.keys(EXTRACTION_LABELS) as (keyof ExtractedRecipe)[])
        .filter(key => key !== "note" && (recipe[key] === null || (Array.isArray(recipe[key]) && recipe[key].length === 0)))
        .map(key => EXTRACTION_LABELS[key])
    : [];
  const incompleteIngredients = recipe?.ingredients?.some(i => !i.ingredient || (i.quantity === null && i.unit !== "q.b."));

  return (
    <section aria-labelledby="recipe-scan-title" className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <ScanText className="size-5 text-brand" aria-hidden="true" />
        <h2 id="recipe-scan-title" className="text-lg font-semibold">Scansiona una ricetta</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Inquadra la ricetta scritta: compiliamo i campi vuoti e puoi correggere tutto prima di salvare.</p>

      {/* capture opens the rear camera directly on phones; desktops fall back to a file picker. */}
      <input ref={cameraInput} type="file" accept="image/*" capture="environment" className="hidden" onChange={onPick} />
      <input ref={galleryInput} type="file" accept={IMPORT_ACCEPT} className="hidden" onChange={onPick} />

      {pending ? (
        <div aria-live="polite" className="mt-4 flex items-center gap-3 rounded-2xl bg-muted/40 p-4">
          <Loader2 className="size-5 shrink-0 animate-spin text-brand motion-reduce:animate-none" aria-hidden="true" />
          <p className="flex-1 text-sm">Sto leggendo la ricetta…</p>
          <Button type="button" variant="outline" size="sm" onClick={() => { request.current?.abort(); setPending(false); }}>Annulla</Button>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button type="button" className="btn-brand h-12 flex-1 rounded-full text-base" onClick={() => cameraInput.current?.click()}>
            <Camera className="size-5" aria-hidden="true" />
            {scan ? "Scansiona di nuovo" : "Scansiona ricetta"}
          </Button>
          <Button type="button" variant="outline" className="h-12 rounded-full" onClick={() => galleryInput.current?.click()}>
            <ImageIcon className="size-4" aria-hidden="true" />
            Scegli dalla galleria
          </Button>
        </div>
      )}

      {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}

      {scan && recipe && (
        <div aria-live="polite" className="mt-4 space-y-3 border-t border-border pt-4 text-sm">
          <p className="font-medium">
            {recipe.title ? `“${recipe.title}” letta` : "Ricetta letta"}: {recipe.ingredients?.length ?? 0} ingredienti. Controlla i tre passaggi e scegli il tuo voto.
          </p>
          {missing.length > 0 && <p className="text-muted-foreground">Da completare a mano: {missing.join(", ")}.</p>}
          {incompleteIngredients && <p className="text-muted-foreground">Alcuni ingredienti non hanno la quantità: controllali nel passaggio Ingredienti.</p>}
          {scan.result.warnings.length > 0 && (
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              {scan.result.warnings.map((warning, index) => <li key={`${index}-${warning}`}>{warning}</li>)}
            </ul>
          )}
          <div className="flex flex-wrap gap-2">
            {!replaced && (
              <Button type="button" variant="outline" size="sm" onClick={() => { onApply(recipe, true); setReplaced(true); }}>
                Sostituisci anche i campi già compilati
              </Button>
            )}
            {/* Recipe images are shown with <img>, which most browsers cannot do for HEIC. */}
            {!isHeic(scan.file) && !coverSet && (
              <Button type="button" variant="outline" size="sm" onClick={() => { onUseAsCover(scan.file); setCoverSet(true); }}>
                Usa la foto come immagine della ricetta
              </Button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

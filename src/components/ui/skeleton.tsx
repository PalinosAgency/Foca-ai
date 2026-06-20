/*! desenvolvido por Arthur Miquelito Lopes e Heitor Crespo de Souza
 * Copyright (c) 2026 Arthur Miquelito Lopes e Heitor Crespo de Souza. Todos os direitos reservados.
 * Aviso de propriedade intelectual: remocao ou alteracao deste aviso nao remove os direitos autorais dos autores.
 */
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

export { Skeleton };

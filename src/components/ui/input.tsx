import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        // Força o navegador a renderizar este input em modo CLARO (texto escuro, fundo claro)
        style={{ colorScheme: 'light' }}
        className={cn(
          // Estilos Base
          "flex h-11 w-full rounded-lg border border-input px-4 py-2 text-base shadow-sm transition-all duration-200",
          
          // Ficheiro
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          
          // Placeholder e Foco
          "placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0026f7]/30 focus-visible:border-[#0026f7]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          
          // --- CORREÇÃO SUPREMA DE CORES ---
          // O '!' força estas cores acima de qualquer tema global
          "!bg-white !text-black !placeholder-gray-500",
          "dark:!bg-white dark:!text-black dark:!placeholder-gray-500",
          
          // Correção para Autopreenchimento (quando o navegador preenche amarelo/azul)
          "[&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:!text-black [&:-webkit-autofill]:[-webkit-text-fill-color:black] [&:-webkit-autofill]:shadow-[0_0_0px_1000px_white_inset]",
          
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
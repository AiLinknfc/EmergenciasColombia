import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          {
            "bg-primary text-white hover:brightness-110 shadow-lg": variant === "default",
            "bg-error text-white hover:brightness-110 shadow-lg": variant === "destructive",
            "border-2 border-outline-variant bg-transparent text-on-surface hover:bg-surface-container-high": variant === "outline",
            "bg-surface-container-high text-on-surface hover:bg-surface-container-highest": variant === "secondary",
            "hover:bg-surface-container-high text-primary": variant === "ghost",
          },
          {
            "h-12 px-6 text-xs": size === "default",
            "h-9 px-4 text-[10px]": size === "sm",
            "h-14 px-10 text-sm": size === "lg",
            "h-10 w-10 p-0": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

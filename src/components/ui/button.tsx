import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:scale-105 active:scale-95 touch-manipulation focus-ring",
  {
    variants: {
      variant: {
        default: "btn-primary",
        destructive: "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg rounded-2xl px-8 py-4",
        outline: "btn-outline",
        secondary: "btn-secondary",
        ghost: "text-white hover:bg-white/10 hover:text-white rounded-xl px-4 py-3",
        link: "text-blue-300 underline-offset-4 hover:underline hover:text-white px-4 py-3",
      },
      size: {
        default: "px-8 py-4 rounded-2xl text-base min-h-[48px]",
        sm: "px-4 py-2 rounded-xl text-sm min-h-[40px]",
        lg: "px-10 py-5 rounded-2xl text-lg min-h-[56px]",
        icon: "btn-icon",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
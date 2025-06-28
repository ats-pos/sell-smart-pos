
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:scale-105 active:scale-95 touch-manipulation focus-ring",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 shadow-soft hover:shadow-medium rounded-xl",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-soft hover:shadow-medium rounded-xl",
        outline: "border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 bg-white hover:bg-blue-50 rounded-xl",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-soft rounded-xl",
        ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700",
      },
      size: {
        default: "px-6 py-3 rounded-xl text-sm min-h-[48px]",
        sm: "px-4 py-2 rounded-lg text-sm min-h-[40px]",
        lg: "px-8 py-4 rounded-xl text-base min-h-[56px]",
        icon: "p-3 rounded-xl min-w-[48px] min-h-[48px]",
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

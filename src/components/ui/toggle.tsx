
import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"



const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    {
      variant?: "default" | "outline"
      size?: "default" | "sm" | "lg"
    }
>(({ className = "", variant = "default", size = "default", ...props }, ref) => {
  const [pressed, setPressed] = React.useState(props.pressed || false)
  
  React.useEffect(() => {
    if (props.pressed !== undefined) {
      setPressed(props.pressed)
    }
  }, [props.pressed])
  
  return (
  <TogglePrimitive.Root
    ref={ref}
    className={`toggle ${variant} ${size} ${pressed ? 'pressed' : ''} ${className}`}
    onPressedChange={(newPressed) => {
      setPressed(newPressed)
      props.onPressedChange?.(newPressed)
    }}
    {...props}
  />
  )
})

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle }

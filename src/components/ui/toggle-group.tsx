import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"


const ToggleGroupContext = React.createContext<
  {
    size?: "default" | "sm" | "lg"
    variant?: "default" | "outline"
  }
>({
  size: "default",
  variant: "default",
})

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    {
      variant?: "default" | "outline"
      size?: "default" | "sm" | "lg"
    }
>(({ className = "", variant = "default", size = "default", children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={`toggle-group ${className}`}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    {
      variant?: "default" | "outline"
      size?: "default" | "sm" | "lg"
    }
>(({ className = "", children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)
  const [pressed, setPressed] = React.useState(false)
  
  React.useEffect(() => {
    if (props.value && props.value === props.defaultValue) {
      setPressed(true)
    }
  }, [props.value, props.defaultValue])

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={`toggle-group-item ${context.variant || variant} ${context.size || size} ${pressed ? 'pressed' : ''} ${className}`}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }

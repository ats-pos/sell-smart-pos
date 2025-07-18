
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"


const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className = "", ...props }, ref) => {
  const [checked, setChecked] = React.useState(props.checked || false)
  
  React.useEffect(() => {
    if (props.checked !== undefined) {
      setChecked(props.checked)
    }
  }, [props.checked])
  
  return (
  <SwitchPrimitives.Root
    className={`switch ${checked ? 'checked' : ''} ${className}`}
    {...props}
    onCheckedChange={(newChecked) => {
      setChecked(newChecked)
      props.onCheckedChange?.(newChecked)
    }}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={`switch-thumb ${checked ? 'checked' : ''}`}
    />
  </SwitchPrimitives.Root>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }

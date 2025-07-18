
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"


const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className = "", ...props }, ref) => {
  const [checked, setChecked] = React.useState(props.checked || false)
  
  React.useEffect(() => {
    if (props.checked !== undefined) {
      setChecked(props.checked)
    }
  }, [props.checked])
  
  return (
  <CheckboxPrimitive.Root
    ref={ref}
    className={`checkbox ${checked ? 'checked' : ''} ${className}`}
    {...props}
    onCheckedChange={(newChecked) => {
      setChecked(!!newChecked)
      props.onCheckedChange?.(newChecked)
    }}
  >
    <CheckboxPrimitive.Indicator
      className="checkbox-indicator"
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }

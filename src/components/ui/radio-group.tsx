
import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"


const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className = "", ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={`radio-group ${className}`}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className = "", ...props }, ref) => {
  const [checked, setChecked] = React.useState(props.checked || false)
  
  React.useEffect(() => {
    if (props.checked !== undefined) {
      setChecked(props.checked)
    }
  }, [props.checked])
  
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={`radio-group-item ${checked ? 'checked' : ''} ${className}`}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="radio-indicator">
        <Circle className="h-2.5 w-2.5 fill-blue-500 text-blue-500" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }

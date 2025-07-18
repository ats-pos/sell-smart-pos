
import * as React from "react"



export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    {
      variant?: "default" | "secondary" | "destructive" | "outline"
    } {}

function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const classes = `badge ${variant} ${className}`.trim()
  
  return (
    <div className={classes} {...props} />
  )
}

export { Badge }

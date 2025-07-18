import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster"
      toastOptions={{
        classNames: {
          toast:
            "toast",
          description: "toast-description",
          actionButton:
            "toast-action",
          cancelButton:
            "toast-close",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }

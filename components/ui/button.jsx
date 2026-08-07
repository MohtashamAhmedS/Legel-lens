import { forwardRef } from "react";

const VARIANTS = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
};

const SIZES = {
  default: "h-11 px-6 text-sm",
  sm: "h-9 px-4 text-sm",
  lg: "h-12 px-8 text-base",
};

const Button = forwardRef(
  (
    { className = "", variant = "default", size = "default", disabled, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`inline-flex items-center justify-center gap-2 rounded-md font-semibold
                    transition-colors focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50
                    ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

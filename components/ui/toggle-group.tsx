"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

const toggleGroupVariants = cva("flex items-center justify-center gap-1", {
  variants: {
    variant: {
      default: "bg-transparent",
      outline:
        "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
    },
    size: {
      default: "h-9",
      sm: "h-8",
      lg: "h-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface ToggleGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toggleGroupVariants> {
  type: "single" | "multiple";
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  disabled?: boolean;
}

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      className,
      variant,
      size,
      type,
      value,
      onValueChange,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const handleValueChange = (itemValue: string) => {
      if (disabled) {
        return;
      }

      if (type === "single") {
        onValueChange?.(value === itemValue ? "" : itemValue);
      } else {
        const currentValue = Array.isArray(value) ? value : [];
        const newValue = currentValue.includes(itemValue)
          ? currentValue.filter((v) => v !== itemValue)
          : [...currentValue, itemValue];
        onValueChange?.(newValue);
      }
    };

    return (
      <div
        className={cn(toggleGroupVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (
            React.isValidElement<ToggleGroupItemProps>(child) &&
            child.type === ToggleGroupItem
          ) {
            const itemValue = child.props.value;
            const isPressed =
              type === "single"
                ? value === itemValue
                : Array.isArray(value) && value.includes(itemValue);

            return React.cloneElement(child, {
              pressed: isPressed,
              onPressedChange: () => handleValueChange(itemValue),
              disabled: disabled || child.props.disabled,
            });
          }
          return child;
        })}
      </div>
    );
  }
);
ToggleGroup.displayName = "ToggleGroup";

interface ToggleGroupItemProps extends React.ComponentProps<typeof Toggle> {
  value: string;
}

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof Toggle>,
  ToggleGroupItemProps
>(({ value, ...props }, ref) => {
  return <Toggle ref={ref} {...props} />;
});
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };

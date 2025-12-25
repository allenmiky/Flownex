export default function Button({
    children,
    variant = "primary",
    className = "",
    ...props
}) {
    const base =
        "fn-btn " +
        (variant === "secondary" ? "fn-btn-secondary" : "");

    return (
        <button className={`${base} ${className}`} {...props}>
            {children}
        </button>
    );
}

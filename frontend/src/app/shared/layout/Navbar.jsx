import Button from "../ui/Button";

export default function Navbar() {
  return (
    <header
      className="h-14 flex items-center justify-between px-6 border-b"
      style={{ borderColor: "var(--border-color)" }}
    >
      <div className="font-semibold text-lg">
        Flownex
      </div>

      <div className="flex items-center gap-3">
        <Button variant="secondary">Board</Button>
        <Button variant="secondary">Timeline</Button>
        <Button variant="secondary">Calendar</Button>
      </div>
    </header>
  );
}

export default function BgGrid() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      data-testid="bg-grid"
    >
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 204, 0, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 204, 0, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
}

interface ImagePlaceholderProps {
  width: string | number;
  height: string | number;
  desc: string;
  circular?: boolean;
  style?: React.CSSProperties;
}

export default function ImagePlaceholder({ width, height, desc, circular, style }: ImagePlaceholderProps) {
  return (
    <div style={{
      width,
      height,
      background: "var(--bg-surface)",
      border: "2px dashed var(--border)",
      borderRadius: circular ? "50%" : "8px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-soft)",
      fontSize: "0.58rem",
      textAlign: "center",
      padding: "4px",
      lineHeight: 1.4,
      whiteSpace: "pre-line",
      flexShrink: 0,
      gap: "3px",
      boxSizing: "border-box",
      ...style,
    }}>
      <i className="fas fa-camera" style={{ fontSize: "0.85rem", marginBottom: "2px" }} />
      {desc}
    </div>
  );
}

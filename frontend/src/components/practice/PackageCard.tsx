import Link from "next/link";
import type { ExamPackage } from "@/types";
import Badge from "@/components/ui/Badge";

interface Props {
  pkg: ExamPackage;
  examHref?: (pkgId: number) => string;
}

export default function PackageCard({ pkg, examHref }: Props) {
  const href = examHref ? examHref(pkg.id) : `/exam/${pkg.id}`;
  const tagLower = pkg.tag.toLowerCase() as "tsa" | "hsa";

  return (
    <Link href={href} style={{
      background: "#fff", border: "2px solid #f0d5d5", borderRadius: "14px",
      padding: "18px 20px", display: "flex", alignItems: "center", gap: "16px",
      transition: "box-shadow .15s",
    }}>
      <div style={{
        width: "44px", height: "44px", borderRadius: "12px",
        background: pkg.tag === "TSA" ? "#e3f2fd" : "#e8f5e9",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: pkg.tag === "TSA" ? "#1565c0" : "#2e7d32", fontSize: "1.2rem",
        flexShrink: 0,
      }}>
        <i className="fas fa-file-alt" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <Badge variant={tagLower}>{pkg.tag}</Badge>
          <span style={{ fontSize: "0.75rem", color: "#777" }}>
            <i className="fas fa-list" style={{ marginRight: "4px" }} />{pkg.examCount} đề
          </span>
          {pkg.isLocked && <i className="fas fa-lock" style={{ color: "#f5a623", fontSize: "0.8rem" }} />}
        </div>
        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#2c2c2c", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {pkg.name}
        </div>
        {pkg.description && (
          <div style={{ fontSize: "0.75rem", color: "#888", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {pkg.description}
          </div>
        )}
      </div>
      <i className="fas fa-chevron-right" style={{ color: "#ccc", fontSize: "0.8rem" }} />
    </Link>
  );
}

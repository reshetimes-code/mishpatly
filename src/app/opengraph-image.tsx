import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "משפטלי - משפט לי - מאגר פסקי דין והחלטות משפטיות";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), "public/logo.png"));
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0B3C5D 0%, #072a42 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoBase64}
          alt="משפטלי"
          width={400}
          height={200}
          style={{ objectFit: "contain" }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "24px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "2px",
              background: "#C9A84C",
            }}
          />
          <div
            style={{
              color: "#C9A84C",
              fontSize: "24px",
              fontWeight: 400,
              letterSpacing: "2px",
            }}
          >
            mishpatly.co.il
          </div>
          <div
            style={{
              width: "60px",
              height: "2px",
              background: "#C9A84C",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

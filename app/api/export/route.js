import PDFDocument from "pdfkit";
import { withSession } from "@/lib/middleware/withSession";
import { withErrorHandler } from "@/lib/middleware/withErrorHandler";
import { fail } from "@/lib/utils/apiResponse";
import Document from "@/lib/db/models/Document";
import Analysis from "@/lib/db/models/Analysis";

function toMarkdown(doc, analysis) {
  const lines = [
    `# ${doc.title}`,
    `_${doc.documentType.replace(/_/g, " ")}_`,
    "",
    "## Executive Summary",
    analysis.executiveSummary || "",
    "",
    "## Plain English Summary",
    analysis.plainEnglishSummary || "",
    "",
    `## Scores`,
    `- Risk: ${analysis.scores?.riskScore ?? "N/A"}/100`,
    `- Complexity: ${analysis.scores?.complexityScore ?? "N/A"}/100`,
    `- Confidence: ${analysis.scores?.confidenceScore ?? "N/A"}`,
    "",
    "## Red Flags",
    ...(analysis.redFlags || []).map((r) => `- **[${r.severity}] ${r.type}**: ${r.description}`),
    "",
    "## Clauses",
    ...(analysis.clauses || []).flatMap((c) => [
      `### ${c.heading}`,
      `**Plain English:** ${c.plainEnglish}`,
      `**Why it matters:** ${c.whyItMatters}`,
      c.possibleRisk ? `**Risk:** ${c.possibleRisk}` : "",
      "",
    ]),
    "## Obligations",
    ...(analysis.obligations || []).map((o) => `- **${o.party}**: ${o.description}${o.deadline ? ` (by ${o.deadline})` : ""}`),
    "",
    "## Timeline",
    ...(analysis.timeline || []).map((t) => `- ${t.date}: ${t.description}`),
    "",
    "---",
    "_This analysis is informational only and is not legal advice._",
  ];
  return lines.join("\n");
}

function toPlainText(doc, analysis) {
  return toMarkdown(doc, analysis)
    .replace(/^#+\s*/gm, "")
    .replace(/\*\*/g, "");
}

function toPdfBuffer(doc, analysis) {
  return new Promise((resolve, reject) => {
    const pdfDoc = new PDFDocument({ margin: 50 });
    const chunks = [];
    pdfDoc.on("data", (chunk) => chunks.push(chunk));
    pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
    pdfDoc.on("error", reject);

    pdfDoc.fontSize(20).text(doc.title, { underline: true });
    pdfDoc.moveDown();
    pdfDoc.fontSize(14).text("Executive Summary");
    pdfDoc.fontSize(11).text(analysis.executiveSummary || "");
    pdfDoc.moveDown();

    pdfDoc.fontSize(14).text("Scores");
    pdfDoc.fontSize(11).text(`Risk: ${analysis.scores?.riskScore ?? "N/A"}/100  |  Complexity: ${analysis.scores?.complexityScore ?? "N/A"}/100`);
    pdfDoc.moveDown();

    pdfDoc.fontSize(14).text("Red Flags");
    (analysis.redFlags || []).forEach((r) => {
      pdfDoc.fontSize(11).text(`[${r.severity}] ${r.type}: ${r.description}`);
    });
    pdfDoc.moveDown();

    pdfDoc.fontSize(14).text("Clauses");
    (analysis.clauses || []).forEach((c) => {
      pdfDoc.fontSize(12).text(c.heading, { underline: true });
      pdfDoc.fontSize(11).text(c.plainEnglish || "");
      pdfDoc.moveDown(0.5);
    });

    pdfDoc.moveDown();
    pdfDoc.fontSize(9).fillColor("gray").text("This analysis is informational only and is not legal advice.");

    pdfDoc.end();
  });
}

export const GET = withErrorHandler(
  withSession(async (req, _context, session) => {
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get("documentId");
    const format = searchParams.get("format");

    if (!["pdf", "markdown", "text"].includes(format)) {
      return fail("format must be one of pdf, markdown, text.", 422);
    }

    const document = await Document.findOne({ _id: documentId, userId: session._id });
    if (!document) return fail("Document not found.", 404);

    const analysis = await Analysis.findOne({ documentId }).lean();
    if (!analysis) return fail("Analysis not found.", 404);

    const safeName = document.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    if (format === "markdown") {
      return new Response(toMarkdown(document, analysis), {
        headers: {
          "Content-Type": "text/markdown",
          "Content-Disposition": `attachment; filename="${safeName}.md"`,
        },
      });
    }

    if (format === "text") {
      return new Response(toPlainText(document, analysis), {
        headers: {
          "Content-Type": "text/plain",
          "Content-Disposition": `attachment; filename="${safeName}.txt"`,
        },
      });
    }

    const pdfBuffer = await toPdfBuffer(document, analysis);
    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}.pdf"`,
      },
    });
  })
);

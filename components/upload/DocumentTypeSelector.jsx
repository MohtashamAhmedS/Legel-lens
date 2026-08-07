"use client";

const DOCUMENT_TYPES = [
  { value: "employment_contract", label: "Employment Contract" },
  { value: "rental_agreement", label: "Rental Agreement" },
  { value: "nda", label: "NDA" },
  { value: "service_agreement", label: "Service Agreement" },
  { value: "purchase_agreement", label: "Purchase Agreement" },
  { value: "privacy_policy", label: "Privacy Policy" },
  { value: "terms_and_conditions", label: "Terms & Conditions" },
  { value: "loan_agreement", label: "Loan Agreement" },
  { value: "partnership_agreement", label: "Partnership Agreement" },
  { value: "freelance_contract", label: "Freelance Contract" },
  { value: "legal_notice", label: "Legal Notice" },
  { value: "custom", label: "Other / Not Sure" },
];

export default function DocumentTypeSelector({ value, onChange, disabled }) {
  return (
    <div className="w-full">
      <label
        htmlFor="document-type"
        className="block text-sm font-medium text-foreground mb-2"
      >
        Document type
      </label>
      <select
        id="document-type"
        name="documentType"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="" disabled>
          Select document type
        </option>
        {DOCUMENT_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export { DOCUMENT_TYPES };

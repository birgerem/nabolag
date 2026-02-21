"use client";

// ============================================================
// JobApplicationForm – Kontaktskjema for arbeidsgivere
// Brukes på /sommerjobb-siden
// ============================================================

import { useState } from "react";
import { sendJobApplication } from "@/actions/jobapplication";
import BigButton from "@/components/ui/BigButton";

export default function JobApplicationForm() {
  const [employerName, setEmployerName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!employerName.trim() || !company.trim() || !email.trim() || !message.trim()) {
      setError("Vennligst fyll ut alle feltene.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await sendJobApplication({
      employer_name: employerName.trim(),
      company: company.trim(),
      employer_email: email.trim(),
      message: message.trim(),
    });

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "Noe gikk galt. Prøv igjen.");
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="bg-surface rounded-2xl p-8 md:p-10 card-soft border border-border-light text-center">
        <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <span className="text-secondary text-3xl font-bold">&#10003;</span>
        </div>
        <h3 className="text-2xl font-bold text-primary mb-3">Takk for henvendelsen!</h3>
        <p className="text-lg text-text-muted leading-relaxed">
          Edvard og foreldrene hans vil ta kontakt med deg så snart som mulig.
          Vi gleder oss til å høre mer!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl p-8 md:p-10 card-soft border border-border-light">
      <h3 className="text-2xl font-bold text-primary mb-2">
        Ta kontakt
      </h3>
      <p className="text-text-muted mb-6 leading-relaxed">
        Er du interessert i å gi Edvard sommerjobb? Fyll ut skjemaet så tar vi kontakt!
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="employer-name">Ditt navn</label>
          <input
            id="employer-name"
            type="text"
            value={employerName}
            onChange={(e) => setEmployerName(e.target.value)}
            placeholder="Fornavn Etternavn"
            required
          />
        </div>
        <div>
          <label htmlFor="company">Bedrift / arbeidsgiver</label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Bedriftsnavn"
            required
          />
        </div>
        <div>
          <label htmlFor="employer-email">E-postadresse</label>
          <input
            id="employer-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="din@bedrift.no"
            required
          />
        </div>
        <div>
          <label htmlFor="message">Melding til Edvard</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Fortell litt om jobben, hvor mange timer, og når det passer best ..."
            rows={5}
          />
        </div>

        {error && (
          <div className="bg-error-light rounded-xl p-4 border border-error/20">
            <p className="text-error font-semibold">{error}</p>
          </div>
        )}

        <BigButton
          onClick={handleSubmit}
          variant="primary"
          fullWidth
          disabled={submitting}
        >
          {submitting ? "Sender ..." : "Send henvendelse"}
        </BigButton>

        <p className="text-sm text-text-muted text-center">
          Vi svarer så raskt vi kan — som regel innen en dag eller to.
        </p>
      </div>
    </div>
  );
}

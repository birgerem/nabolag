"use client";

// ============================================================
// Admin login-side
// ============================================================

import { useState } from "react";
import { loginAction } from "@/actions/auth";
import BigButton from "@/components/ui/BigButton";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // Hvis vellykket, redirect skjer i loginAction
  }

  return (
    <div className="section min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-2xl p-8 shadow-sm border border-border-light">
          <h1 className="text-2xl font-bold text-text mb-6 text-center">
            Admin-innlogging
          </h1>

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email">E-post</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="din@epost.no"
              />
            </div>

            <div>
              <label htmlFor="password">Passord</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Ditt passord"
              />
            </div>

            {error && (
              <div className="bg-error-light rounded-xl p-4 border border-red-200">
                <p className="text-error font-semibold">{error}</p>
              </div>
            )}

            <BigButton
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? "Logger inn..." : "Logg inn"}
            </BigButton>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

type VehicleContactFormProps = {
  vehicleId: string;
  vehicleTitle: string;
  ownerId: string;
};

export default function VehicleContactForm({
  vehicleId,
  vehicleTitle,
  ownerId,
}: VehicleContactFormProps) {
  const { data: session } = useSession();
  const [subject, setSubject] = useState(`Question about ${vehicleTitle}`);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!session?.user?.id) {
      setFeedback("You must be logged in to contact the owner.");
      return;
    }

    setIsSubmitting(true);
    setFeedback("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId,
          recipientId: ownerId,
          subject,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback(data.error ?? "Failed to send message.");
        return;
      }

      setMessage("");
      setFeedback("Message sent successfully.");
    } catch (error) {
      console.error(error);
      setFeedback("Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!session?.user) {
    return (
      <div className="rounded-xl border bg-white p-4">
        <h2 className="mb-2 text-xl font-semibold">Contact Owner</h2>
        <p className="text-sm text-gray-600">Log in to send a private message to the seller.</p>
      </div>
    );
  }

  if (session.user.id === ownerId) {
    return (
      <div className="rounded-xl border bg-white p-4">
        <h2 className="mb-2 text-xl font-semibold">Contact Owner</h2>
        <p className="text-sm text-gray-600">This is your vehicle listing.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-4">
      <h2 className="mb-4 text-xl font-semibold">Contact Owner</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded border px-3 py-2"
          placeholder="Subject"
          required
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-32 w-full rounded border px-3 py-2"
          placeholder="Write your message... and don't forget to include your contact information!"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>

      {feedback && <p className="mt-3 text-sm text-gray-700">{feedback}</p>}
    </div>
  );
}

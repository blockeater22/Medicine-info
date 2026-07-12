"use client";

export function ContactForm() {
  return (
    <form className="space-y-4 rounded-xl border p-6" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label htmlFor="name" className="text-sm font-medium">Name</label>
        <input id="name" type="text" className="mt-1 w-full h-10 rounded-lg border px-3 text-sm bg-background" required />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input id="email" type="email" className="mt-1 w-full h-10 rounded-lg border px-3 text-sm bg-background" required />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium">Message</label>
        <textarea id="message" rows={4} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-background" required />
      </div>
      <button type="submit" className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors">
        Send Message
      </button>
    </form>
  );
}

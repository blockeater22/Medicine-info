"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Stethoscope } from "lucide-react";
import { SearchBar } from "@/components/search/search-bar";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background section-padding">
      <div className="container-custom text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Stethoscope className="h-4 w-4" /> India&apos;s Trusted Medical Resource
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Your Health, <span className="text-primary">Our Priority</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Search medicines, diseases, symptoms, lab tests, calculators, and health articles — all free, all reliable.
          </p>
          <div className="max-w-2xl mx-auto mb-6">
            <SearchBar />
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
            <span>Popular:</span>
            {["Paracetamol", "Diabetes", "BMI Calculator", "Headache"].map((term) => (
              <Link key={term} href={`/search?q=${encodeURIComponent(term.toLowerCase())}`} className="text-primary hover:underline">
                {term}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

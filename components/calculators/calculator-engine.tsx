"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CalculatorInput } from "@/types";

interface CalculatorEngineProps {
  slug: string;
  name: string;
  inputs: CalculatorInput[];
}

function calculate(slug: string, values: Record<string, string>): { result: string; details?: string } | null {
  switch (slug) {
    case "bmi": {
      const weight = parseFloat(values.weight);
      const height = parseFloat(values.height) / 100;
      if (!weight || !height) return null;
      const bmi = weight / (height * height);
      let category = "Normal";
      if (bmi < 18.5) category = "Underweight";
      else if (bmi < 25) category = "Normal weight";
      else if (bmi < 30) category = "Overweight";
      else category = "Obese";
      return { result: bmi.toFixed(1), details: `Category: ${category}` };
    }
    case "bmr": {
      const weight = parseFloat(values.weight);
      const height = parseFloat(values.height);
      const age = parseFloat(values.age);
      const gender = values.gender;
      if (!weight || !height || !age || !gender) return null;
      const bmr = gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
      return { result: `${Math.round(bmr)} kcal/day`, details: "Basal Metabolic Rate (Mifflin-St Jeor)" };
    }
    case "calorie": {
      const bmr = parseFloat(values.bmr || "0");
      const activity = values.activity || "1.2";
      if (!bmr) return null;
      return { result: `${Math.round(bmr * parseFloat(activity))} kcal/day`, details: "Total Daily Energy Expenditure estimate" };
    }
    case "water-intake": {
      const weight = parseFloat(values.weight);
      if (!weight) return null;
      const ml = weight * 35;
      return { result: `${Math.round(ml)} ml/day`, details: "Approx. 35ml per kg body weight" };
    }
    case "ideal-weight": {
      const height = parseFloat(values.height);
      const gender = values.gender || "male";
      if (!height) return null;
      const base = gender === "male" ? height - 100 : height - 105;
      return { result: `${Math.round(base * 0.9)} - ${Math.round(base * 1.1)} kg`, details: "Devine formula approximation" };
    }
    case "body-fat": {
      const waist = parseFloat(values.waist);
      const neck = parseFloat(values.neck);
      const height = parseFloat(values.height);
      const gender = values.gender;
      if (!waist || !neck || !height || !gender) return null;
      let bf: number;
      if (gender === "male") {
        bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
      } else {
        const hip = parseFloat(values.hip || "0");
        if (!hip) return null;
        bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
      }
      return { result: `${bf.toFixed(1)}%`, details: "US Navy method estimate" };
    }
    case "heart-rate": {
      const age = parseFloat(values.age);
      if (!age) return null;
      const max = 220 - age;
      return {
        result: `Max HR: ${max} bpm`,
        details: `Moderate zone: ${Math.round(max * 0.5)}-${Math.round(max * 0.7)} bpm | Vigorous: ${Math.round(max * 0.7)}-${Math.round(max * 0.85)} bpm`,
      };
    }
    case "pregnancy-due-date": {
      const lmp = values.lmp;
      if (!lmp) return null;
      const date = new Date(lmp);
      date.setDate(date.getDate() + 280);
      return { result: date.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }), details: "Estimated due date (Naegele's rule)" };
    }
    case "ovulation": {
      const lmp = values.lmp;
      const cycle = parseInt(values.cycle || "28");
      if (!lmp) return null;
      const date = new Date(lmp);
      date.setDate(date.getDate() + cycle - 14);
      const start = new Date(date);
      start.setDate(start.getDate() - 2);
      const end = new Date(date);
      end.setDate(end.getDate() + 2);
      return {
        result: date.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        details: `Fertile window: ${start.toLocaleDateString("en-IN", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`,
      };
    }
    case "pregnancy-week": {
      const lmp = values.lmp;
      if (!lmp) return null;
      const diff = Date.now() - new Date(lmp).getTime();
      const weeks = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
      const days = Math.floor((diff % (7 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
      return { result: `Week ${weeks}, Day ${days}`, details: "Based on last menstrual period" };
    }
    case "age": {
      const dob = values.dob;
      if (!dob) return null;
      const birth = new Date(dob);
      const now = new Date();
      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      let days = now.getDate() - birth.getDate();
      if (days < 0) { months--; days += 30; }
      if (months < 0) { years--; months += 12; }
      return { result: `${years} years, ${months} months, ${days} days`, details: "Exact age calculation" };
    }
    case "diabetes-risk": {
      let score = 0;
      if (parseInt(values.age || "0") >= 45) score += 2;
      if (values.bmi && parseFloat(values.bmi) >= 25) score += 2;
      if (values.family === "yes") score += 3;
      if (values.activity === "low") score += 2;
      const risk = score >= 5 ? "High" : score >= 3 ? "Moderate" : "Low";
      return { result: `${risk} Risk (Score: ${score})`, details: "Simplified screening estimate — not diagnostic" };
    }
    case "child-growth": {
      const age = parseFloat(values.age);
      const height = parseFloat(values.height);
      if (!age || !height) return null;
      return { result: `${height} cm at ${age} years`, details: "Consult pediatric growth charts for percentile assessment" };
    }
    case "drug-dose": {
      const weight = parseFloat(values.weight);
      const dosePerKg = parseFloat(values.dosePerKg);
      if (!weight || !dosePerKg) return null;
      return { result: `${(weight * dosePerKg).toFixed(1)} mg`, details: `Based on ${dosePerKg} mg/kg × ${weight} kg` };
    }
    case "blood-pressure-guide": {
      const sys = parseFloat(values.systolic);
      const dia = parseFloat(values.diastolic);
      if (!sys || !dia) return null;
      let cat = "Normal";
      if (sys >= 180 || dia >= 120) cat = "Hypertensive Crisis";
      else if (sys >= 140 || dia >= 90) cat = "Stage 2 Hypertension";
      else if (sys >= 130 || dia >= 80) cat = "Stage 1 Hypertension";
      else if (sys >= 120) cat = "Elevated";
      return { result: `${sys}/${dia} mmHg`, details: `Category: ${cat}` };
    }
    default:
      return null;
  }
}

const EXTRA_INPUTS: Record<string, CalculatorInput[]> = {
  bmr: [
    { id: "weight", label: "Weight (kg)", type: "number", required: true },
    { id: "height", label: "Height (cm)", type: "number", required: true },
    { id: "age", label: "Age (years)", type: "number", required: true },
    { id: "gender", label: "Gender", type: "select", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }], required: true },
  ],
  "water-intake": [{ id: "weight", label: "Weight (kg)", type: "number", required: true }],
  bmi: [
    { id: "weight", label: "Weight (kg)", type: "number", unit: "kg", required: true },
    { id: "height", label: "Height (cm)", type: "number", unit: "cm", required: true },
  ],
  calorie: [
    { id: "bmr", label: "BMR (kcal/day)", type: "number", required: true },
    { id: "activity", label: "Activity Level", type: "select", options: [
      { label: "Sedentary", value: "1.2" }, { label: "Light", value: "1.375" },
      { label: "Moderate", value: "1.55" }, { label: "Active", value: "1.725" },
      { label: "Very Active", value: "1.9" },
    ], required: true },
  ],
  "ideal-weight": [
    { id: "height", label: "Height (cm)", type: "number", required: true },
    { id: "gender", label: "Gender", type: "select", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }], required: true },
  ],
  "body-fat": [
    { id: "gender", label: "Gender", type: "select", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }], required: true },
    { id: "height", label: "Height (cm)", type: "number", required: true },
    { id: "neck", label: "Neck (cm)", type: "number", required: true },
    { id: "waist", label: "Waist (cm)", type: "number", required: true },
    { id: "hip", label: "Hip (cm, female only)", type: "number" },
  ],
  "heart-rate": [{ id: "age", label: "Age (years)", type: "number", required: true }],
  "pregnancy-due-date": [{ id: "lmp", label: "Last Menstrual Period", type: "date", required: true }],
  ovulation: [
    { id: "lmp", label: "Last Menstrual Period", type: "date", required: true },
    { id: "cycle", label: "Cycle Length (days)", type: "number", required: true },
  ],
  "pregnancy-week": [{ id: "lmp", label: "Last Menstrual Period", type: "date", required: true }],
  age: [{ id: "dob", label: "Date of Birth", type: "date", required: true }],
  "diabetes-risk": [
    { id: "age", label: "Age (years)", type: "number", required: true },
    { id: "bmi", label: "BMI", type: "number" },
    { id: "family", label: "Family History of Diabetes", type: "select", options: [{ label: "Yes", value: "yes" }, { label: "No", value: "no" }], required: true },
    { id: "activity", label: "Physical Activity", type: "select", options: [{ label: "Low", value: "low" }, { label: "Moderate/High", value: "high" }], required: true },
  ],
  "child-growth": [
    { id: "age", label: "Age (years)", type: "number", required: true },
    { id: "height", label: "Height (cm)", type: "number", required: true },
  ],
  "drug-dose": [
    { id: "weight", label: "Weight (kg)", type: "number", required: true },
    { id: "dosePerKg", label: "Dose (mg/kg)", type: "number", required: true },
  ],
  "blood-pressure-guide": [
    { id: "systolic", label: "Systolic (mmHg)", type: "number", required: true },
    { id: "diastolic", label: "Diastolic (mmHg)", type: "number", required: true },
  ],
};

export function CalculatorEngine({ slug, name, inputs }: CalculatorEngineProps) {
  const allInputs = EXTRA_INPUTS[slug] || inputs;
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ result: string; details?: string } | null>(null);

  const handleCalculate = () => {
    setResult(calculate(slug, values));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {allInputs.map((input) => (
          <div key={input.id} className="space-y-2">
            <Label htmlFor={input.id}>{input.label}{input.unit ? ` (${input.unit})` : ""}</Label>
            {input.type === "select" ? (
              <Select value={values[input.id] || ""} onValueChange={(v) => setValues((prev) => ({ ...prev, [input.id]: v }))}>
                <SelectTrigger id={input.id}><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {input.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={input.id}
                type={input.type === "date" ? "date" : "number"}
                value={values[input.id] || ""}
                onChange={(e) => setValues((prev) => ({ ...prev, [input.id]: e.target.value }))}
                min={input.min}
                max={input.max}
                required={input.required}
              />
            )}
          </div>
        ))}
        <Button onClick={handleCalculate} className="w-full">Calculate</Button>
        {result && (
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-center">
            <p className="text-2xl font-bold text-primary">{result.result}</p>
            {result.details && <p className="text-sm text-muted-foreground mt-1">{result.details}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

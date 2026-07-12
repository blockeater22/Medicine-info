import fs from "fs";
import path from "path";
import type { TeamMember } from "@/types";

const TEAM_DIR = path.join(process.cwd(), "data/team");

export function getAllTeamMembers(): TeamMember[] {
  if (!fs.existsSync(TEAM_DIR)) return [];
  return fs
    .readdirSync(TEAM_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(TEAM_DIR, f), "utf-8")) as TeamMember)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getTeamMember(id: string): TeamMember | null {
  const filePath = path.join(TEAM_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as TeamMember;
}

export function getTeamMemberOrThrow(id: string): TeamMember {
  const member = getTeamMember(id);
  if (!member) throw new Error(`Team member not found: ${id}`);
  return member;
}

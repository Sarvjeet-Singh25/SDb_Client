import {
  Globe2,
  FileCheck2,
  Plane,
  Briefcase,
  GraduationCap,
  Landmark,
  ShieldCheck,
  Users2,
  Compass,
  Building2,
  Award,
  Handshake,
  MapPin,
  FileText,
  Scale,
  Rocket,
} from "lucide-react";

// Keep this list in sync with server_build/models/Service.js ALLOWED_ICONS —
// the admin panel can only pick from these, and the site can only render these.
export const ICON_OPTIONS = [
  "Globe2",
  "FileCheck2",
  "Plane",
  "Briefcase",
  "GraduationCap",
  "Landmark",
  "ShieldCheck",
  "Users2",
  "Compass",
  "Building2",
  "Award",
  "Handshake",
  "MapPin",
  "FileText",
  "Scale",
  "Rocket",
];

const ICON_MAP = {
  Globe2,
  FileCheck2,
  Plane,
  Briefcase,
  GraduationCap,
  Landmark,
  ShieldCheck,
  Users2,
  Compass,
  Building2,
  Award,
  Handshake,
  MapPin,
  FileText,
  Scale,
  Rocket,
};

export function getIcon(name) {
  return ICON_MAP[name] || Briefcase;
}

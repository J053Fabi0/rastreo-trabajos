import { GrammyError } from "grammy/mod.ts";

export default function isGrammyError(error: unknown): error is GrammyError {
  return Boolean(typeof error === "object" && error !== null && "name" in error && error.name === "GrammyError");
}

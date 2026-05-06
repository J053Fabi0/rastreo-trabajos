/// <reference lib="dom" />
/// <reference lib="deno.unstable" />

import "./crons/crons.ts";
import "./telegram/initBot.ts";
import * as env from "./env.ts";
import "humanizer/toQuantity.ts";

console.group();
for (const [key, value] of Object.entries(env)) console.log(key, value);
console.groupEnd();

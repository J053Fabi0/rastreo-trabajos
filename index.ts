/// <reference lib="dom" />
/// <reference lib="deno.unstable" />

import "./crons/crons.ts";
import "./telegram/initBot.ts";
import * as env from "./env.ts";
import "humanizer/toQuantity.ts";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);

console.group();
for (const [key, value] of Object.entries(env)) console.log(key, value);
console.groupEnd();

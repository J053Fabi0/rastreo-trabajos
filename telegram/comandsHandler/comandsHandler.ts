import testComand from "./testComand.ts";
import { Composer } from "grammy/mod.ts";

const comandsHandler = new Composer();

comandsHandler.command("test", testComand);

export default comandsHandler;

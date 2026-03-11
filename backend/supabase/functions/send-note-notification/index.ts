import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { title } from "node:process";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function notifyAllOfNewNote(req: any) {
  const { data, error } = await supabase.from("profile").select(
    "expo_push_token",
  ).not(
    "expo_push_token",
    "is",
    null,
  );
  if (error) {
    console.error(`error in notifyallOfNewNote ${error.message}`);
    return false;
  }

  const pushTokens = data
    .filter((entry) => typeof entry.expo_push_token === "string")
    .map((entry) => entry.expo_push_token);

  const noteTitle = req.record.title;
  const noteBody = req.record.body;
  const requestBodies = pushTokens.map((token) => {
    return {
      to: token,
      sound: "default",
      title: `Nytt notat: ${noteTitle}`,
      body: noteBody,
    };
  });
  //TODO: lage chunking funksjon siden den kun kan takle 100 notifikasjoner samtidig

  const res = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(requestBodies),
  }).then((res) => res.json());
  return res;
}
Deno.serve(async (req) => {
  const reqBody = await req.json();
  const res = await notifyAllOfNewNote(reqBody);

  return new Response(JSON.stringify(res), {
    headers: { "Content-Type": "application/json" },
  });
});

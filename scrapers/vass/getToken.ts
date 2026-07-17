export default async function getToken() {
  const html = await fetch("https://vasscompany.csod.com/ux/ats/careersite/1/home?c=vasscompany");
  const text = await html.text();

  const regex = /token":"(.+?)"/g;

  const regexRes = regex.exec(text);

  if (regexRes === null) throw new Error("No token found for vass");

  return regexRes[1];
}

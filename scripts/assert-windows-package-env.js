const [major, minor] = process.versions.node.split(".").map(Number);
const nodeIsSupported = major > 22 || (major === 22 && minor >= 12);

if (process.platform !== "win32") {
  throw new Error([
    `Refusing official Windows packaging on ${process.platform}.`,
    "Mac/Linux may run build:desktop, smoke:desktop, and steam:preflight only.",
    "Produce the release .exe with the Windows Portable Package GitHub workflow or a Node 22.12+ Windows machine."
  ].join(" "));
}

if (!nodeIsSupported) {
  throw new Error(`Windows packaging requires Node >=22.12; current runtime is ${process.versions.node}.`);
}

console.log(`Windows packaging host accepted: ${process.platform}, Node ${process.versions.node}`);

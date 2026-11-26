import { useEffect, useState } from "react";
import {
  createFamily,
  getFamily,
  joinFamily,
  leaveFamily,
} from "../Services/familyService";
import type { Family } from "../Types/family";

export default function FamilyPage() {
  // undefined = still loading, null = not in a family
  const [family, setFamily] = useState<Family | null | undefined>(undefined);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getFamily()
      .then(setFamily)
      .catch(() => setMessage("Could not load your family."));
  }, []);

  // Runs a family action and shows `errorMessage` if it fails
  const run = async (action: () => Promise<Family | null>, errorMessage: string) => {
    setMessage("");
    try {
      setFamily(await action());
    } catch {
      setMessage(errorMessage);
    }
  };

  const handleLeave = () => {
    if (window.confirm("Leave this family? Your data stays yours.")) {
      run(async () => {
        await leaveFamily();
        return null;
      }, "Could not leave the family.");
    }
  };

  // Same styles as the Settings page
  const card = "flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6";
  const input =
    "rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500";
  const button = "rounded-lg py-2.5 text-sm font-semibold text-white";

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <h1 className="text-center text-2xl font-bold">Family</h1>
      {message && <p className="text-center text-sm text-red-500">{message}</p>}

      {family === undefined ? null : family ? (
        <div className={card}>
          <h2 className="font-semibold">{family.name}</h2>
          <p className="text-sm text-slate-500">
            Share this code so your family can join. Everyone sees the family
            totals on the Dashboard.
          </p>
          <p className="rounded-lg bg-slate-50 py-3 text-center font-mono text-2xl font-bold tracking-[0.3em]">
            {family.code}
          </p>
          <h3 className="text-sm font-semibold">Members</h3>
          <ul className="text-sm text-slate-600">
            {family.members.map((member) => (
              <li key={member.id}>
                {member.firstName} {member.lastName}
              </li>
            ))}
          </ul>
          <button className={`${button} bg-red-600 hover:bg-red-700`} onClick={handleLeave}>
            Leave family
          </button>
        </div>
      ) : (
        <>
          <form
            className={card}
            onSubmit={(e) => {
              e.preventDefault();
              run(() => createFamily(name), "Could not create the family.");
            }}
          >
            <h2 className="font-semibold">Create a family</h2>
            <input
              className={input}
              placeholder="Family name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
            />
            <button className={`${button} bg-emerald-600 hover:bg-emerald-700`} type="submit">
              Create
            </button>
          </form>

          <form
            className={card}
            onSubmit={(e) => {
              e.preventDefault();
              run(() => joinFamily(code), "Wrong code. Check it and try again.");
            }}
          >
            <h2 className="font-semibold">Join with a code</h2>
            <input
              className={`${input} font-mono uppercase`}
              placeholder="Invite code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <button className={`${button} bg-emerald-600 hover:bg-emerald-700`} type="submit">
              Join
            </button>
          </form>
        </>
      )}
    </div>
  );
}

import Link from "next/link";
import { prisma } from "@repo/db";

export default async function WaitlistPage() {
  let users: Array<{
    id: string;
    name: string;
    email: string;
    score: number;
    createdAt: Date;
    tasks: Array<{
      id: string;
      task: {
        id: string;
        title: string;
        points: number;
        type: string;
      };
    }>;
  }> = [];

  let dbErrorMessage: string | null = null;

  try {
    users = await prisma.waitlistUser.findMany({
      include: {
        tasks: {
          include: {
            task: {
              select: {
                id: true,
                title: true,
                points: true,
                type: true,
              },
            },
          },
        },
      },
      orderBy: [{ score: "desc" }, { createdAt: "desc" }],
    });
  } catch {
    dbErrorMessage =
      "Unable to connect to the database. Configure DATABASE_URL in your environment and restart the admin server.";
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 p-6">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Waitlist Admin</h1>
          <p className="text-sm text-gray-500">
            View waitlist users, score, and completed tasks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
          >
            Home
          </Link>
          <Link
            href="/tasks"
            className="rounded-md bg-black px-3 py-2 text-sm text-white"
          >
            Go to Tasks
          </Link>
        </div>
      </section>

      {dbErrorMessage ? (
        <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {dbErrorMessage}
        </p>
      ) : null}

      <section className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Score</th>
                <th className="px-4 py-3 font-semibold">Tasks</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-gray-500">
                    No waitlist users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b align-top">
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.score}</td>
                    <td className="px-4 py-3">
                      {user.tasks.length === 0 ? (
                        <span className="text-gray-500">No tasks</span>
                      ) : (
                        <ul className="space-y-1">
                          {user.tasks.map((userTask) => (
                            <li key={userTask.id} className="text-xs">
                              {userTask.task.title} · {userTask.task.points} pts
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

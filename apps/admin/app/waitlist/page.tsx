import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@repo/db";
import { DeleteUserButton } from "../../components/delete-user-button";

export const dynamic = "force-dynamic";

async function deleteWaitlistUser(formData: FormData) {
  "use server";

  const userId = String(formData.get("userId") ?? "").trim();

  if (!userId) {
    return;
  }

  await prisma.$transaction([
    prisma.userTask.deleteMany({
      where: { userId },
    }),
    prisma.waitlistUser.delete({
      where: { id: userId },
    }),
  ]);

  revalidatePath("/waitlist");
}

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
          <p className="text-sm text-muted-foreground">
            View waitlist users, score, and completed tasks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
          >
            Home
          </Link>
          <Link
            href="/tasks"
            className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
          >
            Go to Tasks
          </Link>
        </div>
      </section>

      {dbErrorMessage ? (
        <p className="rounded-md border border-destructive-border bg-destructive-muted px-3 py-2 text-sm text-destructive">
          {dbErrorMessage}
        </p>
      ) : null}

      <section className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-muted text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Score</th>
                <th className="px-4 py-3 font-semibold">Tasks</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-muted-foreground">
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
                        <span className="text-muted-foreground">No tasks</span>
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
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <DeleteUserButton
                        userId={user.id}
                        userName={user.name}
                        userEmail={user.email}
                        action={deleteWaitlistUser}
                        disabled={Boolean(dbErrorMessage)}
                      />
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

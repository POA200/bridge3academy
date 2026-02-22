"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from "@repo/ui";
import { CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { joinWaitlist } from "@/lib/actions/join-waitlist";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskItem } from "@/components/waitlist/task-item";

type WaitlistTask = {
  id: string;
  title: string;
  points: number;
  type: string;
  link: string | null;
};

type WaitlistModalProps = {
  tasks: WaitlistTask[];
};

export function WaitlistModal({ tasks }: WaitlistModalProps) {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [openedTaskIds, setOpenedTaskIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scoreById = useMemo(
    () => new Map(tasks.map((task) => [task.id, task.points])),
    [tasks],
  );

  const totalScore = useMemo(
    () =>
      completedTaskIds.reduce(
        (sum, taskId) => sum + (scoreById.get(taskId) ?? 0),
        0,
      ),
    [completedTaskIds, scoreById],
  );

  const trimmedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const canOpenModal =
    trimmedName.length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

  const toggleTask = (taskId: string) => {
    setCompletedTaskIds((currentTaskIds) =>
      currentTaskIds.includes(taskId)
        ? currentTaskIds.filter((id) => id !== taskId)
        : [...currentTaskIds, taskId],
    );
  };

  const openTaskLink = (task: WaitlistTask) => {
    if (!task.link) {
      return;
    }

    window.open(task.link, "_blank", "noopener,noreferrer");

    setOpenedTaskIds((currentTaskIds) =>
      currentTaskIds.includes(task.id)
        ? currentTaskIds
        : [...currentTaskIds, task.id],
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (trimmedName.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

    if (!validEmail) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      await joinWaitlist({
        name: trimmedName,
        email: normalizedEmail,
        completedTaskIds,
      });
      setOpen(false);
      setSuccessOpen(true);
    } catch {
      setError("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetState = () => {
    setOpen(false);
    setSuccessOpen(false);
    setName("");
    setEmail("");
    setCompletedTaskIds([]);
    setOpenedTaskIds([]);
    setError(null);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && isSubmitting) {
            return;
          }

          if (nextOpen && !canOpenModal) {
            return;
          }

          setOpen(nextOpen);

          if (!nextOpen) {
            setError(null);
          }
        }}
      >
        <div className="space-y-2">
          <Input
            type="text"
            name="name"
            placeholder="Full Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-md bg-foreground/10 px-4 py-6"
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-md bg-foreground/10 px-4 py-6"
          />

          <DialogTrigger asChild>
            <Button
              variant="default"
              size="lg"
              className="mt-1 w-full py-6 font-medium"
              disabled={!canOpenModal}
            >
              Join Early Access
              <ChevronRight className="ml-1 h-5 w-5" />
            </Button>
          </DialogTrigger>
        </div>

        <DialogContent className="flex h-[85vh] max-h-[85vh] flex-col overflow-hidden border-border/60 p-0">
          <div className="border-b border-border/60 px-6 pt-6 pb-4">
            <DialogHeader>
              <DialogTitle>Early Access Waitlist</DialogTitle>
              <DialogDescription>
                Complete verified tasks to boost your priority score.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex min-h-0 flex-1 flex-col px-6 py-4">
            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col gap-4"
            >
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Current Points
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  {totalScore} XP
                </p>
              </div>

              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                <p className="text-base font-semibold text-foreground">
                  You&apos;re almost done, {trimmedName || "there"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Submit your verified tasks to confirm your place and improve
                  your position on the waitlist.
                </p>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-2">
                <p className="text-sm font-medium text-foreground">Tasks</p>

                {tasks.length === 0 ? (
                  <p className="rounded-md border border-border/60 p-3 text-sm text-muted-foreground">
                    No tasks available yet.
                  </p>
                ) : (
                  <ScrollArea className="min-h-0 flex-1 pr-4">
                    <div className="space-y-4">
                      {tasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          hasOpenedTask={openedTaskIds.includes(task.id)}
                          isCompleted={completedTaskIds.includes(task.id)}
                          isSubmitting={isSubmitting}
                          onOpenTask={openTaskLink}
                          onVerifyTask={toggleTask}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>

              {error ? (
                <p className="text-sm text-red-400" role="alert">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                className="w-full"
                size={"lg"}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Tasks"
                )}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={successOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            resetState();
            return;
          }

          setSuccessOpen(nextOpen);
        }}
      >
        <DialogContent className="border-border/60 p-6 sm:max-w-md">
          <DialogHeader className="text-center">
            <CheckCircle2 className="mx-auto mb-2 h-12 w-12 text-primary" />
            <DialogTitle>You&apos;re on the waitlist</DialogTitle>
            <DialogDescription>
              Thank you for joining, {trimmedName || "there"}. We&apos;ll be in
              touch soon with your early access update.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            <Button onClick={resetState} className="w-full" size="lg">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

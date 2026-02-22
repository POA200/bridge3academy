"use client";

import { Button } from "@repo/ui";
import { ExternalLink } from "lucide-react";

type TaskItemProps = {
  task: {
    id: string;
    title: string;
    points: number;
    type: string;
    link: string | null;
  };
  hasOpenedTask: boolean;
  isCompleted: boolean;
  isSubmitting: boolean;
  onOpenTask: (task: {
    id: string;
    title: string;
    points: number;
    type: string;
    link: string | null;
  }) => void;
  onVerifyTask: (taskId: string) => void;
};

function getActionLabel(task: { title: string; type: string }) {
  const normalizedTitle = task.title.toLowerCase();
  const normalizedType = task.type.toLowerCase();

  if (normalizedTitle.includes("follow") || normalizedType.includes("social")) {
    return "Follow";
  }

  if (
    normalizedTitle.includes("join") ||
    normalizedType.includes("community")
  ) {
    return "Join";
  }

  if (
    normalizedTitle.includes("share") ||
    normalizedType.includes("engagement")
  ) {
    return "Share";
  }

  if (
    normalizedTitle.includes("refer") ||
    normalizedType.includes("referral")
  ) {
    return "Refer";
  }

  return "Open";
}

export function TaskItem({
  task,
  hasOpenedTask,
  isCompleted,
  isSubmitting,
  onOpenTask,
  onVerifyTask,
}: TaskItemProps) {
  const isMissingLink = !task.link;

  const handleButtonClick = () => {
    if (!hasOpenedTask) {
      if (isMissingLink) {
        return;
      }

      onOpenTask(task);
      return;
    }

    onVerifyTask(task.id);
  };

  return (
    <div className="flex items-center justify-between rounded-md border border-border/60 bg-card/60 p-3">
      <div>
        <p className="font-medium text-foreground">{task.title}</p>
        <p className="text-xs text-muted-foreground">
          {task.points} pts • {task.type}
        </p>
      </div>
      <Button
        type="button"
        variant={
          !hasOpenedTask ? "outline" : isCompleted ? "secondary" : "default"
        }
        onClick={handleButtonClick}
        disabled={isSubmitting || (!hasOpenedTask && isMissingLink)}
        className="min-w-[80px]"
      >
        {!hasOpenedTask ? (
          <>
            <ExternalLink className="mr-2 h-4 w-4" />
            {isMissingLink ? "No Link" : getActionLabel(task)}
          </>
        ) : isCompleted ? (
          "Verified"
        ) : (
          "Verify"
        )}
      </Button>
    </div>
  );
}

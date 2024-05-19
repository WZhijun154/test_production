const taskSessionMap: { [key: string]: string } = {};

export function setTaskSession(taskId: string, sessionId: string) {
  taskSessionMap[taskId] = sessionId;
}

export function getSessionId(taskId: string): string | undefined {
  return taskSessionMap[taskId];
}

export function deleteTaskSession(taskId: string) {
  delete taskSessionMap[taskId];
}

import { useMutation } from '@tanstack/react-query';
import { assistantService } from '../Services/assistantService';

export function useAskAssistant() {
  return useMutation({
    mutationFn: ({ input, threadId }) => assistantService.ask({ input, threadId }),
  });
}

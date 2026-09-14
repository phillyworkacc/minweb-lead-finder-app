function sleep(ms: number) {
   return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry(fn: Function, {
   retries = 2, delay = 500,
   backoff = 2, shouldRetry = (_: any): any => true,
} = {}) {
   let lastError;
   let currentDelay = delay;

   for (let attempt = 0; attempt <= retries; attempt++) {
      try {
         return await fn(attempt);
      } catch (error: any) {
         lastError = error;
         if (attempt >= retries || !shouldRetry(error)) throw error;
         await sleep(currentDelay);
         currentDelay *= backoff;
      }
   }

   throw lastError;
}

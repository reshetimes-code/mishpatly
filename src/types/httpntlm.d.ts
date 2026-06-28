declare module 'httpntlm' {
  interface NtlmOptions {
    url: string;
    username: string;
    password: string;
    domain?: string;
    workstation?: string;
    binary?: boolean;
  }

  interface NtlmResponse {
    statusCode: number;
    body: any;
    headers: Record<string, string>;
  }

  type NtlmCallback = (err: Error | null, res: NtlmResponse) => void;

  export function get(options: NtlmOptions, callback: NtlmCallback): void;
  export function post(options: NtlmOptions & { body?: string }, callback: NtlmCallback): void;
}

declare module "heic-decode" {
  type HeicDecodeResult = {
    width: number;
    height: number;
    data: Uint8Array;
  };

  export default function heicDecode(input: { buffer: Buffer }): Promise<HeicDecodeResult>;
}

declare module "jpeg-js" {
  export function encode(
    input: { data: Uint8Array; width: number; height: number },
    quality?: number
  ): { data: Uint8Array; width: number; height: number };
}


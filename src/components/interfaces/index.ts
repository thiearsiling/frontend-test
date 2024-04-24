export interface IRows {
  id: string;
  symbol: string;
  c?: string;
  b?: string;
  P?: string;
}

export interface IStream {
  data: IStreamData;
}

export interface IStreamData {
  s: string;
}

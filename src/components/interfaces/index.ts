export interface IRows {
  id: string;
  symbol: string;
  c?: string;
  b?: string;
}

export interface IStream {
  data: IStreamData;
}

export interface IStreamData {
  s: string;
}

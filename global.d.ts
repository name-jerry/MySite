interface Tip {
  id: number;
  title: string;
  createTime: number;
  isEnd: boolean;
  endTime: number | string;
}
interface Tag {
  id?: string;
  src: string;
  title: string;
  sub?: string | null;
  children?: Tag[];
}
interface Option {
  fontIcon?: string;
  title: string;
}
interface ClientInfo {
  clientLeft: number;
  clientRight: number;
  clientTop: number;
  clientBottom: number;
  clientWidth: number;
  clientHeight: number;
  windowWidth: number;
  windowHeight: number;
}
interface Position {
  top?: string
  right?: string;
  bottom?: string;
  left?: string;
}
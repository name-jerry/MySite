

interface Tip {
  id : number;
  title : string;
  createTime : number;
  isEnd : boolean;
  endTime : number | string;
}
interface Tag {
  id ?: string;
  src : string;
  href ?: string;
  title : string;
  sub ?: string | null;
  children ?: Tag[];
}
type Option = {
  fontIcon ?: string,
  title : string
} | string;

interface ClientInfo {
  clientLeft : number;
  clientRight : number;
  clientTop : number;
  clientBottom : number;
  clientWidth : number;
  clientHeight : number;
  windowWidth : number;
  windowHeight : number;
}
interface Position {
  top ?: string
  right ?: string;
  bottom ?: string;
  left ?: string;
}
interface PostItem {
  imgSrc : string;
  title : string;
  sub : string;
  tags : string[];
  time : string;
  value : string;
}

export {
  Tip, Tag,
  Option,
  ClientInfo,
  Position,
  PostItem
}

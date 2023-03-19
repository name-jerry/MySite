

interface Tip {
  _id ?: string;
  title : string;
  create_date ?: string;
  is_end ?: boolean;
  end_date ?: number | string;
}
interface Article {
  _id ?: string;
  user_id ?: string;
  sub ?: string;
  title : string;
  content ?: string
}
interface Tag {
  _id ?: string;
  // 图片地址
  src ?: string;
  // 跳转地址
  href ?: string;
  title : string;
  sub ?: string | null;
  children ?: Tag[];
}
type Option = {
  key ?: string,
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


type CURD = "get" | "add" | "remove" | "update"
export {
  Tip,
  Tag,
  ClientInfo,
  Position,
  PostItem,
  Option,
  CURD,
  Article
}

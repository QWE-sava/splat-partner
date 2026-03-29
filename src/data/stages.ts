export interface Stage {
  id: string;
  name: string;
  features: ("long" | "vertical" | "narrow" | "open" | "complex")[];
  description: string;
}

export const stages: Stage[] = [
  {
    id: "yunohana",
    name: "ユノハナ大渓谷",
    features: ["long", "open"],
    description: "高低差があり、中央が開けている縦長のステージ。",
  },
  {
    id: "gonzui",
    name: "ゴンズイ地区",
    features: ["vertical", "narrow"],
    description: "歩道橋が特徴的な、上下の攻防が激しいステージ。",
  },
  {
    id: "yamagara",
    name: "ヤガラ市場",
    features: ["open", "complex"],
    description: "障害物が多く、多角的な攻めが可能な広めのステージ。",
  },
  {
    id: "mahimahi",
    name: "マヒマヒリゾート＆スパ",
    features: ["narrow", "open"],
    description: "水位の変化で地形が変わる、非常に狭いステージ。",
  },
  {
    id: "chozame",
    name: "チョウザメ造船",
    features: ["vertical", "complex"],
    description: "跳ね橋のギミックがあり、高所からの攻撃が有効なステージ。",
  },
  {
    id: "sumenage",
    name: "スメーシーワールド",
    features: ["open", "complex"],
    description: "回転する足場があり、塗り状況が変わりやすい円形ステージ。",
  },
  {
    id: "hiruga",
    name: "ヒラメが丘団地",
    features: ["vertical", "complex"],
    description: "圧倒的な高低差があり、壁塗りと登り動作が重要なステージ。",
  },
  {
    id: "kinmedai",
    name: "キンメダイ美術館",
    features: ["open", "vertical"],
    description: "回転する大型の壁があり、タイミングが重要なステージ。",
  },
  {
    id: "kusaya",
    name: "クサヤ温泉",
    features: ["long", "narrow"],
    description: "坂道が多く、長射程が有利になりやすい縦長ステージ。",
  },
  {
    id: "nampula",
    name: "ナンプラー遺跡",
    features: ["long", "open"],
    description: "遮蔽物が少なく、正面突破がメインとなる縦長ステージ。",
  },
];

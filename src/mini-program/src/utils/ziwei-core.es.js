const S = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"], b = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
function se(n) {
  return b.indexOf(n) + 1;
}
function de(n) {
  return b[((n - 1) % 12 + 12) % 12];
}
function me(n) {
  return S[(n % 10 + 10) % 10];
}
function ge(n) {
  return S.indexOf(n);
}
const tn = [
  "命宫",
  "兄弟宫",
  "夫妻宫",
  "子女宫",
  "财帛宫",
  "疾厄宫",
  "迁移宫",
  "交友宫",
  "官禄宫",
  "田宅宫",
  "福德宫",
  "父母宫"
], K = [
  19416,
  19168,
  42352,
  21717,
  53856,
  55632,
  91476,
  22176,
  39632,
  21970,
  19168,
  42422,
  42192,
  53840,
  119381,
  46400,
  54944,
  44450,
  38320,
  84343,
  18800,
  42160,
  46261,
  27216,
  27968,
  109396,
  11104,
  38256,
  21234,
  18800,
  25958,
  54432,
  59984,
  92821,
  23248,
  11104,
  100067,
  37600,
  116951,
  51536,
  54432,
  120998,
  46416,
  22176,
  107956,
  9680,
  37584,
  53938,
  43344,
  46423,
  27808,
  46416,
  86869,
  19872,
  42416,
  83315,
  21168,
  43432,
  59728,
  27296,
  44710,
  43856,
  19296,
  43748,
  42352,
  21088,
  62051,
  55632,
  23383,
  22176,
  38608,
  19925,
  19152,
  42192,
  54484,
  53840,
  54616,
  46400,
  46752,
  103846,
  38320,
  18864,
  43380,
  42160,
  45690,
  27216,
  27968,
  44870,
  43872,
  38256,
  19189,
  18800,
  25776,
  29859,
  59984,
  27480,
  23232,
  43872,
  38613,
  37600,
  51552,
  55636,
  54432,
  55888,
  30034,
  22176,
  43959,
  9680,
  37584,
  51893,
  43344,
  46240,
  47780,
  44368,
  21977,
  19360,
  42416,
  86390,
  21168,
  43312,
  31060,
  27296,
  44368,
  23378,
  19296,
  42726,
  42208,
  53856,
  60005,
  54576,
  23200,
  30371,
  38608,
  19195,
  19152,
  42192,
  118966,
  53840,
  54560,
  56645,
  46496,
  22224,
  21938,
  18864,
  42359,
  42160,
  43600,
  111189,
  27936,
  44448,
  84835,
  37744,
  18936,
  18800,
  25776,
  92326,
  59984,
  27296,
  108228,
  43744,
  37600,
  53987,
  51552,
  54615,
  54432,
  55888,
  23893,
  22176,
  42704,
  21972,
  21200,
  43448,
  43344,
  46240,
  46758,
  44368,
  21920,
  43940,
  42416,
  21168,
  45683,
  26928,
  29495,
  27296,
  44368,
  84821,
  19296,
  42352,
  21732,
  53600,
  59752,
  54560,
  55968,
  92838,
  22224,
  19168,
  43476,
  42192,
  53584,
  62034
], jn = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], B = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"], z = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
let k = null;
function O(n) {
  const t = n - 1901;
  if (t < 0 || t >= K.length)
    throw new Error(`农历年份超出范围: ${n} (支持1901-2100)`);
  return K[t] & 131071;
}
function A(n) {
  return n & 15;
}
function L(n, t) {
  return !!(n & 1 << 3 + t);
}
function v(n) {
  return n & 65536 ? 30 : 29;
}
function he(n, t, e) {
  const a = O(n);
  return e ? A(a) === t ? v(a) : 0 : L(a, t) ? 30 : 29;
}
function kn(n) {
  const t = O(n);
  let e = 0;
  for (let i = 1; i <= 12; i++)
    e += L(t, i) ? 30 : 29;
  return A(t) > 0 && (e += v(t)), e;
}
function C(n) {
  if (!k) {
    k = /* @__PURE__ */ new Map();
    let t = 49;
    k.set(1901, t);
    for (let e = 1902; e <= 2101; e++)
      t += kn(e - 1), k.set(e, t);
  }
  return k.get(n) ?? 49;
}
function Z(n) {
  return n % 4 === 0 && n % 100 !== 0 || n % 400 === 0;
}
function en(n, t) {
  return t === 2 && Z(n) ? 29 : jn[t - 1];
}
function an(n, t, e) {
  let a = 0;
  for (let i = 1901; i < n; i++)
    a += Z(i) ? 366 : 365;
  for (let i = 1; i < t; i++)
    a += en(n, i);
  return a + e - 1;
}
function rn(n) {
  let t = 1901;
  for (; ; ) {
    const e = Z(t) ? 366 : 365;
    if (n < e) break;
    n -= e, t++;
  }
  for (let e = 1; e <= 12; e++) {
    const a = en(t, e);
    if (n < a)
      return { year: t, month: e, day: n + 1 };
    n -= a;
  }
  return { year: t, month: 12, day: 31 };
}
function un(n, t, e) {
  const a = an(n, t, e);
  let i = 1901 + Math.floor((a - 49) / 355);
  for (i < 1901 && (i = 1901), i > 2100 && (i = 2100); C(i) > a && i > 1901; )
    i--;
  for (; i < 2100 && C(i + 1) <= a; )
    i++;
  const r = C(i);
  let u = a - r;
  const l = O(i), o = A(l);
  for (let s = 1; s <= 12; s++) {
    const m = L(l, s) ? 30 : 29;
    if (u < m)
      return { year: i, month: s, day: u + 1, isLeap: !1 };
    if (u -= m, o === s) {
      const c = v(l);
      if (u < c)
        return { year: i, month: s, day: u + 1, isLeap: !0 };
      u -= c;
    }
  }
  return { year: i + 1, month: 1, day: u + 1, isLeap: !1 };
}
function on(n, t, e, a) {
  const i = C(n), r = O(n), u = A(r);
  let l = 0;
  for (let o = 1; o < t; o++)
    l += L(r, o) ? 30 : 29, u === o && (l += v(r));
  if (a) {
    if (u !== t)
      throw new Error(`农历${n}年${t}月无闰月`);
    l += L(r, t) ? 30 : 29;
  }
  return l += e - 1, rn(i + l);
}
function fe(n) {
  const t = C(n);
  return rn(t);
}
function ye(n) {
  const t = O(n);
  return A(t);
}
function Cn(n) {
  const t = ((n - 4) % 10 + 10) % 10, e = ((n - 4) % 12 + 12) % 12;
  return { stem: B[t], branch: z[e] };
}
function Ln(n, t) {
  const a = [2, 4, 6, 8, 0][Math.floor(n % 10 / 2)];
  return {
    stem: B[(a + t - 1) % 10],
    branch: z[(t + 1) % 12]
  };
}
function On(n, t, e) {
  const a = an(n, t, e);
  return {
    stem: B[a % 10],
    branch: z[a % 12]
  };
}
function An(n, t) {
  const e = Math.floor((t + 1) % 24 / 2), i = [0, 2, 4, 6, 8][Math.floor(n % 10 / 2)];
  return {
    stem: B[(i + e) % 10],
    branch: z[e]
  };
}
function qn(n, t, e, a, i = !1) {
  let r = n, u = t, l = e;
  if (i) {
    const h = on(n, t, e, !1);
    r = h.year, u = h.month, l = h.day;
  }
  const o = Cn(r), s = un(r, u, l), m = B.indexOf(o.stem), c = Ln(m, s.month), g = On(r, u, l), p = B.indexOf(g.stem), f = An(p, a);
  return { yearPillar: o, monthPillar: c, dayPillar: g, hourPillar: f };
}
const Pn = [
  { name: "小寒", nameEn: "Minor Cold", longitude: 285, lunarMonth: 12, isSection: !1 },
  { name: "大寒", nameEn: "Major Cold", longitude: 300, lunarMonth: 12, isSection: !1 },
  { name: "立春", nameEn: "Start of Spring", longitude: 315, lunarMonth: 1, isSection: !0 },
  { name: "雨水", nameEn: "Rain Water", longitude: 330, lunarMonth: 1, isSection: !1 },
  { name: "惊蛰", nameEn: "Awakening of Insects", longitude: 345, lunarMonth: 2, isSection: !0 },
  { name: "春分", nameEn: "Spring Equinox", longitude: 0, lunarMonth: 2, isSection: !1 },
  { name: "清明", nameEn: "Pure Brightness", longitude: 15, lunarMonth: 3, isSection: !0 },
  { name: "谷雨", nameEn: "Grain Rain", longitude: 30, lunarMonth: 3, isSection: !1 },
  { name: "立夏", nameEn: "Start of Summer", longitude: 45, lunarMonth: 4, isSection: !0 },
  { name: "小满", nameEn: "Grain Full", longitude: 60, lunarMonth: 4, isSection: !1 },
  { name: "芒种", nameEn: "Grain in Ear", longitude: 75, lunarMonth: 5, isSection: !0 },
  { name: "夏至", nameEn: "Summer Solstice", longitude: 90, lunarMonth: 5, isSection: !1 },
  { name: "小暑", nameEn: "Minor Heat", longitude: 105, lunarMonth: 6, isSection: !0 },
  { name: "大暑", nameEn: "Major Heat", longitude: 120, lunarMonth: 6, isSection: !1 },
  { name: "立秋", nameEn: "Start of Autumn", longitude: 135, lunarMonth: 7, isSection: !0 },
  { name: "处暑", nameEn: "End of Heat", longitude: 150, lunarMonth: 7, isSection: !1 },
  { name: "白露", nameEn: "White Dew", longitude: 165, lunarMonth: 8, isSection: !0 },
  { name: "秋分", nameEn: "Autumnal Equinox", longitude: 180, lunarMonth: 8, isSection: !1 },
  { name: "寒露", nameEn: "Cold Dew", longitude: 195, lunarMonth: 9, isSection: !0 },
  { name: "霜降", nameEn: "Frost Descent", longitude: 210, lunarMonth: 9, isSection: !1 },
  { name: "立冬", nameEn: "Start of Winter", longitude: 225, lunarMonth: 10, isSection: !0 },
  { name: "小雪", nameEn: "Minor Snow", longitude: 240, lunarMonth: 10, isSection: !1 },
  { name: "大雪", nameEn: "Major Snow", longitude: 255, lunarMonth: 11, isSection: !0 },
  { name: "冬至", nameEn: "Winter Solstice", longitude: 270, lunarMonth: 11, isSection: !1 }
];
function pe() {
  return Pn.map((n) => n.name);
}
function zn(n, t) {
  const e = [
    // [month, day] 近似值，适用于2000~2050年
    [1, 5],
    // 小寒
    [1, 20],
    // 大寒
    [2, 4],
    // 立春
    [2, 19],
    // 雨水
    [3, 6],
    // 惊蛰
    [3, 21],
    // 春分
    [4, 5],
    // 清明
    [4, 20],
    // 谷雨
    [5, 6],
    // 立夏
    [5, 21],
    // 小满
    [6, 6],
    // 芒种
    [6, 21],
    // 夏至
    [7, 7],
    // 小暑
    [7, 23],
    // 大暑
    [8, 7],
    // 立秋
    [8, 23],
    // 处暑
    [9, 8],
    // 白露
    [9, 23],
    // 秋分
    [10, 8],
    // 寒露
    [10, 23],
    // 霜降
    [11, 7],
    // 立冬
    [11, 22],
    // 小雪
    [12, 7],
    // 大雪
    [12, 22]
    // 冬至
  ];
  let [a, i] = e[t];
  const r = n - 2e3, u = Math.round(r * 0.0104);
  for (i -= u; i < 1; )
    a--, i += D(n, a);
  for (; i > D(n, a); )
    i -= D(n, a), a++;
  return { month: a, day: Math.round(i) };
}
function D(n, t) {
  t < 1 && (t = 12, n--), t > 12 && (t = 1, n++);
  const e = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return t === 2 && (n % 4 === 0 && n % 100 !== 0 || n % 400 === 0) ? 29 : e[t - 1];
}
function R(n, t, e, a) {
  const i = zn(n, a);
  return t < i.month ? !0 : t > i.month ? !1 : e < i.day;
}
function vn(n, t, e) {
  return !R(n, t, e, 2);
}
function Se(n, t, e) {
  const a = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 0];
  let i = 0;
  for (let r = 1; r <= 12; r++) {
    const u = a[r - 1];
    if (u === 0) {
      R(n, t, e, u) || (i = 12);
      continue;
    }
    if (!R(n, t, e, u))
      i = r;
    else
      break;
  }
  return i === 0 && (i = 12), i;
}
const Hn = [
  { city: "北京", province: "北京", longitude: 116.4, latitude: 39.9 },
  { city: "上海", province: "上海", longitude: 121.5, latitude: 31.2 },
  { city: "广州", province: "广东", longitude: 113.3, latitude: 23.1 },
  { city: "深圳", province: "广东", longitude: 114.1, latitude: 22.5 },
  { city: "杭州", province: "浙江", longitude: 120.2, latitude: 30.3 },
  { city: "南京", province: "江苏", longitude: 118.8, latitude: 32.1 },
  { city: "武汉", province: "湖北", longitude: 114.3, latitude: 30.6 },
  { city: "成都", province: "四川", longitude: 104.1, latitude: 30.7 },
  { city: "重庆", province: "重庆", longitude: 106.5, latitude: 29.6 },
  { city: "西安", province: "陕西", longitude: 108.9, latitude: 34.3 },
  { city: "沈阳", province: "辽宁", longitude: 123.4, latitude: 41.8 },
  { city: "天津", province: "天津", longitude: 117.2, latitude: 39.1 },
  { city: "长沙", province: "湖南", longitude: 113, latitude: 28.2 },
  { city: "郑州", province: "河南", longitude: 113.7, latitude: 34.8 },
  { city: "济南", province: "山东", longitude: 117, latitude: 36.7 },
  { city: "青岛", province: "山东", longitude: 120.4, latitude: 36.1 },
  { city: "哈尔滨", province: "黑龙江", longitude: 126.6, latitude: 45.8 },
  { city: "昆明", province: "云南", longitude: 102.7, latitude: 25 },
  { city: "贵阳", province: "贵州", longitude: 106.7, latitude: 26.7 },
  { city: "福州", province: "福建", longitude: 119.3, latitude: 26.1 },
  { city: "厦门", province: "福建", longitude: 118.1, latitude: 24.5 },
  { city: "南宁", province: "广西", longitude: 108.4, latitude: 22.8 },
  { city: "海口", province: "海南", longitude: 110.3, latitude: 20 },
  { city: "兰州", province: "甘肃", longitude: 103.8, latitude: 36 },
  { city: "西宁", province: "青海", longitude: 101.8, latitude: 36.6 },
  { city: "呼和浩特", province: "内蒙古", longitude: 111.7, latitude: 40.8 },
  { city: "乌鲁木齐", province: "新疆", longitude: 87.6, latitude: 43.8 },
  { city: "拉萨", province: "西藏", longitude: 91.1, latitude: 29.6 },
  { city: "银川", province: "宁夏", longitude: 106.3, latitude: 38.5 },
  { city: "太原", province: "山西", longitude: 112.5, latitude: 37.9 },
  { city: "石家庄", province: "河北", longitude: 114.5, latitude: 38 },
  { city: "南昌", province: "江西", longitude: 115.9, latitude: 28.7 },
  { city: "合肥", province: "安徽", longitude: 117.3, latitude: 31.8 },
  { city: "香港", province: "香港", longitude: 114.2, latitude: 22.3 },
  { city: "澳门", province: "澳门", longitude: 113.5, latitude: 22.2 },
  { city: "台北", province: "台湾", longitude: 121.5, latitude: 25 }
];
function Ee(n) {
  return Hn.find(
    (t) => t.city === n || t.city.includes(n) || n.includes(t.city)
  );
}
const ln = 120;
function Yn(n, t, e) {
  const i = (ln - e) * 4;
  let r = n * 60 + t - i;
  const u = Math.floor(r / 60), l = Math.round(r % 60);
  return {
    hour: (u % 24 + 24) % 24,
    minute: (l % 60 + 60) % 60
  };
}
function _n(n) {
  const t = 360 * (n - 81) / 365 * Math.PI / 180;
  return 9.87 * Math.sin(2 * t) - 7.53 * Math.cos(t) - 1.5 * Math.sin(t);
}
function Fn(n, t, e) {
  const a = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let i = 0;
  for (let r = 0; r < t - 1; r++)
    i += a[r];
  return i += e, t > 2 && (n % 4 === 0 && n % 100 !== 0 || n % 400 === 0) && (i += 1), i;
}
function Nn(n, t, e, a, i, r) {
  const u = Yn(a, i, r), l = Fn(n, t, e), o = _n(l);
  let s = u.hour * 60 + u.minute + o;
  const m = (Math.floor(s / 60) % 24 + 24) % 24, c = (Math.round(s % 60) + 60) % 60, g = Math.floor((m + 1) % 24 / 2), f = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"][g], h = ln - r, $ = h !== 0 ? `北京时间→地方平太阳时修正${Math.abs(h * 4).toFixed(1)}分钟（${h > 0 ? "晚" : "早"}），均时差修正${o > 0 ? "+" : ""}${o.toFixed(1)}分钟` : `已在北京时区，仅做均时差修正${o > 0 ? "+" : ""}${o.toFixed(1)}分钟`;
  return {
    originalHour: a,
    originalMinute: i,
    localMeanHour: u.hour,
    localMeanMinute: u.minute,
    trueSolarHour: m,
    trueSolarMinute: c,
    timeBranchIndex: g,
    timeBranchName: f,
    note: $
  };
}
function Dn(n, t, e, a, i, r) {
  return r !== void 0 && r !== 120 ? Nn(n, t, e, a, i, r).timeBranchIndex : Math.floor((a + 1) % 24 / 2);
}
function Rn(n, t, e = !1) {
  let u = (2 + (n - 1)) % 12 + 1 - t;
  return u <= 0 && (u += 12), u;
}
function Gn(n, t) {
  let r = (2 + (n - 1)) % 12 + 1 + t;
  return r > 12 && (r -= 12), r;
}
function Zn(n) {
  const t = [];
  for (let e = 0; e < 12; e++) {
    let a = n - e;
    a <= 0 && (a += 12), t.push(a);
  }
  return t;
}
function W(n, t) {
  const e = [2, 4, 6, 8, 0], a = Math.floor(n % 10 / 2), i = e[a], r = ((t - 3) % 12 + 12) % 12, u = ((i + r) % 10 + 10) % 10;
  return S[u];
}
function Wn(n) {
  return {
    1: "贪狼",
    // 子
    2: "巨门",
    // 丑
    3: "禄存",
    // 寅
    4: "文昌",
    // 卯
    5: "廉贞",
    // 辰
    6: "武曲",
    // 巳
    7: "破军",
    // 午
    8: "武曲",
    // 未
    9: "廉贞",
    // 申
    10: "文昌",
    // 酉
    11: "禄存",
    // 戌
    12: "巨门"
    // 亥
  }[n] || "";
}
function $n(n) {
  return {
    1: "火星",
    // 子
    2: "天相",
    // 丑
    3: "天梁",
    // 寅
    4: "天同",
    // 卯
    5: "文昌",
    // 辰
    6: "天机",
    // 巳
    7: "铃星",
    // 午
    8: "天相",
    // 未
    9: "天梁",
    // 申
    10: "天同",
    // 酉
    11: "文昌",
    // 戌
    12: "天机"
    // 亥
  }[n] || "";
}
function Xn(n, t, e) {
  return Zn(n).map((i, r) => {
    const u = W(e, i), l = b[i - 1];
    return {
      name: tn[r],
      stem: u,
      branch: l,
      branchIndex: i,
      isMing: r === 0,
      isShen: i === t,
      mainStars: [],
      minorStars: [],
      shaStars: [],
      miscStars: [],
      hua: []
    };
  });
}
const G = [
  // 水二局（0）
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // to be filled
  // 木三局（1）
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // 金四局（2）
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // 土五局（3）
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // 火六局（4）
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
function Jn() {
  const n = [2, 3, 4, 5, 6], t = 3;
  for (let e = 0; e < 5; e++) {
    const a = n[e];
    let i = t;
    for (let r = 1; r <= 30; r++)
      G[e][r - 1] = i, r % a === 0 && (i++, i > 12 && (i = 1));
  }
}
Jn();
const Qn = [0, 1, -1, 3, 4, 5, -1, 7], Un = [0, 1, 2, 3, 4, 5, 6, -1, 8], V = ["ziwei", "tianji", "", "taiyang", "wuqu", "tiantong", "", "lianzhen"], nn = ["tianfu", "taiyin", "tanlang", "jumen", "tianxiang", "tianliang", "qisha", "", "pojun"];
function Kn(n, t) {
  const a = {
    水二局: 0,
    木三局: 1,
    金四局: 2,
    土五局: 3,
    火六局: 4
  }[n];
  return t < 1 || t > 30 ? (console.warn(`农历生日超出范围: ${t}，使用默认值15`), G[a][14]) : G[a][t - 1];
}
function Vn(n) {
  return ((8 - n) % 12 % 12 + 12) % 12 || 12;
}
function cn(n, t) {
  const e = Kn(n, t), a = Vn(e), i = {};
  for (let r = 0; r < V.length; r++) {
    const u = V[r];
    if (!u) continue;
    const l = Qn[r];
    let o = e + l;
    o > 12 && (o -= 12), i[u] = o;
  }
  for (let r = 0; r < nn.length; r++) {
    const u = nn[r];
    if (!u) continue;
    const l = Un[r];
    let o = a - l;
    o < 1 && (o += 12), i[u] = o;
  }
  return { ziweiBranch: e, tianfuBranch: a, starMap: i };
}
function we(n, t) {
  return cn(n, t).starMap;
}
const nt = {
  // 甲子乙丑组 → 金4
  甲子: 4,
  乙丑: 4,
  // 丙寅丁卯组 → 火6
  丙寅: 6,
  丁卯: 6,
  // 戊辰己巳组 → 木3
  戊辰: 3,
  己巳: 3,
  // 庚午辛未组 → 土5
  庚午: 5,
  辛未: 5,
  // 壬申癸酉组 → 金4
  壬申: 4,
  癸酉: 4,
  // 甲戌乙亥组 → 火6
  甲戌: 6,
  乙亥: 6,
  // 丙子丁丑组 → 水2
  丙子: 2,
  丁丑: 2,
  // 戊寅己卯组 → 土5
  戊寅: 5,
  己卯: 5,
  // 庚辰辛巳组 → 金4
  庚辰: 4,
  辛巳: 4,
  // 壬午癸未组 → 木3
  壬午: 3,
  癸未: 3,
  // 甲申乙酉组 → 水2
  甲申: 2,
  乙酉: 2,
  // 丙戌丁亥组 → 土5
  丙戌: 5,
  丁亥: 5,
  // 戊子己丑组 → 火6
  戊子: 6,
  己丑: 6,
  // 庚寅辛卯组 → 木3
  庚寅: 3,
  辛卯: 3,
  // 壬辰癸巳组 → 水2
  壬辰: 2,
  癸巳: 2,
  // 甲午乙未组 → 金4
  甲午: 4,
  乙未: 4,
  // 丙申丁酉组 → 火6
  丙申: 6,
  丁酉: 6,
  // 戊戌己亥组 → 木3
  戊戌: 3,
  己亥: 3,
  // 庚子辛丑组 → 土5
  庚子: 5,
  辛丑: 5,
  // 壬寅癸卯组 → 金4
  壬寅: 4,
  癸卯: 4,
  // 甲辰乙巳组 → 火6
  甲辰: 6,
  乙巳: 6,
  // 丙午丁未组 → 水2
  丙午: 2,
  丁未: 2,
  // 戊申己酉组 → 土5
  戊申: 5,
  己酉: 5,
  // 庚戌辛亥组 → 金4
  庚戌: 4,
  辛亥: 4,
  // 壬子癸丑组 → 木3
  壬子: 3,
  癸丑: 3,
  // 甲寅乙卯组 → 水2
  甲寅: 2,
  乙卯: 2,
  // 丙辰丁巳组 → 土5
  丙辰: 5,
  丁巳: 5,
  // 戊午己未组 → 火6
  戊午: 6,
  己未: 6,
  // 庚申辛酉组 → 木3
  庚申: 3,
  辛酉: 3,
  // 壬戌癸亥组 → 水2
  壬戌: 2,
  癸亥: 2
}, tt = {
  2: "水二局",
  3: "木三局",
  4: "金四局",
  5: "土五局",
  6: "火六局"
};
function et(n, t) {
  const e = n + t, a = nt[e];
  return a ? tt[a] || "金四局" : (console.warn(`未知的纳音组合: ${e}，使用默认金四局`), "金四局");
}
function at(n) {
  return {
    水二局: 2,
    木三局: 3,
    金四局: 4,
    土五局: 5,
    火六局: 6
  }[n];
}
function be(n) {
  return {
    水二局: "水",
    木三局: "木",
    金四局: "金",
    土五局: "土",
    火六局: "火"
  }[n];
}
function it(n) {
  return (4 + n - 1) % 12 + 1;
}
function rt(n) {
  return ((10 - (n - 1)) % 12 + 12) % 12 + 1;
}
function ut(n) {
  return ((10 - n) % 12 + 12) % 12 + 1;
}
function ot(n) {
  return (4 + n) % 12 + 1;
}
function lt(n) {
  return {
    // 年干 → [天魁, 天钺]
    0: [2, 8],
    // 甲 → 丑(2), 未(8)
    1: [1, 7],
    // 乙 → 子(1), 申(9) → 子,申
    2: [12, 10],
    // 丙 → 亥(12), 酉(10)
    3: [6, 4],
    // 丁 → 巳(6), 卯(4)
    4: [2, 8],
    // 戊 → 丑(2), 未(8)
    5: [1, 7],
    // 己 → 子(1), 申(9)
    6: [3, 5],
    // 庚 → 寅(3), 午(7), 甲戊庚牛羊 → 丑未
    7: [3, 5],
    // 辛 → 寅(3), 午(7)
    8: [6, 4],
    // 壬 → 巳(6), 卯(4)
    9: [6, 4]
    // 癸 → 巳(6), 卯(4)
  }[n] || [2, 8];
}
function ct(n) {
  return {
    0: 3,
    // 甲 → 寅
    1: 4,
    // 乙 → 卯
    2: 6,
    // 丙 → 巳
    3: 7,
    // 丁 → 午
    4: 6,
    // 戊 → 巳
    5: 7,
    // 己 → 午
    6: 9,
    // 庚 → 申
    7: 10,
    // 辛 → 酉
    8: 12,
    // 壬 → 亥
    9: 1
    // 癸 → 子
  }[n] || 3;
}
function st(n) {
  return n % 12 + 1;
}
function dt(n) {
  return ((n - 2) % 12 + 12) % 12 + 1;
}
function mt(n, t) {
  const a = {
    3: { start: 2, forward: !0 },
    // 寅
    7: { start: 2, forward: !0 },
    // 午
    11: { start: 2, forward: !0 },
    // 戌
    1: { start: 3, forward: !0 },
    // 子
    5: { start: 3, forward: !0 },
    // 辰
    9: { start: 3, forward: !0 },
    // 申
    4: { start: 4, forward: !0 },
    // 卯
    8: { start: 4, forward: !0 },
    // 未
    12: { start: 4, forward: !0 },
    // 亥
    2: { start: 10, forward: !0 },
    // 丑
    6: { start: 10, forward: !0 },
    // 巳
    10: { start: 10, forward: !0 }
    // 酉
  }[n] || { start: 2, forward: !0 };
  return a.forward ? (a.start - 1 + t) % 12 + 1 : ((a.start - 1 - t) % 12 + 12) % 12 + 1;
}
function gt(n, t) {
  const a = {
    3: { start: 11, forward: !0 },
    // 寅
    7: { start: 11, forward: !0 },
    // 午
    11: { start: 11, forward: !0 },
    // 戌
    1: { start: 4, forward: !0 },
    // 子
    5: { start: 4, forward: !0 },
    // 辰
    9: { start: 4, forward: !0 },
    // 申
    4: { start: 3, forward: !0 },
    // 卯
    8: { start: 3, forward: !0 },
    // 未
    12: { start: 3, forward: !0 },
    // 亥
    2: { start: 9, forward: !0 },
    // 丑
    6: { start: 9, forward: !0 },
    // 巳
    10: { start: 9, forward: !0 }
    // 酉
  }[n] || { start: 11, forward: !0 };
  return a.forward ? (a.start - 1 + t) % 12 + 1 : ((a.start - 1 - t) % 12 + 12) % 12 + 1;
}
function ht(n) {
  return ((11 - n) % 12 + 12) % 12 + 1;
}
function ft(n) {
  return (11 + n) % 12 + 1;
}
function yt(n) {
  return {
    3: 9,
    // 寅 → 申
    7: 9,
    // 午 → 申
    11: 9,
    // 戌 → 申
    1: 3,
    // 子 → 寅
    5: 3,
    // 辰 → 寅
    9: 3,
    // 申 → 寅
    4: 12,
    // 卯 → 亥
    8: 12,
    // 未 → 亥
    12: 12,
    // 亥 → 亥
    2: 6,
    // 丑 → 巳
    6: 6,
    // 巳 → 巳
    10: 6
    // 酉 → 巳
  }[n] || 3;
}
function sn(n) {
  return (3 + n - 1) % 12 + 1;
}
function pt(n) {
  return (sn(n) - 1 + 6) % 12 + 1;
}
function dn(n) {
  return {
    1: 7,
    2: 8,
    3: 9,
    4: 10,
    5: 11,
    6: 12,
    7: 1,
    8: 2,
    9: 3,
    10: 4,
    11: 5,
    12: 6
  }[n] || 7;
}
function St(n) {
  return (dn(n) - 1 + 6) % 12 + 1;
}
function Et(n) {
  return (3 + n) % 12 + 1;
}
function wt(n) {
  return ((3 - n) % 12 + 12) % 12 + 1;
}
function bt(n) {
  return (4 + n - 1) % 12 + 1;
}
function Tt(n) {
  return (10 + n - 1) % 12 + 1;
}
function mn(n) {
  return {
    3: 6,
    4: 6,
    5: 6,
    // 寅卯辰 → 巳
    6: 9,
    7: 9,
    8: 9,
    // 巳午未 → 申
    9: 12,
    10: 12,
    11: 12,
    // 申酉戌 → 亥
    12: 3,
    1: 3,
    2: 3
    // 亥子丑 → 寅
  }[n] || 6;
}
function Mt(n) {
  return (mn(n) - 1 + 6) % 12 + 1;
}
function It(n) {
  return (2 + n - 1) % 12 + 1;
}
function xt(n) {
  return (2 + n - 1) % 12 + 1;
}
function Bt(n) {
  return (6 + n) % 12 + 1;
}
function jt(n) {
  return (8 + n) % 12 + 1;
}
function kt(n, t, e, a, i = !0, r = !0) {
  const u = {}, l = {}, o = {};
  u.zuobi = it(n), u.youbi = rt(n), u.wenchang = ut(t), u.wenqu = ot(t);
  const [s, m] = lt(e);
  if (u.tiankui = s, u.tianyue = m, u.lucun = ct(e), u.tianma = yt(a), i) {
    const c = u.lucun;
    l.qingyang = st(c), l.tuoluo = dt(c), l.huoxing = mt(a, t), l.lingxing = gt(a, t), l.dikong = ht(t), l.dijie = ft(t);
  }
  return r && (o.hongluan = sn(a), o.tianxi = pt(a), o.tianku = dn(a), o.tianxu = St(a), o.longchi = bt(a), o.fengge = Tt(a), o.guchen = mn(a), o.gusu = Mt(a), o.santai = Et(t), o.bazuo = wt(t), o.tianguan = It(n), o.tianfu2 = xt(n), o.taifu = Bt(t), o.fenghao = jt(t)), { lucky: u, sha: l, misc: o };
}
const Ct = {
  甲: ["lianzhen", "pojun", "wuqu", "taiyang"],
  乙: ["tianji", "tianliang", "ziwei", "taiyin"],
  丙: ["tiantong", "tianji", "wenchang", "lianzhen"],
  丁: ["taiyin", "tiantong", "tianji", "jumen"],
  戊: ["tanlang", "taiyin", "youbi", "tianji"],
  己: ["wuqu", "tanlang", "tianliang", "wenqu"],
  庚: ["taiyang", "wuqu", "taiyin", "tiantong"],
  辛: ["jumen", "taiyang", "wenqu", "wenchang"],
  壬: ["tianliang", "ziwei", "zuobi", "wuqu"],
  癸: ["pojun", "jumen", "taiyin", "tanlang"]
}, Lt = {
  甲: ["lianzhen", "pojun", "wuqu", "taiyang"],
  乙: ["tianji", "tianliang", "ziwei", "taiyin"],
  丙: ["tiantong", "tianji", "wenchang", "lianzhen"],
  丁: ["taiyin", "tiantong", "tianji", "jumen"],
  戊: ["tanlang", "taiyin", "youbi", "tianji"],
  己: ["wuqu", "tanlang", "tianliang", "wenqu"],
  庚: ["taiyang", "wuqu", "taiyin", "tiantong"],
  辛: ["jumen", "taiyang", "wenqu", "wenchang"],
  壬: ["tianliang", "ziwei", "zuobi", "wuqu"],
  癸: ["pojun", "jumen", "taiyin", "tanlang"]
}, Ot = {
  甲: ["lianzhen", "pojun", "wuqu", "taiyang"],
  乙: ["tianji", "tianliang", "ziwei", "taiyin"],
  丙: ["tiantong", "tianji", "wenchang", "lianzhen"],
  丁: ["taiyin", "tiantong", "tianji", "jumen"],
  戊: ["tanlang", "taiyin", "youbi", "tianji"],
  己: ["wuqu", "tanlang", "tianliang", "wenqu"],
  庚: ["taiyang", "wuqu", "taiyin", "tiantong"],
  辛: ["jumen", "taiyang", "wenqu", "wenchang"],
  壬: ["tianliang", "ziwei", "zuobi", "wuqu"],
  癸: ["pojun", "jumen", "taiyin", "tanlang"]
}, At = {
  甲: ["lianzhen", "pojun", "wuqu", "taiyang"],
  乙: ["tianji", "tianliang", "ziwei", "taiyin"],
  丙: ["tiantong", "tianji", "wenchang", "lianzhen"],
  丁: ["taiyin", "tiantong", "tianji", "jumen"],
  戊: ["tanlang", "taiyin", "youbi", "tianji"],
  己: ["wuqu", "tanlang", "tianliang", "wenqu"],
  庚: ["taiyang", "wuqu", "taiyin", "tiantong"],
  辛: ["jumen", "taiyang", "wenqu", "wenchang"],
  壬: ["tianliang", "ziwei", "zuobi", "wuqu"],
  癸: ["pojun", "jumen", "taiyin", "tanlang"]
}, gn = ["禄", "权", "科", "忌"];
function hn(n = "sanhe") {
  switch (n) {
    case "feixing":
      return Lt;
    case "sihua":
      return Ot;
    case "nishi":
      return At;
    default:
      return Ct;
  }
}
function T(n, t = "sanhe") {
  const a = hn(t)[n];
  return a ? a.map((i, r) => ({
    starId: i,
    type: gn[r]
  })) : [];
}
function Te(n, t, e = "sanhe") {
  const i = hn(e)[n];
  if (!i) return null;
  const r = i.indexOf(t);
  return r === -1 ? null : gn[r];
}
function Me(n, t = "sanhe") {
  return T(n, t);
}
function Ie(n, t = "sanhe") {
  const e = (n - 4) % 10, a = S[(e % 10 + 10) % 10];
  return T(a, t);
}
function xe(n, t, e = "sanhe") {
  const r = (({
    甲: 2,
    乙: 4,
    丙: 6,
    丁: 8,
    戊: 0,
    己: 2,
    庚: 4,
    辛: 6,
    壬: 8,
    癸: 0
  }[n] ?? 2) + t - 1) % 10, u = S[r];
  return T(u, e);
}
function Be(n, t, e, a, i = "sanhe") {
  const r = S.indexOf(n), u = (e * 30 + a) % 10, l = (r + u) % 10, o = S[l];
  return T(o, i);
}
function qt(n, t = "sanhe") {
  return T(n, t);
}
function Pt(n) {
  return n % 2 === 0;
}
function zt(n, t) {
  const e = Pt(n);
  return !!(e && t === "男" || !e && t === "女");
}
function vt(n, t, e, a, i, r) {
  const u = zt(e, i), o = at(r), s = [];
  for (let m = 0; m < 12; m++) {
    let c;
    u ? c = (n + m - 1) % 12 + 1 : c = ((n - 1 - m) % 12 + 12) % 12 + 1;
    const g = W(e, c), p = b[c - 1], f = o + m * 10, h = f + 9;
    s.push({
      palaceIndex: c,
      startAge: f,
      endAge: h,
      stem: g,
      branch: p
    });
  }
  return s;
}
function Ht(n, t) {
  return n.find((e) => t >= e.startAge && t <= e.endAge);
}
function je(n, t, e) {
  const a = t - n + 1;
  return Ht(e, a);
}
function ke(n) {
  const t = (n - 4) % 12;
  return b[(t % 12 + 12) % 12];
}
function Yt(n) {
  const t = (n - 4) % 10;
  return S[(t % 10 + 10) % 10];
}
function _t(n) {
  return ((n - 4) % 12 + 12) % 12 + 1;
}
function Ce(n) {
  const t = Yt(n);
  return T(t);
}
function Ft(n, t) {
  const e = _t(n) - 1, a = (t - 1) % 12;
  return (e + a) % 12 + 1;
}
function Le(n, t, e) {
  return (Ft(n, t) - 1 + (e - 1)) % 12 + 1;
}
function Nt(n, t) {
  var o, s, m;
  const e = (o = Object.entries(t).find(([c]) => c === "qisha")) == null ? void 0 : o[1], a = (s = Object.entries(t).find(([c]) => c === "pojun")) == null ? void 0 : s[1], i = (m = Object.entries(t).find(([c]) => c === "tanlang")) == null ? void 0 : m[1];
  if (!e || !a || !i) return !1;
  const u = n[0].branchIndex, l = /* @__PURE__ */ new Set([
    u,
    (u - 1 + 6) % 12 + 1,
    // 对宫
    (u - 1 + 4) % 12 + 1,
    // 财帛
    (u - 1 + 10) % 12 + 1
    // 官禄
  ]);
  return l.has(e) && l.has(a) && l.has(i);
}
function Dt(n, t) {
  var o, s, m, c;
  const e = (o = Object.entries(t).find(([g]) => g === "tianji")) == null ? void 0 : o[1], a = (s = Object.entries(t).find(([g]) => g === "taiyin")) == null ? void 0 : s[1], i = (m = Object.entries(t).find(([g]) => g === "tiantong")) == null ? void 0 : m[1], r = (c = Object.entries(t).find(([g]) => g === "tianliang")) == null ? void 0 : c[1];
  if (!e || !a || !i || !r) return !1;
  const u = n[0].branchIndex, l = /* @__PURE__ */ new Set([
    u,
    (u - 1 + 6) % 12 + 1,
    (u - 1 + 4) % 12 + 1,
    (u - 1 + 10) % 12 + 1
  ]);
  return l.has(e) && l.has(a) && l.has(i) && l.has(r);
}
function Rt(n) {
  const t = n.ziwei, e = n.tianfu;
  return t !== void 0 && e !== void 0 && t === e;
}
function Gt(n) {
  const t = n.taiyang, e = n.taiyin;
  if (!t || !e) return !1;
  const a = [4, 5, 6].includes(t), i = [10, 11, 12].includes(e);
  return a && i;
}
function Zt(n) {
  const t = n.taiyang, e = n.taiyin;
  if (!t || !e) return !1;
  const a = [11, 12, 1].includes(t), i = [5, 6, 7].includes(e);
  return a && i;
}
function Wt(n, t) {
  const e = n.tianfu, a = n.tianxiang;
  if (!e || !a) return !1;
  const i = t[0].branchIndex, r = /* @__PURE__ */ new Set([
    i,
    (i - 1 + 4) % 12 + 1,
    // 财帛
    (i - 1 + 10) % 12 + 1
    // 官禄
  ]);
  return r.has(e) && r.has(a);
}
function $t(n, t) {
  const e = n.tanlang;
  return e ? t[0].branchIndex === e && e === 3 : !1;
}
function Xt(n, t) {
  const e = n.taiyin;
  return e ? t[0].branchIndex === e && e === 12 : !1;
}
function Jt(n, t) {
  const e = n.taiyang;
  return e ? t[0].branchIndex === e && e === 7 : !1;
}
function Qt(n, t) {
  const e = n.jumen, a = n.tianji;
  return !e || !a ? !1 : t[0].branchIndex === e && e === a;
}
function Oe(n, t) {
  return n.tianxiang, !1;
}
const Ut = [
  { name: "杀破狼", description: "七杀、破军、贪狼在三方四正会照，主变动革新", detect: (n, t) => Nt(n, t) },
  { name: "紫府同宫", description: "紫微与天府同宫，主大贵", detect: (n, t) => Rt(t) },
  { name: "日月并明", description: "太阳太阴皆在庙旺之地，主光明磊落", detect: (n, t) => Gt(t) },
  { name: "日月反背", description: "太阳太阴皆落陷，主劳碌", detect: (n, t) => Zt(t) },
  { name: "府相朝垣", description: "天府天相在三方拱照命宫", detect: (n, t) => Wt(t, n) },
  { name: "机月同梁", description: "天机太阴天同天梁在三方会照，主公职", detect: (n, t) => Dt(n, t) },
  { name: "雄宿乾元", description: "贪狼在寅宫坐命", detect: (n, t) => $t(t, n) },
  { name: "月朗天门", description: "太阴在亥宫坐命庙旺", detect: (n, t) => Xt(t, n) },
  { name: "日丽中天", description: "太阳在午宫坐命庙旺", detect: (n, t) => Jt(t, n) },
  { name: "巨机同临", description: "巨门天机同宫坐命", detect: (n, t) => Qt(t, n) }
];
function Kt(n, t, e, a) {
  return Ut.map((i) => ({
    name: i.name,
    description: i.description,
    triggered: i.detect(n, t, e, a),
    stars: [],
    palaces: []
  })).filter((i) => i.triggered);
}
function Vt(n) {
  const {
    year: t,
    month: e,
    day: a,
    hour: i,
    minute: r,
    gender: u,
    longitude: l,
    latitude: o,
    school: s = "sanhe",
    isLunar: m = !1
  } = n;
  let c = t, g = e, p = a, f = e, h = a;
  if (m) {
    const d = on(t, e, a, !1);
    c = d.year, g = d.month, p = d.day;
  } else {
    const d = un(t, e, a);
    d.year, f = d.month, h = d.day, d.isLeap;
  }
  const X = vn(c, g, p) ? c : c - 1, j = (X - 4) % 10, q = ((X - 4) % 12 + 12) % 12, J = S[(j % 10 + 10) % 10], En = b[(q % 12 + 12) % 12], M = qn(c, g, p, i, !1), H = Dn(c, g, p, i, r, l), I = Rn(f, H, !1), Y = Gn(f, H), wn = W((j % 10 + 10) % 10, I), bn = b[I - 1], P = et(wn, bn), Tn = Wn(I), Mn = $n(q + 1), _ = cn(P, h).starMap, x = kt(
    f,
    H,
    (j % 10 + 10) % 10,
    q + 1,
    !0,
    !0
  ), F = qt(J, s), Q = {};
  F.forEach((d) => {
    Q[d.starId] = d.type;
  });
  const N = Xn(I, Y, (j % 10 + 10) % 10), U = {
    ..._,
    ...x.lucky,
    ...x.sha,
    ...x.misc
  };
  N.forEach((d) => {
    const w = d.branchIndex;
    for (const [y, E] of Object.entries(_))
      E === w && d.mainStars.push(y);
    for (const [y, E] of Object.entries(x.lucky))
      E === w && d.minorStars.push(y);
    for (const [y, E] of Object.entries(x.sha))
      E === w && d.shaStars.push(y);
    for (const [y, E] of Object.entries(x.misc))
      E === w && d.miscStars.push(y);
    for (const y of F)
      U[y.starId] === w && d.hua.push(y.type);
  });
  const In = vt(
    I,
    Y,
    (j % 10 + 10) % 10,
    q + 1,
    u,
    P
  );
  Kt(N, _, P, Q);
  const xn = F.map((d) => ({
    starId: d.starId,
    type: d.type,
    palaceIndex: U[d.starId] || 0
  })), Bn = N.map((d, w) => ({
    ...d,
    name: tn[w]
  }));
  return {
    input: n,
    fourPillars: {
      year: `${J}${En}`,
      month: `${M.monthPillar.stem}${M.monthPillar.branch}`,
      day: `${M.dayPillar.stem}${M.dayPillar.branch}`,
      hour: `${M.hourPillar.stem}${M.hourPillar.branch}`
    },
    mingPalace: I,
    shenPalace: Y,
    elementPhase: P,
    palaces: Bn,
    mingMaster: Tn,
    shenMaster: Mn,
    hua: xn,
    greatLimits: In
  };
}
function Ae(n, t, e, a, i = 0, r = "男", u = "sanhe") {
  return Vt({
    year: n,
    month: t,
    day: e,
    hour: a,
    minute: i,
    gender: r,
    school: u,
    isLunar: !1
  });
}
const fn = [
  "长生",
  "沐浴",
  "冠带",
  "临官",
  "帝旺",
  "衰",
  "病",
  "死",
  "墓",
  "绝",
  "胎",
  "养"
], yn = {
  金: { branch: 6, forward: !0 },
  // 巳
  木: { branch: 12, forward: !0 },
  // 亥
  水: { branch: 9, forward: !0 },
  // 申
  火: { branch: 3, forward: !0 },
  // 寅
  土: { branch: 9, forward: !0 }
  // 申
};
function ne(n) {
  const t = yn[n];
  if (!t)
    return console.warn(`未知五行: ${n}，使用水局`), ne("水");
  const e = [];
  t.branch;
  for (let a = 0; a < 12; a++)
    e.push(fn[a]);
  return e;
}
function qe(n, t) {
  const a = {
    水二局: "水",
    木三局: "木",
    金四局: "金",
    土五局: "土",
    火六局: "火"
  }[n], r = ((yn[a].branch - t) % 12 + 12) % 12;
  return fn[r];
}
const pn = {
  ziwei: {
    id: "ziwei",
    name: "紫微",
    nameEn: "Zi Wei",
    group: "中天",
    element: "土",
    yinyang: "阴",
    type: "主星",
    earthBranch: 0,
    isZiweiSeries: !0,
    seriesOrder: 1,
    luck: "吉",
    description: "北斗之主，帝星。主贵、权威、统御。入命身宫主贵气、领导才能。",
    symbolism: ["帝王", "尊贵", "领袖", "权力", "高贵"]
  },
  tianji: {
    id: "tianji",
    name: "天机",
    nameEn: "Tian Ji",
    group: "南斗",
    element: "木",
    yinyang: "阴",
    type: "主星",
    earthBranch: 0,
    isZiweiSeries: !0,
    seriesOrder: 2,
    luck: "吉",
    description: "南斗第三星，化气为善。主智慧、谋略、变动、思考。",
    symbolism: ["智慧", "谋略", "变动", "思考", "善变"]
  },
  taiyang: {
    id: "taiyang",
    name: "太阳",
    nameEn: "Tai Yang",
    group: "中天",
    element: "火",
    yinyang: "阳",
    type: "主星",
    earthBranch: 0,
    isZiweiSeries: !0,
    seriesOrder: 3,
    luck: "吉",
    description: "中天主星，化气为贵。主光明、博爱、积极、名声。",
    symbolism: ["光明", "博爱", "积极", "名声", "父亲", "丈夫"]
  },
  wuqu: {
    id: "wuqu",
    name: "武曲",
    nameEn: "Wu Qu",
    group: "北斗",
    element: "金",
    yinyang: "阴",
    type: "主星",
    earthBranch: 0,
    isZiweiSeries: !0,
    seriesOrder: 4,
    luck: "吉",
    description: "北斗第六星，化气为财。主财富、刚毅、执行力、武职。",
    symbolism: ["财富", "刚毅", "执行力", "武职", "金融"]
  },
  tiantong: {
    id: "tiantong",
    name: "天同",
    nameEn: "Tian Tong",
    group: "南斗",
    element: "水",
    yinyang: "阳",
    type: "主星",
    earthBranch: 0,
    isZiweiSeries: !0,
    seriesOrder: 5,
    luck: "吉",
    description: "南斗第四星，化气为福。主福气、温和、协调、享受。",
    symbolism: ["福气", "温和", "协调", "享受", "懒散"]
  },
  lianzhen: {
    id: "lianzhen",
    name: "廉贞",
    nameEn: "Lian Zhen",
    group: "北斗",
    element: "火",
    yinyang: "阴",
    type: "主星",
    earthBranch: 0,
    isZiweiSeries: !0,
    seriesOrder: 6,
    luck: "吉带煞",
    description: "北斗第五星，化气为囚。主贞烈、是非、权术、感情复杂。",
    symbolism: ["贞烈", "权术", "是非", "感情", "囚狱"]
  },
  tianfu: {
    id: "tianfu",
    name: "天府",
    nameEn: "Tian Fu",
    group: "南斗",
    element: "土",
    yinyang: "阳",
    type: "主星",
    earthBranch: 0,
    isZiweiSeries: !1,
    seriesOrder: 1,
    luck: "吉",
    description: "南斗主星，化气为库。主保守、稳定、包容、财库。",
    symbolism: ["保守", "稳定", "包容", "财库", "库藏"]
  },
  taiyin: {
    id: "taiyin",
    name: "太阴",
    nameEn: "Tai Yin",
    group: "中天",
    element: "水",
    yinyang: "阴",
    type: "主星",
    earthBranch: 0,
    isZiweiSeries: !1,
    seriesOrder: 2,
    luck: "吉",
    description: "中天主星，化气为富。主温柔、美丽、财富、田宅、母亲。",
    symbolism: ["温柔", "美丽", "财富", "田宅", "母亲", "妻子"]
  },
  tanlang: {
    id: "tanlang",
    name: "贪狼",
    nameEn: "Tan Lang",
    group: "北斗",
    element: "木",
    yinyang: "阳",
    type: "主星",
    earthBranch: 0,
    isZiweiSeries: !1,
    seriesOrder: 3,
    luck: "平",
    description: "北斗第一星，化气为桃花。主欲望、才艺、交际、桃花、投机。",
    symbolism: ["桃花", "欲望", "才艺", "交际", "投机"]
  },
  jumen: {
    id: "jumen",
    name: "巨门",
    nameEn: "Ju Men",
    group: "北斗",
    element: "水",
    yinyang: "阴",
    type: "主星",
    earthBranch: 0,
    isZiweiSeries: !1,
    seriesOrder: 4,
    luck: "凶",
    description: "北斗第二星，化气为暗。主是非、口舌、暗昧、思辨、沟通。",
    symbolism: ["是非", "口舌", "暗昧", "思辨", "沟通"]
  },
  tianxiang: {
    id: "tianxiang",
    name: "天相",
    nameEn: "Tian Xiang",
    group: "南斗",
    element: "水",
    yinyang: "阳",
    type: "主星",
    earthBranch: 0,
    isZiweiSeries: !1,
    seriesOrder: 5,
    luck: "吉",
    description: "南斗第五星，化气为印。主辅佐、协调、公正、印章、服务。",
    symbolism: ["辅佐", "协调", "公正", "印章", "服务"]
  },
  tianliang: {
    id: "tianliang",
    name: "天梁",
    nameEn: "Tian Liang",
    group: "南斗",
    element: "土",
    yinyang: "阳",
    type: "主星",
    earthBranch: 0,
    isZiweiSeries: !1,
    seriesOrder: 6,
    luck: "吉",
    description: "南斗第二星，化气为荫。主荫庇、长寿、清高、解厄、医药。",
    symbolism: ["荫庇", "长寿", "清高", "解厄", "医药", "长辈"]
  },
  qisha: {
    id: "qisha",
    name: "七杀",
    nameEn: "Qi Sha",
    group: "南斗",
    element: "金",
    yinyang: "阴",
    type: "主星",
    earthBranch: 0,
    isZiweiSeries: !1,
    seriesOrder: 7,
    luck: "煞带吉",
    description: "南斗第六星，化气为杀。主威严、决断、拼搏、冒险、变动。",
    symbolism: ["威严", "决断", "拼搏", "冒险", "变动"]
  },
  pojun: {
    id: "pojun",
    name: "破军",
    nameEn: "Po Jun",
    group: "北斗",
    element: "火",
    yinyang: "阴",
    type: "主星",
    earthBranch: 0,
    isZiweiSeries: !1,
    seriesOrder: 8,
    luck: "煞带吉",
    description: "北斗第七星，化气为耗。主破旧立新、破坏、消耗、变革、冒险。",
    symbolism: ["破旧立新", "破坏", "消耗", "变革", "冒险"]
  }
}, te = ["ziwei", "tianji", "taiyang", "wuqu", "tiantong", "lianzhen"], ee = ["tianfu", "taiyin", "tanlang", "jumen", "tianxiang", "tianliang", "qisha", "pojun"], ae = [...te, ...ee];
function Pe(n) {
  return pn[n];
}
function ze() {
  return ae.map((n) => pn[n]);
}
const Sn = {
  zuobi: {
    id: "zuobi",
    name: "左辅",
    nameEn: "Zuo Bi",
    luck: "吉",
    category: "辅",
    earthBranch: 0,
    method: "月支",
    rule: "左辅从辰起正月，顺数至出生月",
    description: "辅佐星，主助力、贵人、团队协作。"
  },
  youbi: {
    id: "youbi",
    name: "右弼",
    nameEn: "You Bi",
    luck: "吉",
    category: "辅",
    earthBranch: 0,
    method: "月支",
    rule: "右弼从戌起正月，逆数至出生月",
    description: "辅佐星，主助力、暗中相助、协调。"
  },
  wenchang: {
    id: "wenchang",
    name: "文昌",
    nameEn: "Wen Chang",
    luck: "吉",
    category: "辅",
    earthBranch: 0,
    method: "时干",
    rule: "文昌从戌起子时，逆数至生时",
    description: "文星，主才学、文采、考试。"
  },
  wenqu: {
    id: "wenqu",
    name: "文曲",
    nameEn: "Wen Qu",
    luck: "吉",
    category: "辅",
    earthBranch: 0,
    method: "时干",
    rule: "文曲从辰起子时，顺数至生时",
    description: "文星，主才艺、口才、技艺。"
  },
  tiankui: {
    id: "tiankui",
    name: "天魁",
    nameEn: "Tian Kui",
    luck: "吉",
    category: "辅",
    earthBranch: 0,
    method: "年干",
    rule: "甲戊庚牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸蛇兔藏，六辛逢虎马",
    description: "贵人星，主天乙贵人、助力、机遇。"
  },
  tianyue: {
    id: "tianyue",
    name: "天钺",
    nameEn: "Tian Yue",
    luck: "吉",
    category: "辅",
    earthBranch: 0,
    method: "年干",
    rule: "甲戊庚牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸蛇兔藏，六辛逢虎马",
    description: "贵人星，主偏财、暗中助力。"
  },
  lucun: {
    id: "lucun",
    name: "禄存",
    nameEn: "Lu Cun",
    luck: "吉",
    category: "辅",
    earthBranch: 0,
    method: "年干",
    rule: "甲禄到寅宫，乙禄到卯宫，丙戊禄在巳，丁己禄在午，庚禄居申，辛禄在酉，壬禄在亥，癸禄在子",
    description: "财星，主财富、积蓄、福禄。"
  },
  qingyang: {
    id: "qingyang",
    name: "擎羊",
    nameEn: "Qing Yang",
    luck: "凶",
    category: "煞",
    earthBranch: 0,
    method: "年干",
    rule: "禄前为擎羊",
    description: "煞星，主血光、争斗、横祸、速发。"
  },
  tuoluo: {
    id: "tuoluo",
    name: "陀罗",
    nameEn: "Tuo Luo",
    luck: "凶",
    category: "煞",
    earthBranch: 0,
    method: "年干",
    rule: "禄后为陀罗",
    description: "煞星，主拖延、纠缠、慢性病。"
  },
  huoxing: {
    id: "huoxing",
    name: "火星",
    nameEn: "Huo Xing",
    luck: "凶",
    category: "煞",
    earthBranch: 0,
    method: "年支",
    rule: "火星以年生，依时起",
    description: "煞星，主突发、暴躁、火爆、速成速败。"
  },
  lingxing: {
    id: "lingxing",
    name: "铃星",
    nameEn: "Ling Xing",
    luck: "凶",
    category: "煞",
    earthBranch: 0,
    method: "年支",
    rule: "铃星以年生，依时起",
    description: "煞星，主阴险、暗算、慢性烦恼。"
  },
  dikong: {
    id: "dikong",
    name: "地空",
    nameEn: "Di Kong",
    luck: "凶",
    category: "煞",
    earthBranch: 0,
    method: "时支",
    rule: "地空从亥起子时，逆数至生时",
    description: "煞星，主空虚、破财、理想、玄学。"
  },
  dijie: {
    id: "dijie",
    name: "地劫",
    nameEn: "Di Jie",
    luck: "凶",
    category: "煞",
    earthBranch: 0,
    method: "时支",
    rule: "地劫从亥起子时，顺数至生时",
    description: "煞星，主波折、损失、变动、破耗。"
  },
  tianma: {
    id: "tianma",
    name: "天马",
    nameEn: "Tian Ma",
    luck: "平",
    category: "辅",
    earthBranch: 0,
    method: "年支",
    rule: "寅午戌年天马在申，申子辰年在寅，巳酉丑年在亥，亥卯未年在巳",
    description: "动星，主奔波、出国、交通、变动。"
  },
  // ---- 杂曜 ----
  tianku: {
    id: "tianku",
    name: "天哭",
    nameEn: "Tian Ku",
    luck: "凶",
    category: "杂",
    earthBranch: 0,
    method: "年支",
    rule: "天哭天虚与年支相关",
    description: "杂曜，主悲伤、眼泪、孤独。"
  },
  tianxu: {
    id: "tianxu",
    name: "天虚",
    nameEn: "Tian Xu",
    luck: "凶",
    category: "杂",
    earthBranch: 0,
    method: "年支",
    rule: "天哭天虚与年支相关",
    description: "杂曜，主虚无、损耗、不实。"
  },
  longchi: {
    id: "longchi",
    name: "龙池",
    nameEn: "Long Chi",
    luck: "吉",
    category: "杂",
    earthBranch: 0,
    method: "年支",
    rule: "龙池与年支相关",
    description: "杂曜，主文采、艺术、名气。"
  },
  fengge: {
    id: "fengge",
    name: "凤阁",
    nameEn: "Feng Ge",
    luck: "吉",
    category: "杂",
    earthBranch: 0,
    method: "年支",
    rule: "凤阁与年支相关",
    description: "杂曜，主优雅、名声、女贵。"
  },
  hongluan: {
    id: "hongluan",
    name: "红鸾",
    nameEn: "Hong Luan",
    luck: "吉",
    category: "杂",
    earthBranch: 0,
    method: "年支",
    rule: "红鸾从卯起子年，顺数至年支",
    description: "桃花星，主姻缘、恋爱、喜庆。"
  },
  tianxi: {
    id: "tianxi",
    name: "天喜",
    nameEn: "Tian Xi",
    luck: "吉",
    category: "杂",
    earthBranch: 0,
    method: "年支",
    rule: "天喜从酉起子年，顺数至年支",
    description: "喜庆星，主婚姻、喜事、生产。"
  },
  guchen: {
    id: "guchen",
    name: "孤辰",
    nameEn: "Gu Chen",
    luck: "凶",
    category: "杂",
    earthBranch: 0,
    method: "年支",
    rule: "孤辰与年支相关",
    description: "孤独星，主独处、孤僻、少社交。"
  },
  gusu: {
    id: "gusu",
    name: "寡宿",
    nameEn: "Gu Su",
    luck: "凶",
    category: "杂",
    earthBranch: 0,
    method: "年支",
    rule: "寡宿与年支相关",
    description: "寡宿星，主独居、配偶缘薄。"
  },
  santai: {
    id: "santai",
    name: "三台",
    nameEn: "San Tai",
    luck: "吉",
    category: "杂",
    earthBranch: 0,
    method: "时支",
    rule: "三台与生时相关",
    description: "科甲星，主功名、提升。"
  },
  bazuo: {
    id: "bazuo",
    name: "八座",
    nameEn: "Ba Zuo",
    luck: "吉",
    category: "杂",
    earthBranch: 0,
    method: "时支",
    rule: "八座与生时相关",
    description: "科甲星，主功名、地位。"
  },
  tianwu: {
    id: "tianwu",
    name: "天巫",
    nameEn: "Tian Wu",
    luck: "平",
    category: "杂",
    earthBranch: 0,
    method: "月支",
    rule: "天巫与月支相关",
    description: "灵性星，主玄学、宗教信仰。"
  },
  tianyue2: {
    id: "tianyue2",
    name: "天月",
    nameEn: "Tian Yue",
    luck: "平",
    category: "杂",
    earthBranch: 0,
    method: "月支",
    rule: "天月与月支相关",
    description: "杂曜，主随和、宗教。"
  },
  yinsha: {
    id: "yinsha",
    name: "阴煞",
    nameEn: "Yin Sha",
    luck: "凶",
    category: "杂",
    earthBranch: 0,
    method: "月支",
    rule: "阴煞与月支相关",
    description: "暗星，主暗中阻碍、小人。"
  },
  taifu: {
    id: "taifu",
    name: "台辅",
    nameEn: "Tai Fu",
    luck: "吉",
    category: "杂",
    earthBranch: 0,
    method: "时支",
    rule: "台辅与生时相关",
    description: "科甲星，主名誉、辅助。"
  },
  fenghao: {
    id: "fenghao",
    name: "封诰",
    nameEn: "Feng Gao",
    luck: "吉",
    category: "杂",
    earthBranch: 0,
    method: "时支",
    rule: "封诰与生时相关",
    description: "封赠星，主名声、荣誉。"
  },
  tianguan: {
    id: "tianguan",
    name: "天官",
    nameEn: "Tian Guan",
    luck: "吉",
    category: "杂",
    earthBranch: 0,
    method: "月支",
    rule: "天官与月支相关",
    description: "官禄星，主升职、官运。"
  },
  tianfu2: {
    id: "tianfu2",
    name: "天福",
    nameEn: "Tian Fu",
    luck: "吉",
    category: "杂",
    earthBranch: 0,
    method: "月支",
    rule: "天福与月支相关",
    description: "福星，主福气、享受。"
  }
}, ve = Object.keys(Sn);
function He(n) {
  return Sn[n];
}
const ie = {
  庙: 5,
  旺: 4,
  得地: 3,
  利益: 2,
  平和: 1,
  不得地: -1,
  落陷: -2
}, re = {
  // ---- 14主星 ----
  ziwei: [
    "庙",
    // 子
    "旺",
    // 丑
    "得地",
    // 寅
    "旺",
    // 卯
    "得地",
    // 辰
    "旺",
    // 巳
    "庙",
    // 午
    "旺",
    // 未
    "得地",
    // 申
    "旺",
    // 酉
    "得地",
    // 戌
    "旺"
    // 亥
  ],
  tianji: [
    "得地",
    // 子
    "不得地",
    // 丑
    "利益",
    // 寅
    "旺",
    // 卯
    "不得地",
    // 辰
    "利益",
    // 巳
    "落陷",
    // 午
    "旺",
    // 未
    "利益",
    // 申
    "旺",
    // 酉
    "落陷",
    // 戌
    "平和"
    // 亥
  ],
  taiyang: [
    "落陷",
    // 子
    "落陷",
    // 丑
    "得地",
    // 寅
    "旺",
    // 卯
    "旺",
    // 辰
    "庙",
    // 巳
    "庙",
    // 午
    "庙",
    // 未
    "旺",
    // 申
    "得地",
    // 酉
    "落陷",
    // 戌
    "落陷"
    // 亥
  ],
  wuqu: [
    "旺",
    // 子
    "庙",
    // 丑
    "得地",
    // 寅
    "庙",
    // 卯
    "庙",
    // 辰
    "旺",
    // 巳
    "庙",
    // 午
    "得地",
    // 未
    "平",
    // 申
    "旺",
    // 酉
    "落陷",
    // 戌
    "得地"
    // 亥
  ],
  tiantong: [
    "庙",
    // 子
    "不得地",
    // 丑
    "利益",
    // 寅
    "旺",
    // 卯
    "利益",
    // 辰
    "旺",
    // 巳
    "落陷",
    // 午
    "庙",
    // 未
    "旺",
    // 申
    "旺",
    // 酉
    "得地",
    // 戌
    "平和"
    // 亥
  ],
  lianzhen: [
    "旺",
    // 子
    "平和",
    // 丑
    "平和",
    // 寅
    "落陷",
    // 卯
    "利益",
    // 辰
    "庙",
    // 巳
    "庙",
    // 午
    "得地",
    // 未
    "利益",
    // 申
    "旺",
    // 酉
    "落陷",
    // 戌
    "旺"
    // 亥
  ],
  tianfu: [
    "庙",
    // 子
    "旺",
    // 丑
    "得地",
    // 寅
    "旺",
    // 卯
    "得地",
    // 辰
    "庙",
    // 巳
    "庙",
    // 午
    "旺",
    // 未
    "得地",
    // 申
    "旺",
    // 酉
    "得地",
    // 戌
    "庙"
    // 亥
  ],
  taiyin: [
    "庙",
    // 子
    "庙",
    // 丑
    "得地",
    // 寅
    "旺",
    // 卯
    "落陷",
    // 辰
    "利益",
    // 巳
    "落陷",
    // 午
    "庙",
    // 未
    "庙",
    // 申
    "旺",
    // 酉
    "得地",
    // 戌
    "平和"
    // 亥
  ],
  tanlang: [
    "旺",
    // 子
    "不得地",
    // 丑
    "旺",
    // 寅
    "落陷",
    // 卯
    "庙",
    // 辰
    "得地",
    // 巳
    "落陷",
    // 午
    "旺",
    // 未
    "庙",
    // 申
    "旺",
    // 酉
    "落陷",
    // 戌
    "庙"
    // 亥
  ],
  jumen: [
    "庙",
    // 子
    "旺",
    // 丑
    "平和",
    // 寅
    "旺",
    // 卯
    "落陷",
    // 辰
    "旺",
    // 巳
    "庙",
    // 午
    "得地",
    // 未
    "利益",
    // 申
    "旺",
    // 酉
    "落陷",
    // 戌
    "平和"
    // 亥
  ],
  tianxiang: [
    "庙",
    // 子
    "得地",
    // 丑
    "得地",
    // 寅
    "平和",
    // 卯
    "庙",
    // 辰
    "庙",
    // 巳
    "落陷",
    // 午
    "得地",
    // 未
    "旺",
    // 申
    "平和",
    // 酉
    "庙",
    // 戌
    "旺"
    // 亥
  ],
  tianliang: [
    "庙",
    // 子
    "得地",
    // 丑
    "庙",
    // 寅
    "旺",
    // 卯
    "得地",
    // 辰
    "旺",
    // 巳
    "落陷",
    // 午
    "得地",
    // 未
    "庙",
    // 申
    "旺",
    // 酉
    "得地",
    // 戌
    "旺"
    // 亥
  ],
  qisha: [
    "旺",
    // 子
    "得地",
    // 丑
    "旺",
    // 寅
    "庙",
    // 卯
    "得地",
    // 辰
    "旺",
    // 巳
    "庙",
    // 午
    "得地",
    // 未
    "旺",
    // 申
    "庙",
    // 酉
    "落陷",
    // 戌
    "旺"
    // 亥
  ],
  pojun: [
    "庙",
    // 子
    "旺",
    // 丑
    "旺",
    // 寅
    "平和",
    // 卯
    "得地",
    // 辰
    "得地",
    // 巳
    "落陷",
    // 午
    "旺",
    // 未
    "庙",
    // 申
    "得地",
    // 酉
    "落陷",
    // 戌
    "旺"
    // 亥
  ],
  // ---- 辅星 ----
  zuobi: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ],
  youbi: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ],
  wenchang: [
    "旺",
    // 子
    "庙",
    // 丑
    "得地",
    // 寅
    "旺",
    // 卯
    "庙",
    // 辰
    "旺",
    // 巳
    "落陷",
    // 午
    "平和",
    // 未
    "得地",
    // 申
    "旺",
    // 酉
    "庙",
    // 戌
    "得地"
    // 亥
  ],
  wenqu: [
    "旺",
    // 子
    "庙",
    // 丑
    "得地",
    // 寅
    "旺",
    // 卯
    "庙",
    // 辰
    "旺",
    // 巳
    "落陷",
    // 午
    "平和",
    // 未
    "得地",
    // 申
    "旺",
    // 酉
    "庙",
    // 戌
    "得地"
    // 亥
  ],
  tiankui: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ],
  tianyue: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ],
  lucun: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ],
  tianma: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ],
  // ---- 煞星 ----
  qingyang: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ],
  tuoluo: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ],
  huoxing: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ],
  lingxing: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ],
  dikong: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ],
  dijie: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ]
};
function Ye(n, t) {
  const e = re[n];
  return e ? e[t - 1] ?? null : null;
}
function _e(n) {
  return n ? ie[n] ?? 0 : 0;
}
const ue = {
  ziwei: { id: "ziwei", nameCn: "紫微", nameEn: "Zi Wei", aliases: ["北极", "帝星"] },
  tianji: { id: "tianji", nameCn: "天机", nameEn: "Tian Ji", aliases: ["善星", "谋星"] },
  taiyang: { id: "taiyang", nameCn: "太阳", nameEn: "Tai Yang", aliases: ["日", "阳星", "光明星"] },
  wuqu: { id: "wuqu", nameCn: "武曲", nameEn: "Wu Qu", aliases: ["财星", "刚星"] },
  tiantong: { id: "tiantong", nameCn: "天同", nameEn: "Tian Tong", aliases: ["福星", "和星"] },
  lianzhen: { id: "lianzhen", nameCn: "廉贞", nameEn: "Lian Zhen", aliases: ["囚星", "次桃花"] },
  tianfu: { id: "tianfu", nameCn: "天府", nameEn: "Tian Fu", aliases: ["库星", "令星"] },
  taiyin: { id: "taiyin", nameCn: "太阴", nameEn: "Tai Yin", aliases: ["月", "阴星", "富星"] },
  tanlang: { id: "tanlang", nameCn: "贪狼", nameEn: "Tan Lang", aliases: ["桃花星", "杀星", "狼星"] },
  jumen: { id: "jumen", nameCn: "巨门", nameEn: "Ju Men", aliases: ["暗星", "口舌星"] },
  tianxiang: { id: "tianxiang", nameCn: "天相", nameEn: "Tian Xiang", aliases: ["印星", "辅佐星"] },
  tianliang: { id: "tianliang", nameCn: "天梁", nameEn: "Tian Liang", aliases: ["荫星", "寿星", "清星"] },
  qisha: { id: "qisha", nameCn: "七杀", nameEn: "Qi Sha", aliases: ["杀星", "将星"] },
  pojun: { id: "pojun", nameCn: "破军", nameEn: "Po Jun", aliases: ["耗星", "破星"] },
  // 辅星
  zuobi: { id: "zuobi", nameCn: "左辅", nameEn: "Zuo Bi", aliases: ["辅星"] },
  youbi: { id: "youbi", nameCn: "右弼", nameEn: "You Bi", aliases: ["弼星"] },
  wenchang: { id: "wenchang", nameCn: "文昌", nameEn: "Wen Chang", aliases: ["文星", "科星"] },
  wenqu: { id: "wenqu", nameCn: "文曲", nameEn: "Wen Qu", aliases: ["曲星", "才星"] },
  tiankui: { id: "tiankui", nameCn: "天魁", nameEn: "Tian Kui", aliases: ["天乙贵人", "阳贵"] },
  tianyue: { id: "tianyue", nameCn: "天钺", nameEn: "Tian Yue", aliases: ["玉堂贵人", "阴贵"] },
  lucun: { id: "lucun", nameCn: "禄存", nameEn: "Lu Cun", aliases: ["禄星", "福禄"] },
  tianma: { id: "tianma", nameCn: "天马", nameEn: "Tian Ma", aliases: ["驿马", "动星"] },
  // 煞星
  qingyang: { id: "qingyang", nameCn: "擎羊", nameEn: "Qing Yang", aliases: ["阳刃", "刑星"] },
  tuoluo: { id: "tuoluo", nameCn: "陀罗", nameEn: "Tuo Luo", aliases: ["暗刃", "忌星"] },
  huoxing: { id: "huoxing", nameCn: "火星", nameEn: "Huo Xing", aliases: ["火", "暴星"] },
  lingxing: { id: "lingxing", nameCn: "铃星", nameEn: "Ling Xing", aliases: ["铃", "毒星"] },
  dikong: { id: "dikong", nameCn: "地空", nameEn: "Di Kong", aliases: ["空亡", "空星"] },
  dijie: { id: "dijie", nameCn: "地劫", nameEn: "Di Jie", aliases: ["劫星", "破星"] },
  // 杂曜
  hongluan: { id: "hongluan", nameCn: "红鸾", nameEn: "Hong Luan", aliases: ["鸾星"] },
  tianxi: { id: "tianxi", nameCn: "天喜", nameEn: "Tian Xi", aliases: ["喜星"] },
  tianku: { id: "tianku", nameCn: "天哭", nameEn: "Tian Ku", aliases: ["哭星"] },
  tianxu: { id: "tianxu", nameCn: "天虚", nameEn: "Tian Xu", aliases: ["虚星"] },
  longchi: { id: "longchi", nameCn: "龙池", nameEn: "Long Chi", aliases: ["龙星"] },
  fengge: { id: "fengge", nameCn: "凤阁", nameEn: "Feng Ge", aliases: ["凤星"] },
  guchen: { id: "guchen", nameCn: "孤辰", nameEn: "Gu Chen", aliases: ["孤星"] },
  gusu: { id: "gusu", nameCn: "寡宿", nameEn: "Gu Su", aliases: ["寡星"] },
  santai: { id: "santai", nameCn: "三台", nameEn: "San Tai", aliases: ["台星"] },
  bazuo: { id: "bazuo", nameCn: "八座", nameEn: "Ba Zuo", aliases: ["座星"] }
};
function Fe(n) {
  for (const [t, e] of Object.entries(ue))
    if (e.nameCn === n || e.aliases.includes(n))
      return t;
}
const oe = {
  sanhe: {
    name: "San He",
    nameCn: "三合派",
    description: "中州派三合飞星，注重星曜组合与三方四正",
    huaTable: "sanhe",
    specialRules: ["三合飞星", "格局判定优先"]
  },
  feixing: {
    name: "Fei Xing",
    nameCn: "飞星派",
    description: "飞星派四化，注重宫位飞转与四化流转",
    huaTable: "feixing",
    specialRules: ["宫位飞化", "四化串联"]
  },
  sihua: {
    name: "Si Hua",
    nameCn: "四化派",
    description: "钦天四化派，以四化为主导，星曜为辅",
    huaTable: "sihua",
    specialRules: ["四化为纲", "星曜为目", "先后天四化"]
  },
  nishi: {
    name: "Ni Shi",
    nameCn: "倪海厦派",
    description: "倪海厦紫微斗数，偏重临床应用",
    huaTable: "nishi",
    specialRules: ["特殊安星", "临床应用角度"]
  }
};
function Ne(n, t) {
  return T(n);
}
function De(n) {
  var t;
  return ((t = oe[n]) == null ? void 0 : t.nameCn) || "三合派";
}
export {
  re as BRIGHTNESS_TABLE,
  ie as BRIGHTNESS_VALUE,
  Hn as CITY_LOCATIONS,
  b as EARTH_BRANCHES,
  Lt as FEIXING_HUA,
  S as HEAVENLY_STEMS,
  pn as MAIN_STARS,
  ae as MAIN_STAR_IDS,
  Sn as MINOR_STARS,
  ve as MINOR_STAR_IDS,
  At as NISHI_HUA,
  tn as PALACE_NAMES,
  Ct as SANHE_HUA,
  oe as SCHOOL_CONFIGS,
  Ot as SIHUA_HUA,
  Pn as SOLAR_TERMS,
  ue as STAR_NAMES,
  ee as TIANFU_SERIES,
  fn as TWELVE_LONGEVITIES,
  te as ZIWEI_SERIES,
  G as ZIWEI_TABLE,
  Xn as buildPalaces,
  et as calcElementPhase,
  vt as calcGreatLimits,
  Wn as calcMingMaster,
  Rn as calcMingPalace,
  W as calcPalaceStem,
  $n as calcShenMaster,
  Gn as calcShenPalace,
  Vn as calcTianfuPosition,
  Nn as calcTrueSolarTime,
  ne as calcTwelveLongevities,
  Kn as calcZiweiPosition,
  Vt as createChart,
  rn as dayCountToSolar,
  Kt as detectAllPatterns,
  Wt as detectFuXiangChaoYuan,
  Dt as detectJiYueTongLiang,
  Qt as detectJuJiTongLin,
  Jt as detectRiLiZhongTian,
  Gt as detectRiYueBingMing,
  Zt as detectRiYueFanBei,
  Nt as detectShaPoLang,
  Oe as detectXingQiuJiaYin,
  $t as detectXiongSuQianYuan,
  Xt as detectYueLangTianMen,
  Rt as detectZiFuTongGong,
  Ee as findCityLocation,
  Fe as findStarIdByCnName,
  we as get14MainStarsPlacement,
  ze as getAllMainStars,
  qt as getAllMingHua,
  de as getBranchByIndex,
  se as getBranchIndex,
  _e as getBrightnessScore,
  je as getCurrentGreatLimit,
  Be as getDailyHua,
  On as getDayPillar,
  Me as getDecadeHua,
  Le as getFlowDayPalace,
  Ft as getFlowMonthPalace,
  qn as getFourPillars,
  Ht as getGreatLimitAtAge,
  An as getHourPillar,
  T as getHuaByStem,
  ye as getLeapMonth,
  qe as getLongevityByPalace,
  Pe as getMainStar,
  He as getMinorStar,
  he as getMonthDays,
  Ln as getMonthPillar,
  xe as getMonthlyHua,
  Zn as getPalaceBranches,
  be as getPhaseElement,
  at as getPhaseNumber,
  Ne as getSchoolHua,
  De as getSchoolName,
  en as getSolarMonthDays,
  zn as getSolarTermDate,
  Se as getSolarTermMonth,
  pe as getSolarTermNames,
  fe as getSpringFestival,
  C as getSpringFestivalOffset,
  Ye as getStarBrightness,
  Te as getStarHua,
  me as getStemByIndex,
  ge as getStemIndex,
  Dn as getTimeBranchIndex,
  ke as getYearBranch,
  kn as getYearDays,
  Ce as getYearHua,
  _t as getYearPalaceIndex,
  Cn as getYearPillar,
  Yt as getYearStem,
  Ie as getYearlyHua,
  vn as hasPassedSpringStart,
  R as isBeforeSolarTerm,
  zt as isGreatLimitForward,
  Z as isSolarLeapYear,
  Pt as isYearStemYang,
  on as lunarToSolar,
  cn as placeMainStars,
  Ae as quickChart,
  an as solarToDayCount,
  un as solarToLunar
};

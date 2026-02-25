import Mock from "mockjs";

// 模拟获取文章内容
Mock.mock("/api/getHtmlString", "get", {
  code: 200,
  message: "success",
  data: {
    htmlString:
      "小明『考试『学习』刻苦，成绩出类拔粹，高考作文满分也是传颂一时，那时候去他家拜访的人都穿流不息，可毕业后他竟然当了村官，大家都觉得他大才小用，认为他放弃城、？市高薪到农村是得不尝失，没想到小明很快就在村里独挡一面，在村里搞养殖独劈蹊径带大家走上致富路子，不断给村里带来吉详。小明『考试『学习』刻苦，成绩出类拔粹，高考作文满分也是传颂一时，那时候去他家拜访的人都穿流不息，可毕业后他竟然当了村官，大家都觉得他大才小用，认为他放弃城、？市高薪到农村是得不尝失，没想到小明很快就在村里独挡一面，在村里搞养殖独劈蹊径带大家走上致富路子，不断给村里带来吉详。",
  },
});

// 模拟获取敏感词
Mock.mock("/api/getSensitive", "get", {
  code: 200,
  message: "success",
  data: ["小明", "弃城", "传颂", "富路"],
});

// 模拟文字校对
Mock.mock("/api/checkText", "post", {
  code: 200,
  message: "success",
  data: [
    {
      errtype: 13,
      errword: "『",
      pos: 25,
      level: 1,
      corword: ["标点符号『缺少成对"],
    },
    {
      errtype: 1,
      errword: "出类拔粹",
      pos: 37,
      level: 1,
      corword: ["出类拔萃"],
    },
    {
      errtype: 1,
      errword: "穿流不息",
      pos: 66,
      level: 1,
      corword: ["川流不息"],
    },
    {
      errtype: 1,
      errword: "村官",
      pos: 80,
      level: 3,
      corword: ["“村官”"],
    },
    {
      errtype: 13,
      errword: "、？",
      pos: 100,
      level: 1,
      corword: ["相邻标点、和？不匹配"],
    },
    {
      errtype: 1,
      errword: "得不尝失",
      pos: 109,
      level: 1,
      corword: ["得不偿失"],
    },
    {
      errtype: 1,
      errword: "独挡一面",
      pos: 125,
      level: 1,
      corword: ["独当一面"],
    },
    {
      errtype: 1,
      errword: "独劈蹊径",
      pos: 136,
      level: 1,
      corword: ["独辟蹊径"],
    },
    {
      errtype: 1,
      errword: "吉详",
      pos: 157,
      level: 1,
      corword: ["吉祥"],
    },
    {
      errtype: 13,
      errword: "『",
      pos: 162,
      level: 1,
      corword: ["标点符号『缺少成对"],
    },
    {
      errtype: 1,
      errword: "出类拔粹",
      pos: 174,
      level: 1,
      corword: ["出类拔萃"],
    },
    {
      errtype: 1,
      errword: "穿流不息",
      pos: 203,
      level: 1,
      corword: ["川流不息"],
    },
    {
      errtype: 1,
      errword: "村官",
      pos: 217,
      level: 3,
      corword: ["“村官”"],
    },
    {
      errtype: 13,
      errword: "、？",
      pos: 237,
      level: 1,
      corword: ["相邻标点、和？不匹配"],
    },
    {
      errtype: 1,
      errword: "得不尝失",
      pos: 246,
      level: 1,
      corword: ["得不偿失"],
    },
    {
      errtype: 1,
      errword: "独挡一面",
      pos: 262,
      level: 1,
      corword: ["独当一面"],
    },
    {
      errtype: 1,
      errword: "独劈蹊径",
      pos: 273,
      level: 1,
      corword: ["独辟蹊径"],
    },
    {
      errtype: 1,
      errword: "吉详",
      pos: 294,
      level: 1,
      corword: ["吉祥"],
    },
  ],
});

export default Mock;

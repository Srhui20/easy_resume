import { v4 as uuidv4 } from "uuid";

const resumeStyle1 = [
  {
    page: 1,
    pageAttributes: [
      {
        className: "absolute",
        id: uuidv4(),
        pageLabel: "张三",
        style: { fontSize: "34px", left: "40px", top: "40px" },
      },
      {
        className: "absolute",
        id: uuidv4(),
        pageLabel: "电话: 13333333333",
        style: { fontSize: "16px", left: "40px", top: "120px" },
      },
      {
        className: "absolute",
        id: uuidv4(),
        pageLabel: "年龄: 28岁",
        style: { fontSize: "16px", left: "300px", top: "120px" },
      },
      {
        className: "absolute",
        id: uuidv4(),
        pageLabel: "性别: 男",
        style: { fontSize: "16px", left: "500px", top: "120px" },
      },
      {
        className: "absolute",
        id: uuidv4(),
        pageLabel: "邮箱: 13333333333@qq.com",
        style: { fontSize: "16px", left: "40px", top: "150px" },
      },
      {
        className: "absolute",
        id: uuidv4(),
        pageLabel: "地址: 某某省某某市",
        style: { fontSize: "16px", left: "300px", top: "150px" },
      },
      {
        className: "absolute",
        id: uuidv4(),
        pageLabel: "工作经验: 3年",
        style: { fontSize: "16px", left: "500px", top: "150px" },
      },
    ],
  },
  {
    page: 2,
    pageAttributes: [],
  },
];

export default resumeStyle1;

import { v4 as uuidv4 } from "uuid";
import type { RESUME_TYPE } from "@/types/resume";

const resumeStyle1: RESUME_TYPE[] = [
  {
    page: 1,
    pageAttributes: [
      {
        className: "absolute",
        id: uuidv4(),
        pageLabel: "张三",
        style: { fontSize: "34px", left: "40px", top: "40px" },
        type: "baseInfo",
      },
      {
        className: "absolute",
        id: uuidv4(),
        pageLabel: "电话: 13333333333",
        style: { fontSize: "16px", left: "40px", top: "120px" },
        type: "baseInfo",
      },
      {
        className: "absolute",
        id: uuidv4(),
        pageLabel: "年龄: 28岁",
        style: { fontSize: "16px", left: "300px", top: "120px" },
        type: "baseInfo",
      },
      {
        className: "absolute",
        id: uuidv4(),
        pageLabel: "性别: 男",
        style: { fontSize: "16px", left: "500px", top: "120px" },
        type: "baseInfo",
      },
      {
        className: "absolute",
        id: uuidv4(),
        pageLabel: "邮箱: 13333333333@qq.com",
        style: { fontSize: "16px", left: "40px", top: "150px" },
        type: "baseInfo",
      },
      {
        className: "absolute",
        id: uuidv4(),
        pageLabel: "地址: 某某省某某市",
        style: { fontSize: "16px", left: "300px", top: "150px" },
        type: "baseInfo",
      },
      {
        className: "absolute",
        id: uuidv4(),
        pageLabel: "工作经验: 3年",
        style: { fontSize: "16px", left: "500px", top: "150px" },
        type: "baseInfo",
      },
      {
        className: "absolute",
        id: uuidv4(),
        pageLabel:
          "为了统一多个上层业务的交易链路，可以更高效的做到对交易链路的资损防控及异常的统一处理，搭建了订单领域服务，包括但不限于订单创建、订单预支付、标记支付、订单的交付、订单的履约等功能。商品领域服务的搭建，包括但不限于商品的创建、审核、上下架等功能。以及营销服务的搭建，包括但不限于优惠券、优惠码、限时折扣、订单满减等功能。",
        style: { fontSize: "16px", left: "40px", top: "200px" },
        title: "技术栈",
        type: "paragraph",
      },
    ],
  },
];

export default resumeStyle1;

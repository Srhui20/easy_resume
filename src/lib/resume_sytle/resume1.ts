import { v4 as uuidv4 } from "uuid";
import type { PAGE_ATTRIBUTE } from "@/types/resume";

const resumeStyle1: PAGE_ATTRIBUTE[] = [
  {
    className: "absolute",
    id: uuidv4(),
    pageLabel: "张三",
    style: {
      fontSize: "34px",
      fontWeight: "bold",
      left: "0px",
      top: "0px",
    },
    type: "baseInfo",
  },
  {
    className: "absolute",
    id: uuidv4(),
    pageLabel: "电话: 13333333333",
    style: { fontSize: "16px", left: "0px", top: "80px" },
    type: "baseInfo",
  },
  {
    className: "absolute",
    id: uuidv4(),
    pageLabel: "年龄: 28岁",
    style: { fontSize: "16px", left: "300px", top: "80px" },
    type: "baseInfo",
  },
  {
    className: "absolute",
    id: uuidv4(),
    pageLabel: "性别: 男",
    style: { fontSize: "16px", left: "600px", top: "80px" },
    type: "baseInfo",
  },
  {
    className: "absolute",
    id: uuidv4(),
    pageLabel: "邮箱: 13333333333@qq.com",
    style: { fontSize: "16px", left: "0px", top: "110px" },
    type: "baseInfo",
  },
  {
    className: "absolute",
    id: uuidv4(),
    pageLabel: "地址: 某某省某某市",
    style: { fontSize: "16px", left: "300px", top: "110px" },
    type: "baseInfo",
  },
  {
    className: "absolute",
    id: uuidv4(),
    pageLabel: "工作经验: 3年",
    style: { fontSize: "16px", left: "600px", top: "110px" },
    type: "baseInfo",
  },
  {
    borderStyle: {
      borderBottomColor: "pink",
      borderBottomStyle: "solid",
      borderBottomWidth: "1px",
    },
    className: "absolute",
    id: uuidv4(),
    paragraphArr: [
      {
        endTime: null,
        id: uuidv4(),
        label:
          '<ul><ul><ul><li><span style="font-size: 16px;">熟练掌握html5、JavaScript、css3、vue、angularjs等前端技术</span></li><li><span style="font-size: 16px;">熟练掌握nodejs、nginx、ajax、Bootstrap等技术</span></li><li style="color:rgb(50, 50, 51)"><span style="color: rgb(50, 50, 51); background-color: rgb(255, 255, 255); font-size: 16px; font-family: &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, Tahoma, Arial, sans-serif;">熟练掌握HTML5各种新特性, 能够实现基本绘图，地理定位，SVG绘图</span></li><li style="color:rgb(50, 50, 51)"><span style="color: rgb(50, 50, 51); background-color: rgb(255, 255, 255); font-size: 16px; font-family: &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, Tahoma, Arial, sans-serif;">熟练掌握各种js函数库和框架: 包括jQuery, Ajax, boot,,能够使用jQuery简化DOM操作</span></li><li style="color:rgb(50, 50, 51)"><span style="color: rgb(50, 50, 51); background-color: rgb(255, 255, 255); font-size: 16px; font-family: &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, Tahoma, Arial, sans-serif;">熟悉PHP,Mysql,HTTP协议，能够使用PHP和Mysql实现服务器端功能，访问数据库。</span></li><li style="color:rgb(50, 50, 51)"><span style="color: rgb(50, 50, 51); background-color: rgb(255, 255, 255); font-size: 16px; font-family: &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, Tahoma, Arial, sans-serif;">精通JS，DOM，BOM等原生js代码，能够使用原生代码开发页面功能。</span></li></ul></ul></ul>',
        name: "",
        position: "",
        startTime: "",
        style: { fontSize: "16px" },
      },
    ],
    style: {
      fontSize: "16px",
      left: "0px",
      top: "160px",
    },
    titleInfo: {
      label: "技术栈",
      style: { backgroundColor: "pink", fontSize: "16px", fontWeight: "bold" },
    },
    type: "paragraph",
  },
  {
    borderStyle: {
      borderBottomColor: "pink",
      borderBottomStyle: "solid",
      borderBottomWidth: "1px",
    },
    className: "absolute ",
    id: uuidv4(),
    paragraphArr: [
      {
        endTime: "",
        id: uuidv4(),
        label:
          '<p><strong>主要功能</strong>：</p><p style="text-indent: 2em;">为了统一多个上层业务的交易链路，可以更高效的做到对交易链路的资损防控及异常的统一处理，搭建了订单领域服务，包括但不限于订单创建、订单预支付、标记支付、订单的交付、订单的履约等功能。商品领域服务的搭建，包括但不限于商品的创建、审核、上下架等功能。以及营销服务的搭建，包括但不限于优惠券、优惠码、限时折扣、订单满减等功能。</p><p><strong>模型设计</strong>：</p><p style="text-indent: 2em;">对订单模型进行了领域化建模，抽象了订单基础信息、订单支付、订单商品、订单商品的履约、订单权益、以及订单佣金等领域模型的设计。对不同的订单类型领域服务做了策略模式的设计，减小了业务变更的影响且大大提高了不同类型的订单接入服务的效率。</p>',
        name: "XXX后台管理系统",
        position: "前端开发工程师",
        startTime: "2025-12-08",
        style: {
          fontSize: "16px",
        },
      },
      {
        endTime: "",
        id: uuidv4(),
        label:
          '<p><strong>主要功能</strong>：</p><p style="text-indent: 2em;">为了统一多个上层业务的交易链路，可以更高效的做到对交易链路的资损防控及异常的统一处理，搭建了订单领域服务，包括但不限于订单创建、订单预支付、标记支付、订单的交付、订单的履约等功能。商品领域服务的搭建，包括但不限于商品的创建、审核、上下架等功能。以及营销服务的搭建，包括但不限于优惠券、优惠码、限时折扣、订单满减等功能。</p><p><strong>模型设计</strong>：</p><p style="text-indent: 2em;">对订单模型进行了领域化建模，抽象了订单基础信息、订单支付、订单商品、订单商品的履约、订单权益、以及订单佣金等领域模型的设计。对不同的订单类型领域服务做了策略模式的设计，减小了业务变更的影响且大大提高了不同类型的订单接入服务的效率。</p>',
        name: "XXX后台管理系统",
        position: "前端开发工程师",
        startTime: "2025-12-08",
        style: {
          fontSize: "16px",
        },
      },
    ],
    ref: null,
    style: {
      fontSize: "16px",
      left: "0px",
      top: "367px",
      zIndex: 99,
    },
    titleInfo: {
      label: "项目经验",
      style: {
        backgroundColor: "pink",
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    type: "paragraph",
  },
  {
    borderStyle: {
      borderBottomColor: "pink",
      borderBottomStyle: "solid",
      borderBottomWidth: "1px",
    },
    className: "absolute",
    id: uuidv4(),
    paragraphArr: [
      {
        endTime: "",
        id: uuidv4(),
        label:
          '<p><strong>主要功能</strong>：</p><p style="text-indent: 2em;">为了统一多个上层业务的交易链路，可以更高效的做到对交易链路的资损防控及异常的统一处理，搭建了订单领域服务，包括但不限于订单创建、订单预支付、标记支付、订单的交付、订单的履约等功能。商品领域服务的搭建，包括但不限于商品的创建、审核、上下架等功能。以及营销服务的搭建，包括但不限于优惠券、优惠码、限时折扣、订单满减等功能。</p><p><strong>模型设计</strong>：</p><p style="text-indent: 2em;">对订单模型进行了领域化建模，抽象了订单基础信息、订单支付、订单商品、订单商品的履约、订单权益、以及订单佣金等领域模型的设计。对不同的订单类型领域服务做了策略模式的设计，减小了业务变更的影响且大大提高了不同类型的订单接入服务的效率。</p>',
        name: "家里蹲科技有限公司",
        position: "前端开发工程师",
        startTime: "2025-12-08",
        style: {
          fontSize: "16px",
        },
      },
      {
        endTime: "2025-12-08",
        id: uuidv4(),
        label:
          '<p><strong>主要功能</strong>：</p><p style="text-indent: 2em;">为了统一多个上层业务的交易链路，可以更高效的做到对交易链路的资损防控及异常的统一处理，搭建了订单领域服务，包括但不限于订单创建、订单预支付、标记支付、订单的交付、订单的履约等功能。商品领域服务的搭建，包括但不限于商品的创建、审核、上下架等功能。以及营销服务的搭建，包括但不限于优惠券、优惠码、限时折扣、订单满减等功能。</p><p><strong>模型设计</strong>：</p><p style="text-indent: 2em;">对订单模型进行了领域化建模，抽象了订单基础信息、订单支付、订单商品、订单商品的履约、订单权益、以及订单佣金等领域模型的设计。对不同的订单类型领域服务做了策略模式的设计，减小了业务变更的影响且大大提高了不同类型的订单接入服务的效率。</p>',
        name: "家里蹲科技有限公司",
        position: "前端开发工程师",
        startTime: "2025-12-08",
        style: {
          fontSize: "16px",
        },
      },
    ],
    ref: null,
    style: {
      fontSize: "16px",
      left: "0px",
      top: "940px",
      zIndex: 99,
    },
    titleInfo: {
      label: "工作经验",
      style: {
        backgroundColor: "pink",
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    type: "paragraph",
  },
];

export default resumeStyle1;

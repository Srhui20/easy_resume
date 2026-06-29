import { Button, Carousel, Modal, message } from "antd";
import Image from "next/image";
import { useRef } from "react";
import Image1 from "@/assets/theme/image1.png";
import Image2 from "@/assets/theme/image2.png";
import Image3 from "@/assets/theme/image3.png";
import style1 from "@/lib/resume_sytle/style1";
import style2 from "@/lib/resume_sytle/style2";
import style3 from "@/lib/resume_sytle/style3";
import { usePublicStore } from "@/lib/store/public";
import { useUndoStore } from "@/lib/store/undo";
import type { PAGE_ATTRIBUTE } from "@/types/resume";

interface ThemeProps {
  dialogOpen: boolean;
  onCancel: () => void;
}

export function ChooseTheme({ dialogOpen, onCancel }: ThemeProps) {
  const resumeData = usePublicStore((state) => state.resumeData);
  const setResumeData = usePublicStore((state) => state.setResumeData);
  const setUndoList = useUndoStore((state) => state.setUndoList);

  const themeList = [
    { img: Image1, key: "1", style: style1 },
    { img: Image2, key: "2", style: style2 },
    { img: Image3, key: "3", style: style3 },
  ];

  const themeIndex = useRef(0);

  const getIndex = (index: number) => {
    themeIndex.current = index;
  };

  const changeTheme = () => {
    localStorage.setItem("themeIndex", `${themeIndex.current}`);
    const theme = themeList[themeIndex.current];
    const style = theme.style();

    let arr: PAGE_ATTRIBUTE[] = [...resumeData];
    arr = arr?.map((item) => {
      if (item.type === "baseInfo") return item;
      return {
        ...item,
        borderStyle: style.borderStyle,
        titleInfo: {
          label: item.titleInfo?.label || "",
          style: style.titleInfo.style,
        },
      };
    });

    setUndoList(resumeData);
    setResumeData(arr);
    message.success("简历样式已更新");
    onCancel();
  };
  const footer: React.ReactNode = (
    <>
      <Button onClick={onCancel}>关闭</Button>
      <Button onClick={() => changeTheme()} type="primary">
        确定
      </Button>
    </>
  );
  return (
    <Modal
      centered={true}
      destroyOnHidden={true}
      footer={footer}
      keyboard={false}
      onCancel={onCancel}
      open={dialogOpen}
      title="简历样式"
      width={700}
    >
      <div className="h-[220px] rounded-md border border-[var(--app-border)] bg-[var(--app-panelAlt)] p-3">
        <Carousel
          afterChange={getIndex}
          arrows
          draggable={true}
          infinite={true}
          style={{ height: "196px" }}
        >
          {themeList.map((item) => (
            <div className="flex justify-center" key={item.key}>
              <Image
                alt={`简历模板示例-${item.key}`}
                src={item.img}
                style={{ height: "196px", margin: "0 auto", width: "auto" }}
              />
            </div>
          ))}
        </Carousel>
      </div>
    </Modal>
  );
}

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DrillSettings from "./DrillSettings";
import type { Mode } from "@/lib/drill";
import React from "react";

jest.mock("@/contexts/FuriganaContext", () => ({
  useFurigana: () => ({ furigana: false, setFurigana: () => {} }),
}));

jest.mock("@/components/common/Ruby", () => ({
  __esModule: true,
  default: ({
    children,
  }: {
    children: React.ReactNode;
    reading: string;
  }) => <>{children}</>,
}));

jest.mock("@chakra-ui/react", () => ({
  Box: ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => <div {...props}>{children}</div>,
  VStack: ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => <div {...props}>{children}</div>,
  HStack: ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => <div {...props}>{children}</div>,
  Text: ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => <span {...props}>{children}</span>,
  Flex: ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => <div {...props}>{children}</div>,
  Input: ({
    type,
    name,
    value,
    checked,
    onChange,
    hidden,
  }: {
    type?: string;
    name?: string;
    value?: string;
    checked?: boolean;
    onChange?: () => void;
    hidden?: boolean;
  }) => (
    <input
      type={type || "text"}
      name={name}
      value={value || ""}
      checked={checked}
      onChange={onChange}
      hidden={hidden}
    />
  ),
  Collapsible: {
    Root: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Trigger: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Content: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  },
}));

const defaultMode: Mode = {
  role: "roster",
  playerNum: 2,
  operators: ["+"],
};

describe("DrillSettings", () => {
  it("設定ラベルが表示される", () => {
    render(<DrillSettings mode={defaultMode} onModeChange={() => {}} />);
    expect(screen.getByText("設定")).toBeInTheDocument();
    expect(screen.getByText("対象選手")).toBeInTheDocument();
    expect(screen.getByText("難易度")).toBeInTheDocument();
  });

  it("対象選手の選択肢が表示される", () => {
    render(<DrillSettings mode={defaultMode} onModeChange={() => {}} />);
    expect(screen.getByText("支配下選手のみ")).toBeInTheDocument();
    expect(screen.getByText("すべて")).toBeInTheDocument();
  });

  it("難易度の選択肢が表示される", () => {
    render(<DrillSettings mode={defaultMode} onModeChange={() => {}} />);
    expect(screen.getByText("Easy")).toBeInTheDocument();
    expect(screen.getByText("Normal")).toBeInTheDocument();
    expect(screen.getByText("Hard")).toBeInTheDocument();
  });

  it("演算子の選択肢が表示される", () => {
    render(<DrillSettings mode={defaultMode} onModeChange={() => {}} />);
    expect(screen.getByText(/足し算/)).toBeInTheDocument();
    expect(screen.getByText(/引き算/)).toBeInTheDocument();
    expect(screen.getByText(/掛け算/)).toBeInTheDocument();
    expect(screen.getByText(/割り算/)).toBeInTheDocument();
  });

  it("演算子のトグルで onModeChange が呼ばれる", () => {
    const onModeChange = jest.fn();
    render(<DrillSettings mode={defaultMode} onModeChange={onModeChange} />);

    // 引き算の checkbox input をクリック
    const checkboxes = screen.getAllByRole("checkbox", { hidden: true });
    const subCheckbox = checkboxes.find(
      (el) => (el as HTMLInputElement).value === "-",
    )!;
    fireEvent.click(subCheckbox);
    expect(onModeChange).toHaveBeenCalledWith({
      ...defaultMode,
      operators: ["+", "-"],
    });
  });

  it("最後の演算子を外そうとすると + にフォールバックする", () => {
    const onModeChange = jest.fn();
    render(<DrillSettings mode={defaultMode} onModeChange={onModeChange} />);

    // 足し算（唯一の演算子）の checkbox input をクリック
    const checkboxes = screen.getAllByRole("checkbox", { hidden: true });
    const addCheckbox = checkboxes.find(
      (el) => (el as HTMLInputElement).value === "+",
    )!;
    fireEvent.click(addCheckbox);
    expect(onModeChange).toHaveBeenCalledWith({
      ...defaultMode,
      operators: ["+"],
    });
  });
});

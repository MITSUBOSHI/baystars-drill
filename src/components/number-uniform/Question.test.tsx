import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Question from "./Question";
import { PlayerType, Role } from "@/types/Player";
import React from "react";

// Mock Chakra UI components
jest.mock("@chakra-ui/react", () => ({
  Box: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <div {...props}>{children}</div>,
  VStack: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <div {...props}>{children}</div>,
  HStack: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <div {...props}>{children}</div>,
  Text: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <span {...props}>{children}</span>,
  Container: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <div {...props}>{children}</div>,
  Flex: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <div {...props}>{children}</div>,
  Badge: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <span {...props}>{children}</span>,
  Heading: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <h2 {...props}>{children}</h2>,
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
  Button: ({
    children,
    onClick,
    disabled,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    [key: string]: unknown;
  }) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
  Input: ({
    type,
    name,
    value,
    checked,
    onChange,
    hidden,
    ...props
  }: {
    type?: string;
    name?: string;
    value?: string;
    checked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    hidden?: boolean;
    [key: string]: unknown;
  }) => (
    <input
      type={type || "text"}
      role="button"
      name={name}
      value={value || ""}
      checked={checked}
      onChange={onChange}
      hidden={hidden}
      {...props}
    />
  ),
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

jest.mock("@/contexts/FuriganaContext", () => ({
  useFurigana: () => ({ furigana: false, setFurigana: () => {} }),
}));

jest.mock("@/components/ui/number-input", () => ({
  NumberInputRoot: ({
    children,
    value,
    onValueChange,
  }: {
    children: React.ReactNode;
    value?: string;
    onValueChange?: (details: { value: string; valueAsNumber: number }) => void;
  }) => (
    <div>
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement<{
            value?: string;
            onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
          }>(child)
        ) {
          return React.cloneElement(child, {
            value,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              onValueChange?.({
                value: e.target.value,
                valueAsNumber: Number(e.target.value),
              });
            },
          });
        }
        return child;
      })}
    </div>
  ),
  NumberInputField: ({
    disabled,
    placeholder,
    value,
    onChange,
  }: {
    disabled?: boolean;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      disabled={disabled}
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
      data-testid="number-input"
    />
  ),
}));

const mockPlayers: PlayerType[] = [
  {
    name: "佐野 恵太",
    name_kana: "さの けいた",
    uniform_name: "SANO",
    number_disp: "7",
    number_calc: 7,
    role: Role.Roster,
    year: 2026,
    url: "https://dummy/sano",
    date_of_birth: "1994-11-28",
    height_cm: 178,
    weight_kg: 88,
  },
  {
    name: "牧 秀悟",
    name_kana: "まき しゅうご",
    uniform_name: "MAKI",
    number_disp: "2",
    number_calc: 2,
    role: Role.Roster,
    year: 2026,
    url: "https://dummy/maki",
    date_of_birth: "1998-04-21",
    height_cm: 178,
    weight_kg: 97,
  },
  {
    name: "山本 祐大",
    name_kana: "やまもと ゆうだい",
    uniform_name: "YAMAMOTO",
    number_disp: "50",
    number_calc: 50,
    role: Role.Roster,
    year: 2026,
    url: "https://dummy/yamamoto",
    date_of_birth: "1998-09-11",
    height_cm: 180,
    weight_kg: 87,
  },
  {
    name: "宮﨑 敏郎",
    name_kana: "みやざき としろう",
    uniform_name: "MIYAZAKI",
    number_disp: "51",
    number_calc: 51,
    role: Role.Roster,
    year: 2026,
    url: "https://dummy/miyazaki",
    date_of_birth: "1988-12-12",
    height_cm: 172,
    weight_kg: 85,
  },
];

describe("Question Component", () => {
  beforeEach(() => {
    // Reset mock players before each test
    mockPlayers.forEach((player) => {
      player.name_kana = player.name_kana.replace(/\s+/g, " ").trim();
    });
  });

  it("renders initial state correctly", () => {
    render(<Question players={mockPlayers} />);

    // Check if settings are displayed
    expect(screen.getByText("対象選手")).toBeInTheDocument();
    expect(screen.getByText("難易度")).toBeInTheDocument();

    // Check if radio buttons are present
    expect(screen.getByText("支配下選手のみ")).toBeInTheDocument();
    expect(screen.getByText("すべて")).toBeInTheDocument();
    expect(screen.getByText("Easy")).toBeInTheDocument();
    expect(screen.getByText("Normal")).toBeInTheDocument();
    expect(screen.getByText("Hard")).toBeInTheDocument();

    // Check if operator checkboxes are present
    expect(screen.getByText(/足し算/)).toBeInTheDocument();
    expect(screen.getByText(/引き算/)).toBeInTheDocument();
    expect(screen.getByText(/掛け算/)).toBeInTheDocument();
    expect(screen.getByText(/割り算/)).toBeInTheDocument();

    // Check if buttons are present
    expect(screen.getByText("解答する")).toBeInTheDocument();
    expect(screen.getByText("再挑戦")).toBeInTheDocument();
  });

  it("allows user to input answer", () => {
    render(<Question players={mockPlayers} />);
    const input = screen.getByTestId("number-input");
    fireEvent.change(input, { target: { value: "42" } });
    expect(input).toHaveValue("42");
  });

  it("shows result when answer is submitted", () => {
    render(<Question players={mockPlayers} />);

    const input = screen.getByTestId("number-input");
    const submitButton = screen.getByText("解答する");

    fireEvent.change(input, { target: { value: "42" } });
    fireEvent.click(submitButton);

    // Result box should be visible
    const resultText = screen.getByText("😢 不正解...");
    expect(resultText).toBeInTheDocument();
  });

  describe("when answer the question", () => {
    it("should show correct result when answer is correct", () => {
      const mockPlayers: PlayerType[] = [
        {
          name: "佐野 恵太",
          name_kana: "さのけいた",
          uniform_name: "SANO",
          number_disp: "7",
          number_calc: 7,
          role: Role.Roster,
          year: 2026,
          url: "https://dummy/",
          date_of_birth: "1994-11-28",
          height_cm: 178,
          weight_kg: 88,
        },
        {
          name: "牧 秀悟",
          name_kana: "まきしゅうご",
          uniform_name: "MAKI",
          number_disp: "2",
          number_calc: 2,
          role: Role.Roster,
          year: 2026,
          url: "https://dummy/",
          date_of_birth: "1998-04-21",
          height_cm: 178,
          weight_kg: 97,
        },
      ];
      render(<Question players={mockPlayers} />);

      const input = screen.getByTestId("number-input");
      fireEvent.change(input, { target: { value: String(9) } });
      const submitButton = screen.getByText("解答する");
      fireEvent.click(submitButton);

      // Result box should show correct message
      const resultText = screen.getByText("🎉 正解！");
      expect(resultText).toBeInTheDocument();

      // NOTE: 内訳の選手の順番は制御していないため省略する
      const explanation = screen.getByText(new RegExp(/9 = /));
      expect(explanation).toBeInTheDocument();
    });

    it("should show incorrect result when answer is incorrect", () => {
      const mockPlayers: PlayerType[] = [
        {
          name: "佐野 恵太",
          name_kana: "さのけいた",
          uniform_name: "SANO",
          number_disp: "7",
          number_calc: 7,
          role: Role.Roster,
          year: 2026,
          url: "https://dummy/",
          date_of_birth: "1994-11-28",
          height_cm: 178,
          weight_kg: 88,
        },
        {
          name: "牧 秀悟",
          name_kana: "まきしゅうご",
          uniform_name: "MAKI",
          number_disp: "2",
          number_calc: 2,
          role: Role.Roster,
          year: 2026,
          url: "https://dummy/",
          date_of_birth: "1998-04-21",
          height_cm: 178,
          weight_kg: 97,
        },
      ];
      render(<Question players={mockPlayers} />);

      const input = screen.getByTestId("number-input");
      fireEvent.change(input, { target: { value: String(10) } });
      const submitButton = screen.getByText("解答する");
      fireEvent.click(submitButton);

      // Result box should show incorrect message
      const resultText = screen.getByText("😢 不正解...");
      expect(resultText).toBeInTheDocument();

      // NOTE: 内訳の選手の順番は制御していないため省略する
      const explanation = screen.getByText(new RegExp(/9 = /));
      expect(explanation).toBeInTheDocument();
    });
  });

  it("should reset the game when retry button is clicked", () => {
    render(<Question players={mockPlayers} />);

    const input = screen.getByTestId("number-input");
    const submitButton = screen.getByText("解答する");
    const retryButton = screen.getByText("再挑戦");

    fireEvent.change(input, { target: { value: "999" } });
    fireEvent.click(submitButton);

    expect(input).toHaveValue("999");
    expect(input).toBeDisabled();
    const resultBox = screen.queryByText("😢 不正解...");
    expect(resultBox).toBeInTheDocument();

    fireEvent.click(retryButton);

    expect(input).toHaveValue("");
    expect(input).not.toBeDisabled();
    expect(resultBox).not.toBeInTheDocument();
  });

  describe("when using arithmetic operators", () => {
    const mockPlayers: PlayerType[] = [
      {
        name: "佐野 恵太",
        name_kana: "さの けいた",
        uniform_name: "SANO",
        number_disp: "7",
        number_calc: 7,
        role: Role.Roster,
        year: 2026,
        url: "https://dummy/",
        date_of_birth: "1994-11-28",
        height_cm: 178,
        weight_kg: 88,
      },
      {
        name: "牧 秀悟",
        name_kana: "まき しゅうご",
        uniform_name: "MAKI",
        number_disp: "2",
        number_calc: 2,
        role: Role.Roster,
        year: 2026,
        url: "https://dummy/",
        date_of_birth: "1998-04-21",
        height_cm: 178,
        weight_kg: 97,
      },
    ];

    it("should handle addition correctly", () => {
      render(<Question players={mockPlayers} />);
      const input = screen.getByTestId("number-input");
      fireEvent.change(input, { target: { value: "9" } });
      const submitButton = screen.getByText("解答する");
      fireEvent.click(submitButton);

      const explanation = screen.getByText(/[0-9]+ = /);
      expect(explanation).toBeInTheDocument();
      expect(explanation.textContent).toMatch(/[＋]/);
    });

    it("should handle multiplication correctly", () => {
      render(<Question players={mockPlayers} />);

      // 掛け算のチェックボックスをクリックして有効化
      const multCheckboxLabel = screen.getByText(/掛け算/);
      fireEvent.click(multCheckboxLabel);

      const retryButton = screen.getByText("再挑戦");
      fireEvent.click(retryButton);

      // 掛け算を使用した問題が表示されていることを確認
      expect(screen.getByText(/×/)).toBeInTheDocument();
    });

    it("should handle division correctly", () => {
      render(<Question players={mockPlayers} />);

      // 割り算のチェックボックスをクリックして有効化
      const divCheckboxLabel = screen.getByText(/割り算/);
      fireEvent.click(divCheckboxLabel);

      const retryButton = screen.getByText("再挑戦");
      fireEvent.click(retryButton);

      // 割り算を使用した問題が表示されていることを確認
      expect(screen.getByText(/÷/)).toBeInTheDocument();
    });

    it("should handle subtraction correctly", () => {
      render(<Question players={mockPlayers} />);

      // 引き算のチェックボックスをクリックして有効化
      const subCheckboxLabel = screen.getByText(/引き算/);
      fireEvent.click(subCheckboxLabel);

      const retryButton = screen.getByText("再挑戦");
      fireEvent.click(retryButton);

      // 引き算を使用した問題が表示されていることを確認
      expect(screen.getByText(/－/)).toBeInTheDocument();
    });

    it("should maintain selected operators after retry", () => {
      render(<Question players={mockPlayers} />);

      // Enable multiplication and division
      const multiplyCheckbox = screen.getByText(/掛け算/)
        .previousSibling as HTMLInputElement;
      const divideCheckbox = screen.getByText(/割り算/)
        .previousSibling as HTMLInputElement;
      fireEvent.click(multiplyCheckbox);
      fireEvent.click(divideCheckbox);

      const retryButton = screen.getByText("再挑戦");
      fireEvent.click(retryButton);

      // Check if operators are still enabled by looking for their labels
      expect(screen.getByText(/掛け算/)).toBeInTheDocument();
      expect(screen.getByText(/割り算/)).toBeInTheDocument();
    });
  });

});

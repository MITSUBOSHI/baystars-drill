import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Question from "./Question";
import { PlayerType, Role } from "@/types/Player";
import React from "react";

// Mock Chakra UI components
jest.mock("@chakra-ui/react", () => ({
  Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  VStack: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  HStack: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Text: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  Container: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Flex: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  Heading: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  Radio: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => {
    return (
      <div>
        <input
          type="radio"
          role="radio"
          name="radio-group"
          value={value}
          id={`radio-${value}`}
        />
        <label htmlFor={`radio-${value}`}>{children}</label>
      </div>
    );
  },
  RadioGroup: ({
    children,
    value,
    onValueChange,
  }: {
    children: React.ReactNode;
    value?: string;
    onValueChange?: (e: { value: string }) => void;
  }) => (
    <div
      role="radiogroup"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onValueChange?.({ value: e.target.value })
      }
    >
      {children}
    </div>
  ),
}));

jest.mock("@/components/ui/radio", () => ({
  Radio: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => (
    <div>
      <input
        type="radio"
        role="radio"
        name="radio-group"
        value={value}
        aria-label={children?.toString()}
      />
      <label>{children}</label>
    </div>
  ),
  RadioGroup: ({
    children,
    value,
    onValueChange,
  }: {
    children: React.ReactNode;
    value: string;
    onValueChange: (e: { value: string }) => void;
  }) => (
    <div
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onValueChange({ value: e.target.value })
      }
    >
      {children}
    </div>
  ),
}));
// jest.mock("@/components/ui/radio", () => ({
//   Radio: ({
//     children,
//     value,
//   }: {
//     children: React.ReactNode;
//     value: string;
//   }) => {
//     const id = `radio-${value}`;
//     // const label = typeof children === "string" ? children : value;
//     return (
//       <div>
//         <input
//           type="radio"
//           role="radio"
//           name="radio-group"
//           value={value}
//           id={id}
//           aria-label={children?.toString()}
//         />
//         <label htmlFor={id}>{children}</label>
//       </div>
//     );
//   },
//   RadioGroup: ({
//     children,
//     value,
//     onValueChange,
//   }: {
//     children: React.ReactNode;
//     value?: string;
//     onValueChange?: (value: string) => void;
//   }) => (
//     <div role="radiogroup">
//       <div>
//         {React.Children.map(children, (child) => {
//           if (
//             React.isValidElement<{
//               value: string;
//               onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//               checked?: boolean;
//             }>(child)
//           ) {
//             return React.cloneElement(child, {
//               checked: child.props.value === value,
//               onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
//                 onValueChange?.(e.target.value),
//             });
//           }
//           return child;
//         })}
//       </div>
//     </div>
//   ),
// }));

jest.mock("@/components/ui/number-input", () => ({
  NumberInputRoot: ({
    children,
    value,
    onChange,
  }: {
    children: React.ReactNode;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <div>
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement<{
            value?: string;
            onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
          }>(child)
        ) {
          return React.cloneElement(child, { value, onChange });
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
    number_disp: "2",
    number_calc: 2,
    role: Role.Roster,
    year: 2025,
    url: "https://dummy/sano",
  },
  {
    name: "牧 秀悟",
    name_kana: "まき しゅうご",
    number_disp: "1",
    number_calc: 1,
    role: Role.Roster,
    year: 2025,
    url: "https://dummy/maki",
  },
  {
    name: "山本 祐大",
    name_kana: "やまもと ゆうだい",
    number_disp: "50",
    number_calc: 50,
    role: Role.Roster,
    year: 2025,
    url: "https://dummy/yamamoto",
  },
  {
    name: "宮﨑 敏郎",
    name_kana: "みやざき としろう",
    number_disp: "51",
    number_calc: 51,
    role: Role.Roster,
    year: 2025,
    url: "https://dummy/miyazaki",
  },
];

describe("Question Component", () => {
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
          number_disp: "2",
          number_calc: 2,
          role: Role.Roster,
          year: 2025,
          url: "https://dummy/",
        },
        {
          name: "牧 秀悟",
          name_kana: "まきしゅうご",
          number_disp: "1",
          number_calc: 1,
          role: Role.Roster,
          year: 2025,
          url: "https://dummy/",
        },
      ];
      render(<Question players={mockPlayers} />);

      const input = screen.getByTestId("number-input");
      fireEvent.change(input, { target: { value: String(3) } });
      const submitButton = screen.getByText("解答する");
      fireEvent.click(submitButton);

      // Result box should show correct message
      const resultText = screen.getByText("🎉 正解！");
      expect(resultText).toBeInTheDocument();

      // NOTE: 内訳の選手の順番は制御していないため省略する
      const explanation = screen.getByText(new RegExp(/3 = /));
      expect(explanation).toBeInTheDocument();
    });

    it("should show incorrect result when answer is incorrect", () => {
      const mockPlayers: PlayerType[] = [
        {
          name: "佐野 恵太",
          name_kana: "さのけいた",
          number_disp: "2",
          number_calc: 2,
          role: Role.Roster,
          year: 2025,
          url: "https://dummy/",
        },
        {
          name: "牧 秀悟",
          name_kana: "まきしゅうご",
          number_disp: "1",
          number_calc: 1,
          role: Role.Roster,
          year: 2025,
          url: "https://dummy/",
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
      const explanation = screen.getByText(new RegExp(/3 = /));
      expect(explanation).toBeInTheDocument();
    });
  });

  it("should rest the game when retry button is clicked", () => {
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

  it("should change difficulty when difficulty mode is changed", async () => {
    render(<Question players={mockPlayers} />);

    const retryButton = screen.getByText("再挑戦");

    const questionTextOnDefaultMode = screen.getByText(new RegExp(/＋/));
    expect(questionTextOnDefaultMode.textContent?.split("＋")?.length).toEqual(
      2,
    );

    const normalButton = screen.getByRole("radio", { name: "Normal" });
    fireEvent.click(normalButton);
    fireEvent.click(retryButton);

    const questionTextOnNormalMode = screen.getByText(new RegExp(/＋/));
    expect(questionTextOnNormalMode.textContent?.split("＋")?.length).toEqual(
      3,
    );

    const hardButton = screen.getByRole("radio", { name: "Hard" });
    fireEvent.click(hardButton);
    fireEvent.click(retryButton);

    const questionTextOnHardMode = screen.getByText(new RegExp(/＋/));
    expect(questionTextOnHardMode.textContent?.split("＋")?.length).toEqual(4);

    const easyButton = screen.getByRole("radio", { name: "Easy" });
    fireEvent.click(easyButton);
    fireEvent.click(retryButton);

    const questionTextOnEasyMode = screen.getByText(new RegExp(/＋/));
    expect(questionTextOnEasyMode.textContent?.split("＋")?.length).toEqual(2);
  });

  it("should change players list when players list mode is changed", () => {
    const mockPlayers: PlayerType[] = [
      {
        name: "粟飯原 龍之介",
        name_kana: "あいばら りゅうのすけ",
        number_disp: "133",
        number_calc: 133,
        role: Role.Training,
        year: 2025,
        url: "https://dummy/",
      },
      {
        name: "小針 大輝",
        name_kana: "こばり だいき",
        number_disp: "155",
        number_calc: 155,
        role: Role.Training,
        year: 2025,
        url: "https://dummy/",
      },
    ];

    render(<Question players={mockPlayers} />);

    const retryButton = screen.getByText("再挑戦");

    const allPlayersButton = screen.getByRole("radio", { name: "すべて" });
    fireEvent.click(allPlayersButton);
    fireEvent.click(retryButton);

    expect(screen.queryByText(/粟飯原 龍之介/)).toBeInTheDocument();
    expect(screen.queryByText(/小針 大輝/)).toBeInTheDocument();

    const rosterOnlyButton = screen.getByRole("radio", {
      name: "支配下選手のみ",
    });
    fireEvent.click(rosterOnlyButton);
    fireEvent.click(retryButton);

    expect(screen.queryByText(/粟飯原 龍之介/)).not.toBeInTheDocument();
    expect(screen.queryByText(/小針 大輝/)).not.toBeInTheDocument();
  });
});

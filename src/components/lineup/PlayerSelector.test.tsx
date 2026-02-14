import { Position } from "./LineupCreator";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PlayerType, Role } from "../../types/Player";

// Create a mock focus function that we can access in tests
const mockInputFocus = jest.fn();

// Mock Chakra UI components completely to avoid structuredClone issue
jest.mock("@chakra-ui/react", () => {
  const MockBox = ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="box" {...props}>
      {children}
    </div>
  );
  MockBox.displayName = "MockBox";

  const MockButton = ({
    children,
    onClick,
    ...props
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    [key: string]: unknown;
  }) => (
    <button data-testid="button" onClick={onClick} {...props}>
      {children}
    </button>
  );
  MockButton.displayName = "MockButton";

  const MockBadge = ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <span data-testid="badge" {...props}>
      {children}
    </span>
  );
  MockBadge.displayName = "MockBadge";

  const MockText = ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <span data-testid="text" {...props}>
      {children}
    </span>
  );
  MockText.displayName = "MockText";

  const MockFlex = ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="flex" {...props}>
      {children}
    </div>
  );
  MockFlex.displayName = "MockFlex";

  const MockInput = React.forwardRef(
    (
      {
        onChange,
        ...props
      }: {
        onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
        [key: string]: unknown;
      },
      ref,
    ) => {
      // Create a proper forwarded ref element that can be focused
      React.useImperativeHandle(ref, () => ({
        focus: mockInputFocus,
      }));
      return <input data-testid="input" onChange={onChange} {...props} />;
    },
  );
  MockInput.displayName = "MockInput";

  return {
    Box: MockBox,
    Button: MockButton,
    Badge: MockBadge,
    Text: MockText,
    Flex: MockFlex,
    Input: MockInput,
  };
});

// Mock structuredClone
global.structuredClone = jest.fn((obj) => JSON.parse(JSON.stringify(obj)));

// Now import the component after the mocks
import PlayerSelector from "./PlayerSelector";

// Mock data
const mockPlayers: PlayerType[] = [
  {
    name: "佐野 恵太",
    name_kana: "さの けいた",
    uniform_name: "SANO",
    number_disp: "7",
    number_calc: 7,
    role: Role.Roster,
    year: 2025,
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
    year: 2025,
    url: "https://dummy/maki",
    date_of_birth: "1998-04-21",
    height_cm: 178,
    weight_kg: 97,
  },
];

// Default props
const defaultProps = {
  players: mockPlayers,
  selectedPlayer: null,
  onSelectPlayer: jest.fn(),
  onClearPlayer: jest.fn(),
  position: "投手" as Position,
  getDisplayName: (player: PlayerType | null) => player?.name || "未選択",
};

describe("PlayerSelector", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  test("選手が選択されていない場合、ドロップダウンボタンが表示される", () => {
    render(<PlayerSelector {...defaultProps} />);
    expect(screen.getByTestId("button")).toBeInTheDocument();
    expect(screen.getByText("投手の選手を選択")).toBeInTheDocument();
  });

  test("ドロップダウンボタンをクリックするとドロップダウンメニューが表示される", () => {
    render(<PlayerSelector {...defaultProps} />);
    fireEvent.click(screen.getByTestId("button"));

    // ドロップダウンメニューが表示されていることを確認
    expect(screen.getByTestId("input")).toBeInTheDocument();
    expect(screen.getByText("佐野 恵太")).toBeInTheDocument();
    expect(screen.getByText("牧 秀悟")).toBeInTheDocument();
  });

  test("ドロップダウンを開くと検索フィールドに自動でフォーカスが当たる", () => {
    // Mock setTimeout to execute immediately
    jest.useFakeTimers();

    render(<PlayerSelector {...defaultProps} />);
    fireEvent.click(screen.getByTestId("button"));

    // Run the setTimeout callback
    jest.runAllTimers();

    // useEffectによってfocusが呼ばれることをテスト
    expect(mockInputFocus).toHaveBeenCalled();

    // Restore timers
    jest.useRealTimers();
  });

  test("検索フィールドに入力すると、選手がフィルタリングされる", () => {
    render(<PlayerSelector {...defaultProps} />);
    fireEvent.click(screen.getByTestId("button"));

    // 検索フィールドに「佐野」と入力
    fireEvent.change(screen.getByTestId("input"), {
      target: { value: "佐野" },
    });

    // 佐野のみが表示されていることを確認
    expect(screen.getByText("佐野 恵太")).toBeInTheDocument();
    expect(screen.queryByText("牧 秀悟")).not.toBeInTheDocument();
  });

  test("選手を選択すると、onSelectPlayerが呼び出される", () => {
    render(<PlayerSelector {...defaultProps} />);
    fireEvent.click(screen.getByTestId("button"));

    // 選手を選択
    fireEvent.click(screen.getByText("佐野 恵太"));

    // コールバックが呼ばれたことを確認
    expect(defaultProps.onSelectPlayer).toHaveBeenCalledWith(mockPlayers[0]);
  });

  test("選手が選択されている場合、選手情報とクリアボタンが表示される", () => {
    render(
      <PlayerSelector {...defaultProps} selectedPlayer={mockPlayers[0]} />,
    );

    // 選手情報が表示されていることを確認
    expect(screen.getByText("佐野 恵太")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();

    // クリアボタンをクリック
    fireEvent.click(screen.getByText("クリア"));

    // コールバックが呼ばれたことを確認
    expect(defaultProps.onSelectPlayer).toHaveBeenCalledWith(null);
  });
});

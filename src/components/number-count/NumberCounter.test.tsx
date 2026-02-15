import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import NumberCounter from "./NumberCounter";
import { PlayerType, Role } from "@/types/Player";
import { ReactNode } from "react";

jest.mock("@chakra-ui/react", () => ({
  Box: ({
    children,
    ...props
  }: {
    children?: ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="box" {...props}>
      {children}
    </div>
  ),
  Text: ({
    children,
    ...props
  }: {
    children?: ReactNode;
    [key: string]: unknown;
  }) => (
    <span data-testid="text" {...props}>
      {children}
    </span>
  ),
  Flex: ({
    children,
    ...props
  }: {
    children?: ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="flex" {...props}>
      {children}
    </div>
  ),
  VStack: ({
    children,
    ...props
  }: {
    children?: ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="vstack" {...props}>
      {children}
    </div>
  ),
  Button: ({
    children,
    onClick,
    disabled,
    ...props
  }: {
    children?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    [key: string]: unknown;
  }) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
  Collapsible: {
    Root: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Trigger: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Content: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  },
}));

jest.mock("@/components/common/OptionGroup", () => ({
  __esModule: true,
  default: ({
    options,
    selectedValues,
    onChange,
  }: {
    name: string;
    options: { value: string; label: string }[];
    selectedValues: string[];
    onChange: (value: string) => void;
  }) => (
    <div data-testid="option-group">
      {options.map((opt: { value: string; label: string }) => (
        <button
          key={opt.value}
          data-selected={selectedValues.includes(opt.value)}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  ),
}));

jest.mock("@/components/uniform-view/UniformBack", () => ({
  __esModule: true,
  default: ({
    uniformName,
    numberDisp,
  }: {
    uniformName: string;
    numberDisp: string;
  }) => (
    <div data-testid="uniform-back">
      {uniformName} #{numberDisp}
    </div>
  ),
}));

jest.mock("react-icons/fi", () => ({
  FiPlay: () => <span>play</span>,
  FiPause: () => <span>pause</span>,
  FiRotateCcw: () => <span>reset</span>,
  FiChevronRight: () => <span>chevron-right</span>,
  FiChevronDown: () => <span>chevron-down</span>,
}));

const mockSpeak = jest.fn();
const mockCancel = jest.fn();

class MockSpeechSynthesisUtterance {
  text: string;
  lang = "";
  rate = 1;
  constructor(text: string) {
    this.text = text;
  }
}

beforeEach(() => {
  jest.useFakeTimers();
  // SpeechSynthesisUtterance のグローバルモック
  (globalThis as Record<string, unknown>).SpeechSynthesisUtterance =
    MockSpeechSynthesisUtterance;
  Object.defineProperty(window, "speechSynthesis", {
    value: {
      speak: mockSpeak,
      cancel: mockCancel,
      speaking: false,
      getVoices: jest.fn(() => []),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    writable: true,
    configurable: true,
  });
  mockSpeak.mockClear();
  mockCancel.mockClear();
});

afterEach(() => {
  jest.useRealTimers();
});

const mockPlayers: PlayerType[] = [
  {
    year: 2025,
    name: "牧 秀悟",
    name_kana: "まき しゅうご",
    uniform_name: "MAKI",
    number_calc: 2,
    number_disp: "2",
    role: Role.Roster,
    url: "",
    date_of_birth: "1998-04-21",
    height_cm: 178,
    weight_kg: 97,
  },
  {
    year: 2025,
    name: "東 克樹",
    name_kana: "あずま かつき",
    uniform_name: "AZUMA",
    number_calc: 11,
    number_disp: "11",
    role: Role.Roster,
    url: "",
    date_of_birth: "1995-11-29",
    height_cm: 170,
    weight_kg: 80,
  },
  {
    year: 2025,
    name: "三浦 大輔",
    name_kana: "みうら だいすけ",
    uniform_name: "MIURA",
    number_calc: 81,
    number_disp: "81",
    role: Role.Coach,
    url: "",
    date_of_birth: "1973-12-25",
    height_cm: null,
    weight_kg: null,
  },
  {
    year: 2025,
    name: "育成 太郎",
    name_kana: "いくせい たろう",
    uniform_name: "IKUSEI",
    number_calc: 101,
    number_disp: "101",
    role: Role.Training,
    url: "",
    date_of_birth: "2000-01-01",
    height_cm: 175,
    weight_kg: 75,
  },
];

describe("NumberCounter", () => {
  it("初期表示: idle状態で番号1が表示される（歯抜け）", () => {
    render(<NumberCounter players={mockPlayers} />);
    // 番号1には選手がいないのでベイスターズ表示
    expect(screen.getByText("ベイスターズ")).toBeInTheDocument();
    expect(screen.getByTestId("uniform-back")).toHaveTextContent("BAYSTARS #1");
  });

  it("カウント数のデフォルトは30", () => {
    render(<NumberCounter players={mockPlayers} />);
    const input = screen.getByLabelText("カウント数") as HTMLInputElement;
    expect(input.value).toBe("30");
    // 進捗: 1 / 30
    expect(screen.getByText("1 / 30")).toBeInTheDocument();
  });

  it("歯抜け番号はベイスターズと表示、選手番号では選手名を表示", () => {
    render(<NumberCounter players={mockPlayers} />);
    // 再生して番号2に進む（牧選手）
    const playButton = screen.getByLabelText("再生");
    act(() => {
      fireEvent.click(playButton);
    });
    // intervalが1回tick
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    // fadeアニメーションのsetTimeout(150ms)
    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(screen.getByText("牧 秀悟")).toBeInTheDocument();
    expect(screen.getByTestId("uniform-back")).toHaveTextContent("MAKI #2");
  });

  it("再生ボタンでカウント開始、音声が呼ばれる", () => {
    render(<NumberCounter players={mockPlayers} />);
    const playButton = screen.getByLabelText("再生");
    act(() => {
      fireEvent.click(playButton);
    });
    // start() 内で speakCurrentNumber が呼ばれる
    expect(mockSpeak).toHaveBeenCalled();
  });

  it("停止ボタンでカウント一時停止", () => {
    render(<NumberCounter players={mockPlayers} />);
    // 再生開始
    const playButton = screen.getByLabelText("再生");
    act(() => {
      fireEvent.click(playButton);
    });
    // 停止ボタンが表示される
    const pauseButton = screen.getByLabelText("停止");
    act(() => {
      fireEvent.click(pauseButton);
    });
    // 音声がキャンセルされる
    expect(mockCancel).toHaveBeenCalled();
  });

  it("リセットで初期状態に戻る", () => {
    render(<NumberCounter players={mockPlayers} />);
    // 再生
    const playButton = screen.getByLabelText("再生");
    act(() => {
      fireEvent.click(playButton);
    });
    // tick を進める
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    act(() => {
      jest.advanceTimersByTime(150);
    });
    // リセット
    const resetButton = screen.getByLabelText("リセット");
    act(() => {
      fireEvent.click(resetButton);
    });
    // 番号1に戻る
    expect(screen.getByText("ベイスターズ")).toBeInTheDocument();
    expect(screen.getByTestId("uniform-back")).toHaveTextContent("BAYSTARS #1");
  });

  it("方向切替でカウントダウンに変更", () => {
    render(<NumberCounter players={mockPlayers} />);
    // デフォルトはカウントアップが選択されている
    expect(screen.getByText("カウントアップ")).toBeInTheDocument();
    // カウントダウンボタンをクリック
    const downButton = screen.getByText("カウントダウン");
    act(() => {
      fireEvent.click(downButton);
    });
    // countLimit(30) から開始、1まで
    expect(screen.getByText("30 / 1")).toBeInTheDocument();
  });

  it("速度選択オプションが表示される", () => {
    render(<NumberCounter players={mockPlayers} />);
    expect(screen.getByText("ゆっくり (2秒)")).toBeInTheDocument();
    expect(screen.getByText("ふつう (1秒)")).toBeInTheDocument();
    expect(screen.getByText("はやい (0.5秒)")).toBeInTheDocument();
  });

  it("カウント数を変更すると進捗が更新される", () => {
    render(<NumberCounter players={mockPlayers} />);
    const input = screen.getByLabelText("カウント数");
    fireEvent.change(input, { target: { value: "10" } });
    expect(screen.getByText("1 / 10")).toBeInTheDocument();
  });
});

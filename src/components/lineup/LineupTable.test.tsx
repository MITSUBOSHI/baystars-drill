import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LineupTable from "./LineupTable";
import { LineupSpot } from "./LineupCreator";
import { PlayerType, Role } from "@/types/Player";
import { ReactNode } from "react";

// Chakra UIコンポーネントのモック
jest.mock("@chakra-ui/react", () => ({
  __esModule: true,
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
  Badge: ({
    children,
    ...props
  }: {
    children?: ReactNode;
    [key: string]: unknown;
  }) => (
    <span data-testid="badge" {...props}>
      {children}
    </span>
  ),
  Table: Object.assign(
    ({
      children,
      ...props
    }: {
      children?: ReactNode;
      [key: string]: unknown;
    }) => (
      <table data-testid="table" {...props}>
        {children}
      </table>
    ),
    {
      Root: ({
        children,
        ...props
      }: {
        children?: ReactNode;
        [key: string]: unknown;
      }) => (
        <table data-testid="table" {...props}>
          {children}
        </table>
      ),
      Header: ({
        children,
        ...props
      }: {
        children?: ReactNode;
        [key: string]: unknown;
      }) => (
        <thead data-testid="thead" {...props}>
          {children}
        </thead>
      ),
      Body: ({
        children,
        ...props
      }: {
        children?: ReactNode;
        [key: string]: unknown;
      }) => (
        <tbody data-testid="tbody" {...props}>
          {children}
        </tbody>
      ),
      Row: ({
        children,
        ...props
      }: {
        children?: ReactNode;
        [key: string]: unknown;
      }) => (
        <tr data-testid="tr" {...props}>
          {children}
        </tr>
      ),
      ColumnHeader: ({
        children,
        ...props
      }: {
        children?: ReactNode;
        [key: string]: unknown;
      }) => (
        <th data-testid="th" {...props}>
          {children}
        </th>
      ),
      Cell: ({
        children,
        ...props
      }: {
        children?: ReactNode;
        [key: string]: unknown;
      }) => (
        <td data-testid="td" {...props}>
          {children}
        </td>
      ),
    },
  ),
  Heading: ({
    children,
    ...props
  }: {
    children?: ReactNode;
    [key: string]: unknown;
  }) => (
    <h2 data-testid="heading" {...props}>
      {children}
    </h2>
  ),
}));

// Node.js環境では利用できないがブラウザ環境で利用可能なstructuredCloneをモック
if (typeof structuredClone === "undefined") {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

const mockPlayer: PlayerType = {
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
};

const mockLineup: LineupSpot[] = [
  { order: 1, player: mockPlayer, position: "左翼手" },
  { order: null, player: null, position: "投手" },
];

const mockGetDisplayName = (player: PlayerType | null): string => {
  return player ? player.name : "未選択";
};

describe("LineupTable", () => {
  test("コンポーネントが正しく表示される", () => {
    render(
      <LineupTable
        lineup={mockLineup}
        startingPitcher={null}
        getDisplayName={mockGetDisplayName}
      />,
    );

    // タイトルが表示されることを確認
    expect(screen.getByText("スタメンジェネレータ")).toBeInTheDocument();

    // テーブルヘッダーが表示されることを確認
    expect(screen.getByText("打順")).toBeInTheDocument();
    expect(screen.getByText("背番号")).toBeInTheDocument();
    expect(screen.getByText("選手名")).toBeInTheDocument();
    expect(screen.getByText("位置")).toBeInTheDocument();

    // 選手情報が表示されることを確認（1番打者の情報）
    const orderCells = screen.getAllByText(/1/);
    expect(orderCells.some((cell) => cell.textContent === "1")).toBeTruthy();
    expect(screen.getByText("佐野 恵太")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("左")).toBeInTheDocument();
  });

  test("カスタムタイトルが表示される", () => {
    render(
      <LineupTable
        lineup={mockLineup}
        startingPitcher={null}
        getDisplayName={mockGetDisplayName}
        title="テスト用ラインナップ"
      />,
    );

    expect(screen.getByText("テスト用ラインナップ")).toBeInTheDocument();
  });

  test("先発投手が表示される", () => {
    const { container } = render(
      <LineupTable
        lineup={[]}
        startingPitcher={mockPlayer}
        getDisplayName={mockGetDisplayName}
      />,
    );

    expect(screen.getByText("先発投手:")).toBeInTheDocument();

    // 先発投手の名前が表示されていることを確認
    // Badge内に表示されている佐野 恵太を探す
    const badgeElement = container.querySelector('[data-testid="badge"]');
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement?.textContent).toBe("佐野 恵太");
  });

  test("打順が設定されていない場合のメッセージが表示される", () => {
    render(
      <LineupTable
        lineup={[{ order: null, player: null, position: "投手" }]}
        startingPitcher={null}
        getDisplayName={mockGetDisplayName}
      />,
    );

    expect(screen.getByText("打順が設定されていません")).toBeInTheDocument();
  });

  test("isForImageがtrueの場合、メッセージが表示されない", () => {
    const fullLineup: LineupSpot[] = Array(9)
      .fill(null)
      .map((_, index) => ({
        order: index + 1,
        player: mockPlayer,
        position: "中堅手" as const,
      }));

    render(
      <LineupTable
        lineup={fullLineup}
        startingPitcher={null}
        getDisplayName={mockGetDisplayName}
        isForImage={true}
      />,
    );

    // 「打順設定完了 ⚾」メッセージが表示されないことを確認
    expect(screen.queryByText("打順設定完了 ⚾")).not.toBeInTheDocument();

    // 代わりに「Generated by: Baystars Drill」が表示されることを確認
    expect(
      screen.getByText("Generated by: Baystars Drill"),
    ).toBeInTheDocument();
  });
});

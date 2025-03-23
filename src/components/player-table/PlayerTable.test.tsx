import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PlayerTable from "./PlayerTable";
import { PlayerType, Role } from "@/types/Player";

jest.mock("@chakra-ui/react", () => ({
  Table: {
    ScrollArea: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="table-scroll-area">{children}</div>
    ),
    Root: ({ children }: { children: React.ReactNode }) => (
      <table>{children}</table>
    ),
    Header: ({ children }: { children: React.ReactNode }) => (
      <thead>{children}</thead>
    ),
    Body: ({ children }: { children: React.ReactNode }) => (
      <tbody>{children}</tbody>
    ),
    Row: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
    Cell: ({ children }: { children: React.ReactNode }) => <td>{children}</td>,
    ColumnHeader: ({ children }: { children: React.ReactNode }) => (
      <th>{children}</th>
    ),
  },
  Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  HStack: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="hstack">{children}</div>
  ),
  IconButton: ({
    children,
    "aria-label": ariaLabel,
    onClick,
  }: {
    children: React.ReactNode;
    "aria-label": string;
    onClick: () => void;
  }) => (
    <button data-testid="sort-button" aria-label={ariaLabel} onClick={onClick}>
      {children}
    </button>
  ),
  Icon: ({ as: Icon }: { as: React.ComponentType }) => <Icon />,
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockPlayers: PlayerType[] = [
  {
    name: "佐野 恵太",
    name_kana: "さの けいた",
    number_disp: "7",
    number_calc: 7,
    role: Role.Roster,
    year: 2025,
    url: "https://dummy/sano",
  },
  {
    name: "牧 秀悟",
    name_kana: "まき しゅうご",
    number_disp: "2",
    number_calc: 2,
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
];

describe("PlayerTable", () => {
  it("renders all players correctly", () => {
    render(<PlayerTable players={mockPlayers} />);

    // Check if all players are rendered
    mockPlayers.forEach((player) => {
      expect(screen.getByText(player.name)).toBeInTheDocument();
      expect(screen.getByText(`（${player.name_kana}）`)).toBeInTheDocument();
      expect(screen.getByText(player.number_disp)).toBeInTheDocument();
    });

    // Check if table headers are rendered
    expect(screen.getByText("背番号")).toBeInTheDocument();
    expect(screen.getByText("名前")).toBeInTheDocument();
    expect(screen.getByText("ロール")).toBeInTheDocument();
  });

  it("should sort players by number when sort button is clicked", () => {
    render(<PlayerTable players={mockPlayers} />);
    const sortButton = screen.getByTestId("sort-button");

    // Initial order check
    const initialCells = screen.getAllByRole("cell");
    expect(initialCells[0]).toHaveTextContent("7");
    expect(initialCells[3]).toHaveTextContent("2");
    expect(initialCells[6]).toHaveTextContent("50");

    // Click sort button for ascending order
    fireEvent.click(sortButton);
    const ascCells = screen.getAllByRole("cell");
    expect(ascCells[0]).toHaveTextContent("2");
    expect(ascCells[3]).toHaveTextContent("7");
    expect(ascCells[6]).toHaveTextContent("50");

    // Click sort button for descending order
    fireEvent.click(sortButton);
    const descCells = screen.getAllByRole("cell");
    expect(descCells[0]).toHaveTextContent("50");
    expect(descCells[3]).toHaveTextContent("7");
    expect(descCells[6]).toHaveTextContent("2");

    // Click sort button to reset order
    fireEvent.click(sortButton);
    const resetCells = screen.getAllByRole("cell");
    expect(resetCells[0]).toHaveTextContent("7");
    expect(resetCells[3]).toHaveTextContent("2");
    expect(resetCells[6]).toHaveTextContent("50");
  });

  it("should render player links correctly", () => {
    render(<PlayerTable players={mockPlayers} />);

    mockPlayers.forEach((player) => {
      const link = screen.getByText(player.name).closest("a");
      expect(link).toHaveAttribute("href", player.url);
    });
  });
});

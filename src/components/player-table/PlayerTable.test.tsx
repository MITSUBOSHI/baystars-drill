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
    date_of_birth: "1994-11-28",
    height_cm: 178,
    weight_kg: 88,
  },
  {
    name: "牧 秀悟",
    name_kana: "まき しゅうご",
    number_disp: "2",
    number_calc: 2,
    role: Role.Roster,
    year: 2025,
    url: "https://dummy/maki",
    date_of_birth: "1998-04-21",
    height_cm: 178,
    weight_kg: 97,
  },
  {
    name: "山本 祐大",
    name_kana: "やまもと ゆうだい",
    number_disp: "50",
    number_calc: 50,
    role: Role.Roster,
    year: 2025,
    url: "https://dummy/yamamoto",
    date_of_birth: "1998-09-11",
    height_cm: 180,
    weight_kg: 87,
  },
];

describe("PlayerTable", () => {
  it("renders all players correctly", () => {
    render(<PlayerTable players={mockPlayers} />);

    // Check if all players are rendered
    mockPlayers.forEach((player) => {
      expect(
        screen.getByText((content) => content.includes(player.name)),
      ).toBeInTheDocument();
      expect(
        screen.getByText((content) => content.includes(player.name_kana)),
      ).toBeInTheDocument();
      expect(screen.getByText(player.number_disp)).toBeInTheDocument();
    });

    // Check if table headers are rendered
    expect(screen.getByText("背番号")).toBeInTheDocument();
    expect(screen.getByText("名前")).toBeInTheDocument();
    expect(screen.getByText("生年月日")).toBeInTheDocument();
    expect(screen.getByText("身長")).toBeInTheDocument();
    expect(screen.getByText("体重")).toBeInTheDocument();
  });

  it("should sort players by number when sort button is clicked", () => {
    render(<PlayerTable players={mockPlayers} />);
    const sortButton = screen.getByLabelText("Sort by number");

    // Initial order check
    const initialCells = screen.getAllByRole("cell");
    expect(initialCells[0]).toHaveTextContent("7");
    expect(initialCells[5]).toHaveTextContent("2");
    expect(initialCells[10]).toHaveTextContent("50");

    // Click sort button for ascending order
    fireEvent.click(sortButton);
    const ascCells = screen.getAllByRole("cell");
    expect(ascCells[0]).toHaveTextContent("2");
    expect(ascCells[5]).toHaveTextContent("7");
    expect(ascCells[10]).toHaveTextContent("50");

    // Click sort button for descending order
    fireEvent.click(sortButton);
    const descCells = screen.getAllByRole("cell");
    expect(descCells[0]).toHaveTextContent("50");
    expect(descCells[5]).toHaveTextContent("7");
    expect(descCells[10]).toHaveTextContent("2");
  });

  it("should sort players by date_of_birth when sort button is clicked", () => {
    render(<PlayerTable players={mockPlayers} />);
    const sortButton = screen.getByLabelText("Sort by date of birth");

    // Initial order check
    const initialCells = screen.getAllByRole("cell");
    expect(initialCells[2]).toHaveTextContent("1994-11-28");
    expect(initialCells[7]).toHaveTextContent("1998-04-21");
    expect(initialCells[12]).toHaveTextContent("1998-09-11");

    // Click sort button for ascending order
    fireEvent.click(sortButton);
    const ascCells = screen.getAllByRole("cell");
    expect(ascCells[2]).toHaveTextContent("1994-11-28");
    expect(ascCells[7]).toHaveTextContent("1998-04-21");
    expect(ascCells[12]).toHaveTextContent("1998-09-11");

    // Click sort button for descending order
    fireEvent.click(sortButton);
    const descCells = screen.getAllByRole("cell");
    expect(descCells[2]).toHaveTextContent("1998-09-11");
    expect(descCells[7]).toHaveTextContent("1998-04-21");
    expect(descCells[12]).toHaveTextContent("1994-11-28");
  });

  it("should sort players by height_cm when sort button is clicked", () => {
    render(<PlayerTable players={mockPlayers} />);
    const sortButton = screen.getByLabelText("Sort by height");

    // Initial order check
    const initialCells = screen.getAllByRole("cell");
    expect(initialCells[3]).toHaveTextContent("178cm");
    expect(initialCells[8]).toHaveTextContent("178cm");
    expect(initialCells[13]).toHaveTextContent("180cm");

    // Click sort button for ascending order
    fireEvent.click(sortButton);
    const ascCells = screen.getAllByRole("cell");
    expect(ascCells[3]).toHaveTextContent("178cm");
    expect(ascCells[8]).toHaveTextContent("178cm");
    expect(ascCells[13]).toHaveTextContent("180cm");

    // Click sort button for descending order
    fireEvent.click(sortButton);
    const descCells = screen.getAllByRole("cell");
    expect(descCells[3]).toHaveTextContent("180cm");
    expect(descCells[8]).toHaveTextContent("178cm");
    expect(descCells[13]).toHaveTextContent("178cm");
  });

  it("should sort players by weight_kg when sort button is clicked", () => {
    render(<PlayerTable players={mockPlayers} />);
    const sortButton = screen.getByLabelText("Sort by weight");

    // Initial order check
    const initialCells = screen.getAllByRole("cell");
    expect(initialCells[4]).toHaveTextContent("88kg");
    expect(initialCells[9]).toHaveTextContent("97kg");
    expect(initialCells[14]).toHaveTextContent("87kg");

    // Click sort button for ascending order
    fireEvent.click(sortButton);
    const ascCells = screen.getAllByRole("cell");
    expect(ascCells[4]).toHaveTextContent("87kg");
    expect(ascCells[9]).toHaveTextContent("88kg");
    expect(ascCells[14]).toHaveTextContent("97kg");

    // Click sort button for descending order
    fireEvent.click(sortButton);
    const descCells = screen.getAllByRole("cell");
    expect(descCells[4]).toHaveTextContent("97kg");
    expect(descCells[9]).toHaveTextContent("88kg");
    expect(descCells[14]).toHaveTextContent("87kg");
  });

  it("should render player links correctly", () => {
    render(<PlayerTable players={mockPlayers} />);

    mockPlayers.forEach((player) => {
      const link = screen
        .getByText((content) => content.includes(player.name))
        .closest("a");
      expect(link).toHaveAttribute("href", player.url);
    });
  });
});

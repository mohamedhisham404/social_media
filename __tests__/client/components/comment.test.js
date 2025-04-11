import { render, screen } from "@testing-library/react";
import Comment from "../../../client/src/components/Comment";
import PostMenu from "../../../client/src/components/PostMenu";
import { formatDistanceToNow } from "date-fns";

jest.mock("../../../client/src/components/PostMenu", () => jest.fn(() => <div data-testid="post-menu" />));
jest.mock("date-fns", () => ({
  formatDistanceToNow: jest.fn(() => "2 hours"),
}));

describe("Comment component", () => {
  const mockReply = {
    username: "testuser",
    userProfilePic: "testpic.jpg",
    createdAt: "2024-12-20T10:00:00Z",
    text: "This is a test comment",
  };

  const mockProps = {
    reply: mockReply,
    lastReply: false,
    currentUser: { id: 1 },
    toast: jest.fn(),
  };

  it("renders the username, text, and formatted time", () => {
    render(<Comment {...mockProps} />);

    expect(screen.getByText(mockReply.username)).toBeInTheDocument();
    expect(screen.getByText(mockReply.text)).toBeInTheDocument();
    expect(screen.getByText(/2 hours ago/)).toBeInTheDocument();
  });

  it("renders the avatar with the correct source", () => {
    render(<Comment {...mockProps} />);

    const avatar = screen.getByRole("img");
    expect(avatar).toHaveAttribute("src", mockReply.userProfilePic);
  });

  it("renders the PostMenu component", () => {
    render(<Comment {...mockProps} />);

    expect(screen.getByTestId("post-menu")).toBeInTheDocument();
  });

  it("renders a Divider if not the last reply", () => {
    render(<Comment {...mockProps} />);

    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("does not render a Divider if it's the last reply", () => {
    render(<Comment {...mockProps} lastReply={true} />);

    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
  });
});

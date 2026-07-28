import { NavLink } from "react-router-dom";

import {
  Container,
  Nav,
  Button
} from "react-bootstrap";

import {
  HiOutlineViewGrid,
  HiOutlineClipboardList,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineUser,
  HiOutlineLogout
} from "react-icons/hi";


import "../../styles/layout.css";

export default function Sidebar() {
  return (
    <Container
      fluid
      className="sidebar d-flex flex-column p-0"
    >
      <div className="sidebar-header text-center py-4">

        <h4 className="fw-bold text-white">
          ExamProctor AI
        </h4>

      </div>

      <Nav className="flex-column px-3 flex-grow-1">

        <Nav.Link
          as={NavLink}
          to="/student/dashboard"
          className="sidebar-link"
        >
          <HiOutlineViewGrid className="me-2" />
          Dashboard
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to="/student/exams"
          className="sidebar-link"
        >
          <HiOutlineClipboardList className="me-2" />
          Available Exams
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to="/student/results"
          className="sidebar-link"
        >
          <HiOutlineDocumentText className="me-2" />
          Results
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to="/student/performance"
          className="sidebar-link"
        >
          <HiOutlineChartBar className="me-2" />
          Performance
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to="/student/profile"
          className="sidebar-link"
        >
          <HiOutlineUser className="me-2" />
          Profile
        </Nav.Link>

      </Nav>

      <div className="p-3">

        <Button
          variant="danger"
          className="w-100 logout-btn"
        >
          <HiOutlineLogout className="me-2" />
          Logout
        </Button>

      </div>

    </Container>
  );
}
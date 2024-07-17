import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import { ToastProvider } from "../ToastManager/ToastManager";

const Layout = () => (
  <>
    <Header />
    <ToastProvider>
      <Container as="main" fluid="sm" className="pt-4">
        <Outlet />
      </Container>
    </ToastProvider>
  </>
);

export default Layout;

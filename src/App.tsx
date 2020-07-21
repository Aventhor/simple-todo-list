import React from "react";
import TodoList from "./components/todo-list";
import { Container } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "./css/index.css";

export const App = () => {
    return (
        <Container>
            <TodoList />
        </Container>
    );
};
